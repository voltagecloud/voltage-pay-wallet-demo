export interface VoltageConfig {
  apiKey: string;
  baseUrl: string;
  organizationId: string;
  environmentId: string;
  walletId: string;
  lineOfCreditId: string;
  network: 'mutinynet' | 'mainnet' | 'testnet3';
}

export interface BalanceAmount {
  amount: number;
  currency: string;
  negative: boolean;
  unit: string;
}

export interface WalletBalance {
  id: string;
  wallet_id: string;
  effective_time: string;
  available: BalanceAmount;
  total: BalanceAmount;
  network: string;
  currency: string;
}

export interface Wallet {
  id: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  name: string;
  organization_id: string;
  environment_id: string;
  limit: number;
  line_of_credit_id: string;
  network: string;
  metadata?: Record<string, unknown>;
  balances: WalletBalance[];
  holds: unknown[];
  error: string | null;
}

export interface PaymentData {
  amount_msats?: number;
  memo?: string;
  payment_request?: string;
  max_fee_msats?: number;
}

export interface Payment {
  id: string;
  created_at: string;
  updated_at: string;
  currency: string;
  data: PaymentData;
  direction: 'send' | 'receive';
  environment_id: string;
  organization_id: string;
  status: 'generating' | 'sending' | 'receiving' | 'completed' | 'failed';
  type: 'bolt11';
  wallet_id: string;
  error: string | null;
  bip21_uri?: string;
}

export interface CreatePaymentRequest {
  id: string;
  wallet_id: string;
  currency: 'btc';
  amount_msats?: number;
  description?: string;
  payment_kind?: 'bolt11';
  data?: PaymentData;
}

export interface PaymentStatusResponse {
  status: 'generating' | 'sending' | 'receiving' | 'completed' | 'failed';
  error?: string;
}

export interface LedgerEntry {
  credit_id: string;
  payment_id: string;
  amount_msats: number;
  currency: string;
  effective_time: string;
  type: 'credited' | 'debited';
}

export interface LedgerResponse {
  items: LedgerEntry[];
  offset: number;
  limit: number;
  total: number;
}