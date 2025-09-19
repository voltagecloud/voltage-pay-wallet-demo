export interface VoltageConfig {
  apiKey: string;
  baseUrl: string;
  organizationId: string;
  environmentId: string;
  walletId: string;
  lineOfCreditId: string;
  network: 'mutinynet' | 'mainnet' | 'testnet3' | 'signet' | 'testnet';
  /** Optional: pre-configured Voltage Cash asset group key (66 hex chars) */
  cashAssetGroupKey?: string;
}

// Generic currency + amount types aligned with OpenAPI
export type Currency = 'btc' | 'usd' | `asset:${string}`;

export type AmountUnit = 'msats' | 'cents' | 'base units';

export interface Amount {
  amount: number;
  currency: Currency;
  unit?: AmountUnit;
  negative?: boolean;
}

export interface BalanceAmount extends Amount {
  negative: boolean;
  unit: AmountUnit;
}

export interface WalletBalance {
  id: string;
  wallet_id: string;
  effective_time: string;
  available: BalanceAmount;
  total: BalanceAmount;
  network: string;
  currency: Currency;
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
  // bolt11
  amount_msats?: number;
  max_fee_msats?: number;
  fee_msats?: number | null;
  // shared
  memo?: string;
  payment_request?: string;
  // taproot asset
  asset?: string; // 66-hex group key
  amount?: Amount; // asset/base units
  max_fee?: Amount | null; // btc msats or asset base units
  fees?: Amount | null; // actual paid fee
  // onchain
  fee_sats?: number | null;
}

export interface Payment {
  id: string;
  created_at: string;
  updated_at: string;
  currency: Currency;
  data: PaymentData;
  direction: 'send' | 'receive';
  environment_id: string;
  organization_id: string;
  status: 'generating' | 'sending' | 'receiving' | 'completed' | 'failed' | 'expired';
  type: 'bolt11' | 'onchain' | 'bip21' | 'taprootasset';
  wallet_id: string;
  error: string | null;
  bip21_uri?: string;
  requested_amount?: Amount;
}

// Asset metadata for display
export interface NamedAsset {
  asset: string; // group key (66 hex)
  name: string;
  network: 'mutinynet' | 'mainnet' | 'testnet3' | 'signet' | 'testnet';
  decimal_display: number; // how many decimals for human display
}

export interface SupportedAssets {
  assets: NamedAsset[];
}

export interface PaymentStatusResponse {
  status: 'generating' | 'sending' | 'receiving' | 'completed' | 'failed' | 'expired';
  error?: string;
}

export interface LedgerEntry {
  credit_id: string;
  payment_id: string;
  amount_msats: number; // deprecated: kept for BTC entries; prefer SignedAmount on Balance
  currency: Currency;
  effective_time: string;
  type: 'credited' | 'debited';
}

export interface LedgerResponse {
  items: LedgerEntry[];
  offset: number;
  limit: number;
  total: number;
}
