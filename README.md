# Voltage Pay Wallet Demo

A modern Lightning Network wallet built with React and TypeScript, showcasing integration with the Voltage Payments API. This demo application provides a complete end-user wallet experience for sending and receiving Bitcoin payments via Lightning Network.

## Features

- **Real-time Balance Display** - View wallet balance in both sats and BTC
- **Lightning Payments** - Send payments via Lightning invoices (BOLT11)
- **Invoice Generation** - Create Lightning invoices to receive payments
- **Transaction History** - View payment history and transaction details
- **Payment Monitoring** - Real-time status updates for payments
- **Error Handling** - Comprehensive error states and user feedback
- **Staging Environment** - Uses Mutinynet for safe testing with no real funds

## Technology Stack

- **Frontend**: React 19.1.0 with TypeScript
- **Build Tool**: Vite 7.0.4
- **Styling**: Tailwind CSS 4.1.11
- **API Integration**: Voltage Payments API
- **Network**: Mutinynet (Bitcoin Signet for testing)

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd voltage-pay-wallet-demo
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Voltage API credentials in `.env`:
   ```bash
   VITE_VOLTAGE_API_KEY=your_api_key_here
   VITE_VOLTAGE_ORGANIZATION_ID=your_organization_id
   VITE_VOLTAGE_ENVIRONMENT_ID=your_environment_id
   VITE_VOLTAGE_WALLET_ID=your_wallet_id
   VITE_VOLTAGE_LINE_OF_CREDIT_ID=your_line_of_credit_id
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## How It Works

### Voltage Payments Integration

This wallet integrates with Voltage Payments, a credit-based Lightning payments platform that handles all the complexity of Lightning Network operations:

- **No Node Management** - Voltage handles nodes, channels, and liquidity
- **Credit-Based System** - Functions like a business credit card for Lightning payments
- **Automatic Invoice Generation** - Creates BOLT11 invoices for receiving payments
- **Real-time Status Monitoring** - Tracks payment states from creation to completion

### Payment Flow

**Receiving Payments:**
1. User enters amount and description
2. App creates payment request via Voltage API (returns 202)
3. App polls for invoice generation (status: "generating" → "receiving")
4. Lightning invoice (BOLT11) is displayed to user
5. App monitors payment status until completion

**Sending Payments:**
1. User pastes Lightning invoice
2. App initiates payment via Voltage API (returns 202)
3. App monitors payment status (status: "sending" → "completed")
4. User receives confirmation of successful payment

### Architecture

```
src/
├── components/          # React UI components
│   ├── WalletBalance.tsx    # Balance display
│   ├── ReceivePayment.tsx   # Invoice generation
│   ├── SendPayment.tsx      # Payment sending
│   └── TransactionHistory.tsx # Payment history
├── services/
│   └── voltage.ts          # Voltage API client
├── types/
│   └── voltage.ts          # TypeScript definitions
└── hooks/                  # Custom React hooks
```

## API Integration Details

### Authentication
Uses `X-Api-Key` header authentication with environment-specific API keys.

### Error Handling
- **202 Responses**: Handled correctly for async payment operations
- **CORS Issues**: Resolved via Vite proxy for development
- **Status Monitoring**: Polling-based approach for payment status updates

### Development vs Production
- **Development**: Uses Vite proxy (`/api`) to avoid CORS issues
- **Production**: Direct API calls to `https://voltageapi.com/v1`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_VOLTAGE_API_KEY` | Your Voltage API key |
| `VITE_VOLTAGE_ORGANIZATION_ID` | Organization UUID |
| `VITE_VOLTAGE_ENVIRONMENT_ID` | Environment UUID (staging/production) |
| `VITE_VOLTAGE_WALLET_ID` | Wallet UUID |
| `VITE_VOLTAGE_LINE_OF_CREDIT_ID` | Line of credit UUID |
| `VITE_VOLTAGE_NETWORK` | Network type (mutinynet/mainnet) |

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Next Steps

- Add webhook support for real-time payment notifications
- Implement QR code generation for Lightning invoices
- Add on-chain Bitcoin payment support
- Integrate with wallet connect protocols
- Add payment request management features

## Documentation

See the `/docs` folder for detailed Voltage Payments API documentation and integration guides.