import { useState, useCallback } from 'react';
import type { Payment, PaymentStatusResponse } from '../types/voltage';
import { createVoltageAPI } from '../services/voltage';

const toErrorMessage = (value: unknown): string => {
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

interface PaymentMonitorState {
  isMonitoring: boolean;
  currentStatus: string | null;
  error: string | null;
}

export const usePaymentMonitor = () => {
  const [state, setState] = useState<PaymentMonitorState>({
    isMonitoring: false,
    currentStatus: null,
    error: null,
  });

  const startMonitoring = useCallback(async (
    paymentId: string,
    onComplete: (payment: Payment) => void,
    onError: (error: string) => void,
    timeoutMs = 60000
  ) => {
    setState(prev => ({ ...prev, isMonitoring: true, error: null }));

    try {
      const api = createVoltageAPI();
      
      const finalPayment = await api.monitorPaymentStatus(
        paymentId,
        (status: PaymentStatusResponse) => {
          setState(prev => ({ ...prev, currentStatus: status.status }));
          
          if (status.status === 'failed') {
            const errorMsg = toErrorMessage(status.error) || 'Payment failed';
            setState(prev => ({ ...prev, error: errorMsg, isMonitoring: false }));
            onError(errorMsg);
          }
        },
        timeoutMs
      );

      if (finalPayment.status === 'completed') {
        setState(prev => ({ ...prev, isMonitoring: false, currentStatus: 'completed' }));
        onComplete(finalPayment);
      }

    } catch (error) {
      const errorMessage = toErrorMessage(error) || 'Payment monitoring failed';
      setState(prev => ({ ...prev, error: errorMessage, isMonitoring: false }));
      onError(errorMessage);
    }
  }, []);

  const stopMonitoring = useCallback(() => {
    setState({
      isMonitoring: false,
      currentStatus: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    startMonitoring,
    stopMonitoring,
  };
};
