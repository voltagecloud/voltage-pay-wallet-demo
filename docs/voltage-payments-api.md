Website logo
⌘
K
Contact Support
Login
Developer Guide
Voltage Payments API
10 min
API Specification

The full Voltage Pay OpenAPI spec can be found at the link below:
Core Resource Categories
1. Wallets
﻿

Wallets are where your funds and credit balances are managed. The API allows you to:

    List wallets - View all wallets in an organization 
        GET /organizations/{organization_id}/wallets
    Create wallets - Set up new wallets in development or production environments 
        POST /organizations/{organization_id}/wallets
    Retrieve wallet details - Get balance information and status for a specific wallet 
        GET /organizations/{organization_id}/wallets/{wallet_id}
    Delete wallets - Remove wallets when no longer needed 
        DELETE /organizations/{organization_id}/wallets/{wallet_id}
    View transaction history - Access the ledger of all transactions for a wallet 
        GET /organizations/{organization_id}/wallets/{wallet_id}/ledger

2. Payments
﻿

The payments API enables sending and receiving Bitcoin payments via Lightning Network. Key operations include:

    List payments - View payment history with filtering options 
        GET /organizations/{organization_id}/environments/{environment_id}/payments
    Create payments - Initiate new send or receive payments 
        POST /organizations/{organization_id}/environments/{environment_id}/payments
    Get payment details - Retrieve information about a specific payment 
        GET /organizations/{organization_id}/environments/{environment_id}/payments/{payment_id}
    Track payment history - View the full lifecycle of a payment 
        GET /organizations/{organization_id}/environments/{environment_id}/payments/{payment_id}/history

3. Lines of Credit
﻿

The credit system is central to Voltage Payments. The API allows you to:

    View credit summary - Get details about your available credit line 
        GET /organizations/{organization_id}/lines_of_credit/{line_id}/summary
    View all credit lines - List all lines of credit across your organization 
        GET /organizations/{organization_id}/lines_of_credit/summaries

Note: For staging lines of credit are automatically created after you create your first wallet, read about it HERE.
Common Parameters

Most endpoints share similar parameter patterns:

    Organization ID - Required for all operations
    Environment ID - Distinguishes between development and production environments
    Wallet ID - Identifies specific wallets

Authentication

The Voltage API uses x-api-key authentication methods for API calls:

    API Key Authentication (via x-api-key header): 

--header 'x-api-key: YOUR_API_KEY'
Response Formats

The API consistently returns:

    200/202 - Successful operations
    400 - Badly formatted requests
    403 - Permission errors (READ/WRITE access controls)
    404 - Resource not found
    500 - Server errors

﻿
Updated 21 Apr 2025
Doc contributor
Doc contributor
Did this page help you?
PREVIOUS
Developer Guide
NEXT
Sending
TABLE OF CONTENTS
API Specification
Core Resource Categories
1. Wallets
2. Payments
3. Lines of Credit
Common Parameters
Authentication
Response Formats

Developer Guide - Voltage Payments Documentation
