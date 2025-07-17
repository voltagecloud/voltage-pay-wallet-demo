Website logo
⌘
K
Contact Support
Login
Developer Guide
21 min
Introduction

The Voltage API enables you to integrate Lightning Network functionality into your applications. This guide will walk you through common tasks and help you get started with the API.

If you are starting here we are assuming that you already have a team and a staging wallet setup for you. If you do not, the Wallet Setup Guide will get you ready.
﻿
Base URL
https://voltageapi.com/v1
Authentication

The Voltage API uses x-api-key authentication methods for API calls:

    API Key Authentication (via x-api-key header): 

--header 'x-api-key: YOUR_API_KEY'
Generating API Key

You can manage your API keys by visiting your team page and clicking on "API Keys"
﻿

Be sure to select the correct Environment for your API key when generating and give it a descriptive name.
﻿
Quick Start Guides
Receiving a payment

The payment flow for receiving payments follows these steps:
1: Create a new payment (Returns 202 on success)
curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/payments' \
  --request POST \
  --data '{
    "amount_msats": 10000,
    "currency": "btc",
    "description": "test payment",
    "id": {payment_id}, // unique UUID created by you
    "payment_kind": "bolt11",
    "wallet_id": {wallet_id}
  }'
﻿
2: After receiving 202, fetch the payment details to get the invoice
curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/payments/{payment_id}' \
  --request GET
﻿

Important: The payment creation endpoint returns a 202 status code on success, indicating the request was accepted. You must then fetch the payment details separately to get the invoice and monitor its status.

Example Payment Details Response
{
    "bip21_uri": "lightning:lntbs140n1pnag...",
    "created_at": "2025-03-14T16:08:11.692963Z",
    "currency": "btc",
    "data": {
        "amount_msats": 14000,
        "memo": "test payment",
        "payment_request": "lntbs140n1pnag..."
    },
    "direction": "receive",
    "environment_id": "{environment_id}",
    "error": null,
    "id": "11ca843c-bdaa-44b6-965a-39ac550fcdf3",
    "organization_id": "{organization_id}",
    "status": "receiving",
    "type": "bolt11",
    "updated_at": "2025-03-14T16:08:13.959324Z",
    "wallet_id": "{wallet_id}"
}
﻿
Sending a Payment

The payment flow for sending payments follows these steps:
1: Initiate payment send (returns 202 on success)
curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/payments' \
  --request POST \
  --header 'x-api-key: your-api-key' \
  --header 'Content-Type: application/json' \
  --data '{
    "id": "68d00852-8dd8-4c71-94d2-91c84695da78",  # Unique payment identifier
    "wallet_id": "{wallet_id}",
    "currency": "btc",
    "type": "bolt11",
    "data": {
      # Optional when payment_request already has an amount
      # Required when payment_request has no amount
      # If provided with an amount-containing payment_request, values must match
      "amount_msats": 150000,
      
      # Optional: defaults to 1% of payment value or 1,000 msats (whichever is greater)
      "max_fee_msats": 1000,
      
      # Required: Lightning invoice to pay
      "payment_request": "lntbs1500n1p..."
    }
  }'
﻿
2: After receiving 202, fetch payment status to monitor progress
curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/payments/{payment_id}' \
  --request GET
﻿

Important: Like the receive flow, the send payment endpoint returns a 202 status code on success. You must fetch the payment details separately to monitor its status.
Payment Status Monitoring

When sending or receiving payments, you must actively monitor the payment status by fetching the payment details. The status field will progress through these states:

    For sent payments:
        Initial: sending
        Final: completed or failed
    For received payments:
        Initial: receiving
        Final: completed or failed

Best practices for monitoring:

    Poll the payment status endpoint every few seconds
    Implement appropriate timeout logic
    Handle both success and error states
    Consider implementing webhook notifications for status changes

Example of checking payment status:
async function monitorPayment(paymentId) {
  while (true) {
    const response = await fetchPaymentStatus(paymentId);
    
    if (response.status === 'completed') {
      return response; // Payment successful
    }
    if (response.status === 'failed') {
      throw new Error(response.error || 'Payment failed');
    }
    
    // Wait before checking again
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}
﻿
Wallet Balance Management

Regularly check wallet balances to ensure sufficient funds:
curl 'https://voltageapi.com/v1/organizations/{organization_id}/wallets/{wallet_id}'
﻿
Payment History

Track payment history and events:
curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/payments/{payment_id}/history'
﻿
Creating A Staging Wallet through the API:

In order to create a Staging Wallet through the API you must have already created your first wallet through the UI.  Doing this will autmatically generated you a line of credit ID that you can use to start creating new wallets through the API.
﻿
﻿
﻿

Great! You now have the info required to make the request BELOW and create staging wallets through the API.
curl 'https://voltageapi.com/v1/organizations/{organization_id}/wallets' \
  --request POST \
  --data '{
    "environment_id": {environment_id},
    "id": "7a68a525-9d11-4c1e-a3dd-1c2bf1378ba2",  # UUID you generate
    "line_of_credit_id": "your-line-of-credit-id",
    # denominated in msats
    "limit": 100000000,
    "metadata": {
      "tag": "testing wallet"
    },
    "name": "My First Wallet",
    "network": "mutinynet"
  }'
﻿
Metadata Support

Add custom metadata to wallets for better organization:
curl 'https://voltageapi.com/v1/organizations/{organization_id}/wallets' \
  --request POST \
  --data '{
    "name": "Customer Wallet",
    "metadata": {
      "customer_id": "cust_123",
      "purpose": "subscription_payments"
    }
    // ... other wallet creation fields
  }'
﻿
Error Handling

The API uses standard HTTP status codes:

    200: Success
    201: Resource created
    202: Successfully requested a new payment be created
    400: Bad request
    403: Authentication/authorization error
    404: Resource not found
    500: Server error

Always check the response status and handle errors appropriately.
Support and Resources

For additional support:

    ﻿Review the full API documentation﻿

﻿

Remember to always use appropriate error handling and logging in your integration to ensure reliable operation of your Lightning Network payments.
Updated 30 Apr 2025
Doc contributor
Doc contributor
Doc contributor
Doc contributor
Did this page help you?
PREVIOUS
Wallet Setup Guide
NEXT
Voltage Payments API
TABLE OF CONTENTS
Introduction
Base URL
Authentication
Generating API Key
Quick Start Guides
Receiving a payment
1: Create a new payment (Returns 202 on success)
2: After receiving 202, fetch the payment details to get the invoice
Sending a Payment
1: Initiate payment send (returns 202 on success)
2: After receiving 202, fetch payment status to monitor progress
Payment Status Monitoring
Wallet Balance Management
Payment History
Creating A Staging Wallet through the API:
Metadata Support
Error Handling
Support and Resources

Wallet Setup Guide - Voltage Payments Documentation
