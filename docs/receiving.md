Website logo
⌘
K
Contact Support
Login
Developer Guide
Receiving
15 min
Receiving Payments

This guide explains how to receive Lightning Network payments using the Voltage API.
Prerequisites

    A Voltage account with an active wallet
    An API key (get this from the "API Keys" page in your dashboard)

Creating and Retrieving a Payment Request

Receiving a payment is a two-step process:

    Create a payment request
    Retrieve the payment details

Step 1: Create Payment Request
Endpoint
POST https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/payments
﻿
Headers
x-api-key: your-api-key
Content-Type: application/json
﻿
Request Body
{
  "amount_msats": 10000,
  "currency": "btc",
  "description": "test payment",
  "id": "11ca843c-bdaa-44b6-965a-39ac550fcdf3",
  "payment_kind": "bolt11",
  "wallet_id": "{wallet_id}"
}
﻿
Required Fields

    id: A unique identifier for the payment
    wallet_id: The ID of the wallet receiving the payment
    amount_msats: Amount to receive in millisatoshis
    currency: Currently only "btc" is supported
    payment_kind: Currently only "bolt11" is supported
    description: Description that will be included in the invoice

Step 2: Retrieve Payment Details
Endpoint
GET https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/payments/{payment_id}
﻿
Headers
x-api-key: your-api-key
﻿
Response
{
  "direction": "receive",
  "id": "{payment_id}",
  "wallet_id": "{wallet_id}",
  "organization_id": "{organization_id}",
  "environment_id": "{environment_id}",
  "created_at": "2025-02-12T20:16:14.095785Z",
  "updated_at": "2025-02-12T20:16:14.807961Z",
  "currency": "btc",
  "type": "bolt11",
  "data": {
    "payment_request": "lntbs1404n1pn66qv...",
    "amount_msats": 10000,
    "memo": "test payment"
  },
  "status": "receiving",
  "error": null
}
﻿

The payment_request in the response contains the BOLT11 invoice that should be provided to the payer.
Complete Example Implementation
# Step 1: Create payment request
curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/payments' \
  --request POST \
  --header 'x-api-key: your-api-key' \
  --header 'Content-Type: application/json' \
  --data '{
    "amount_msats": 10000,
    "currency": "btc",
    "description": "test payment",
    "id": "11ca843c-bdaa-44b6-965a-39ac550fcdf3",
    "payment_kind": "bolt11",
    "wallet_id": "{wallet_id}"
  }'

# Step 2: Retrieve payment details to get BOLT11 invoice
curl 'https://voltageapi.com/api/v1/organizations/{organization_id}/environments/{environment_id}/payments/{payment_id}' \
  --header 'x-api-key: your-api-key'

# Step 3: Monitor payment status
curl 'https://voltageapi.com/api/v1/organizations/{organization_id}/environments/{environment_id}/payments/{payment_id}' \
  --header 'x-api-key: your-api-key'
﻿
Monitoring Payment Status

After creating a payment request, monitor its status using the same GET endpoint:

The payment will transition through these states:

    receiving: Waiting for payment
    completed: Payment received successfully
    failed: Payment failed (check error field for details)

Error Handling

Common HTTP status codes:

    200: Success
    201: Payment request created
    400: Invalid request (check error message)
    403: Authentication error
    404: Payment not found
    500: Server error

Best Practices

    Generate unique payment IDs for each request
    Always retrieve the payment details after creation to get the BOLT11 invoice
    Store the payment ID to track the payment status
    Provide clear descriptions for better record keeping
    Monitor payment status changes to update your application accordingly
    Consider implementing webhook notifications for real-time updates

﻿
Updated 30 Apr 2025
Doc contributor
Doc contributor
Doc contributor
Doc contributor
Did this page help you?
PREVIOUS
Sending
NEXT
Wallet Management
TABLE OF CONTENTS
Receiving Payments
Prerequisites
Creating and Retrieving a Payment Request
Step 1: Create Payment Request
Endpoint
Headers
Request Body
Required Fields
Step 2: Retrieve Payment Details
Endpoint
Headers
Response
Complete Example Implementation
Monitoring Payment Status
Error Handling
Best Practices

Sending - Voltage Payments Documentation
