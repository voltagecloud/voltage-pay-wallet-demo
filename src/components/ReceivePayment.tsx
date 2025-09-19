import { useEffect, useMemo, useState } from 'react';
import { createVoltageAPI } from '../services/voltage';
import type { Payment, NamedAsset } from '../types/voltage';

interface ReceivePaymentProps {
  onSuccess?: (payment: Payment) => void;
  onError?: (error: string) => void;
}

export default function ReceivePayment({ onSuccess, onError }: ReceivePaymentProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<string | null>(null);
  const [, setPaymentId] = useState<string | null>(null);
  const [mode, setMode] = useState<'btc' | 'asset'>('btc');
  const [selectedAsset, setSelectedAsset] = useState<NamedAsset | null>(null);

  // Load supported assets and prefer Voltage Cash if present. If
  // VITE_VOLTAGE_CASH_ASSET is set, we pin to that group key.
  useEffect(() => {
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
        // ignore; asset mode will be disabled if no asset
      }
    };
    init();
  }, []);

  const assetLabel = useMemo(() => selectedAsset?.name || 'Asset', [selectedAsset]);

  const handleCreateInvoice = async () => {
    if (!amount || isNaN(Number(amount))) {
      onError?.('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const api = createVoltageAPI();
      let newPaymentId: string;

      if (mode === 'btc') {
        const amountMsats = Math.floor(Number(amount) * 1000);
        newPaymentId = await api.createReceivePayment(amountMsats, description);
      } else {
        if (!selectedAsset) {
          throw new Error('No asset available for receiving');
        }
        const baseUnits = Math.floor(Number(amount) * Math.pow(10, selectedAsset.decimal_display));
        newPaymentId = await api.createReceiveAssetPayment(selectedAsset.asset, baseUnits, description);
      }
      setPaymentId(newPaymentId);

      // Wait for the invoice to be generated
      let payment = await api.getPayment(newPaymentId);
      
      // Poll until the invoice is ready (status changes from "generating" to "receiving")
      while (payment.status === 'generating' && !payment.data.payment_request) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        payment = await api.getPayment(newPaymentId);
      }
      
      if (payment.data.payment_request) {
        setInvoice(payment.data.payment_request);
        
        // Monitor payment status for completion
        api.monitorPaymentStatus(newPaymentId, (status) => {
          if (status.status === 'completed') {
            onSuccess?.(payment);
            window.dispatchEvent(new CustomEvent('wallet:refresh'));
          } else if (status.status === 'failed') {
            onError?.(status.error || 'Payment failed');
          }
        }).catch((error) => {
          onError?.(error.message);
        });
      } else {
        onError?.('Failed to generate invoice');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create invoice';
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAmount('');
    setDescription('');
    setInvoice(null);
    setPaymentId(null);
  };

  const copyToClipboard = () => {
    if (invoice) {
      navigator.clipboard.writeText(invoice);
    }
  };

  const segmentClass = (isActive: boolean, disabledState = false) => [
    'pill transition-colors duration-150 ease-out',
    isActive ? 'bg-brand text-ink-inverse border-brand shadow-card' : 'hover:border-brand/60 hover:text-ink',
    disabledState ? 'opacity-50 cursor-not-allowed' : '',
  ].filter(Boolean).join(' ');

  const amountValue = Number(amount || '0');
  const hasAmount = Number.isFinite(amountValue) && amountValue > 0;
  const primaryCtaClass = `${hasAmount && !loading ? 'btn-primary' : 'btn-disabled'} w-full justify-center`;

  return (
    <section className="surface-panel p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-display-md font-medium">Receive Payment</h2>
        <p className="text-body-subtle">Generate Lightning or taproot asset invoices.</p>
      </div>

      {!invoice ? (
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

          <div className="grid gap-6 md:grid-cols-2">
            <div className="field-group">
              <label className="field-label" htmlFor="receive-amount">
                {mode === 'btc' ? 'Amount (sats)' : `Amount (${assetLabel})`}
              </label>
              <input
                id="receive-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input"
                placeholder={mode === 'btc' ? 'Enter amount in sats' : `Enter amount in ${assetLabel}`}
                disabled={loading}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="receive-description">
                Description (optional)
              </label>
              <input
                id="receive-description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input"
                placeholder="Payment description"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateInvoice}
            disabled={!hasAmount || loading}
            className={primaryCtaClass}
          >
            {loading ? 'Creating Invoice…' : 'Create Invoice'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="field-group">
            <label className="field-label" htmlFor="generated-invoice">
              {mode === 'btc' ? 'Lightning Invoice' : `${assetLabel} Invoice`}
            </label>
            <div className="relative">
              <textarea
                id="generated-invoice"
                value={invoice}
                readOnly
                className="input min-h-[9rem] resize-none font-mono bg-surface-subtle"
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className="pill absolute right-3 top-3 bg-brand text-ink-inverse border-brand"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border-default bg-surface px-5 py-4 text-body-md text-ink">
            <p>Amount: {amount} {mode === 'btc' ? 'sats' : assetLabel}</p>
            {description && <p className="text-body-muted">Description: {description}</p>}
            <p className="mt-3 text-brand">Waiting for payment…</p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary w-full justify-center"
          >
            Create New Invoice
          </button>
        </div>
      )}
    </section>
  );
}
