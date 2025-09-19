/*
  Temporary asset-balance support (Voltage Cash)
  ------------------------------------------------
  As of 2025-09-19 the Wallet API response (GET /organizations/{org}/wallets/{wallet_id})
  reliably includes BTC balances, but asset balances (e.g., taproot assets like
  "Voltage Cash") may not yet be returned in the wallet.balances array. Until
  the API surfaces asset balances alongside BTC, we compute a best-effort view
  of asset holdings by summing recent completed taprootasset payments.

  - Source of truth: docs/api-docs-full.md (schemas: Wallet, Balance, Amount, SupportedAssets)
  - Fallback: sum requested_amount/data.amount for completed taprootasset payments
  - Scope: We currently look at the latest page (limit 100). This is intentionally
    conservative to avoid heavy client pagination until the official API field lands.
  - Removal: Replace the computed path once wallet.balances includes asset entries.

  NOTE: This file intentionally keeps all hooks declared before any conditional
  render logic to satisfy the Rules of Hooks and avoid order changes.
*/
import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Wallet, BalanceAmount, SupportedAssets, NamedAsset, Payment, Amount } from '../types/voltage';
import { createVoltageAPI } from '../services/voltage';

interface WalletBalanceProps {
  onError?: (error: string) => void;
}

export default function WalletBalance({ onError }: WalletBalanceProps) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<SupportedAssets | null>(null);
  const [computedAssets, setComputedAssets] = useState<Record<string, number>>({}); // currency -> base units

  // Hooks must run unconditionally in the same order on every render.
  // Compute asset map before any early returns to avoid hook-order changes.
  const assetMap = useMemo(() => {
    const map = new Map<string, NamedAsset>();
    assets?.assets.forEach((a) => map.set(`asset:${a.asset}`.toLowerCase(), a));
    return map;
  }, [assets]);

  const fetchWallet = useCallback(async () => {
    try {
      const api = createVoltageAPI();
      const [walletData, supportedAssets, paymentsPage] = await Promise.all([
        api.getWallet(),
        api.getSupportedAssets().catch(() => null),
        api.getPayments(100, 0).catch(() => ({ items: [], total: 0, limit: 0, offset: 0 })),
      ]);
      setWallet(walletData);
      if (supportedAssets) setAssets(supportedAssets);

      // Compute asset balances from recent completed payments as a fallback
      // TODO: remove when wallet.balances includes asset currencies.
      const totals: Record<string, number> = {};
      (paymentsPage.items as Payment[]).forEach((p) => {
        if (p.type !== 'taprootasset' || p.status !== 'completed') return;
        const amt: Amount | undefined = p.requested_amount || p.data?.amount;
        if (!amt || typeof amt.currency !== 'string' || !amt.currency.toLowerCase().startsWith('asset:')) return;
        const key = amt.currency.toLowerCase();
        const delta = p.direction === 'receive' ? amt.amount : -amt.amount;
        totals[key] = (totals[key] || 0) + delta;
      });
      setComputedAssets(totals);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch wallet';
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  useEffect(() => {
    // Lightweight UX improvement: after a payment completes, ask the balance
    // view to refresh. This event is dispatched in Send/Receive components.
    const handler = () => {
      setLoading(true);
      fetchWallet();
    };
    window.addEventListener('wallet:refresh', handler as EventListener);
    return () => window.removeEventListener('wallet:refresh', handler as EventListener);
  }, [fetchWallet]);

  // Do not early-return before declaring all hooks above

  const formatAmount = (a: BalanceAmount) => {
    const cur = String(a.currency).toLowerCase();
    if (cur === 'btc' || a.unit === 'msats' || a.unit === 'msat') {
      const sats = a.unit === 'msat' || a.unit === 'msats' ? a.amount / 1000 : a.amount;
      const btc = (sats / 100_000_000).toFixed(8);
      return {
        headline: `${Math.floor(sats).toLocaleString()} sats`,
        subline: `${btc} BTC`,
      };
    }
    if (typeof a.currency === 'string' && cur.startsWith('asset:')) {
      const key = cur.slice('asset:'.length);
      const meta = assetMap.get(cur);
      const decimals = meta?.decimal_display ?? 0;
      const whole = (a.amount / Math.pow(10, decimals)).toLocaleString(undefined, {
        minimumFractionDigits: Math.min(4, decimals),
        maximumFractionDigits: Math.min(8, Math.max(4, decimals)),
      });
      const name = meta?.name ?? key.slice(0, 8) + '…';
      return {
        headline: `${whole} ${name}`,
        subline: `${a.amount.toLocaleString()} base units`,
      };
    }
    // Fallback
    return {
      headline: `${a.amount.toLocaleString()} ${a.unit || ''}`.trim(),
      subline: a.currency,
    };
  };

  const balances = useMemo(() => wallet?.balances ?? [], [wallet]);
  const hasOfficialBalances = balances.length > 0;

  // Merge computed asset balances that are not yet present in wallet.balances
  // Build a list of computed asset balances that aren't already present as
  // official balances on the wallet object.
  const mergedAssetEntries = useMemo(() => {
    const present = new Set(balances.map((b) => String(b.currency).toLowerCase()));
    const entries = Object.entries(computedAssets)
      .filter(([currency, amount]) => amount !== 0 && !present.has(currency))
      .map(([currency, amount]) => ({ currency, amount }));
    return entries;
  }, [balances, computedAssets]);

  return (
    <section className="surface-panel p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-display-md font-medium">Wallet Balances</h2>
        <p className="text-body-subtle">Live totals across bitcoin, lightning, and asset holdings.</p>
      </div>

      {loading && (
        <div className="space-y-4">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="animate-pulse rounded-2xl border border-border-default bg-surface px-5 py-4">
              <div className="h-4 w-32 rounded-full bg-surface-subtle"></div>
              <div className="mt-3 h-7 w-48 rounded-full bg-surface-subtle"></div>
              <div className="mt-2 h-4 w-40 rounded-full bg-surface-subtle/80"></div>
            </div>
          ))}
        </div>
      )}

      {!loading && !wallet && (
        <p className="text-body-md text-danger">Unable to load wallet data.</p>
      )}

      {!loading && wallet && !hasOfficialBalances && mergedAssetEntries.length === 0 ? (
        <p className="text-body-muted">No balances yet. Complete a payment to see totals here.</p>
      ) : (
        <div className="space-y-4">
          {wallet && balances.map((b) => {
            const avail = formatAmount(b.available);
            const total = formatAmount(b.total);
            const cur = String(b.currency).toLowerCase();
            const label =
              cur === 'btc'
                ? 'Bitcoin'
                : typeof b.currency === 'string' && cur.startsWith('asset:')
                ? assetMap.get(cur)?.name || 'Asset'
                : String(b.currency).toUpperCase();
            return (
              <article key={b.id} className="rounded-2xl border border-border-default bg-surface px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-body-md-strong">{label}</p>
                  <span className="badge">{String(b.currency).toUpperCase()}</span>
                </div>
                <p className="mt-3 text-display-md font-semibold">{avail.headline}</p>
                <p className="text-body-subtle">{avail.subline}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-body-sm text-ink-subtle">
                  <span>Total: {total.headline}</span>
                  <span className="text-ink-muted/70">({total.subline})</span>
                </div>
              </article>
            );
          })}

          {mergedAssetEntries.map(({ currency, amount }) => {
            const meta = assetMap.get(currency);
            const decimals = meta?.decimal_display ?? 0;
            const whole = (amount / Math.pow(10, decimals)).toLocaleString(undefined, {
              minimumFractionDigits: Math.min(4, decimals),
              maximumFractionDigits: Math.min(8, Math.max(4, decimals)),
            });
            const name = meta?.name || 'Asset';
            return (
              <article key={currency} className="rounded-2xl border border-border-muted bg-surface px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-body-md-strong">{name}</p>
                  <span className="badge">Computed</span>
                </div>
                <p className="mt-3 text-display-md font-semibold">{whole} {name}</p>
                <p className="text-body-subtle">{amount.toLocaleString()} base units</p>
                <p className="mt-2 text-body-sm text-ink-muted/80">Approximation until asset balances land in the API.</p>
              </article>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-default pt-4">
        <div className="space-y-1">
          <p className="text-body-sm text-ink-subtle">Wallet: {wallet?.name ?? '—'}</p>
          <p className="text-body-sm text-ink-subtle">Network: {wallet?.network ?? '—'}</p>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setLoading(true);
            fetchWallet();
          }}
        >
          Refresh
        </button>
      </div>
    </section>
  );
}
