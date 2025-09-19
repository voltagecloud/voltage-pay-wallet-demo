Receiving Bitcoin Over Lightning

How to build flawless Lightning receiving experiences for your customers
Design Guide

Whether your users are depositing money into their exchange account or trying to receive bitcoin for their goods and services, requesting and receiving is a critical flow. If it doesn’t work, bitcoin may have failed to be money in the user’s eyes.

There are a couple of different ways to receive bitcoin.
Payment Request

One of the most common ways to receive bitcoin is generating a payment request. While some services choose to make a separate “Lightning section” in their product, you can help your users by abstracting away bitcoin and lightning into a simple “request payment” flow.

A payment request includes on-chain and lightning info, and maybe some user metadata. Optionally, the user can easily switch to just an on-chain address or just a lightning invoice if they need it. However, the majority of wallet clients will parse the unified QR code that contains on-chain and lightning invoice combined.
Exchange App receive Bitcoin UI

By the default, you can combine a Lightning invoice and a Bitcoin on-chain address into a single QR code using BIP-21.
Exchange App receive Bitcoin UI

Of course, the recipient can opt to use the Lightning toggle to manually select a Lightning invoice.
Exchange App receive Bitcoin UI

The recipient can also opt to use the On-chain toggle to manually select a Bitcoin on-chain address.
Payment Details

Typically, it’s best to get the user to the payment request QR code as quickly as possible. This let’s them perform their desired action (receive bitcoin) as quickly as possible. However, there are certain pieces of metadata that the user can optionally configure.
Memo

Lightning invoices can include a memo in the invoice defined by the recipient. (Though the absense of a memo should not disallow the user from adding their own description to a received payment later on.)
Amount

Typically, the user does not need to specify an amount when requesting bitcoin. Early on in the Lightning network, most Lightning clients required an amount to be defined in the invoice. However, the majority of modern Lightning clients accept zero-amount invoices, meaning that the sender can specify any amount.

Of course, there may be some unique situations where the user needs to define an amount, so it should be exposed an option. Be sure to allow the user to toggle between bitcoin and their preferred fiat currency.
Expiry

Lightning invoices (for technical reasons we’ll ignore for now) have an expiration. This can be an annoyance to users. For example, say I owe my friend money and they text me a Lightning invoice, but it’s expired by the time I notice the text message.

This problem can be solved by defaulting to a long expriy, say 24 hours. However, there might be special situations where a user wants to specify a tighter timeframe. For example, somnebody owes me $20 and I would like to receive that equivalent amount in bitcoin before the BTC/USD price fluctuates heavily. In that case, a user could tighten the expiry to 10 minutes. This example wallet, however, does not bother to allow manipulation of the expiration date.
Exchange App receive Bitcoin UI

If needed, the recipient can tap the Edit button to go to this screen. Here they can specify an amount and attach a memo to the Lightning invoice.
Exchange App receive Bitcoin UI

The user types in a memo and an amount, which is converted to USD.
Exchange App receive Bitcoin UI

Allow the user to toggle between a local fiat currency and Bircoin.
Sharing Payment Request

After generating a payment request, consider how the user gets that payment request to the sender. Displaying a QR code is a simple way to do this. However, consider the environment your user might be requesting the payment in.

    In a bright, tropical paradise where people use lower-budget Android devices? → Consider brightening the screen and bringing the QR code full-width for easy scannability.
    In a country where NFC technology is widely-used? → Perhaps implement tap-to-pay.
    Requesting bitcoin from someone who isn’t physically present? → Add a share feature so the user can:
        Copy to another device (like from phone to laptop)
        Add to a text message or email

Exchange App receive Bitcoin UI

The user taps the copy button to copy payment request to clipboard.
Exchange App receive Bitcoin UI

The user taps the share button. The share tray features will depend on the operating system or browser, but should give an easy way to transfer the payment request string to another app.
Payment Complete

Once the payment has been received, immediately notify the user. As a product builder, it’s good to distinguish between on-chain and Lightning payments in your own mind. Typically, wallets might display the a transaction in a “pending” state while waiting for blockchain confirmation, which could tkae 10 minutes or longer.

However, many Lightning payments will settle in 1 - 2 seconds. This means your user may still have the payment request screen open when the payment is received. If you don’t update the screen to immediately show the payment as complete, this can cause confusion and the impression that the app is broken. The sender could say “it says it’s complete on my screen” and the recipient is left scratching their head.

Upon receipt, also give your user the ability to view the transaction details. At a minimum, this should include the bitcoin amount, date and time of receipt, and the memo from the Lightning invoice. Many on-chain payment receipts will include a link to “view transaction on blockchain”. However, Lightning payments bypass the blockchain, so you should not include such links for Lightning.
Exchange App receive Bitcoin UI

This product makes it super clear when the payment is received by switching to a colorful visual.
Exchange App receive Bitcoin UI

The user can view a summary of the payment after it is complete.
Lightning Address

Using Lightning address, you can give your users a username that is cross-compatible with other bitcoin services. It’s much easier for people to say “you can pay me at alice@exchange.app” rather than handle complicated looking bitcoin addresses and invoices.

If your product already has a concept of usernames or handles, you could easily turn these usernames into Lightning addresses for your users.
Exchange App receive Bitcoin UI

The user can always find their Lightning address in their account profile.
Exchange App receive Bitcoin UI

The Lightning address can also be put into a QR format so other people can easily scan it into their phones.
