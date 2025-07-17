import { useState, useEffect } from 'react';
import type { Payment } from '../types/voltage';
import { createVoltageAPI } from '../services/voltage';

interface TransactionHistoryProps {
  onError?: (error: string) => void;
}

export default function TransactionHistory({ onError }: TransactionHistoryProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const api = createVoltageAPI();
        const response = await api.getPayments(20, 0);
        setPayments(response.items);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch payments';
        onError?.(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [onError]);

  const formatSats = (msats: number) => {
    return (msats / 1000).toLocaleString();
  };

  const getPaymentAmount = (payment: Payment) => {
    if (payment.data.amount_msats) {
      return formatSats(payment.data.amount_msats);
    }
    if (payment.requested_amount) {
      return formatSats(payment.requested_amount.amount);
    }
    return 'N/A';
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'sending': case 'receiving': case 'generating': return 'text-yellow-600';
      default: return 'text-gray-600';
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
      
      {payments.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No payments yet</p>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div key={payment.id} className="border-b pb-3 last:border-b-0">
              <div 
                className="flex justify-between items-start cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                onClick={() => setSelectedPayment(selectedPayment?.id === payment.id ? null : payment)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getDirectionIcon(payment.direction)}</span>
                    <p className={`font-semibold ${
                      payment.direction === 'receive' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {payment.direction === 'receive' ? '+' : '-'}{getPaymentAmount(payment)} sats
                    </p>
                    <span className={`text-sm ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{formatDate(payment.created_at)}</span>
                    <span className="capitalize">{payment.type}</span>
                    <span className={`capitalize ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-400">
                  <p>{payment.id.slice(0, 8)}...</p>
                  <p className="mt-1">Click for details</p>
                </div>
              </div>
              
              {selectedPayment?.id === payment.id && (
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-gray-700">Payment ID</p>
                      <p className="text-gray-600 font-mono text-xs break-all">{payment.id}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Type & Direction</p>
                      <p className="text-gray-600">{payment.type} • {payment.direction}</p>
                    </div>
                  </div>
                  
                  {payment.data.memo && (
                    <div>
                      <p className="font-medium text-gray-700">Description</p>
                      <p className="text-gray-600">{payment.data.memo}</p>
                    </div>
                  )}
                  
                  {payment.data.payment_request && (
                    <div>
                      <p className="font-medium text-gray-700">Lightning Invoice</p>
                      <p className="text-gray-600 font-mono text-xs break-all bg-white p-2 rounded border">
                        {formatPaymentRequest(payment.data.payment_request)}
                      </p>
                    </div>
                  )}
                  
                  {payment.data.max_fee_msats && (
                    <div>
                      <p className="font-medium text-gray-700">Max Fee</p>
                      <p className="text-gray-600">{formatSats(payment.data.max_fee_msats)} sats</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div>
                      <p className="font-medium text-gray-700">Created</p>
                      <p className="text-gray-600">{new Date(payment.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Updated</p>
                      <p className="text-gray-600">{new Date(payment.updated_at).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {payment.error && (
                    <div className="pt-2 border-t">
                      <p className="font-medium text-red-700">Error</p>
                      <p className="text-red-600">{payment.error}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}