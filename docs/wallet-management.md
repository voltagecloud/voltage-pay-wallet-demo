Website logo
⌘
K
Contact Support
Login
Developer Guide
Wallet Management
21 min
Managing Wallets

Wallets are central to your Voltage Payments integration, allowing you to manage funds, track balances, and orchestrate transactions. This guide covers the complete lifecycle of wallet management through the API.
Authentication

The Voltage API uses x-api-key authentication methods for API calls:

    API Key Authentication (via x-api-key header):

Your API key can be generated from the "API Keys" page in the dashboard. For all examples in this guide, we'll show Bearer Token authentication, but you can use either method based on your preference and security requirements.
﻿
Overview

A wallet in Voltage Payments:

    Stores funds for Lightning Network and on-chain transactions
    Maintains balance history and transaction ledger
    Can be assigned limits and credit allocations
    Supports custom metadata for your application needs

Wallet Endpoints

The full API spec is HERE﻿

Method
	

Endpoint
	

Description

GET
	

/organizations/{organization_id}/wallets
	

List all wallets in an organization

POST
	

/organizations/{organization_id}/wallets
	

Create a new wallet

GET
	

/organizations/{organization_id}/wallets/{wallet_id}
	

Get a single wallet's details

DELETE
	

/organizations/{organization_id}/wallets/{wallet_id}
	

Delete a wallet

GET
	

/organizations/{organization_id}/wallets/{wallet_id}/ledger
	

Get a wallet's transaction history
Creating a Wallet

Before creating wallets through the API, you must first create your initial wallet through the UI. This process automatically generates a line of credit ID needed for API wallet creation.
Prerequisites

    Create your first wallet through the UI
    Generate an API key with Read, Write, and Billing permissions
    Retrieve your line of credit ID from the API keys page 
    (Click on your API key and the Sidebar will pop out with Line of Credit ID)

﻿
CreateWallet Request
curl 'https://voltageapi.com/v1/organizations/{organization_id}/wallets' \
  --request POST \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{
    "environment_id": "{environment_id}",
    "id": "7a68a525-9d11-4c1e-a3dd-1c2bf1378ba2",  # UUID you generate
    "line_of_credit_id": "your-line-of-credit-id",
    "limit": 100000000,  # denominated in msats (100,000,000 msats = 0.001 BTC)
    "metadata": {
      "tag": "testing wallet",
      "customer_id": "cust_123"  # your custom metadata
    },
    "name": "Customer Wallet",
    "network": "mutinynet"  # or "mainnet", "testnet3"
  }'
﻿
Required Parameters

Parameter
	

Type
	

Description

id
	

string (UUID)
	

Unique identifier you generate for the wallet

environment_id
	

string (UUID)
	

Environment ID to create the wallet in

line_of_credit_id
	

string (UUID)
	

Your line of credit ID obtained from UI

name
	

string
	

Display name for the wallet

network
	

string
	

Network to use: "mainnet", "testnet3", or "mutinynet"

limit
	

integer
	

Maximum balance in msats (100,000,000 = 0.001 BTC)
Optional Parameters

Parameter
	

Type
	

Description

metadata
	

object
	

Custom application data linked to this wallet
Response

The API will return a 202 status code indicating the wallet creation request was accepted. To verify the wallet was created successfully, you need to query the wallet list or get the wallet by ID.
Listing Wallets

Retrieve all wallets in your organization:
curl 'https://voltageapi.com/v1/organizations/{organization_id}/wallets' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'
﻿
Response Example
[
  {
    "id": "7a68a525-9d11-4c1e-a3dd-1c2bf1378ba2",
    "active": true,
    "created_at": "2025-04-11T14:45:30.974Z",
    "updated_at": "2025-04-11T14:45:30.974Z",
    "deleted_at": null,
    "deletion_failed_at": null,
    "name": "Customer Wallet",
    "organization_id": "b0684ab8-1130-46af-8f70-71519442f108",
    "environment_id": "123e4567-e89b-12d3-a456-426614174000",
    "limit": 100000000,
    "line_of_credit_id": "456e7890-f12c-34d5-b678-426614174000",
    "network": "mutinynet",
    "metadata": {
      "tag": "testing wallet",
      "customer_id": "cust_123"
    },
    "balances": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "wallet_id": "7a68a525-9d11-4c1e-a3dd-1c2bf1378ba2",
        "effective_time": "2025-04-11T14:45:30.974Z",
        "available": 50000000,
        "total": 50000000,
        "network": "mutinynet",
        "currency": "btc"
      }
    ],
    "holds": [],
    "error": null
  }
]
Getting a Single Wallet

Retrieve details for a specific wallet:
curl 'https://voltageapi.com/v1/organizations/{organization_id}/wallets/{wallet_id}' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'
﻿

The response format is the same as a single wallet object from the list endpoint.
Checking Wallet Balance

The wallet details endpoint also returns the current balance information in the balances array. You can regularly poll this endpoint to monitor available funds.

Key balance fields:

    available: Currently available balance in msats
    total: Total balance including funds on hold
    currency: The currency of the balance (e.g., "btc")

Viewing Wallet Transaction History

To view all transactions for a wallet:
curl 'https://voltageapi.com/v1/organizations/{organization_id}/wallets/{wallet_id}/ledger' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'
﻿
Query Parameters

Parameter
	

Type
	

Description

offset
	

integer
	

Starting point for pagination

limit
	

integer
	

Maximum number of records to return

payment_id
	

string (UUID)
	

Filter by payment ID

start_date
	

string (date-time)
	

Filter transactions after this date

end_date
	

string (date-time)
	

Filter transactions before this date

sort_key
	

string
	

Field to sort by: "effective_time", "message_time", or "time_and_effective_time"

sort_order
	

string
	

Order: "ASC" or "DESC"
Response Example
{
  "items": [
    {
      "credit_id": "123e4567-e89b-12d3-a456-426614174000",
      "payment_id": "11ca843c-bdaa-44b6-965a-39ac550fcef7",
      "amount_msats": 10000000,
      "currency": "btc",
      "effective_time": "2025-04-11T14:45:30.974Z",
      "type": "credited"
    },
    {
      "credit_id": "456e7890-f12c-34d5-b678-426614174000",
      "payment_id": "3e84b6c5-5bbe-4e0f-9fb3-f1198330f6fa",
      "amount_msats": 5000000,
      "currency": "btc",
      "effective_time": "2025-04-10T18:32:15.123Z",
      "type": "debited"
    }
  ],
  "offset": 0,
  "limit": 10,
  "total": 2
}
Deleting a Wallet

To delete a wallet:
curl 'https://voltageapi.com/v1/organizations/{organization_id}/wallets/{wallet_id}' \
  --request DELETE \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'
﻿

A successful deletion returns a 200 status code.
Using Wallet Metadata

Wallet metadata allows you to store custom information with your wallets for internal tracking. This field accepts any valid JSON object:
"metadata": {
  "customer_id": "cust_123",
  "purpose": "subscription_payments",
  "team": "engineering",
  "region": "north-america"
}

Metadata is returned with wallet objects and can be used for filtering and organization in your application.
Best Practices

    Monitor wallet balances regularly to ensure sufficient funds for outgoing payments.
    Use meaningful wallet names and metadata to organize wallets by purpose or customer.
    Set appropriate wallet limits based on expected transaction volumes.
    Check the ledger periodically to reconcile transactions with your internal systems.
    Consider creating separate wallets for different business functions or customers.

Troubleshooting

Issue
	

Resolution

Wallet creation fails
	

Verify your line of credit ID and ensure you have sufficient credit allocation

Can't retrieve wallet
	

Check if the wallet ID exists and your API key has appropriate permissions

Balance discrepancies
	

Check the ledger for recent transactions and any holds on funds

"403 Forbidden" errors
	

Verify your API key has the correct permissions for the operation

﻿
Updated 12 Jun 2025
Doc contributor
Doc contributor
Did this page help you?
PREVIOUS
Receiving
NEXT
Staging Environment
TABLE OF CONTENTS
Managing Wallets
Authentication
Overview
Wallet Endpoints
Creating a Wallet
Prerequisites
CreateWallet Request
Required Parameters
Optional Parameters
Response
Listing Wallets
Response Example
Getting a Single Wallet
Checking Wallet Balance
Viewing Wallet Transaction History
Query Parameters
Response Example
Deleting a Wallet
Using Wallet Metadata
Best Practices
Troubleshooting

Receiving - Voltage Payments Documentation
