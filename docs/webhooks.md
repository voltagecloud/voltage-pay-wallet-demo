Website logo
⌘
K
Contact Support
Login
Developer Guide
Webhooks
36 min
Voltage Payments Webhooks Documentation
Overview

Webhooks allow your application to receive real-time notifications about events happening in your Voltage payment system. Instead of polling for updates, Voltage will send HTTP POST requests to your specified endpoint whenever relevant events occur.
Event Types

Voltage webhooks support the following event categories and their associated statuses:
Send Events

Events related to outgoing payments:

    succeeded - Payment successfully sent
    failed - Payment failed to send

Receive Events

Events related to incoming payments:

    generated - New payment request generated
    refreshed - Payment request refreshed
    expired - Payment request expired
    succeeded - Partial payment received (on-chain only - not applicable to BOLT11 invoices)
    completed - Full payment received (entire requested amount paid)
    failed - Payment failed

Test Events

    created - Test webhook created

Setting Up Webhooks
1. Create a Webhook

To create a webhook, make a POST request to the webhooks endpoint:
curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/webhooks' \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN' \
  --data '{
    "id": "b0fc9829-f139-4035-bb14-4a4b6cd58f0e",
    "url": "https://your-domain.com/webhook",
    "name": "Production Payment Webhook",
    "events": [
      {"send": "succeeded"},
      {"send": "failed"},
      {"receive": "generated"},
      {"receive": "completed"},
      {"receive": "failed"}
    ]
  }'
﻿

Note: In the example above, we subscribe to receive.completed rather than receive.succeeded because:

    completed fires when the full payment amount is received (common for Lightning/BOLT11)
    succeeded only fires for partial payments (on-chain only)

Most Lightning payment integrations should listen for the completed event.

Response:
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "shared_secret": "vltg_GDtRrrJFJ6afRrAYMW3t9RpxgCdcT8zp"
}

Important: Save the shared_secret securely - it's only shown once and is required for signature verification.
2. Webhook Configuration

When creating a webhook, you can specify:

    url: The HTTPS endpoint that will receive webhook notifications
    name: A descriptive name for your webhook
    events: Array of event types to subscribe to

Webhook Payload Structure
Headers

Each webhook request includes the following headers:

Header
	

Description

x-voltage-signature
	

Base64-encoded HMAC-SHA256 signature for payload verification

x-voltage-timestamp
	

Unix timestamp when the webhook was sent

x-voltage-event
	

The event type (e.g., "send.succeeded", "receive.completed")
Payload Format

The webhook payload follows this structure:
{
  "type": "send",
  "detail": {
    "event": "succeeded",
    "data": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "organization_id": "123e4567-e89b-12d3-a456-426614174000",
      "environment_id": "123e4567-e89b-12d3-a456-426614174000",
      "wallet_id": "123e4567-e89b-12d3-a456-426614174000",
      "direction": "send",
      "currency": "BTC",
      "type": "bolt11",
      "status": "succeeded",
      "data": {
        "amount_msats": 100000,
        "max_fee_msats": 1000,
        "memo": "Payment for invoice #1234",
        "payment_request": "lnbc100n1p3slw4kpp5z4ybq0q0j6wkrkk99s9xg8p7rugry2nl0y4h8srq0l80r8gf8jhsdqqcqzpg..."
      },
      "error": null,
      "created_at": "2024-11-21T18:47:04.008Z",
      "updated_at": "2024-11-21T18:47:04.008Z"
    }
  }
}
Example Payloads

Successful Send Payment
{
  "type": "send",
  "detail": {
    "event": "succeeded",
    "data": {
      "id": "payment-123",
      "direction": "send",
      "currency": "BTC",
      "type": "bolt11",
      "status": "succeeded",
      "data": {
        "amount_msats": 100000,
        "memo": "Coffee payment",
        "payment_request": "lnbc..."
      }
    }
  }
}

Partial payment received (on-chain only)
{
  "type": "receive",
  "detail": {
    "event": "succeeded",
    "data": {
      "id": "payment-456",
      "direction": "receive",
      "currency": "BTC",
      "type": "onchain",
      "status": "succeeded",
      "data": {
        "amount_msats": 150000,
        "requested_amount_msats": 250000,
        "description": "Partial payment for invoice"
      }
    }
  }
}

Full payment completed
{
  "type": "receive",
  "detail": {
    "event": "completed",
    "data": {
      "id": "payment-789",
      "direction": "receive",
      "currency": "BTC",
      "type": "bolt11",
      "status": "completed",
      "data": {
        "amount_msats": 250000,
        "description": "Invoice for services",
        "payment_hash": "a1b2c3d4..."
      }
    }
  }
}
Security & Signature Verification
Signature Verification

Voltage signs all webhook payloads using HMAC-SHA256. You should verify the signature to ensure the webhook is authentic and hasn't been tampered with.

Verification Steps

    Extract the signature and timestamp from headers
    Construct the message: payload_string + "." + timestamp
    Calculate HMAC-SHA256 using your shared secret
    Base64 encode the result
    Compare with the provided signature

const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, timestamp, sharedSecret) {
    // Create message from payload and timestamp
    const message = `${payload}.${timestamp}`;
    
    // Create HMAC
    const hmac = crypto.createHmac('sha256', sharedSecret);
    hmac.update(message);
    
    // Get digest and encode
    const expectedSignature = hmac.digest('base64');
    
    // Compare signatures
    return crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
    );
}
﻿
Testing Webhooks
Using the Test Endpoint

You can test your webhook implementation using the test endpoint:
curl 'https://voltageapi.com/v1/organizations/{organization_id}/environments/{environment_id}/webhooks/{webhook_id}/test' \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN' \
  --data '{
    "delivery_id": "123e4567-e89b-12d3-a456-426614174002",
    "payload": {
      "type": "receive",
      "detail": {
        "event": "completed",
        "data": {
          "id": "test-payment-123",
          "currency": "BTC",
          "direction": "receive",
          "status": "completed",
          "data": {
            "amount_msats": 250000,
            "description": "Test webhook"
          }
        }
      }
    }
  }'
﻿
Local Testing with Webhook Tester

For local development, you can use the provided webhook tester script:

    Set up the webhook tester:

python webhook_tester.py
﻿

    Configure with your shared secret: Create a webhook_config.json:

{
  "host": "localhost",
  "port": 7999,
  "secret": "vltg_GDtRrrJFJ6afRrAYMW3t9RpxgCdcT8zp",
  "output_file": "webhooks.json",
  "log_level": "DEBUG"
}
﻿

    Expose locally using a tunnel service:

# Using smee.io
npm install -g smee-client
smee --url https://smee.io/YOUR_CHANNEL --target http://localhost:7999

# Or using ngrok
ngrok http 7999
﻿

    Register the tunnel URL as your webhook endpoint

Managing Webhook Deliveries
Delivery Status

Webhook deliveries can have the following statuses:

    attempting - Currently being delivered
    succeeded - Successfully delivered (2xx response)
    failed - Failed after all retry attempts
    abandoned - Manually abandoned

Viewing Deliveries

List all deliveries for a webhook:
curl 'https://voltageapi.com/v1/organizations/{org_id}/environments/{env_id}/webhooks/{webhook_id}/deliveries' \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'
﻿
Retry Failed Deliveries

Retry a specific failed delivery:
curl 'https://voltageapi.com/v1/organizations/{org_id}/environments/{env_id}/webhooks/{webhook_id}/deliveries/{delivery_id}/retry' \
  --request POST \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'
﻿
Abandon Deliveries

Stop retrying a delivery:
curl 'https://voltageapi.com/v1/organizations/{org_id}/environments/{env_id}/webhooks/{webhook_id}/deliveries/{delivery_id}/abandon' \
  --request POST \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'
﻿
Best Practices
Understanding Receive Event Types

When handling receive events, it's important to understand the distinction between succeeded and completed:

    succeeded - Fired when a partial payment is received. This is only applicable to on-chain transactions where partial payments are possible. BOLT11 (Lightning) invoices cannot be partially paid.
    completed - Fired when the full requested amount has been received. This is the event you'll typically want to listen for to confirm that a payment has been fully satisfied.

For most use cases with Lightning payments (BOLT11), you'll only receive `completed` events when payments are successful.
1. Always Verify Signatures

Never process a webhook without verifying its signature. This ensures the webhook came from Voltage and hasn't been tampered with.
2. Respond Quickly

Your endpoint should return a 2xx status code within 10 seconds. For long-running processes, acknowledge the webhook immediately and process asynchronously.
3. Handle Duplicates

Webhooks may be delivered more than once. Use the event ID to ensure idempotent processing.
4. Implement Proper Error Handling
const express = require('express');
const crypto = require('crypto');

// Middleware to capture raw body for signature verification
app.use('/webhook', express.raw({ type: 'application/json' }));

app.post('/webhook', async (req, res) => {
    try {
        // Get headers and raw body
        const signature = req.headers['x-voltage-signature'];
        const timestamp = req.headers['x-voltage-timestamp'];
        const rawBody = req.body.toString('utf-8');
        
        // Verify signature
        if (!verifyWebhookSignature(rawBody, signature, timestamp, process.env.WEBHOOK_SECRET)) {
            return res.status(401).json({ error: 'Invalid signature' });
        }
        
        // Parse payload
        const payload = JSON.parse(rawBody);
        
        // Queue for async processing (using your preferred queue system)
        await processWebhookAsync(payload);  // e.g., Bull, RabbitMQ, etc.
        
        return res.status(200).json({ status: 'accepted' });
        
    } catch (error) {
        console.error('Webhook processing error:', error);
        return res.status(500).json({ error: 'Internal error' });
    }
});

function verifyWebhookSignature(payload, signature, timestamp, sharedSecret) {
    if (!signature || !timestamp || !sharedSecret) {
        return false;
    }
    
    const message = `${payload}.${timestamp}`;
    const hmac = crypto.createHmac('sha256', sharedSecret);
    hmac.update(message);
    const expectedSignature = hmac.digest('base64');
    
    return crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
    );
}
﻿
5. Monitor Webhook Health

Regularly check delivery statistics and failed deliveries to ensure your integration is working properly.
6. Use HTTPS

Always use HTTPS endpoints for production webhooks to ensure data security.
7. Rotate Secrets Periodically

Generate new webhook keys periodically for enhanced security:
curl 'https://voltageapi.com/v1/organizations/{org_id}/environments/{env_id}/webhooks/{webhook_id}/keys' \
  --request POST \
  --header 'X-Api-Key: YOUR_SECRET_TOKEN'
﻿
API Reference
Webhook Management

Operation
	

Endpoint
	

Description

List webhooks
	

GET /organizations/{org_id}/webhooks
	

Get all webhooks with filters

Create webhook
	

POST /organizations/{org_id}/environments/{env_id}/webhooks
	

Create new webhook

Get webhook
	

GET /organizations/{org_id}/environments/{env_id}/webhooks/{webhook_id}
	

Get specific webhook

Update webhook
	

PATCH /organizations/{org_id}/environments/{env_id}/webhooks/{webhook_id}
	

Update webhook config

Delete webhook
	

DELETE /organizations/{org_id}/environments/{env_id}/webhooks/{webhook_id}
	

Delete webhook

Generate new key
	

POST /organizations/{org_id}/environments/{env_id}/webhooks/{webhook_id}/keys
	

Rotate shared secret

Start webhook
	

POST /organizations/{org_id}/environments/{env_id}/webhooks/{webhook_id}/start
	

Activate webhook

Stop webhook
	

POST /organizations/{org_id}/environments/{env_id}/webhooks/{webhook_id}/stop
	

Deactivate webhook

Test webhook
	

POST /organizations/{org_id}/environments/{env_id}/webhooks/{webhook_id}/test
	

Send test payload
Delivery Management

Operation
	

Endpoint
	

Description

List deliveries
	

GET /.../webhooks/{webhook_id}/deliveries
	

Get delivery history

Get delivery
	

GET /.../webhooks/{webhook_id}/deliveries/{delivery_id}
	

Get specific delivery

Retry delivery
	

POST /.../webhooks/{webhook_id}/deliveries/{delivery_id}/retry
	

Retry failed delivery

Abandon delivery
	

POST /.../webhooks/{webhook_id}/deliveries/{delivery_id}/abandon
	

Stop retrying
Troubleshooting
Common Issues

    Signature verification failures
        Ensure you're using the raw request body, not parsed JSON
        Verify the shared secret matches exactly
        Check timestamp is included in signature calculation
    Webhooks not being delivered
        Verify webhook status is "active"
        Check your endpoint is publicly accessible
        Ensure you're subscribed to the correct events
    Duplicate webhooks
        Implement idempotency using event IDs
        Track processed events in your database
    Timeout errors
        Return 200 immediately and process asynchronously
        Optimize endpoint response time

For additional support, contact the Voltage support team.
Updated 17 Jun 2025
Doc contributor
Did this page help you?
PREVIOUS
Staging Environment
NEXT
Team Management
TABLE OF CONTENTS
Voltage Payments Webhooks Documentation
Overview
Event Types
Send Events
Receive Events
Test Events
Setting Up Webhooks
1. Create a Webhook
2. Webhook Configuration
Webhook Payload Structure
Headers
Payload Format
Example Payloads
Security & Signature Verification
Signature Verification
Testing Webhooks
Using the Test Endpoint
Local Testing with Webhook Tester
Managing Webhook Deliveries
Delivery Status
Viewing Deliveries
Retry Failed Deliveries
Abandon Deliveries
Best Practices
Understanding Receive Event Types
1. Always Verify Signatures
2. Respond Quickly
3. Handle Duplicates
4. Implement Proper Error Handling
5. Monitor Webhook Health
6. Use HTTPS
7. Rotate Secrets Periodically
API Reference
Webhook Management
Delivery Management
Troubleshooting
Common Issues

Staging Environment - Voltage Payments Documentation
