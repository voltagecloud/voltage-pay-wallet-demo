import {
  type VoltageConfig,
  type Wallet,
  type Payment,
  type LedgerResponse,
  type PaymentStatusResponse,
  type SupportedAssets,
  type Amount,
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

  // Assets
  // Temporary note: We use this endpoint to discover asset metadata (name,
  // decimal_display). The Wallet endpoint may not yet include asset balances
  // in wallet.balances; the UI computes a best-effort asset balance fallback
  // from recent payments until the official field is available.
  async getSupportedAssets(): Promise<SupportedAssets> {
    const params = new URLSearchParams();
    if (this.config.network) params.set('network', this.config.network);
    return this.makeRequest<SupportedAssets>(
      `/organizations/${this.config.organizationId}/assets?${params.toString()}`
    );
  }

  // Payment Management
  private async postPayment(payload: unknown): Promise<void> {
    await this.makeRequest<void>(
      `/organizations/${this.config.organizationId}/environments/${this.config.environmentId}/payments`,
      { method: 'POST', body: JSON.stringify(payload) }
    );
  }

  async getPayments(limit = 20, offset = 0): Promise<{ items: Payment[]; total: number; limit: number; offset: number }> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      wallet_id: this.config.walletId,
    });

    return this.makeRequest<{ items: Payment[]; total: number; limit: number; offset: number }>(
      `/organizations/${this.config.organizationId}/environments/${this.config.environmentId}/payments?${params}`
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

      if (payment.status === 'completed' || payment.status === 'failed' || payment.status === 'expired') {
        return payment;
      }

      // Wait 2 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    throw new Error('Payment monitoring timeout');
  }

  // Convenience Methods - BTC receive (bolt11)
  async createReceivePayment(
    amountMsats: number, 
    description = 'Payment'
  ): Promise<string> {
    const paymentId = crypto.randomUUID();
    
    // Legacy receive payload supported by backend
    const payload = {
      id: paymentId,
      wallet_id: this.config.walletId,
      currency: 'btc',
      amount_msats: amountMsats,
      description,
      payment_kind: 'bolt11',
    } as const;

    await this.postPayment(payload);

    return paymentId;
  }

  // BTC send (bolt11)
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
    
    await this.postPayment(sendPaymentRequest);

    return paymentId;
  }

  // Taproot Asset (Voltage Cash) - receive invoice
  async createReceiveAssetPayment(
    assetGroupKey: string,
    amountBaseUnits: number,
    description = 'Asset payment'
  ): Promise<string> {
    const paymentId = crypto.randomUUID();

    const amount: Amount = {
      currency: `asset:${assetGroupKey}` as const,
      amount: amountBaseUnits,
      unit: 'base units',
    };

    // Use receive (legacy) shape like BTC receive: top-level payment_kind and
    // top-level amount. The send shape (type + data object) is different and is
    // used by createSendAssetPayment below.
    const payload = {
      id: paymentId,
      wallet_id: this.config.walletId,
      currency: amount.currency,
      payment_kind: 'taprootasset',
      amount,
      description: description || undefined,
    } as const;

    await this.postPayment(payload);
    return paymentId;
  }

  // Taproot Asset (Voltage Cash) - send
  async createSendAssetPayment(
    paymentRequest: string,
    assetGroupKey: string,
    amountBaseUnits: number,
    maxFee?: Amount // BTC msats or Asset base units
  ): Promise<string> {
    const paymentId = crypto.randomUUID();

    const amount: Amount = {
      currency: `asset:${assetGroupKey}` as const,
      amount: amountBaseUnits,
      unit: 'base units',
    };

    const max_fee: Amount | undefined = maxFee;

    const payload = {
      id: paymentId,
      wallet_id: this.config.walletId,
      currency: amount.currency,
      type: 'taprootasset',
      data: {
        payment_request: paymentRequest,
        asset: assetGroupKey,
        amount,
        ...(max_fee ? { max_fee } : {}),
      },
    } as const;

    await this.postPayment(payload);
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
    network: import.meta.env.VITE_VOLTAGE_NETWORK as VoltageConfig['network'],
    cashAssetGroupKey: import.meta.env.VITE_VOLTAGE_CASH_ASSET,
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
