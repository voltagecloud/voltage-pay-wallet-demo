

Open API Client
Powered by Scalar
v1.0.0
OAS 3.1.0
Voltage Payments API

API documentation for Voltage Payments
Server
Server:https://voltageapi.com/v1

Environment api key used to authenticate
Name
:
x-api-key
Value
:
Client Libraries
Curl Shell
Wallets ​

Manage wallets in an organization
Wallets Operations

    getorganizations/{organization_id}/wallets
    postorganizations/{organization_id}/wallets
    getorganizations/{organization_id}/wallets/{wallet_id}
    deleteorganizations/{organization_id}/wallets/{wallet_id}
    patchorganizations/{organization_id}/wallets/{wallet_id}
    getorganizations/{organization_id}/wallets/{wallet_id}/ledger

Get all wallets in an organization​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID to create the wallet in

Responses

    application/json
    400

    Badly formatted request
    403

    No access to retrieve the organization's wallets, organization READ access required
    404

    No wallet found for given organization_id in provided organization
    500

    Server failed to complete the request

Request Example for getorganizations/{organization_id}/wallets
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/wallets' \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'

[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "active": true,
    "created_at": "2025-07-17T16:08:48.842Z",
    "updated_at": "2025-07-17T16:08:48.842Z",
    "deleted_at": null,
    "deletion_failed_at": null,
    "name": "string",
    "organization_id": "123e4567-e89b-12d3-a456-426614174000",
    "environment_id": "123e4567-e89b-12d3-a456-426614174000",
    "limit": null,
    "line_of_credit_id": null,
    "network": "mainnet",
    "metadata": null,
    "balances": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "wallet_id": "123e4567-e89b-12d3-a456-426614174000",
        "effective_time": "2025-07-17T16:08:48.842Z",
        "available": {
          "amount": 100000000,
          "currency": "btc",
          "negative": false,
          "unit": "msat"
        },
        "total": {
          "amount": 100000000,
          "currency": "btc",
          "negative": false,
          "unit": "msat"
        },
        "network": "mainnet",
        "currency": "btc"
      }
    ],
    "holds": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "amount": {
          "amount": 100000000,
          "currency": "btc",
          "negative": false,
          "unit": "msat"
        },
        "effective_time": "2025-07-17T16:08:48.842Z"
      }
    ],
    "error": null
  }
]

Successfully retrieved organization's wallets
Create a new wallet​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID to create the wallet in

Body
required
application/json

    id
    Type: stringFormat: uuid
    required
    environment_id
    Type: stringFormat: uuid
    required
    line_of_credit_id
    Type: stringFormat: uuid
    required
    name
    Type: string
    required
    network
    Type: stringenum
    required
        mainnet
        testnet3
        mutinynet
    limit
    Type: integerFormat: u-int64
    min:  
    1
    required

If limit is set to 0, no credit will be available for this wallet.
metadata
Type: object | null

Responses

    202

    Successfully requested a new wallet be created
    400

    Badly formatted request
    403

    No access to create a wallet, organization WRITE access required
    500

    Server failed to complete the request

Request Example for postorganizations/{organization_id}/wallets
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/wallets' \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN' \
  --data '{
  "environment_id": "123e4567-e89b-12d3-a456-426614174000",
  "id": "7a68a525-9d11-4c1e-a3dd-1c2bf1378ba2",
  "limit": 100000000,
  "line_of_credit_id": "7df75323-84f1-4699-97da-776380a0aa81",
  "metadata": {
    "tag": "testing wallet"
  },
  "name": "testing",
  "network": "mutinynet"
}'

No Body

Successfully requested a new wallet be created
Get a wallet​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID to create the wallet in
    wallet_id
    Type: stringFormat: uuid
    required

    Wallet ID to retrieve

Responses

    application/json
    400

    Badly formatted request
    403

    No access to retrieve the wallet, organization READ access required
    404

    No wallet found for given id in provided organization
    500

    Server failed to complete the request

Request Example for getorganizations/{organization_id}/wallets/{wallet_id}
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/wallets/{wallet_id}' \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'

{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "active": true,
  "created_at": "2025-07-17T16:08:48.842Z",
  "updated_at": "2025-07-17T16:08:48.842Z",
  "deleted_at": null,
  "deletion_failed_at": null,
  "name": "string",
  "organization_id": "123e4567-e89b-12d3-a456-426614174000",
  "environment_id": "123e4567-e89b-12d3-a456-426614174000",
  "limit": null,
  "line_of_credit_id": null,
  "network": "mainnet",
  "metadata": null,
  "balances": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "wallet_id": "123e4567-e89b-12d3-a456-426614174000",
      "effective_time": "2025-07-17T16:08:48.842Z",
      "available": {
        "amount": 100000000,
        "currency": "btc",
        "negative": false,
        "unit": "msat"
      },
      "total": {
        "amount": 100000000,
        "currency": "btc",
        "negative": false,
        "unit": "msat"
      },
      "network": "mainnet",
      "currency": "btc"
    }
  ],
  "holds": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "amount": {
        "amount": 100000000,
        "currency": "btc",
        "negative": false,
        "unit": "msat"
      },
      "effective_time": "2025-07-17T16:08:48.842Z"
    }
  ],
  "error": null
}

Successfully retrieved a wallet
Delete a wallet​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID to delete the wallet in
    wallet_id
    Type: stringFormat: uuid
    required

    Wallet ID to delete

Responses

    200

    Successfully deleted wallet
    400

    Badly formatted request
    403

    No access to delete a wallet, organization WRITE access required
    404

    No wallet found for given id in provided organization
    500

    Server failed to complete the request

Request Example for deleteorganizations/{organization_id}/wallets/{wallet_id}
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/wallets/{wallet_id}' \
  --request DELETE \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'

No Body

Successfully deleted wallet
Update a wallet​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID to get the wallet in
    wallet_id
    Type: stringFormat: uuid
    required

    ID of wallet to update

Body
required
application/json

    name
    Type: string
    required

Responses

    202

    Successfully submitted commands to update wallet
    400

    Badly formatted request
    403

    No access to update wallet, organization WRITE access required
    404

    No wallet found with provided id
    500

    Server failed to complete the request

Request Example for patchorganizations/{organization_id}/wallets/{wallet_id}
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/wallets/{wallet_id}' \
  --request PATCH \
  --header 'Content-Type: application/json' \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN' \
  --data '{
  "name": "a new name"
}'

No Body

Successfully submitted commands to update wallet
Get a wallet's transaction history​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID to create the wallet in
    wallet_id
    Type: stringFormat: uuid
    required

    Wallet ID to retrieve the ledger for

Query Parameters

    offset
    Type: integer | nullFormat: u-int32
    min:  
    0
    limit
    Type: integer | nullFormat: u-int32
    min:  
    0
    payment_id
    Type: string | nullFormat: uuid
    start_date
    Type: string | nullFormat: date-time
    end_date
    Type: string | nullFormat: date-time
    sort_key
    Type: stringenum nullable
        effective_time
        message_time
        time_and_effective_time
    sort_order
    Type: stringenum nullable
        ASC
        DESC

Responses

    application/json
    400

    Badly formatted request
    403

    No access to retrieve the wallet ledger, organization READ access required
    404

    No wallet found for given id in provided organization
    500

    Server failed to complete the request

Request Example for getorganizations/{organization_id}/wallets/{wallet_id}/ledger
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/wallets/{wallet_id}/ledger' \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'

{
  "items": [
    {
      "credit_id": "123e4567-e89b-12d3-a456-426614174000",
      "payment_id": "123e4567-e89b-12d3-a456-426614174000",
      "amount_msats": 1,
      "currency": "btc",
      "effective_time": "2025-07-17T16:08:48.842Z",
      "type": "credited"
    }
  ],
  "offset": 1,
  "limit": 1,
  "total": 1
}

Successfully retrieved a wallet's ledger
Payments ​

Manage payments in an organization
Payments Operations

    getorganizations/{organization_id}/environments/{environment_id}/payments
    postorganizations/{organization_id}/environments/{environment_id}/payments
    getorganizations/{organization_id}/environments/{environment_id}/payments/{payment_id}
    getorganizations/{organization_id}/environments/{environment_id}/payments/{payment_id}/history

Get all payments for an organization​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID the payment is in
    environment_id
    Type: stringFormat: uuid
    required

    Environment ID the payment is in

Query Parameters

    offset
    Type: integer | nullFormat: u-int32
    min:  
    0
    limit
    Type: integer | nullFormat: u-int32
    min:  
    0
    wallet_id
    Type: string | nullFormat: uuid
    statuses
    Type: array | null
    sort_key
    Type: stringenum nullable
        created_at
        updated_at
    sort_order
    Type: stringenum nullable
        ASC
        DESC
    kind
    Type: stringenum nullable
        bolt11
        onchain
        bip21
    direction
    Type: stringenum nullable
        send
        receive
    end_date
    Type: string | nullFormat: date-time
    start_date
    Type: string | nullFormat: date-time

Responses

    application/json
    400

    Badly formatted request
    403

    No access to get a payment, organization READ access required
    404

    No payment with that ID found in this organization and environment
    500

    Server failed to complete the request

Request Example for getorganizations/{organization_id}/environments/{environment_id}/payments
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/payments' \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'

{
  "items": [
    {
      "created_at": "2024-11-21T18:47:04.008Z",
      "currency": "btc",
      "data": {
        "amount_msats": 150000,
        "max_fee_msats": 1000,
        "memo": "testing",
        "payment_request": "lntbs1500n1pn5w25ypp59sfhx5llskdp6rmsmmq3zs86xey6l4y9wkzvkjl5v2cw0ex7xd4sdqqcqzzsxqyz5vqsp5u333jtc7lh0qvkusq5ntcpm3n2jjx6tw8jz7zvpqpnt3v8e572eq9qxpqysgq4hm7n79tnk76j4ll4f7ey9mmxdyj5pwzcmyqgxtgz40vjg9w58wq73040qvuurj83jakt2zws6y9qgzg2f6gtnj3ajf0mj4gw4mdt2cqhr2tpz"
      },
      "direction": "send",
      "environment_id": "123e4567-e89b-12d3-a456-426614174000",
      "error": null,
      "id": "3e84b6c5-5bbe-4e0f-9fb3-f1198330f6fa",
      "organization_id": "b0684ab8-1130-46af-8f70-71519442f108",
      "status": "sending",
      "type": "bolt11",
      "updated_at": "2024-11-21T18:47:04.008Z",
      "wallet_id": "7a68a525-9d11-4c1e-a3dd-1c2bf1378ba2"
    },
    {
      "created_at": "2025-02-12T21:22:50.30219Z",
      "currency": "btc",
      "data": {
        "address": "tb1pzkhtj4ld86g9c49du5yagnncfrm0s489t76vmrwmt2ecxfnf7spsvjte49",
        "amount_sats": 150000,
        "fees_sats": 10,
        "label": null,
        "max_fee_sats": 1000,
        "receipts": [
          {
            "amount_sats": 10000,
            "height_mined_at": 1888021,
            "ledger_id": "0c16fd8e-ce4d-42fe-9d0b-3069244eb66c",
            "required_confirmations_num": 1,
            "tx_id": "a22ec88f7a84a705466c9cd8d37024155ffa7930300fcee4fed9e5cc4e25904e"
          }
        ]
      },
      "direction": "send",
      "environment_id": "123e4567-e89b-12d3-a456-426614174000",
      "error": null,
      "id": "2ec1e783-19b4-4c10-8181-66336a6232bd",
      "organization_id": "b0684ab8-1130-46af-8f70-71519442f108",
      "status": "completed",
      "type": "onchain",
      "updated_at": "2025-02-12T21:22:52.407189Z",
      "wallet_id": "7a68a525-9d11-4c1e-a3dd-1c2bf1378ba2"
    },
    {
      "created_at": "2024-11-21T18:47:04.008Z",
      "currency": "btc",
      "data": {
        "amount_msats": 0,
        "memo": "testing",
        "payment_request": "lntbs1500n1pn5w25ypp59sfhx5llskdp6rmsmmq3zs86xey6l4y9wkzvkjl5v2cw0ex7xd4sdqqcqzzsxqyz5vqsp5u333jtc7lh0qvkusq5ntcpm3n2jjx6tw8jz7zvpqpnt3v8e572eq9qxpqysgq4hm7n79tnk76j4ll4f7ey9mmxdyj5pwzcmyqgxtgz40vjg9w58wq73040qvuurj83jakt2zws6y9qgzg2f6gtnj3ajf0mj4gw4mdt2cqhr2tpz"
      },
      "direction": "receive",
      "environment_id": "123e4567-e89b-12d3-a456-426614174000",
      "error": null,
      "id": "11ca843c-bdaa-44b6-965a-39ac550fcef7",
      "organization_id": "b0684ab8-1130-46af-8f70-71519442f108",
      "requested_amount": {
        "amount": 150000,
        "currency": "btc",
        "unit": "msats"
      },
      "status": "receiving",
      "type": "bolt11",
      "updated_at": "2024-11-21T18:47:04.008Z",
      "wallet_id": "7a68a525-9d11-4c1e-a3dd-1c2bf1378ba2"
    },
    {
      "created_at": "2025-02-12T21:21:21.744713Z",
      "currency": "btc",
      "data": {
        "address": "tb1pzkhtj4ld86g9c49du5yagnncfrm0s489t76vmrwmt2ecxfnf7spsvjte49",
        "amount_sats": 10000,
        "label": "test payment",
        "outflows": [
          {
            "amount_sats": 10000,
            "height_mined_at": 1888021,
            "ledger_id": "03d87c6d-2cf8-414b-929a-eceeb4c896ed",
            "required_confirmations_num": 1,
            "tx_id": "a22ec88f7a84a705466c9cd8d37024155ffa7930300fcee4fed9e5cc4e25904e"
          }
        ]
      },
      "direction": "receive",
      "environment_id": "123e4567-e89b-12d3-a456-426614174000",
      "error": null,
      "id": "0a24c349-55d0-473e-9c03-155f884f1867",
      "organization_id": "b0684ab8-1130-46af-8f70-71519442f108",
      "requested_amount": {
        "amount": 10000000,
        "currency": "btc",
        "unit": "msats"
      },
      "status": "completed",
      "type": "onchain",
      "updated_at": "2025-02-12T21:23:03.173159Z",
      "wallet_id": "7a68a525-9d11-4c1e-a3dd-1c2bf1378ba2"
    }
  ],
  "limit": 100,
  "offset": 0,
  "total": 4
}

Successfully found the payment
Create a new payment​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID to create the payment in
    environment_id
    Type: stringFormat: uuid
    required

    Environment ID to create the payment in

Body
required
application/json

    data
    Type: object

        type
        Type: stringenum
        const:  
        bip21
            bip21
        id
        Type: stringFormat: uuid
        required
        wallet_id
        Type: stringFormat: uuid
        required
        currency
        Type: stringenum
        required
            btc
            usd

Responses

    202

    Successfully requested a new payment be created
    400

    Badly formatted request
    403

    No access to create a payment, organization WRITE access required
    500

    Server failed to complete the request

Request Example for postorganizations/{organization_id}/environments/{environment_id}/payments
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/payments' \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN' \
  --data '{
  "amount_msats": 150000,
  "currency": "btc",
  "description": "Payment for services",
  "id": "11ca843c-bdaa-44b6-965a-39ac550fcef7",
  "payment_kind": "bip21",
  "wallet_id": "7a68a525-9d11-4c1e-a3dd-1c2bf1378ba2"
}'

Selected Example Values: receive_webhook_test
No Body

Successfully requested a new payment be created
Get a payment for an organization​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID the payment is in
    environment_id
    Type: stringFormat: uuid
    required

    Environment ID the payment is in
    payment_id
    Type: stringFormat: uuid
    required

    Payment ID for the payment

Responses

    application/json
    400

    Badly formatted request
    403

    No access to get a payment, organization READ access required
    404

    No payment with that ID found in this organization and environment
    500

    Server failed to complete the request

Request Example for getorganizations/{organization_id}/environments/{environment_id}/payments/{payment_id}
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/payments/{payment_id}' \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'

{
  "created_at": "2024-11-21T18:47:04.008Z",
  "currency": "BTC",
  "data": {
    "amount_msats": 100000,
    "max_fee_msats": 1000,
    "memo": "testing",
    "payment_request": "lnbc100n1p3slw4kpp5z4ybq0q0j6wkrkk99s9xg8p7rugry2nl0y4h8srq0l80r8gf8jhsdqqcqzpgxqyz5vqsp5l5ft0c6h6p5ktkudznlddtnkk5zf7xgwsyqcqwwz2v8zrsm8d7q9qyyssq"
  },
  "direction": "send",
  "environment_id": "123e4567-e89b-12d3-a456-426614174000",
  "error": null,
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "organization_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "sending",
  "type": "bolt11",
  "updated_at": "2024-11-21T18:47:04.008Z",
  "wallet_id": "123e4567-e89b-12d3-a456-426614174000"
}

Successfully found the payment
Get the history of a payment​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID the payment is in
    environment_id
    Type: stringFormat: uuid
    required

    Environment ID the payment is in
    payment_id
    Type: stringFormat: uuid
    required

    Payment ID for the payment

Responses

    application/json
    400

    Badly formatted request
    403

    No access to get this payment's history, organization READ access required
    404

    No payment with that ID found in this organization and environment
    500

    Server failed to complete the request

Request Example for getorganizations/{organization_id}/environments/{environment_id}/payments/{payment_id}/history
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/payments/{payment_id}/history' \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'

{
  "events": [
    {
      "event_type": "string",
      "error": null,
      "time": "2025-07-17T16:08:48.842Z",
      "position": 1
    }
  ]
}

Successfully requested the history of a payment
Lines of Credit ​

Manage lines of credit in an organization
Lines of Credit Operations

    getorganizations/{organization_id}/lines_of_credit/{line_id}/summary
    getorganizations/{organization_id}/lines_of_credit/summaries

Retrieve a summary of a line of credit​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID to get the line of credit in
    line_id
    Type: stringFormat: uuid
    required

    ID of line of credit to update

Responses

    application/json
    400

    Badly formatted request
    403

    No access to retrieve the line of credit found, organization READ access required
    404

    No line of credit found for given id in provided organization
    500

    Server failed to complete the request

Request Example for getorganizations/{organization_id}/lines_of_credit/{line_id}/summary
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/lines_of_credit/{line_id}/summary' \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'

{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "organization_id": "123e4567-e89b-12d3-a456-426614174000",
  "network": "mainnet",
  "environment_id": "123e4567-e89b-12d3-a456-426614174000",
  "limit": 1,
  "allocated_limit": 1,
  "currency": "btc",
  "status": null,
  "disabled_at": null
}

Successfully retrieved a line of credit summary
Retrieve summaries for all lines of credit for an organization​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID to get the line of credit in

Responses

    application/json
    400

    Badly formatted request
    403

    No access to retrieve the lines of credit found, organization WRITE access required
    404

    No lines of credit found in provided organization
    500

    Server failed to complete the request

Request Example for getorganizations/{organization_id}/lines_of_credit/summaries
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/lines_of_credit/summaries' \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'

[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "organization_id": "123e4567-e89b-12d3-a456-426614174000",
    "network": "mainnet",
    "environment_id": "123e4567-e89b-12d3-a456-426614174000",
    "limit": 1,
    "allocated_limit": 1,
    "currency": "btc",
    "status": null,
    "disabled_at": null
  }
]

Successfully retrieved lines of credit
Webhooks ​

Manage webhooks in an organization
Webhooks Operations

    getorganizations/{organization_id}/webhooks
    postorganizations/{organization_id}/environments/{environment_id}/webhooks
    getorganizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}
    deleteorganizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}
    patchorganizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}
    postorganizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/keys
    postorganizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/test
    postorganizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/start
    postorganizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/stop
    getorganizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/deliveries
    getorganizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/deliveries/{delivery_id}
    postorganizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/deliveries/{delivery_id}/abandon
    postorganizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/deliveries/{delivery_id}/retry

Get all webhooks for an organization and environment with filter​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID to get webhooks from

Query Parameters

    environment_ids
    Type: array string[] | null
    statuses
    Type: array string[] | nullenum
        active
        stopped
        deleted
    sort_key
    Type: stringenum nullable
        created_at
        updated_at
    sort_order
    Type: stringenum nullable
        ASC
        DESC

Responses

    application/json
    400

    Badly formatted request
    403

    No access to get webhooks, organization READ access required
    500

    Server failed to complete the request

Request Example for getorganizations/{organization_id}/webhooks
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/webhooks' \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'

[
  {
    "created_at": "2025-04-29T17:09:11.299Z",
    "deleted_at": null,
    "environment_id": "123e4567-e89b-12d3-a456-426614174000",
    "events": [
      {
        "send": [
          "succeeded",
          "failed"
        ]
      },
      {
        "receive": [
          "generated",
          "refreshed",
          "expired",
          "succeeded",
          "completed",
          "failed"
        ]
      },
      {
        "test": [
          "created"
        ]
      }
    ],
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "some name",
    "organization_id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "active",
    "stopped_at": null,
    "updated_at": "2025-04-29T17:09:11.299Z",
    "url": "http://example.com"
  }
]

Selected Example Values: All Event Types Example
Create a new webhook​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID to create the webhook in
    environment_id
    Type: stringFormat: uuid
    required

    Environment ID to create the webhook in

Body
required
application/json

    id
    Type: stringFormat: uuid
    required

url
Type: string
required
name
Type: string
required
events
Type: string
required

Responses

    application/json
    400

    Badly formatted request
    403

    No access to create a webhook, organization WRITE access required
    409

    Webhook already exists
    500

    Server failed to complete the request

Request Example for postorganizations/{organization_id}/environments/{environment_id}/webhooks
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/webhooks' \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN' \
  --data '{
  "id": "b0fc9829-f139-4035-bb14-4a4b6cd58f0e",
  "url": "https://example.com",
  "name": "some name",
  "events": [
    {
      "send": "succeeded"
    },
    {
      "send": "failed"
    },
    {
      "receive": "succeeded"
    },
    {
      "receive": "completed"
    },
    {
      "receive": "failed"
    }
  ]
}'

{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "shared_secret": "vltg_GDtRrrJFJ6afRrAYMW3t9RpxgCdcT8zp"
}

Successfully requested a new webhook be created
Get a webhook​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID to get webhook from
    environment_id
    Type: stringFormat: uuid
    required

    Environment ID to get webhook from
    webhook_id
    Type: stringFormat: uuid
    required

    ID of webhook to retrieve

Responses

    application/json
    400

    Badly formatted request
    403

    No access to get webhook, organization READ access required
    404

    Webhook does not exists
    500

    Server failed to complete the request

Request Example for getorganizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}' \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'

{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "organization_id": "123e4567-e89b-12d3-a456-426614174000",
  "environment_id": "123e4567-e89b-12d3-a456-426614174000",
  "url": "https://example.com",
  "name": "some name",
  "events": [
    {
      "send": "succeeded"
    }
  ],
  "status": "active",
  "created_at": "2025-07-17T16:08:48.842Z",
  "updated_at": "2025-07-17T16:08:48.842Z",
  "stopped_at": null,
  "deleted_at": null
}

Successfully retrieved webhook
Delete a webhook​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID to delete webhook from
    environment_id
    Type: stringFormat: uuid
    required

    Environment ID to delete webhook from
    webhook_id
    Type: stringFormat: uuid
    required

    ID of webhook to delete

Responses

    202

    Successfully submitted delete webhook request
    400

    Badly formatted request
    403

    No access to delete webhook, organization WRITE access required
    404

    Webhook does not exists
    500

    Server failed to complete the request

Request Example for deleteorganizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}' \
  --request DELETE \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'

No Body

Successfully submitted delete webhook request
Update webhook details​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID to create the webhook in
    environment_id
    Type: stringFormat: uuid
    required

    Environment ID to create the webhook in
    webhook_id
    Type: stringFormat: uuid
    required

    Webhook ID to update

Body
required
application/json

    url
    Type: string
    required

name
Type: string | null
events
Type: array object[]
required

Provide all event types that the webhook should be subscribed, The event types array will be replaced entirely inline with JSON Merge Patch (RFC 7396)

Responses

    202

    Successfully requested update webhook
    400

    Badly formatted request
    403

    No access to update a webhook, organization WRITE access required
    404

    Webhook does not exists
    500

    Server failed to complete the request

Request Example for patchorganizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}' \
  --request PATCH \
  --header 'Content-Type: application/json' \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN' \
  --data '{
  "url": "https://example.com",
  "name": "some name",
  "events": [
    {
      "send": "succeeded"
    }
  ]
}'

No Body

Successfully requested update webhook
Generate new key for webhook​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID to update the webhook in
    environment_id
    Type: stringFormat: uuid
    required

    Environment ID to update the webhook in
    webhook_id
    Type: stringFormat: uuid
    required

    Webhook ID to generate new key

Responses

    application/json
    400

    Badly formatted request
    403

    No access to create a webhook, organization WRITE access required
    404

    Webhook does not exists
    500

    Server failed to complete the request

Request Example for postorganizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/keys
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/keys' \
  --request POST \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'

{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "shared_secret": "vltg_GDtRrrJFJ6afRrAYMW3t9RpxgCdcT8zp"
}

Successfully requested a new webhook be created
Test a webhook​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID of the webhook to use
    environment_id
    Type: stringFormat: uuid
    required

    Environment ID of the webhook to use
    webhook_id
    Type: stringFormat: uuid
    required

    Webhook to initiate the delivery on

Body
required
application/json

    delivery_id
    Type: stringFormat: uuid
    required
    payload
    required

    detail
    Type: object
    required

        type
        Type: stringenum
        const:  
        send
        required
            send

Responses

    202

    Successfully requested a new webhook delivery be started with provided payload
    400

    Badly formatted request
    403

    No access to submit delivery via a webhook, organization WRITE access required
    404

    Webhook does not exists
    500

    Server failed to complete the request

Request Example for postorganizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/test
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/test' \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN' \
  --data '{
  "delivery_id": "123e4567-e89b-12d3-a456-426614174002",
  "payload": {
    "detail": {
      "data": {
        "created_at": "2024-11-21T19:15:22.123Z",
        "currency": "BTC",
        "data": {
          "amount_msats": 250000,
          "description": "Invoice for coffee",
          "payment_hash": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
          "payment_request": "lnbc2500n1p3xyz123pp5mnrv3usmd97zu3venjxs8xtpy6x5vnryg69tc4p7syc875dajhsqdqqcqzpgxqyz5vqsp5ayzdef"
        },
        "direction": "receive",
        "environment_id": "123e4567-e89b-12d3-a456-426614174000",
        "error": null,
        "id": "123e4567-e89b-12d3-a456-426614174003",
        "organization_id": "123e4567-e89b-12d3-a456-426614174000",
        "status": "pending",
        "type": "bolt11",
        "updated_at": "2024-11-21T19:15:22.123Z",
        "wallet_id": "123e4567-e89b-12d3-a456-426614174000"
      },
      "event": [
        "generated",
        "refreshed",
        "expired",
        "succeeded",
        "completed",
        "failed"
      ]
    },
    "type": "receive"
  }
}'

Selected Example Values: Test Receive Webhook Example
No Body

Successfully requested a new webhook delivery be started with provided payload
Start a webhook​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID to start webhook from
    environment_id
    Type: stringFormat: uuid
    required

    Environment ID to start webhook from
    webhook_id
    Type: stringFormat: uuid
    required

    ID of webhook to start

Responses

    202

    Successfully submitted start webhook request
    400

    Badly formatted request
    403

    No access to start webhook, organization WRITE access required
    404

    Webhook does not exists
    500

    Server failed to complete the request

Request Example for postorganizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/start
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/start' \
  --request POST \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'

No Body

Successfully submitted start webhook request
Stop a webhook​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID to stop webhooks from
    environment_id
    Type: stringFormat: uuid
    required

    Environment ID to stop webhooks from
    webhook_id
    Type: stringFormat: uuid
    required

    ID of Webhook to stop

Responses

    202

    Successfully submitted stop webhook request
    400

    Badly formatted request
    403

    No access to stop webhooks, organization WRITE access required
    404

    Webhook does not exists
    500

    Server failed to complete the request

Request Example for postorganizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/stop
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/stop' \
  --request POST \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'

No Body

Successfully submitted stop webhook request
Get all webhook deliveries for a given webhook in an organization and environment with filter​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID to get webhooks from
    environment_id
    Type: stringFormat: uuid
    required

    Environment ID to get webhooks from
    webhook_id
    Type: stringFormat: uuid
    required

    ID of Webhook to retrieve deliveries from

Query Parameters

    statuses
    Type: array string[] | nullenum

        attempting
        succeeded
        failed
        abandoned
    sort_key
    Type: stringenum nullable
        created_at
        updated_at
    sort_order
    Type: stringenum nullable
        ASC
        DESC
    limit
    Type: integer | nullFormat: u-int32
    min:  
    0
    offset
    Type: integer | nullFormat: u-int32
    min:  
    0

Responses

    application/json
    400

    Badly formatted request
    403

    No access to get webhooks, organization READ access required
    404

    Webhook does not exists
    500

    Server failed to complete the request

Request Example for getorganizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/deliveries
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/deliveries' \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'

{
  "items": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "webhook_id": "123e4567-e89b-12d3-a456-426614174000",
      "url": "https://example.com",
      "status": "succeeded",
      "payload": {
        "detail": {
          "event": "succeeded",
          "data": {
            "created_at": "2024-11-21T18:47:04.008Z",
            "currency": "BTC",
            "data": {
              "amount_msats": 100000,
              "max_fee_msats": 1000,
              "memo": "testing",
              "payment_request": "lnbc100n1p3slw4kpp5z4ybq0q0j6wkrkk99s9xg8p7rugry2nl0y4h8srq0l80r8gf8jhsdqqcqzpgxqyz5vqsp5l5ft0c6h6p5ktkudznlddtnkk5zf7xgwsyqcqwwz2v8zrsm8d7q9qyyssq"
            },
            "direction": "send",
            "environment_id": "123e4567-e89b-12d3-a456-426614174000",
            "error": null,
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "organization_id": "123e4567-e89b-12d3-a456-426614174000",
            "status": "sending",
            "type": "bolt11",
            "updated_at": "2024-11-21T18:47:04.008Z",
            "wallet_id": "123e4567-e89b-12d3-a456-426614174000"
          }
        },
        "type": "send"
      },
      "created_at": "2025-07-17T16:08:48.842Z",
      "updated_at": "2025-07-17T16:08:48.842Z",
      "attempt_count": 1,
      "error": null,
      "status_code": 200
    }
  ],
  "offset": 1,
  "limit": 1,
  "total": 1
}

Successfully retrieved webhooks
Get a webhook delivery​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID to get webhooks from
    environment_id
    Type: stringFormat: uuid
    required

    Environment ID to get webhooks from
    webhook_id
    Type: stringFormat: uuid
    required

    ID of Webhook to retrieve delivery from
    delivery_id
    Type: stringFormat: uuid
    required

    ID of Webhook Delivery to retrieve

Responses

    200

    Successfully retrieved webhook delivery
    400

    Badly formatted request
    403

    No access to get webhook delivery, organization READ access required
    500

    Server failed to complete the request

Request Example for getorganizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/deliveries/{delivery_id}
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/deliveries/{delivery_id}' \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'

No Body

Successfully retrieved webhook delivery
Abandon a webhook delivery​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID of the webhook to use
    environment_id
    Type: stringFormat: uuid
    required

    Environment ID of the webhook to use
    webhook_id
    Type: stringFormat: uuid
    required

    Webhook to abandon the delivery on
    delivery_id
    Type: stringFormat: uuid
    required

    Delivery ID to abandon

Responses

    202

    Successfully requested an abandoned webhook delivery
    400

    Badly formatted request
    403

    No access to submit abandon via a webhook, organization WRITE access required
    404

    Webhook does not exists
    500

    Server failed to complete the request

Request Example for postorganizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/deliveries/{delivery_id}/abandon
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/deliveries/{delivery_id}/abandon' \
  --request POST \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'

No Body

Successfully requested an abandoned webhook delivery
Retry a webhook delivery​
Path Parameters

    organization_id
    Type: stringFormat: uuid
    required

    Organization ID to retry webhook from
    environment_id
    Type: stringFormat: uuid
    required

    Environment ID to retry webhook from
    webhook_id
    Type: stringFormat: uuid
    required

    ID of webhook to retry
    delivery_id
    Type: stringFormat: uuid
    required

    ID of webhook delivery to retry

Responses

    202

    Successfully submitted delete webhook request
    400

    Badly formatted request
    403

    No access to retry webhook delivery, organization WRITE access required
    404

    Webhook does not exists
    500

    Server failed to complete the request

Request Example for postorganizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/deliveries/{delivery_id}/retry
Selected HTTP client: Shell Curl

curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/deliveries/{delivery_id}/retry' \
  --request POST \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'

No Body

Successfully submitted delete webhook request
Onboarding (Collapsed)​

Manage onboarding of an organization
Billing (Collapsed)​

Manage bills in an organization
Models

        amount
        Type: integerFormat: u-int64
        min:  
        0
        required
        currency
        Type: stringenum
        const:  
        btc
        required
            btc

    id
    Type: stringFormat: uuid
    required
    wallet_id
    Type: stringFormat: uuid
    required
    effective_time
    Type: stringFormat: date-time
    required

    the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z
    available
    required

    amount
    Type: integerFormat: u-int64
    min:  
    0
    required
    currency
    Type: stringenum
    const:  
    btc
    required
        btc

total
required

        amount
        Type: integerFormat: u-int64
        min:  
        0
        required
        currency
        Type: stringenum
        const:  
        btc
        required
            btc
    network
    Type: stringenum
    required
        mainnet
        testnet
        signet
        mutinynet
    currency
    Type: stringenum
    required
        btc
        usd

    Type: integerFormat: u-int64
    min:  
    0

    hold_id
    Type: stringFormat: uuid
    required
    payment_id
    Type: stringFormat: uuid
    required
    amount_msats
    Type: integerFormat: u-int64
    min:  
    0
    required
    currency
    Type: stringenum
    required
        btc
        usd
    effective_time
    Type: stringFormat: date-time
    required

    the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z

        secured
        Type: stringenum
        required
            pending_deposit
            partially_secured
            secured

    credit_id
    Type: stringFormat: uuid
    required
    payment_id
    Type: stringFormat: uuid
    required
    amount_msats
    Type: integerFormat: u-int64
    min:  
    0
    required
    currency
    Type: stringenum
    required
        btc
        usd
    effective_time
    Type: stringFormat: date-time
    required

    the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z

    Type: stringenum
        btc
        usd

    Type: stringenum

        attempting
        succeeded
        failed
        abandoned

    deposit_id
    Type: stringFormat: uuid
    required
    amount
    required

        amount
        Type: integerFormat: u-int64
        min:  
        0
        required
        currency
        Type: stringenum
        const:  
        btc
        required
            btc
    effective_time
    Type: stringFormat: date-time
    required

    the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z

    event_type
    Type: string
    required
    error
    Type: string | null
    time
    Type: stringFormat: date-time
    required

    the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z
    position
    Type: integerFormat: int64
    required

    Signed 64-bit integers (long type).

    send
    Type: stringenum
    required

            succeeded
            failed

    Type: array

    hold_id
    Type: stringFormat: uuid
    required
    payment_id
    Type: stringFormat: uuid
    required
    amount_msats
    Type: integerFormat: u-int64
    min:  
    0
    required
    currency
    Type: stringenum
    required
        btc
        usd
    effective_time
    Type: stringFormat: date-time
    required

    the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z

    id
    Type: stringFormat: uuid
    required
    amount
    required

        amount
        Type: integerFormat: u-int64
        min:  
        0
        required
        currency
        Type: stringenum
        const:  
        btc
        required
            btc
    effective_time
    Type: stringFormat: date-time
    required

    the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z

    items
    Type: array
    required

    offset
    Type: integerFormat: u-int32
    min:  
    0
    required
    limit
    Type: integerFormat: u-int32
    min:  
    0
    required
    total
    Type: integerFormat: u-int32
    min:  
    0
    required 

        credit_id
        Type: stringFormat: uuid
        required
        payment_id
        Type: stringFormat: uuid
        required
        amount_msats
        Type: integerFormat: u-int64
        min:  
        0
        required
        currency
        Type: stringenum
        required
            btc
            usd
        effective_time
        Type: stringFormat: date-time
        required

        the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z
        type
        Type: stringenum
        const:  
        credited
        required
            credited

    Type: stringenum
        effective_time
        message_time
        time_and_effective_time

    Type: stringenum
        mainnet
        testnet
        signet
        mutinynet

    id
    Type: stringFormat: uuid
    required
    environment_id
    Type: stringFormat: uuid
    required
    line_of_credit_id
    Type: stringFormat: uuid
    required
    name
    Type: string
    required
    network
    Type: stringenum
    required
        mainnet
        testnet3
        mutinynet
    limit
    Type: integerFormat: u-int64
    min:  
    1
    required

If limit is set to 0, no credit will be available for this wallet.
metadata
Type: object | null

    id
    Type: stringFormat: uuid
    required

url
Type: string
required
name
Type: string
required
events
Type: string
required

    tx_id
    Type: string
    required

The hex encoded bitcoin transaction id
address
Type: string
required

The bitcoin address that received the tainted funds
amount_sats
Type: integerFormat: u-int64
min:  
0
required

The amount of tainted funds in sats to freeze
reason
required

Reason why the funds were frozen

        Type: stringenum
        const:  
        ofac_non_compliant_address
            ofac_non_compliant_address

    required_confirmations_num
    Type: integerFormat: u-int16
    min:  
    0
    required

    The number of confirmations required for the transaction to be considered complete
    tx_id
    Type: string
    required

    The hex encoded bitcoin transaction id
    ledger_id
    Type: string | nullFormat: uuid

    Maps to either the hold_id or credit_id associated with this part of the payment
    height_mined_at
    Type: integer | nullFormat: u-int64
    min:  
    0

    The height of the block that mined the transaction
    amount_sats
    Type: integerFormat: u-int64
    min:  
    0
    required

    The amount of the transaction in sats
    sanctioned_info
    Type: object nullable

    The amount from a sanctioned source in sats and omitted from received value

    detail
    Type: object
    required

        type
        Type: stringenum
        const:  
        send
        required
            send

    data
    Type: object

        type
        Type: stringenum
        const:  
        bip21
            bip21
        id
        Type: stringFormat: uuid
        required
        wallet_id
        Type: stringFormat: uuid
        required
        organization_id
        Type: stringFormat: uuid
        required
        environment_id
        Type: stringFormat: uuid
        required
        created_at
        Type: stringFormat: date-time
        required

        the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z
        updated_at
        Type: stringFormat: date-time
        required

        the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z
        currency
        Type: stringenum
        required
            btc
            usd
        status
        Type: stringenum
        required
            sending
            failed
            completed
        error
        nullable
        direction
        Type: stringenum
        const:  
        send
        required
            send

    Type: stringenum
        send
        receive

    Type: object

    events
    Type: array object[]
    required

    Type: stringenum
        bolt11
        onchain
        bip21

    data
    Type: object
    required

        type
        Type: stringenum
        const:  
        bolt11
        required
            bolt11

    data
    Type: object

        type
        Type: stringenum
        const:  
        bip21
            bip21
        id
        Type: stringFormat: uuid
        required
        wallet_id
        Type: stringFormat: uuid
        required
        currency
        Type: stringenum
        required
            btc
            usd

    data
    Type: object
    required

        type
        Type: stringenum
        const:  
        bolt11
        required
            bolt11

    data
    Type: object
    required

        type
        Type: stringenum
        const:  
        bolt11
        required
            bolt11

    items
    Type: array
    required

    offset
    Type: integerFormat: u-int32
    min:  
    0
    required
    limit
    Type: integerFormat: u-int32
    min:  
    0
    required
    total
    Type: integerFormat: u-int32
    min:  
    0
    required 

        Type: stringenum
        const:  
        ofac_non_compliant_address
            ofac_non_compliant_address

        detail
        Type: string
        required
        type
        Type: stringenum
        const:  
        receive_failed
        required
            receive_failed

    Type: stringenum

        generated
        refreshed
        expired
        succeeded
        completed
        failed

    event
    Type: stringenum
    required

    generated
    refreshed
    expired
    succeeded
    completed
    failed

data
required

    data
    Type: object

        type
        Type: stringenum
        const:  
        bip21
            bip21
        id
        Type: stringFormat: uuid
        required
        wallet_id
        Type: stringFormat: uuid
        required
        organization_id
        Type: stringFormat: uuid
        required
        environment_id
        Type: stringFormat: uuid
        required
        created_at
        Type: stringFormat: date-time
        required

        the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z
        updated_at
        Type: stringFormat: date-time
        required

        the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z
        currency
        Type: stringenum
        required
            btc
            usd
        status
        Type: stringenum
        required
            sending
            failed
            completed
        error
        nullable
        direction
        Type: stringenum
        const:  
        send
        required
            send

    data
    Type: object
    required

        type
        Type: stringenum
        const:  
        bolt11
        required
            bolt11

    id
    Type: stringFormat: uuid
    required
    wallet_id
    Type: stringFormat: uuid
    required
    currency
    Type: stringenum
    required
        btc
        usd
    amount_msats
    Type: integer | nullFormat: u-int64
    min:  
    0

    None will be treated as an 'any' amount invoice, '0' not allowed
    payment_kind
    Type: stringenum
    required
        bolt11
        onchain
        bip21
    description
    Type: string | null

    Human-readable description of the payment Description cannot be an empty string

    Type: stringenum
        generating
        receiving
        expired
        failed
        completed

    hold_id
    Type: stringFormat: uuid
    required
    payment_id
    Type: stringFormat: uuid
    required
    currency
    Type: stringenum
    required
        btc
        usd
    effective_time
    Type: stringFormat: date-time
    required

    the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z

Information about a sanctioned input

    outpoint
    Type: string
    required

    The outpoint being spent (txid:vout)
    address
    Type: string
    required

    The sanctioned address
    amount
    required

The amount from this input

        amount
        Type: integerFormat: u-int64
        min:  
        0
        required
        currency
        Type: stringenum
        const:  
        btc
        required
            btc

Information about a sanctioned transaction

    tx_id
    Type: string
    required

    Transaction ID
    sanctioned_inputs
    Type: array object[]
    required

    Detailed information about each sanctioned input

    Information about a sanctioned input

sanctioned_value
required

Total value from sanctioned inputs

        amount
        Type: integerFormat: u-int64
        min:  
        0
        required
        currency
        Type: stringenum
        const:  
        btc
        required
            btc

    Type: stringenum
        pending_deposit
        partially_secured
        secured

        detail
        Type: string
        required
        type
        Type: stringenum
        const:  
        rejected
        required
            rejected

    Type: stringenum

        succeeded
        failed

    event
    Type: stringenum
    required

    succeeded
    failed

data
required

    data
    Type: object

        type
        Type: stringenum
        const:  
        bip21
            bip21
        id
        Type: stringFormat: uuid
        required
        wallet_id
        Type: stringFormat: uuid
        required
        organization_id
        Type: stringFormat: uuid
        required
        environment_id
        Type: stringFormat: uuid
        required
        created_at
        Type: stringFormat: date-time
        required

        the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z
        updated_at
        Type: stringFormat: date-time
        required

        the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z
        currency
        Type: stringenum
        required
            btc
            usd
        status
        Type: stringenum
        required
            sending
            failed
            completed
        error
        nullable
        direction
        Type: stringenum
        const:  
        send
        required
            send

    data
    Type: object
    required

        type
        Type: stringenum
        const:  
        bolt11
        required
            bolt11

    data
    Type: object
    required

        type
        Type: stringenum
        const:  
        bolt11
        required
            bolt11

    Type: stringenum
        sending
        failed
        completed

        amount
        Type: integerFormat: u-int64
        min:  
        0
        required
        currency
        Type: stringenum
        const:  
        btc
        required
            btc

    Type: stringenum
        created_at
        updated_at

    Type: stringenum
        ASC
        DESC

    id
    Type: stringFormat: uuid
    required
    organization_id
    Type: stringFormat: uuid
    required
    network
    Type: stringenum
    required
        mainnet
        testnet
        signet
        mutinynet
    environment_id
    Type: stringFormat: uuid
    required
    limit
    Type: integerFormat: u-int64
    min:  
    0
    required
    allocated_limit
    Type: integerFormat: u-int64
    min:  
    0
    required
    currency
    Type: stringenum
    required
        btc
        usd
    status
    nullable

    Will always be null for Waived collateral types
    disabled_at
    Type: string | nullFormat: date-time

    Type: stringenum
        mainnet
        testnet3
        mutinynet

    Type: stringenum
    const:  
    created

        created

    event
    Type: stringenum
    const:  
    created
    required

        created
    data
    Type: string
    required 

    delivery_id
    Type: stringFormat: uuid
    required
    payload
    required

    detail
    Type: object
    required

        type
        Type: stringenum
        const:  
        send
        required
            send

    name
    Type: string
    required

    url
    Type: string
    required

name
Type: string | null
events
Type: array
required

Provide all event types that the webhook should be subscribed, The event types array will be replaced entirely inline with JSON Merge Patch (RFC 7396)

    Type: integerFormat: u-int64
    min:  
    0

    Type: stringenum
        pending_verification
        verified

    id
    Type: stringFormat: uuid
    required
    active
    Type: boolean
    required
    created_at
    Type: stringFormat: date-time
    required

    the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z
    updated_at
    Type: stringFormat: date-time
    required

    the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z
    deleted_at
    Type: string | nullFormat: date-time
    deletion_failed_at
    Type: string | nullFormat: date-time
    name
    Type: string
    required
    organization_id
    Type: stringFormat: uuid
    required
    environment_id
    Type: stringFormat: uuid
    required
    limit
    Type: integer | nullFormat: u-int64
    min:  
    0
    line_of_credit_id
    Type: string | nullFormat: uuid
    network
    Type: stringenum
    required
        mainnet
        testnet
        signet
        mutinynet
    metadata
    Type: object | null

balances
Type: array object[]
required
holds
Type: array object[]
required

    error
    nullable 

        type
        Type: stringenum
        const:  
        InsufficientFunds
        required
            InsufficientFunds

    items
    Type: array object[]
    required

    offset
    Type: integerFormat: u-int32
    min:  
    0
    required
    limit
    Type: integerFormat: u-int32
    min:  
    0
    required
    total
    Type: integerFormat: u-int32
    min:  
    0
    required 

    id
    Type: stringFormat: uuid
    required
    webhook_id
    Type: stringFormat: uuid
    required
    url
    Type: string
    required

status
Type: stringenum
required

    attempting
    succeeded
    failed
    abandoned

payload
required

    detail
    Type: object
    required

    type
    Type: stringenum
    const:  
    send
    required
        send

created_at
Type: stringFormat: date-time
required

the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z
updated_at
Type: stringFormat: date-time
required

the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z
attempt_count
Type: integerFormat: int64
required

Signed 64-bit integers (long type).
error
Type: string | null
status_code
Type: integer | nullFormat: u-int16
min:  
0

    id
    Type: stringFormat: uuid
    required
    shared_secret
    Type: string
    required

    Plain text shared secret used to verify the authenticity of the webhook payload. Only ever shown to the user when creating a new webhook or updating the shared secret.

    id
    Type: stringFormat: uuid
    required
    organization_id
    Type: stringFormat: uuid
    required
    environment_id
    Type: stringFormat: uuid
    required
    url
    Type: string
    required

name
Type: string
required
events
Type: array
required

    status
    Type: stringenum
    required
        active
        stopped
        deleted
    created_at
    Type: stringFormat: date-time
    required

    the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z
    updated_at
    Type: stringFormat: date-time
    required

    the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z
    stopped_at
    Type: string | nullFormat: date-time
    deleted_at
    Type: string | nullFormat: date-time

    Type: stringenum
        active
        stopped
        deleted

    withdraw_id
    Type: stringFormat: uuid
    required
    amount
    required

        amount
        Type: integerFormat: u-int64
        min:  
        0
        required
        currency
        Type: stringenum
        const:  
        btc
        required
            btc
    effective_time
    Type: stringFormat: date-time
    required

    the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z

