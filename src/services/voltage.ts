import { 
  type VoltageConfig, 
  type Wallet, 
  type Payment, 
  type CreatePaymentRequest, 
  type LedgerResponse,
  type PaymentStatusResponse 
} from '../types/voltage';

class VoltageAPI {
  private config: VoltageConfig;

  constructor(config: VoltageConfig) {
    this.config = config;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    // Add API key header (Voltage API expects X-Api-Key)
    headers['X-Api-Key'] = this.config.apiKey;
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Voltage API Error ${response.status}: ${errorText}`);
    }

    // Handle 202 responses with no body content
    if (response.status === 202) {
      return undefined as T;
    }

    // Check if there's content to parse
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      if (text.trim()) {
        return JSON.parse(text);
      }
    }

    return undefined as T;
  }

  // Wallet Management
  async getWallet(): Promise<Wallet> {
    return this.makeRequest<Wallet>(
      `/organizations/${this.config.organizationId}/wallets/${this.config.walletId}`
    );
  }

  async getWalletLedger(
    offset = 0, 
    limit = 50, 
    paymentId?: string
  ): Promise<LedgerResponse> {
    const params = new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString(),
    });
    
    if (paymentId) {
      params.append('payment_id', paymentId);
    }

    return this.makeRequest<LedgerResponse>(
      `/organizations/${this.config.organizationId}/wallets/${this.config.walletId}/ledger?${params}`
    );
  }

  // Payment Management
  async createPayment(paymentRequest: CreatePaymentRequest): Promise<void> {
    await this.makeRequest<void>(
      `/organizations/${this.config.organizationId}/environments/${this.config.environmentId}/payments`,
      {
        method: 'POST',
        body: JSON.stringify(paymentRequest),
      }
    );
  }

  async getPayment(paymentId: string): Promise<Payment> {
    return this.makeRequest<Payment>(
      `/organizations/${this.config.organizationId}/environments/${this.config.environmentId}/payments/${paymentId}`
    );
  }

  async getPaymentHistory(paymentId: string): Promise<unknown> {
    return this.makeRequest<unknown>(
      `/organizations/${this.config.organizationId}/environments/${this.config.environmentId}/payments/${paymentId}/history`
    );
  }

  // Payment Status Monitoring
  async monitorPaymentStatus(
    paymentId: string, 
    onStatusUpdate: (status: PaymentStatusResponse) => void,
    timeoutMs = 60000
  ): Promise<Payment> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      const payment = await this.getPayment(paymentId);
      
      onStatusUpdate({ 
        status: payment.status, 
        error: payment.error || undefined 
      });

      if (payment.status === 'completed' || payment.status === 'failed') {
        return payment;
      }

      // Wait 2 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    throw new Error('Payment monitoring timeout');
  }

  // Convenience Methods
  async createReceivePayment(
    amountMsats: number, 
    description = 'Payment'
  ): Promise<string> {
    const paymentId = crypto.randomUUID();
    
    await this.createPayment({
      id: paymentId,
      wallet_id: this.config.walletId,
      currency: 'btc',
      amount_msats: amountMsats,
      description,
      payment_kind: 'bolt11',
    });

    return paymentId;
  }

  async createSendPayment(
    paymentRequest: string, 
    amountMsats?: number,
    maxFeeMsats?: number
  ): Promise<string> {
    const paymentId = crypto.randomUUID();
    
    const sendPaymentRequest = {
      id: paymentId,
      wallet_id: this.config.walletId,
      currency: 'btc',
      type: 'bolt11',
      data: {
        payment_request: paymentRequest,
        ...(amountMsats && { amount_msats: amountMsats }),
        ...(maxFeeMsats && { max_fee_msats: maxFeeMsats }),
      },
    };
    
    await this.makeRequest<void>(
      `/organizations/${this.config.organizationId}/environments/${this.config.environmentId}/payments`,
      {
        method: 'POST',
        body: JSON.stringify(sendPaymentRequest),
      }
    );

    return paymentId;
  }
}

// Create and export a configured instance
export const createVoltageAPI = (): VoltageAPI => {
  const config: VoltageConfig = {
    apiKey: import.meta.env.VITE_VOLTAGE_API_KEY,
    baseUrl: import.meta.env.DEV ? '/api' : import.meta.env.VITE_VOLTAGE_BASE_URL,
    organizationId: import.meta.env.VITE_VOLTAGE_ORGANIZATION_ID,
    environmentId: import.meta.env.VITE_VOLTAGE_ENVIRONMENT_ID,
    walletId: import.meta.env.VITE_VOLTAGE_WALLET_ID,
    lineOfCreditId: import.meta.env.VITE_VOLTAGE_LINE_OF_CREDIT_ID,
    network: import.meta.env.VITE_VOLTAGE_NETWORK as 'mutinynet' | 'mainnet' | 'testnet3',
  };

  // Validate required environment variables
  const requiredFields = ['apiKey', 'organizationId', 'environmentId', 'walletId'];
  for (const field of requiredFields) {
    if (!config[field as keyof VoltageConfig]) {
      throw new Error(`Missing required environment variable: VITE_VOLTAGE_${field.toUpperCase()}`);
    }
  }

  return new VoltageAPI(config);
};

export default VoltageAPI;