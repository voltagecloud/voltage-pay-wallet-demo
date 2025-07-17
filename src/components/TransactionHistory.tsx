import { useState, useEffect } from 'react';
import type { LedgerEntry } from '../types/voltage';
import { createVoltageAPI } from '../services/voltage';

interface TransactionHistoryProps {
  onError?: (error: string) => void;
}

export default function TransactionHistory({ onError }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const api = createVoltageAPI();
        const ledger = await api.getWalletLedger();
        setTransactions(ledger.items);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transactions';
        onError?.(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [onError]);

  const formatSats = (msats: number) => {
    return (msats / 1000).toLocaleString();
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
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b pb-3">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      
      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No transactions yet</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.credit_id} className="border-b pb-3 last:border-b-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className={`font-semibold ${
                    tx.type === 'credited' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tx.type === 'credited' ? '+' : '-'}{formatSats(tx.amount_msats)} sats
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(tx.effective_time)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 capitalize">{tx.type}</p>
                  <p className="text-xs text-gray-400">
                    {tx.payment_id.slice(0, 8)}...
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}