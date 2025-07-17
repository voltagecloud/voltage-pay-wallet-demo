Website logo
⌘
K
Contact Support
Login
Developer Guide
Sending
10 min
Sending Payments

This guide explains how to send Lightning Network payments using the Voltage API.
Prerequisites

    A Voltage account with an active wallet
    An API key (get this from the "API Keys" page in your dashboard)

Sending a Payment
Endpoint
POST https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/payments
﻿
Headers
x-api-key: your-api-key
Content-Type: application/json
﻿
Request Body
{
  "id": "68d00852-8dd8-4c71-94d2-91c84695da78",  // UUID created by you
  "wallet_id": "7a68a525-9d11-4c1e-a3dd-1c2bf1378ba2",
  "currency": "btc",
  "type": "bolt11",
  "data": {
    "payment_request": "lntbs1500n1p...",  // Required: Lightning invoice to pay (cannot be empty)  
    "amount_msats": 150000,  // Optional when payment_request already contains an amount
                             // Required when payment_request has no amount
                             // If provided with an amount-containing payment_request, values must match
                             // Must be greater than 0
    "max_fee_msats": 1000    // Optional: defaults to 1% of payment value or 1,000 msats (whichever is greater)
                             // Must be greater than 0
  }
}
﻿
Required Fields

    id: A unique identifier for the payment
    wallet_id: The ID of the wallet sending the payment
    currency: Currently only "btc" is supported
    type: Currently only "bolt11" is supported
    data.payment_request: The Lightning invoice you want to pay
    data.amount_msats: Payment amount in millisatoshis
    data.max_fee_msats: Maximum routing fee you're willing to pay

Monitoring Payment Status

After sending a payment, monitor its status using:
GET https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/payments/{payment_id}
﻿

The payment will transition through these states:

    sending: Payment is in progress
    completed: Payment was successful
    failed: Payment failed (check error field for details)

Error Handling

Common HTTP status codes:

    200: Success
    400: Invalid request (check error message)
    403: Authentication error
    404: Payment not found
    500: Server error

Example Implementation
# Send payment
curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/payments' \
  --request POST \
  --header 'x-api-key: your-api-key' \
  --header 'Content-Type: application/json' \
  --data '{
    "id": "68d00852-8dd8-4c71-94d2-91c84695da78",
    "wallet_id": "7a68a525-9d11-4c1e-a3dd-1c2bf1378ba2",
    "currency": "btc",
    "type": "bolt11",
    "data": {
      "amount_msats": 150000,
      "max_fee_msats": 1000,
      "payment_request": "lntbs1500n1p..."
    }
  }'

# Check payment status
curl 'https://voltageapi.com/api/v1/organizations/{organization_id}/environments/{environment_id}/payments/{payment_id}' \
  --header 'x-api-key: your-api-key'
﻿

﻿
Updated 30 Apr 2025
Doc contributor
Doc contributor
Doc contributor
Doc contributor
Did this page help you?
PREVIOUS
Voltage Payments API
NEXT
Receiving
TABLE OF CONTENTS
Sending Payments
Prerequisites
Sending a Payment
Endpoint
Headers
Request Body
Required Fields
Monitoring Payment Status
Error Handling
Example Implementation

Voltage Payments API - Voltage Payments Documentation
