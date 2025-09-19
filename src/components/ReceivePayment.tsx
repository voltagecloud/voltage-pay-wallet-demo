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
  const [receiveDetails, setReceiveDetails] = useState<{
    mode: 'lightning' | 'onchain' | 'asset';
    invoice?: string;
    address?: string;
    bip21?: string;
  } | null>(null);
  const [mode, setMode] = useState<'lightning' | 'onchain' | 'asset'>('lightning');
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

  const handleModeChange = (nextMode: 'lightning' | 'onchain' | 'asset') => {
    setMode(nextMode);
    setAmount('');
    setDescription('');
    setReceiveDetails(null);
  };

  const handleCreateInvoice = async () => {
    if (!amount || isNaN(Number(amount))) {
      onError?.('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const currentMode = mode;
      const api = createVoltageAPI();
      let newPaymentId: string;

      if (currentMode === 'lightning') {
        const amountMsats = Math.floor(Number(amount) * 1000);
        newPaymentId = await api.createReceivePayment(amountMsats, description);
      } else if (currentMode === 'asset') {
        if (!selectedAsset) {
          throw new Error('No asset available for receiving');
        }
        const baseUnits = Math.floor(Number(amount) * Math.pow(10, selectedAsset.decimal_display));
        newPaymentId = await api.createReceiveAssetPayment(selectedAsset.asset, baseUnits, description);
      } else {
        const amountSats = Math.floor(Number(amount));
        if (!Number.isFinite(amountSats) || amountSats <= 0) {
          throw new Error('Please enter the amount in sats');
        }
        newPaymentId = await api.createReceiveOnchainPayment(amountSats, description || undefined);
      }

      // Wait for the invoice to be generated
      let payment = await api.getPayment(newPaymentId);

      const isReady = (p: Payment) => {
        if (currentMode === 'onchain') {
          return Boolean(p.data?.address) || Boolean(p.bip21_uri);
        }
        return Boolean(p.data?.payment_request);
      };

      while (payment.status === 'generating' && !isReady(payment)) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        payment = await api.getPayment(newPaymentId);
      }

      if (!isReady(payment)) {
        onError?.('Failed to generate payment details');
        return;
      }

      if (currentMode === 'onchain') {
        setReceiveDetails({
          mode: currentMode,
          address: payment.data?.address ?? undefined,
          bip21: payment.bip21_uri ?? undefined,
        });
      } else {
        setReceiveDetails({
          mode: currentMode,
          invoice: payment.data?.payment_request ?? undefined,
          bip21: payment.bip21_uri ?? undefined,
        });
      }

      api.monitorPaymentStatus(newPaymentId, (status) => {
        if (status.status === 'failed' || status.status === 'expired') {
          const fallback = status.status === 'expired' ? 'Payment expired' : 'Payment failed';
          onError?.(toErrorMessage(status.error) || fallback);
        }
      })
        .then((finalPayment) => {
          if (finalPayment.status === 'completed') {
            onSuccess?.(finalPayment);
            window.dispatchEvent(new CustomEvent('wallet:refresh'));
          }
        })
        .catch((error) => {
          onError?.(toErrorMessage(error));
        });

    } catch (error) {
      const errorMessage = toErrorMessage(error) || 'Failed to create invoice';
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAmount('');
    setDescription('');
    setReceiveDetails(null);
  };

  const copyToClipboard = (value: string | undefined) => {
    if (value) {
      navigator.clipboard.writeText(value);
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
  const createButtonLabel = mode === 'onchain' ? 'Create Address' : 'Create Invoice';
  const createButtonLoadingLabel = mode === 'onchain' ? 'Creating Address…' : 'Creating Invoice…';

  const creationUnit = receiveDetails?.mode === 'asset' ? assetLabel : 'sats';

  return (
    <section className="surface-panel p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-display-md font-medium">Receive Payment</h2>
        <p className="text-body-subtle">Generate Lightning invoices, on-chain deposit addresses, or taproot asset requests.</p>
      </div>

      {!receiveDetails ? (
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

          <div className="grid gap-6 md:grid-cols-2">
            <div className="field-group">
              <label className="field-label" htmlFor="receive-amount">
                {mode === 'asset' ? `Amount (${assetLabel})` : 'Amount (sats)'}
              </label>
              <input
                id="receive-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input"
                placeholder={mode === 'asset' ? `Enter amount in ${assetLabel}` : 'Enter amount in sats'}
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
                placeholder={mode === 'asset' ? `Describe this ${assetLabel} payment` : 'Describe this payment'}
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
            {loading ? createButtonLoadingLabel : createButtonLabel}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {receiveDetails.invoice && (
            <div className="field-group">
              <label className="field-label" htmlFor="generated-invoice">
                {receiveDetails.mode === 'asset' ? `${assetLabel} Invoice` : 'Lightning Invoice'}
              </label>
              <div className="relative">
                <textarea
                  id="generated-invoice"
                  value={receiveDetails.invoice}
                  readOnly
                  className="input min-h-[9rem] resize-none font-mono bg-surface-subtle"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(receiveDetails.invoice)}
                  className="pill absolute right-3 top-3 bg-brand text-ink-inverse border-brand"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {receiveDetails.mode === 'onchain' && (
            <>
              {receiveDetails.address && (
                <div className="field-group">
                  <label className="field-label" htmlFor="generated-address">Bitcoin Address</label>
                  <div className="relative">
                    <textarea
                      id="generated-address"
                      value={receiveDetails.address}
                      readOnly
                      className="input min-h-[6rem] resize-none font-mono bg-surface-subtle"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(receiveDetails.address)}
                      className="pill absolute right-3 top-3 bg-brand text-ink-inverse border-brand"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
              {receiveDetails.bip21 && (
                <div className="field-group">
                  <label className="field-label" htmlFor="generated-bip21">BIP21 URI</label>
                  <div className="relative">
                    <textarea
                      id="generated-bip21"
                      value={receiveDetails.bip21}
                      readOnly
                      className="input min-h-[6rem] resize-none font-mono bg-surface-subtle"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(receiveDetails.bip21)}
                      className="pill absolute right-3 top-3 bg-brand text-ink-inverse border-brand"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {receiveDetails.mode !== 'onchain' && receiveDetails.bip21 && (
            <div className="field-group">
              <label className="field-label" htmlFor="generated-bip21">BIP21 URI</label>
              <div className="relative">
                <textarea
                  id="generated-bip21"
                  value={receiveDetails.bip21}
                  readOnly
                  className="input min-h-[6rem] resize-none font-mono bg-surface-subtle"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(receiveDetails.bip21)}
                  className="pill absolute right-3 top-3 bg-brand text-ink-inverse border-brand"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-border-default bg-surface px-5 py-4 text-body-md text-ink">
            <p>Amount: {amount} {creationUnit}</p>
            {description && <p className="text-body-muted">Description: {description}</p>}
            <p className="mt-3 text-brand">Waiting for payment…</p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary w-full justify-center"
          >
            Create New Request
          </button>
        </div>
      )}
    </section>
  );
}
