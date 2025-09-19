# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Voltage Pay wallet demo application - a React-based Lightning Network wallet demonstrating the Voltage Payments API integration. The application provides a fully functional wallet interface with sending, receiving, and transaction history features.

## Technology Stack

- **Frontend**: React 19.1.0 with TypeScript
- **Build Tool**: Vite 7.0.4
- **Styling**: Tailwind CSS 4.1.11 (new Vite plugin)
- **State Management**: React hooks (useState, useEffect, custom hooks)
- **API Client**: Custom TypeScript wrapper for Voltage API
- **Linting**: ESLint 9.30.1 with TypeScript ESLint

## Development Commands

```bash
# Start development server (with API proxy)
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

## High-Level Architecture

### Component Architecture
The application uses a tab-based navigation system with four main features:
- **Balance Display**: Real-time wallet balance in sats and BTC
- **Send Payment**: Lightning invoice payment interface
- **Receive Payment**: Invoice generation for receiving payments
- **Transaction History**: Paginated transaction list with details

### Service Layer
- `services/voltage.ts`: Centralized API client managing all Voltage API interactions
- Implements retry logic, error handling, and response transformation
- Uses environment variables for configuration (API key, wallet ID)

### Custom Hooks
- `useNotification`: Global notification system for user feedback
- `usePaymentMonitor`: Polls payment status until completion/failure

### Type Safety
- `types/voltage.ts`: Comprehensive TypeScript definitions for all API responses
- Strict typing throughout the application

## API Integration Pattern

### Payment Flow
1. **Receiving**: Create payment → Get 202 response → Poll for invoice → Display to user
2. **Sending**: Parse invoice → Create payment → Get 202 response → Monitor status
3. **Status Monitoring**: Poll `/payments/{id}` endpoint until terminal state

### Error Handling
- API errors display user-friendly messages via notification system
- Network failures trigger retry mechanisms
- Invalid states handled gracefully with error boundaries

### Development vs Production
- **Development**: Uses Vite proxy to handle CORS (`/api` → `https://voltageapi.com/v1`)
- **Production**: Direct API calls with proper CORS headers

## Environment Configuration

Required environment variables:
```env
VITE_VOLTAGE_API_KEY=your-api-key
VITE_VOLTAGE_WALLET_ID=your-wallet-id
VITE_VOLTAGE_API_URL=https://voltageapi.com/v1
```

## Key Implementation Details

### Payment Status Monitoring
The `usePaymentMonitor` hook implements exponential backoff polling:
- Initial poll: 1 second
- Max interval: 10 seconds
- Stops on terminal states: COMPLETED, FAILED, EXPIRED

### Transaction History
- Paginated with 10 transactions per page
- Displays both sent and received payments
- Shows amount, status, timestamp, and description

### Amount Handling
- All amounts internally handled in satoshis (integer)
- UI displays both sats and BTC formats
- Conversion utilities in voltage service

## Testing Considerations

No testing framework is currently configured. When adding tests, focus on:
- Payment flow integration tests
- API error handling scenarios
- Amount conversion accuracy
- Component interaction flows

## Development Notes

- The app uses React 19's latest features
- Tailwind CSS configured with Vite plugin (not PostCSS)
- TypeScript strict mode enabled
- No external state management library needed
- All API responses follow 202 async pattern