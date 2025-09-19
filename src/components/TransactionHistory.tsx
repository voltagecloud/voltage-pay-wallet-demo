import { useState, useEffect, useMemo } from 'react';
import type { Payment, SupportedAssets, NamedAsset, Amount } from '../types/voltage';
import { createVoltageAPI } from '../services/voltage';

interface TransactionHistoryProps {
  onError?: (error: string) => void;
}

export default function TransactionHistory({ onError }: TransactionHistoryProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [assets, setAssets] = useState<SupportedAssets | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const api = createVoltageAPI();
        const [response, supported] = await Promise.all([
          api.getPayments(20, 0),
          api.getSupportedAssets().catch(() => null),
        ]);
        setPayments(response.items);
        if (supported) setAssets(supported);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch payments';
        onError?.(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [onError]);

  const assetMap = useMemo(() => {
    const m = new Map<string, NamedAsset>();
    assets?.assets.forEach(a => m.set(`asset:${a.asset}`.toLowerCase(), a));
    return m;
  }, [assets]);

  const formatSats = (msats: number) => {
    return (msats / 1000).toLocaleString();
  };

  const getPaymentAmount = (payment: Payment) => {
    // BTC bolt11
    if (payment.data?.amount_msats) {
      return `${formatSats(payment.data.amount_msats)} sats`;
    }
    if (typeof payment.data?.amount_sats === 'number') {
      return `${payment.data.amount_sats.toLocaleString()} sats`;
    }
    const amt: Amount | undefined = payment.requested_amount || payment.data?.amount;
    if (!amt) return 'N/A';
    const cur = String(amt.currency).toLowerCase();
    if (cur === 'btc' || amt.unit === 'msats') {
      return `${formatSats(amt.amount)} sats`;
    }
    if (typeof amt.currency === 'string' && cur.startsWith('asset:')) {
      const meta = assetMap.get(cur);
      const decimals = meta?.decimal_display ?? 0;
      const whole = (amt.amount / Math.pow(10, decimals)).toLocaleString();
      const label = meta?.name ?? 'Asset';
      return `${whole} ${label}`;
    }
    return `${amt.amount.toLocaleString()} ${amt.unit || ''}`.trim();
  };

  const formatAnyAmount = (amt: Amount) => {
    const cur = String(amt.currency).toLowerCase();
    if (cur === 'btc' || amt.unit === 'msats') {
      const sats = Math.floor(amt.amount / 1000);
      return `${sats.toLocaleString()} sats`;
    }
    if (typeof amt.currency === 'string' && cur.startsWith('asset:')) {
      const meta = assetMap.get(cur);
      const decimals = meta?.decimal_display ?? 0;
      const whole = (amt.amount / Math.pow(10, decimals)).toLocaleString();
      const label = meta?.name ?? 'Asset';
      return `${whole} ${label}`;
    }
    return `${amt.amount.toLocaleString()} ${amt.unit || ''}`.trim();
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'failed':
        return 'text-danger';
      case 'sending':
      case 'receiving':
      case 'generating':
        return 'text-warning-strong';
      default:
        return 'text-ink-subtle';
    }
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed': return '✓';
      case 'failed': return '✗';
      case 'sending': case 'receiving': case 'generating': return '⏳';
      default: return '⋯';
    }
  };

  const getDirectionIcon = (direction: Payment['direction']) => {
    return direction === 'send' ? '↗' : '↙';
  };

  const formatPaymentRequest = (request: string) => {
    if (request.length > 20) {
      return `${request.slice(0, 8)}...${request.slice(-8)}`;
    }
    return request;
  };

  const copyToClipboard = (value: string | undefined | null) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
  };

  const formatTxId = (txId: string) => {
    if (txId.length <= 22) return txId;
    return `${txId.slice(0, 12)}…${txId.slice(-8)}`;
  };

  const toDisplayString = (value: unknown) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (value instanceof Error) return value.message;
    if (typeof value === 'object') {
      const detail = (value as { detail?: unknown }).detail;
      if (typeof detail === 'string' && detail.trim()) return detail;
      const message = (value as { message?: unknown }).message;
      if (typeof message === 'string' && message.trim()) return message;
      try {
        return JSON.stringify(value);
      } catch {
        return '';
      }
    }
    return String(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <section className="surface-panel p-6 space-y-6">
        <div className="space-y-1">
          <h2 className="text-display-md font-medium">Transaction History</h2>
          <p className="text-body-subtle">Recent sends and receives across all rails.</p>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse rounded-2xl border border-border-default bg-surface px-5 py-4">
              <div className="h-4 w-40 rounded-full bg-surface-subtle"></div>
              <div className="mt-2 h-3 w-32 rounded-full bg-surface-subtle/80"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="surface-panel p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-display-md font-medium">Transaction History</h2>
        <p className="text-body-subtle">Tap into invoice metadata, fees, and statuses with one click.</p>
      </div>

      {payments.length === 0 ? (
        <p className="text-body-muted text-center py-8">No payments yet.</p>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => {
            const onchainEntries = payment.data?.receipts ?? payment.data?.outflows ?? null;
            return (
              <article key={payment.id} className="rounded-2xl border border-border-default bg-surface px-5 py-4">
                <button
                  type="button"
                  onClick={() => setSelectedPayment(selectedPayment?.id === payment.id ? null : payment)}
                  className="flex w-full items-start justify-between gap-4 text-left transition-colors hover:bg-surface-subtle rounded-2xl px-3 py-2"
                >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-ink-muted">{getDirectionIcon(payment.direction)}</span>
                    <p
                      className={`text-body-lg-strong ${
                        payment.direction === 'receive' ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {payment.direction === 'receive' ? '+' : '-'}{getPaymentAmount(payment)}
                    </p>
                    <span className={`badge ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-body-sm text-ink-subtle">
                    <span>{formatDate(payment.created_at)}</span>
                    <span className="capitalize">{payment.type}</span>
                    <span className={`capitalize ${getStatusColor(payment.status)}`}>{payment.status}</span>
                  </div>
                </div>
                <div className="text-right text-body-sm text-ink-subtle">
                  <p className="font-mono text-xs text-ink-muted">{payment.id.slice(0, 8)}…</p>
                  <p className="text-body-sm text-ink-subtle">Details</p>
                </div>
              </button>

              {selectedPayment?.id === payment.id && (
                <div className="mt-4 space-y-4 rounded-2xl border border-border-muted bg-surface-subtle px-5 py-4 text-body-sm text-ink">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-body-md-strong text-ink-muted">Payment ID</p>
                      <p className="text-mono break-all text-ink">{payment.id}</p>
                    </div>
                    <div>
                      <p className="text-body-md-strong text-ink-muted">Type & Direction</p>
                      <p className="text-body-md text-ink">{payment.type} • {payment.direction}</p>
                    </div>
                  </div>

                  {payment.data.memo && (
                    <div>
                      <p className="text-body-md-strong text-ink-muted">Description</p>
                      <p className="text-body-md text-ink">{payment.data.memo}</p>
                    </div>
                  )}

                  {payment.data.payment_request && (
                    <div className="space-y-2">
                      <p className="text-body-md-strong text-ink-muted">Lightning Invoice</p>
                      <p className="rounded-2xl border border-border-default bg-surface px-4 py-2 font-mono text-xs text-ink break-all">
                        {formatPaymentRequest(payment.data.payment_request)}
                      </p>
                    </div>
                  )}

                  {(payment.type === 'onchain' || payment.type === 'bip21') && payment.data.address && (
                    <div className="space-y-2">
                      <p className="text-body-md-strong text-ink-muted">Bitcoin Address</p>
                      <p className="rounded-2xl border border-border-default bg-surface px-4 py-2 font-mono text-xs text-ink break-all">
                        {formatPaymentRequest(payment.data.address)}
                      </p>
                    </div>
                  )}

                  {(payment.type === 'onchain' || payment.type === 'bip21' || payment.bip21_uri) && payment.bip21_uri && (
                    <div className="space-y-2">
                      <p className="text-body-md-strong text-ink-muted">BIP21 URI</p>
                      <p className="rounded-2xl border border-border-default bg-surface px-4 py-2 font-mono text-xs text-ink break-all">
                        {formatPaymentRequest(payment.bip21_uri)}
                      </p>
                    </div>
                  )}

                  {payment.direction === 'send' && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {typeof payment.data.fee_msats === 'number' && (
                        <div>
                          <p className="text-body-md-strong text-ink-muted">Fee Paid</p>
                          <p>{formatSats(payment.data.fee_msats)} sats</p>
                        </div>
                      )}
                      {typeof payment.data.fee_sats === 'number' && (
                        <div>
                          <p className="text-body-md-strong text-ink-muted">Fee Paid</p>
                          <p>{payment.data.fee_sats?.toLocaleString()} sats</p>
                        </div>
                      )}
                      {payment.data.fees && (
                        <div>
                          <p className="text-body-md-strong text-ink-muted">Fee Paid</p>
                          <p>{formatAnyAmount(payment.data.fees)}</p>
                        </div>
                      )}
                      {payment.data.max_fee_msats && (
                        <div>
                          <p className="text-body-md-strong text-ink-muted">Max Fee (limit)</p>
                          <p>{formatSats(payment.data.max_fee_msats)} sats</p>
                        </div>
                      )}
                      {payment.data.max_fee && (
                        <div>
                          <p className="text-body-md-strong text-ink-muted">Max Fee (limit)</p>
                          <p>{formatAnyAmount(payment.data.max_fee)}</p>
                        </div>
                      )}
                      {typeof payment.data.max_fee_sats === 'number' && (
                        <div>
                          <p className="text-body-md-strong text-ink-muted">Max Fee (limit)</p>
                          <p>{payment.data.max_fee_sats.toLocaleString()} sats</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid gap-4 border-t border-border-muted pt-4 md:grid-cols-2">
                    <div>
                      <p className="text-body-md-strong text-ink-muted">Created</p>
                      <p>{new Date(payment.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-body-md-strong text-ink-muted">Updated</p>
                      <p>{new Date(payment.updated_at).toLocaleString()}</p>
                    </div>
                  </div>

                  {toDisplayString(payment.error) && (
                    <div className="border-t border-border-muted pt-4">
                      <p className="text-body-md-strong text-danger">Error</p>
                      <p className="text-body-md text-danger">{toDisplayString(payment.error)}</p>
                    </div>
                  )}

                  {onchainEntries && onchainEntries.length > 0 && (
                    <div className="border-t border-border-muted pt-4">
                      <p className="text-body-md-strong text-ink-muted">On-chain Activity</p>
                      <ul className="mt-2 space-y-2 text-body-sm text-ink-subtle">
                        {onchainEntries.slice(0, 3).map((entry) => (
                          <li
                            key={`${entry.tx_id}-${entry.ledger_id ?? entry.required_confirmations_num}`}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-muted bg-surface px-3 py-2"
                          >
                            <div className="space-y-1">
                              <p className="font-mono text-xs text-ink">{formatTxId(entry.tx_id)}</p>
                              <p className="text-body-xs text-ink-subtle">
                                {entry.amount_sats.toLocaleString()} sats • {entry.required_confirmations_num} confs
                              </p>
                            </div>
                            <button
                              type="button"
                              className="pill border-border-default text-body-xs"
                              onClick={() => copyToClipboard(entry.tx_id)}
                            >
                              Copy
                            </button>
                          </li>
                        ))}
                        {onchainEntries.length > 3 && (
                          <li className="text-body-xs text-ink-muted">
                            +{onchainEntries.length - 3} additional output{onchainEntries.length - 3 === 1 ? '' : 's'}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
