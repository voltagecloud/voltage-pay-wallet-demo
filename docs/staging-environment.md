Website logo
⌘
K
Contact Support
Login
Developer Guide
Staging Environment
16 min
Staging Environment

The Voltage Payments staging environment provides a safe, sandbox environment for testing your Lightning Network integrations using Mutinynet, a global Bitcoin signet. This guide will help you understand how to use the staging environment effectively.
Overview

The staging environment allows you to:

    Test Lightning Network payment functionality without real funds
    Develop and validate your integration before moving to production
    Access automatic line of credit for testing
    Experiment with the API without financial risk

Getting Started
Base URL

All API requests for staging and mainnet environments should be made to:
https://voltageapi.com/v1
﻿
Authentication

    Navigate to the "API Keys" page in your dashboard
    Generate a new API key specifically for the staging environment
    Include your API key in requests using the x-api-key header

Staging Wallets
Automatic Line of Credit

When using Mutinynet, your organization automatically receives a line of credit for testing purposes. Unlike mainnet:

    No application process is required
    No collateral or bank verification needed
    No billing cycles or payments to manage

How the Line of Credit Works

    Automatic Creation: A line of credit is automatically created when you create your first Mutinynet environment Wallet
    Credit Limit: Each Mutinynet environment comes with a 1 BTC default credit limit
    Finding Your Line of Credit ID: Your line of credit ID is displayed on the API Keys page in your dashboard for convenient access
    Wallet Creation:
        Wallets created through the UI have a default limit of 0.05 BTC
        When creating wallets through the API, you can set any limit value as long as there's enough allocation left in your line of credit
    Automatic Expansion: If you need additional credit for testing, creating a new wallet through the dashboard UI will automatically expand your line of credit with an additional 1 BTC buffer
    Deleting Wallets: When a wallet is deleted, its allocation is freed up within the line of credit, but the total line of credit limit remains unchanged

Creating a Staging Wallet

To create a new staging wallet, you'll need:

    Your organization ID
    Your environment ID
    Your line of credit ID (found in the UI)

Example request:
curl 'https://voltageapi.com/api/v1/organizations/{organization_id}/wallets' \
  --request POST \
  --data '{
    "environment_id": "{environment_id}",
    "id": "7a68a525-9d11-4c1e-a3dd-1c2bf1378ba2",  # UUID you generate
    "line_of_credit_id": "your-line-of-credit-id",
    "limit": 100000000,
    "metadata": {
      "tag": "testing wallet"
    },
    "name": "My First Wallet",
    "network": "mutinynet"
  }'
﻿
Testing Payments
Sending Payments

You can test sending payments without worrying about real funds or billing cycles. The staging environment allows you to:

    Send test Lightning payments
    Experiment with different payment amounts
    Test error handling and payment states

﻿
Receiving Payments

The staging environment supports full testing of payment receiving functionality:

    Generate test invoices
    Monitor payment status changes

﻿
Payment Status Flow

Monitor payment status transitions in your staging environment:

    For sent payments: sending → completed or failed
    For received payments: receiving → completed or failed

Best Practices

    Environment Separation
        Use different API keys for staging and production
        Clearly label test wallets and payments
        Use meaningful metadata for testing scenarios
    Testing Scenarios
        Test both successful and failed payment flows
        Validate error handling
        Test payment status monitoring
    Monitoring
        Regularly check wallet balances
        Monitor payment history
        Test API response handling

Limitations

While the staging environment closely mirrors production functionality, be aware of these differences:

    Uses Mutinynet instead of mainnet Bitcoin
    No real funds are involved
    No billing cycles or invoices
    Automatic line of credit approval
    May have different rate limits than production

Moving to Production

When you're ready to move to production:

    Submit a mainnet application
    Complete the approval process
    Set up required collateral or bank verification
    Generate new API keys for production
    Update your integration to use production endpoints

﻿
Updated 11 Apr 2025
Doc contributor
Did this page help you?
PREVIOUS
Wallet Management
NEXT
Webhooks
TABLE OF CONTENTS
Staging Environment
Overview
Getting Started
Base URL
Authentication
Staging Wallets
Automatic Line of Credit
How the Line of Credit Works
Creating a Staging Wallet
Testing Payments
Sending Payments
Receiving Payments
Payment Status Flow
Best Practices
Limitations
Moving to Production

Wallet Management - Voltage Payments Documentation
