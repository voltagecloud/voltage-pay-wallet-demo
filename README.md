# Voltage Pay Wallet Demo

Voltage Pay Wallet demonstrates a unified Bitcoin experience across Lightning, on-chain, and taproot asset rails using the Voltage Payments API. The UI mirrors the Conduit community design language and ships with production-ready patterns for balances, payment flows, and transaction insights.

## Features

- **Unified rails** – Send and receive via Lightning invoices, on-chain addresses/BIP21 URIs, or configured taproot assets (e.g., Voltage Cash).
- **Live wallet insights** – Aggregate BTC and asset balances with computed fallbacks when the API omits asset totals.
- **Guided payment flows** – Inline validation, fee controls (Lightning routing limits, on-chain miner caps, asset fee currency selection), and instant status feedback.
- **Transaction intelligence** – Detail drawer with fee breakdowns, payment metadata, and on-chain tx IDs with copy actions.
- **Responsive notifications** – Toast-style success/error handling and automatic wallet refresh after settlement.
- **Design system alignment** – Shared tokens, hover/active states, and documentation mirroring the Conduit reference.

## Technology Stack

- **Frontend**: React 19.1.0 + TypeScript
- **Build tooling**: Vite 7 with esbuild/tsc pipelines
- **Styling**: Tailwind CSS 4 + custom Conduit-inspired tokens (`src/globals.css`)
- **State & UX**: React hooks, local event bus (`wallet:refresh`) for balance refreshes
- **Backend API**: Voltage Payments REST (Lightning, on-chain, taproot asset endpoints)
- **Default network**: Mutinynet / Signet for sandbox usage

## Quick Start

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd voltage-pay-wallet-demo
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```

   Provide your Voltage credentials:
   ```bash
   VITE_VOLTAGE_API_KEY=your_api_key
   VITE_VOLTAGE_ORGANIZATION_ID=your_org_id
   VITE_VOLTAGE_ENVIRONMENT_ID=your_env_id
   VITE_VOLTAGE_WALLET_ID=your_wallet_id
   VITE_VOLTAGE_LINE_OF_CREDIT_ID=your_loc_id
   VITE_VOLTAGE_NETWORK=mutinynet
   # Optional: taproot asset group key (e.g., Voltage Cash) to enable asset rail
   VITE_VOLTAGE_CASH_ASSET=your_asset_group_key
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## How It Works

### Payment rails at a glance

| Rail | Send flow | Receive flow | Notes |
|------|-----------|--------------|-------|
| Lightning | Pay BOLT11 invoices with optional amount overrides and max routing fee (msats). | Generate BOLT11 invoices with memo + monitoring. | Default rail; invoices validated via prefix check. |
| On-chain | Pay BTC addresses/BIP21 URIs, auto-parsing amount/label, adjustable miner fee cap (sats). | Generate Signet/Mutinynet deposit addresses and BIP21 URI. | Completed sends surface tx IDs immediately. |
| Taproot Asset | Pay taproot asset invoices with per-asset fee controls (BTC or asset fees). | Generate asset receive requests using base-unit conversion. | Voltage Cash (or configured asset) auto-selected when available. |

All flows converge on `createVoltageAPI()` (`src/services/voltage.ts`), which wraps the Voltage Payments endpoints and emits UUID-based payment IDs. `monitorPaymentStatus` polls until a terminal status (`completed`, `failed`, `expired`) is observed.

### UI architecture

```
src/
├── components/
│   ├── WalletBalance.tsx       # Live wallet + asset overview
│   ├── SendPayment.tsx         # Unified send rail selector
│   ├── ReceivePayment.tsx      # Unified receive rail selector
│   ├── TransactionHistory.tsx  # Detail drawer w/ tx receipts
│   └── Notification.tsx        # Toast presentation
├── hooks/
│   ├── useNotification.ts      # Toast lifecycle
│   └── usePaymentMonitor.ts    # Reusable status polling
├── services/voltage.ts         # API client + helpers
├── types/voltage.ts            # Domain models / Amount helpers
└── globals.css                 # Conduit-inspired tokens & utilities
```

## API & Error Handling Notes

- **Authentication** – Requests sign with `X-Api-Key` from `import.meta.env`.
- **Async workflows** – `POST /payments` returns `202`; we persist local UUIDs and poll `GET /payments/{id}`.
- **Structured errors** – Voltage often responds with `{ detail, type }`; helpers stringify these before surfacing toasts or rendering history rows.
- **On-chain receipts** – Completed sends return `outflows[]` with `tx_id` + confirmation requirements, which we bubble up to the UI.
- **Development proxy** – Vite rewrites `/api` to the real host to avoid CORS; production uses `VITE_VOLTAGE_BASE_URL`.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_VOLTAGE_API_KEY` | Voltage API key |
| `VITE_VOLTAGE_ORGANIZATION_ID` | Organization UUID |
| `VITE_VOLTAGE_ENVIRONMENT_ID` | Environment UUID |
| `VITE_VOLTAGE_WALLET_ID` | Wallet UUID |
| `VITE_VOLTAGE_LINE_OF_CREDIT_ID` | Line of credit UUID |
| `VITE_VOLTAGE_NETWORK` | Network type (mutinynet/mainnet) |
| `VITE_VOLTAGE_CASH_ASSET` | Optional taproot asset group key |

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production (tsc --build + vite build)
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Documentation

- `docs/design-theme.md` – Conduit-aligned design tokens, typography, motion, and component patterns.
- Refer to Voltage’s official OpenAPI spec for the latest endpoint contract.

## Contributing

1. Create a feature branch and keep `.env.example` in sync with any new vars.
2. Run `npm run lint` (and unit tests where logic changes).
3. Update documentation (README, design theme) when UX or API behaviour evolves.
4. Submit PRs with concise, imperative commits and include screenshots/gifs for UI work.

## Roadmap Ideas

- Webhook listeners to replace polling in production deployments.
- Invoice/QR exports for Lightning invoices and BIP21 URIs.
- Optional dark theme using mirrored design tokens.
- Wallet connect integrations for mobile clients.

