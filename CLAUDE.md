# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Voltage Pay wallet demo application - a React-based frontend for demonstrating Lightning Network payment integration using the Voltage API. The project is in early development stages with basic React boilerplate and Tailwind CSS styling.

## Technology Stack

- **Frontend**: React 19.1.0 with TypeScript
- **Build Tool**: Vite 7.0.4
- **Styling**: Tailwind CSS 4.1.11 with the new Vite plugin
- **Linting**: ESLint 9.30.1 with TypeScript ESLint
- **Package Manager**: npm (uses package-lock.json)

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── App.tsx          # Main application component (currently minimal)
├── main.tsx         # React application entry point
├── globals.css      # Global styles with Tailwind import
├── assets/          # Static assets
└── vite-env.d.ts    # Vite TypeScript definitions
```

## Voltage API Integration Context

This project is intended to demonstrate the Voltage Payments API, which provides Lightning Network functionality without requiring node management. Key concepts from the documentation:

### Payment Flow Architecture
- **Receiving**: Create payment → Get 202 response → Fetch payment details for invoice
- **Sending**: Initiate payment → Get 202 response → Monitor payment status
- **Status Monitoring**: Poll payment status endpoints for completion/failure

### API Structure
- Base URL: `https://voltageapi.com/v1`
- Authentication: `x-api-key` header
- Organization/Environment/Wallet hierarchy
- Credit-based payment system (like business credit card)

## Development Notes

- The application currently has minimal implementation (just "Hello world")
- Tailwind CSS is configured with the new Vite plugin approach
- TypeScript is strictly configured with separate app/node configs
- ESLint is set up with React hooks and refresh plugins
- The project uses Vite's fast refresh for React development

## Key Implementation Areas

When implementing Voltage API features, focus on:

1. **Payment Creation Flow**: Handle the 202 response pattern for both send/receive
2. **Status Monitoring**: Implement polling logic for payment status updates
3. **Error Handling**: Use standard HTTP status codes (200, 201, 202, 400, 403, 404, 500)
4. **Wallet Management**: Balance checking and transaction history
5. **Metadata Support**: Custom metadata for wallets and payments

## Testing

No testing framework is currently configured. Consider adding Jest or Vitest for testing payment flows and API integrations.

## Environment Setup

The project expects staging environment setup through the Voltage dashboard before API integration. API keys should be environment-specific and never committed to the repository.