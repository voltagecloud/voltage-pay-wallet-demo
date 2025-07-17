import { useState } from 'react';
import { createVoltageAPI } from '../services/voltage';
import type { Payment } from '../types/voltage';

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

  const handleSendPayment = async () => {
    if (!invoice.trim()) {
      onError?.('Please enter a Lightning invoice');
      return;
    }

    setLoading(true);
    setPaymentStatus('sending');
    
    try {
      const api = createVoltageAPI();
      const amountMsats = amount ? Math.floor(Number(amount) * 1000) : undefined;
      const maxFeeMsats = maxFee ? Math.floor(Number(maxFee) * 1000) : undefined;
      
      const paymentId = await api.createSendPayment(invoice, amountMsats, maxFeeMsats);

      // Monitor payment status
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
    if (trimmed.startsWith('lnbc') || trimmed.startsWith('lntb') || trimmed.startsWith('lnbs')) {
      return { valid: true, hasAmount: true }; // Simplified check
    }
    return { valid: false, hasAmount: false };
  };

  const invoiceInfo = parseInvoice(invoice);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Send Payment</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lightning Invoice
          </label>
          <textarea
            value={invoice}
            onChange={(e) => setInvoice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste Lightning invoice here (lnbc...)"
            rows={3}
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (sats) - Optional if invoice has amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Override amount in sats"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Fee (sats) - Optional
          </label>
          <input
            type="number"
            value={maxFee}
            onChange={(e) => setMaxFee(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Maximum fee in sats"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Defaults to 1% of payment value or 1,000 msats (whichever is greater)
          </p>
        </div>
        
        {paymentStatus && (
          <div className="p-3 rounded-md bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-800">
              Status: {paymentStatus}
              {paymentStatus === 'sending' && ' - Please wait...'}
            </p>
          </div>
        )}
        
        <button
          onClick={handleSendPayment}
          disabled={loading || !invoice.trim() || !invoiceInfo.valid}
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending Payment...' : 'Send Payment'}
        </button>
        
        {invoice && !invoiceInfo.valid && (
          <p className="text-red-500 text-sm">
            Invalid Lightning invoice format
          </p>
        )}
      </div>
    </div>
  );
}