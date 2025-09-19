import { useEffect, useMemo, useState } from 'react';
import { createVoltageAPI } from '../services/voltage';
import type { Payment, NamedAsset, Amount } from '../types/voltage';

interface SendPaymentProps {
  onSuccess?: (payment: Payment) => void;
  onError?: (error: string) => void;
}

export default function SendPayment({ onSuccess, onError }: SendPaymentProps) {
  const [invoice, setInvoice] = useState('');
  const [amount, setAmount] = useState('');
  const [maxFee, setMaxFee] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [mode, setMode] = useState<'btc' | 'asset'>('btc');
  const [selectedAsset, setSelectedAsset] = useState<NamedAsset | null>(null);
  const [feeCurrency, setFeeCurrency] = useState<'btc' | 'asset'>('btc');

  useEffect(() => {
    // Load supported assets and prefer Voltage Cash if present. If
    // VITE_VOLTAGE_CASH_ASSET is set, we pin to that group key.
    const init = async () => {
      try {
        const api = createVoltageAPI();
        const supported = await api.getSupportedAssets().catch(() => null);
        if (supported) {
          const envKey = import.meta.env?.VITE_VOLTAGE_CASH_ASSET as string | undefined;
          const byEnv = envKey
            ? supported.assets.find(a => a.asset.toLowerCase() === envKey.toLowerCase())
            : undefined;
          const byName = supported.assets.find(a => a.name.toLowerCase().includes('voltage cash'));
          const pick = byEnv || byName || supported.assets[0];
          if (pick) setSelectedAsset(pick);
        }
      } catch {
        // ignore
      }
    };
    init();
  }, []);

  const assetLabel = useMemo(() => selectedAsset?.name || 'Asset', [selectedAsset]);

  const handleSendPayment = async () => {
    if (!invoice.trim()) {
      onError?.('Please enter an invoice');
      return;
    }

    setLoading(true);
    setPaymentStatus('sending');
    
    try {
      const api = createVoltageAPI();
      let paymentId: string;

      if (mode === 'btc') {
        const amountMsats = amount ? Math.floor(Number(amount) * 1000) : undefined;
        const maxFeeMsats = maxFee ? Math.floor(Number(maxFee) * 1000) : undefined;
        paymentId = await api.createSendPayment(invoice, amountMsats, maxFeeMsats);
      } else {
        if (!selectedAsset) {
          throw new Error('No asset available for sending');
        }
        const baseUnits = Math.floor(Number(amount || '0') * Math.pow(10, selectedAsset.decimal_display));
        let maxFeeAmount: Amount | undefined;
        if (maxFee) {
          if (feeCurrency === 'btc') {
            maxFeeAmount = { currency: 'btc', amount: Math.floor(Number(maxFee) * 1000), unit: 'msats' };
          } else {
            // Asset fee in whole units → base units
            const feeBase = Math.floor(Number(maxFee) * Math.pow(10, selectedAsset.decimal_display));
            maxFeeAmount = { currency: (`asset:${selectedAsset.asset}`) as const, amount: feeBase, unit: 'base units' };
          }
        }
        paymentId = await api.createSendAssetPayment(invoice, selectedAsset.asset, baseUnits, maxFeeAmount);
      }

      // Monitor payment status and refresh balances on completion
      const finalPayment = await api.monitorPaymentStatus(paymentId, (status) => {
        setPaymentStatus(status.status);
        if (status.status === 'failed') {
          onError?.(status.error || 'Payment failed');
        }
      });

      if (finalPayment.status === 'completed') {
        onSuccess?.(finalPayment);
        setInvoice('');
        setAmount('');
        setMaxFee('');
        setPaymentStatus(null);
        window.dispatchEvent(new CustomEvent('wallet:refresh'));
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send payment';
      onError?.(errorMessage);
      setPaymentStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const parseInvoice = (invoiceString: string) => {
    // Simple invoice parsing - in a real app you'd use a proper Lightning invoice decoder
    const trimmed = invoiceString.trim().toLowerCase();
    if (mode === 'btc' && (trimmed.startsWith('lnbc') || trimmed.startsWith('lntb') || trimmed.startsWith('lnbs'))) {
      return { valid: true, hasAmount: true }; // Simplified check
    }
    if (mode === 'asset') {
      // No strict validation for taproot asset invoices here
      return { valid: trimmed.length > 10, hasAmount: true };
    }
    return { valid: false, hasAmount: false };
  };

  const invoiceInfo = parseInvoice(invoice);

  const segmentClass = (isActive: boolean, disabledState = false) => [
    'pill transition-colors duration-150 ease-out',
    isActive ? 'bg-brand text-ink-inverse border-brand shadow-card' : 'hover:border-brand/60 hover:text-ink',
    disabledState ? 'opacity-50 cursor-not-allowed' : '',
  ].filter(Boolean).join(' ');

  const canSend = invoice.trim().length > 0 && invoiceInfo.valid && !loading;
  const primaryCtaClass = `${canSend ? 'btn-primary' : 'btn-disabled'} w-full justify-center`;

  return (
    <section className="surface-panel p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-display-md font-medium">Send Payment</h2>
        <p className="text-body-subtle">Pay Lightning or taproot asset invoices through Voltage Conduit.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <span className="heading-eyebrow">Payment Rail</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={segmentClass(mode === 'btc')}
              onClick={() => setMode('btc')}
            >
              Bitcoin (BTC)
            </button>
            <button
              type="button"
              className={segmentClass(mode === 'asset', !selectedAsset)}
              onClick={() => setMode('asset')}
              disabled={!selectedAsset}
            >
              {selectedAsset ? assetLabel : 'Asset (unavailable)'}
            </button>
          </div>
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="invoice-input">
            {mode === 'btc' ? 'Lightning Invoice' : `${assetLabel} Invoice`}
          </label>
          <textarea
            id="invoice-input"
            value={invoice}
            onChange={(e) => setInvoice(e.target.value)}
            className="input h-32 resize-none font-mono"
            placeholder={mode === 'btc' ? 'Paste Lightning invoice here (lnbc...)' : `Paste ${assetLabel} invoice`}
            rows={3}
            disabled={loading}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="field-group">
            <label className="field-label" htmlFor="amount-input">
              {mode === 'btc' ? 'Amount (sats)' : `Amount (${assetLabel})`}
            </label>
            <input
              id="amount-input"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
              placeholder={mode === 'btc' ? 'Override amount in sats (optional)' : `Enter amount in ${assetLabel}`}
              disabled={loading}
            />
            <p className="field-hint">Leave blank to respect the invoice amount.</p>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="fee-input">
              {mode === 'btc'
                ? 'Max Routing Fee (sats)'
                : feeCurrency === 'btc'
                  ? 'Max Routing Fee (BTC sats)'
                  : `Max Asset Fee (${assetLabel})`}
            </label>
            {mode === 'asset' && (
              <div className="flex flex-wrap items-center gap-2 text-body-sm text-ink-subtle">
                <span>Fee currency:</span>
                <button
                  type="button"
                  className={segmentClass(feeCurrency === 'btc')}
                  onClick={() => setFeeCurrency('btc')}
                >
                  BTC
                </button>
                <button
                  type="button"
                  className={segmentClass(feeCurrency === 'asset', !selectedAsset)}
                  onClick={() => setFeeCurrency('asset')}
                  disabled={!selectedAsset}
                >
                  {assetLabel}
                </button>
              </div>
            )}
            <input
              id="fee-input"
              type="number"
              value={maxFee}
              onChange={(e) => setMaxFee(e.target.value)}
              className="input"
              placeholder={mode === 'btc' ? 'Maximum fee in sats (optional)' : (feeCurrency === 'btc' ? 'Max routing fee in sats (optional)' : `Max fee in ${assetLabel}`)}
              disabled={loading}
            />
            <p className="field-hint">Defaults to the greater of 1% of the amount or 1,000 msats. For assets we translate to base units.</p>
          </div>
        </div>

        {paymentStatus && (
          <div className="surface-accent px-5 py-3 text-body-md text-brand">
            Status: {paymentStatus}
            {paymentStatus === 'sending' && ' — we will update you shortly.'}
          </div>
        )}

        <button
          type="button"
          onClick={handleSendPayment}
          disabled={!canSend}
          className={primaryCtaClass}
        >
          {loading ? 'Sending Payment…' : 'Send Payment'}
        </button>

        {invoice && !invoiceInfo.valid && (
          <p className="text-body-sm text-danger">Invoice format not recognised. Double-check the value.</p>
        )}
      </div>
    </section>
  );
}
