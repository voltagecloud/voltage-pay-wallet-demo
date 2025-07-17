import { useState, useCallback } from 'react';
import type { Payment, PaymentStatusResponse } from '../types/voltage';
import { createVoltageAPI } from '../services/voltage';

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
            const errorMsg = status.error || 'Payment failed';
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
      const errorMessage = error instanceof Error ? error.message : 'Payment monitoring failed';
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