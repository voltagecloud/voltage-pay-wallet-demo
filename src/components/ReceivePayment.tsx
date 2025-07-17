import { useState } from 'react';
import { createVoltageAPI } from '../services/voltage';
import type { Payment } from '../types/voltage';

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

  const handleCreateInvoice = async () => {
    if (!amount || isNaN(Number(amount))) {
      onError?.('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const api = createVoltageAPI();
      const amountMsats = Math.floor(Number(amount) * 1000);
      
      const newPaymentId = await api.createReceivePayment(amountMsats, description);
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
          } else if (status.status === 'failed') {
            onError?.(status.error || 'Payment failed');
          }
        }).catch((error) => {
          onError?.(error.message);
        });
      } else {
        onError?.('Failed to generate Lightning invoice');
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Receive Payment</h2>
      
      {!invoice ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (sats)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount in sats"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Payment description"
              disabled={loading}
            />
          </div>
          
          <button
            onClick={handleCreateInvoice}
            disabled={loading || !amount}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Invoice...' : 'Create Invoice'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lightning Invoice
            </label>
            <div className="relative">
              <textarea
                value={invoice}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
                rows={4}
              />
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Copy
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>Amount: {amount} sats</p>
            {description && <p>Description: {description}</p>}
            <p className="text-orange-600 mt-2">Waiting for payment...</p>
          </div>
          
          <button
            onClick={handleReset}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
          >
            Create New Invoice
          </button>
        </div>
      )}
    </div>
  );
}