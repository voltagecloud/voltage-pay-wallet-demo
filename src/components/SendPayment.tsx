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
  const [mode, setMode] = useState<'lightning' | 'onchain' | 'asset'>('lightning');
  const [selectedAsset, setSelectedAsset] = useState<NamedAsset | null>(null);
  const [feeCurrency, setFeeCurrency] = useState<'btc' | 'asset'>('btc');
  const [description, setDescription] = useState('');
  const [recentOnchainTx, setRecentOnchainTx] = useState<string[] | null>(null);

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

  const toErrorMessage = (reason: unknown): string => {
    if (!reason) return '';
    if (typeof reason === 'string') return reason;
    if (reason instanceof Error) return reason.message;
    if (typeof reason === 'object') {
      const maybeDetail = (reason as { detail?: unknown }).detail;
      if (typeof maybeDetail === 'string' && maybeDetail.trim()) return maybeDetail;
      const maybeMessage = (reason as { message?: unknown }).message;
      if (typeof maybeMessage === 'string' && maybeMessage.trim()) return maybeMessage;
      try {
        return JSON.stringify(reason);
      } catch {
        return '';
      }
    }
    return String(reason);
  };

  const onchainDetails = useMemo(() => {
    if (mode !== 'onchain') return null;
    const rawValue = invoice.trim();
    if (!rawValue) {
      return { valid: false, address: '', isBip21: false } as const;
    }

    let addressPart = rawValue;
    let amountFromUri: number | undefined;
    let labelFromUri: string | undefined;
    let isBip21 = false;

    const lowerValue = rawValue.toLowerCase();
    if (lowerValue.startsWith('bitcoin:')) {
      isBip21 = true;
      const withoutScheme = rawValue.slice('bitcoin:'.length);
      const [addressSection, querySection] = withoutScheme.split('?');
      addressPart = addressSection;
      if (querySection) {
        const params = new URLSearchParams(querySection);
        const amountParam = params.get('amount');
        if (amountParam) {
          const btcAmount = Number(amountParam);
          if (!Number.isNaN(btcAmount) && btcAmount > 0) {
            amountFromUri = Math.round(btcAmount * 100_000_000);
          }
        }
        const labelParam = params.get('label') || params.get('message');
        if (labelParam) {
          try {
            labelFromUri = decodeURIComponent(labelParam);
          } catch {
            labelFromUri = labelParam;
          }
        }
      }
    }

    const candidate = addressPart.split(/[?;]/)[0]?.trim() ?? '';
    const bech32Lower = /^(bc1|tb1|bcrt1)[0-9ac-hj-np-z]{11,}$/;
    const bech32Upper = /^(BC1|TB1|BCRT1)[0-9AC-HJ-NP-Z]{11,}$/;
    const legacy = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    const isValid =
      Boolean(candidate) &&
      (bech32Lower.test(candidate) || bech32Upper.test(candidate) || legacy.test(candidate));

    return {
      valid: isValid,
      address: candidate,
      isBip21,
      amountSats: amountFromUri,
      label: labelFromUri,
    } as const;
  }, [invoice, mode]);

  useEffect(() => {
    if (mode !== 'onchain') return;
    if (onchainDetails?.amountSats && !amount) {
      setAmount(onchainDetails.amountSats.toString());
    }
    if (onchainDetails?.label && !description) {
      setDescription(onchainDetails.label);
    }
  }, [mode, onchainDetails?.amountSats, onchainDetails?.label, amount, description]);

  const handleModeChange = (nextMode: 'lightning' | 'onchain' | 'asset') => {
    setMode(nextMode);
    setInvoice('');
    setAmount('');
    setMaxFee('');
    setDescription('');
    setPaymentStatus(null);
    setRecentOnchainTx(null);
    if (nextMode !== 'asset') {
      setFeeCurrency('btc');
    }
  };

  const handleSendPayment = async () => {
    const trimmedInput = invoice.trim();

    if (mode === 'lightning') {
      if (!trimmedInput) {
        onError?.('Please enter a Lightning invoice');
        return;
      }
      if (!invoiceInfo.valid) {
        onError?.('Invoice format not recognised. Double-check the value.');
        return;
      }
    }

    if (mode === 'asset') {
      if (!trimmedInput) {
        onError?.(`Please enter a ${assetLabel} invoice`);
        return;
      }
      if (!selectedAsset) {
        onError?.('No asset available for sending');
        return;
      }
    }

    if (mode === 'onchain') {
      if (!onchainDetails?.valid) {
        onError?.('Please enter a valid bitcoin address or BIP21 URI');
        return;
      }
    }

    if (mode === 'onchain') {
      const satsValue = Math.floor(Number(amount || '0'));
      if (!Number.isFinite(satsValue) || satsValue <= 0) {
        onError?.('Please enter the amount in sats');
        return;
      }
    }

    setLoading(true);
    setPaymentStatus('sending');
    setRecentOnchainTx(null);

    try {
      const api = createVoltageAPI();
      let paymentId: string;

      if (mode === 'lightning') {
        const amountMsats = amount ? Math.floor(Number(amount) * 1000) : undefined;
        const maxFeeMsats = maxFee ? Math.floor(Number(maxFee) * 1000) : undefined;
        paymentId = await api.createSendPayment(trimmedInput, amountMsats, maxFeeMsats);
      } else if (mode === 'asset') {
        const baseUnits = Math.floor(Number(amount || '0') * Math.pow(10, selectedAsset!.decimal_display));
        let maxFeeAmount: Amount | undefined;
        if (maxFee) {
          if (feeCurrency === 'btc') {
            maxFeeAmount = { currency: 'btc', amount: Math.floor(Number(maxFee) * 1000), unit: 'msats' };
          } else {
            const feeBase = Math.floor(Number(maxFee) * Math.pow(10, selectedAsset!.decimal_display));
            maxFeeAmount = { currency: (`asset:${selectedAsset!.asset}`) as const, amount: feeBase, unit: 'base units' };
          }
        }
        paymentId = await api.createSendAssetPayment(trimmedInput, selectedAsset!.asset, baseUnits, maxFeeAmount);
      } else {
        const amountSats = Math.floor(Number(amount || '0'));
        const computedMaxFee = maxFee
          ? Math.max(Math.floor(Number(maxFee)), 100)
          : Math.max(Math.floor(amountSats * 0.02), 100);
        const destinationAddress = onchainDetails?.address ?? trimmedInput;
        const memo = description.trim() || undefined;
        paymentId = await api.createSendOnchainPayment(destinationAddress, amountSats, computedMaxFee, memo);
      }

      const finalPayment = await api.monitorPaymentStatus(paymentId, (status) => {
        setPaymentStatus(status.status);
        if (status.status === 'failed' || status.status === 'expired') {
          const fallback = status.status === 'expired' ? 'Payment expired' : 'Payment failed';
          onError?.(toErrorMessage(status.error) || fallback);
        }
      });

      if (finalPayment.status === 'completed') {
        onSuccess?.(finalPayment);
        setInvoice('');
        setAmount('');
        setMaxFee('');
        setDescription('');
        setPaymentStatus(null);
        if ((finalPayment.type === 'onchain' || finalPayment.type === 'bip21') && Array.isArray(finalPayment.data?.outflows)) {
          const txIds = finalPayment.data.outflows
            .map(entry => entry?.tx_id)
            .filter((id): id is string => Boolean(id));
          setRecentOnchainTx(txIds.length > 0 ? txIds : null);
        } else {
          setRecentOnchainTx(null);
        }
        window.dispatchEvent(new CustomEvent('wallet:refresh'));
      }

    } catch (error) {
      const errorMessage = toErrorMessage(error) || 'Failed to send payment';
      onError?.(errorMessage);
      setPaymentStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const parseInvoice = (invoiceString: string) => {
    // Simple invoice parsing - in a real app you'd use a proper Lightning invoice decoder
    const trimmed = invoiceString.trim().toLowerCase();
    if (mode === 'lightning' && (trimmed.startsWith('lnbc') || trimmed.startsWith('lntb') || trimmed.startsWith('lnbs'))) {
      return { valid: true, hasAmount: true } as const; // Simplified check
    }
    if (mode === 'asset') {
      // No strict validation for taproot asset invoices here
      return { valid: trimmed.length > 10, hasAmount: true } as const;
    }
    return { valid: false, hasAmount: false } as const;
  };

  const invoiceInfo = parseInvoice(invoice);

  const segmentClass = (isActive: boolean, disabledState = false) => [
    'pill transition-colors duration-150 ease-out',
    isActive ? 'bg-brand text-ink-inverse border-brand shadow-card' : 'hover:border-brand/60 hover:text-ink',
    disabledState ? 'opacity-50 cursor-not-allowed' : '',
  ].filter(Boolean).join(' ');

  const trimmedInvoice = invoice.trim();
  const amountValue = Number(amount || '0');
  const amountIsPositive = Number.isFinite(amountValue) && amountValue > 0;

  const copyToClipboard = (value: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
  };

  const formatTxId = (txId: string) => {
    if (txId.length <= 20) return txId;
    return `${txId.slice(0, 10)}…${txId.slice(-8)}`;
  };

  const canSend = (() => {
    if (loading) return false;
    if (mode === 'lightning') {
      return trimmedInvoice.length > 0 && invoiceInfo.valid;
    }
    if (mode === 'asset') {
      return trimmedInvoice.length > 0 && invoiceInfo.valid && Boolean(selectedAsset);
    }
    if (mode === 'onchain') {
      return Boolean(onchainDetails?.valid) && amountIsPositive;
    }
    return false;
  })();

  const primaryCtaClass = `${canSend ? 'btn-primary' : 'btn-disabled'} w-full justify-center`;

  return (
    <section className="surface-panel p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-display-md font-medium">Send Payment</h2>
        <p className="text-body-subtle">Pay Lightning invoices, on-chain addresses, or taproot asset invoices through Voltage Conduit.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <span className="heading-eyebrow">Payment Rail</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={segmentClass(mode === 'lightning')}
              onClick={() => handleModeChange('lightning')}
            >
              Lightning (BTC)
            </button>
            <button
              type="button"
              className={segmentClass(mode === 'onchain')}
              onClick={() => handleModeChange('onchain')}
            >
              On-chain (BTC)
            </button>
            <button
              type="button"
              className={segmentClass(mode === 'asset', !selectedAsset)}
              onClick={() => handleModeChange('asset')}
              disabled={!selectedAsset}
            >
              {selectedAsset ? assetLabel : 'Asset (unavailable)'}
            </button>
          </div>
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="invoice-input">
            {mode === 'lightning'
              ? 'Lightning Invoice'
              : mode === 'onchain'
                ? 'Bitcoin Address or BIP21 URI'
                : `${assetLabel} Invoice`}
          </label>
          <textarea
            id="invoice-input"
            value={invoice}
            onChange={(e) => setInvoice(e.target.value)}
            className="input h-32 resize-none font-mono"
            placeholder={mode === 'lightning'
              ? 'Paste Lightning invoice here (lnbc...)'
              : mode === 'onchain'
                ? 'Paste a bitcoin: URI or BTC address'
                : `Paste ${assetLabel} invoice`}
            rows={3}
            disabled={loading}
          />
          {mode === 'onchain' && onchainDetails?.address && (
            <p className="mt-2 text-body-sm text-ink-subtle">
              Detected address:
              <span className="ml-1 font-mono text-body-xs text-ink">
                {onchainDetails.address.length > 24
                  ? `${onchainDetails.address.slice(0, 10)}…${onchainDetails.address.slice(-8)}`
                  : onchainDetails.address}
              </span>
              {onchainDetails.isBip21 && onchainDetails.amountSats ? ' • Amount auto-filled from URI' : ''}
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="field-group">
            <label className="field-label" htmlFor="amount-input">
              {mode === 'asset' ? `Amount (${assetLabel})` : 'Amount (sats)'}
            </label>
            <input
              id="amount-input"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
              placeholder={mode === 'lightning'
                ? 'Override amount in sats (optional)'
                : mode === 'onchain'
                  ? 'Enter amount in sats'
                  : `Enter amount in ${assetLabel}`}
              disabled={loading}
            />
            <p className="field-hint">
              {mode === 'lightning'
                ? 'Leave blank to respect the invoice amount.'
                : mode === 'onchain'
                  ? 'Required. We will send exactly this amount on-chain.'
                  : 'Required. Enter the total you want to send.'}
            </p>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="fee-input">
              {mode === 'lightning'
                ? 'Max Routing Fee (sats)'
                : mode === 'onchain'
                  ? 'Max Miner Fee (sats)'
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
              placeholder={mode === 'lightning'
                ? 'Maximum fee in sats (optional)'
                : mode === 'onchain'
                  ? 'Max miner fee in sats (optional)'
                  : (feeCurrency === 'btc'
                    ? 'Max routing fee in sats (optional)'
                    : `Max fee in ${assetLabel}`)}
              disabled={loading}
            />
            <p className="field-hint">
              {mode === 'lightning'
                ? 'Defaults to the greater of 1% of the amount or 1,000 msats.'
                : mode === 'onchain'
                  ? 'Defaults to 2% of the amount (minimum 100 sats) when left blank.'
                  : 'Defaults to the greater of 1% of the amount or 1,000 msats; asset fees convert to base units.'}
            </p>
          </div>
        </div>

        {mode === 'onchain' && (
          <div className="field-group">
            <label className="field-label" htmlFor="memo-input">Memo (optional)</label>
            <input
              id="memo-input"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              placeholder="Add a note for tracking this transaction"
              disabled={loading}
            />
            <p className="field-hint">Stored with the payment request so you can identify it later.</p>
          </div>
        )}

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

        {mode !== 'onchain' && invoice && !invoiceInfo.valid && (
          <p className="text-body-sm text-danger">Invoice format not recognised. Double-check the value.</p>
        )}
        {mode === 'onchain' && invoice && !onchainDetails?.valid && (
          <p className="text-body-sm text-danger">Address not recognised. Ensure it is a valid Bitcoin address or BIP21 URI.</p>
        )}
        {mode === 'onchain' && !amountIsPositive && amount && (
          <p className="text-body-sm text-danger">Enter an amount greater than zero.</p>
        )}

        {recentOnchainTx && recentOnchainTx.length > 0 && (
          <div className="surface-accent px-5 py-4 text-body-sm text-ink">
            <p className="text-body-md-strong text-brand">On-chain transaction submitted</p>
            <p className="text-body-sm text-ink-subtle">We captured the transaction id for quick reference.</p>
            <ul className="mt-3 space-y-2">
              {recentOnchainTx.map((txId) => (
                <li key={txId} className="flex items-center justify-between gap-3 rounded-xl border border-border-muted bg-surface px-3 py-2">
                  <span className="font-mono text-xs text-ink">{formatTxId(txId)}</span>
                  <button
                    type="button"
                    className="pill border-border-default text-body-xs"
                    onClick={() => copyToClipboard(txId)}
                  >
                    Copy
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
