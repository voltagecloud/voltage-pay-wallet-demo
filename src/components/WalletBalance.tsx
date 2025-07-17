import { useState, useEffect } from 'react';
import type { Wallet } from '../types/voltage';
import { createVoltageAPI } from '../services/voltage';

interface WalletBalanceProps {
  onError?: (error: string) => void;
}

export default function WalletBalance({ onError }: WalletBalanceProps) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const api = createVoltageAPI();
        const walletData = await api.getWallet();
        setWallet(walletData);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch wallet';
        onError?.(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, [onError]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Wallet Balance</h2>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Wallet Balance</h2>
        <p className="text-red-500">Unable to load wallet data</p>
      </div>
    );
  }

  const formatSats = (balanceAmount: typeof balance.available) => {
    if (balanceAmount.unit === 'msat' || balanceAmount.unit === 'msats') {
      return (balanceAmount.amount / 1000).toLocaleString();
    }
    return balanceAmount.amount.toLocaleString();
  };

  const formatBTC = (balanceAmount: typeof balance.available) => {
    if (balanceAmount.unit === 'msat' || balanceAmount.unit === 'msats') {
      // Convert msats to BTC: msats / 1000 / 100000000
      return (balanceAmount.amount / 1000 / 100000000).toFixed(8);
    }
    // Convert sats to BTC: sats / 100000000
    return (balanceAmount.amount / 100000000).toFixed(8);
  };

  const balance = wallet.balances?.[0];

  // Create empty balance state if no balance data exists
  const displayBalance = balance || {
    available: { amount: 0, currency: 'btc', negative: false, unit: 'msat' },
    total: { amount: 0, currency: 'btc', negative: false, unit: 'msat' }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Wallet Balance</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Available Balance</p>
          <p className="text-2xl font-bold">{formatSats(displayBalance.available)} sats</p>
          <p className="text-sm text-gray-500">{formatBTC(displayBalance.available)} BTC</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Balance</p>
          <p className="text-lg">{formatSats(displayBalance.total)} sats</p>
          <p className="text-sm text-gray-500">{formatBTC(displayBalance.total)} BTC</p>
        </div>
        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500">Wallet: {wallet.name}</p>
          <p className="text-xs text-gray-500">Network: {wallet.network}</p>
          {!balance && (
            <p className="text-xs text-amber-600 mt-1">⚠️ Balance data not yet available</p>
          )}
        </div>
      </div>
    </div>
  );
}