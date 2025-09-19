Sending Bitcoin Over Lightning

How to build flawless Lightning sending experiences for your customers
Design Guide

Whether your users are withdrawing from an exchange or simply paying a friend, the process of sending bitcoin is a very critical part of the experience for your product. If there is too much friction during the send process, then it impedes the primary use-cases of bitcoin, which is a form of money.

As bitcoin has matured over 15+ years, it has accrued a plethora of payment request formats. When it comes to receiving, you may only support a few of these. However, for sending, it’s important that you try to support as many of these payment request formats as possible. At the very bare minimum, it is a good idea to be able to detect and parse these formats so you can provide good messaging for your users, even if you are not capable of sending to them.
The Happy Path - Lightning Sends

At Voltage, we believe that the Lightning network is a great solution for a variety of use-cases. It gives you near-instant final settlement and it works for both small amounts and large amounts. We find Lightning fees to be typically smaller than on-chain fees. Of course, there will be situations where on-chain payments make more sense (very large payments, for example). But in general, we feel Lightning is a sensible default.

As such, we’ve outlined the Happy Path: your customer goes to send bitcoin from your product using a lightning compatible payment format. Both you and your customer save on-chain fees.
Exchange App amount input UI

Starting at the send screen...
Exchange App amount input UI with $5

...the user selects an amount, $5 USD.
Bitcoin address input

Then they are prompted to enter a bitcoin address...
Bitcoin address input filled with a BOLT 12 offer

...which they fill with a BOLT 12 offer, successfully.
Review screen with amount, destination, estimated fee, and maximum fee

The final review screen estimates the fee on their Lightning payment (which we can’t know before the payment completes), but limits it to a maximum value.
Lightning strike animation

Payments sends...
Payment complete screen

...and it settles in mere seconds.
Helping Your Users Save on Fees

There will be some situations where your customers are going to try sending to an on-chain address for small amounts of bitcoin. In this situation, it might save them time and money to use Lightning. It will save them from higher on-chain fees. It will also prevent creating tiny on-chain coins which might be more expensive to use later. Of course, you should not prevent your users from sending on-chain if that is what they would like to do. However, it might be worth letting them know they could save fees with a Lightning format.
Exchange App amount input UI filled with 5 EUR

The user tries to send 5 EUR.
Bitcoin address input filled with a P2TR address

They paste in an on-chain address. This is a good place to notify them they could spend less on fees with Lightning.
UI for choosing the estimated settlement time and corresponding fee

For on-chain, the user can specify the fee. Represent the fee in terms of what they get (how fast it settles and how much it costs) rather than sats/vByte.
Review screen with amount, destination, estimated fee, and fee

Give the user a final chance to review before sending.
Transaction broadcast animation

The user’s transaction is broadcasted...
Payment pending screen

...and enters the pending state while waiting for it to clear on-chain.
Sending to Usernames

There are a few options in bitcoin for usernames. The current best practice is BIP-353 usernames, because they are verifiable and support many payment formats. The legacy Lightning address format is also widely used.
BIP-353 username input

The user pastes in a BIP-353 username, which looks like an email but with a bitcoin symbol.
BIP-353 settlement time choice

Sometimes BIP-353 usernames can contain payment data for both lightning and on-chain. In this case, you could give the user a choice. However, frame the choice in terms of settlement time and cost.
BIP-353 review screen

On the final review screen, the BIP-353 displays as the destination.
Lightning address input

You may also encounter a lightning address, which typically does not include the bitcoin symbol. These only work with lightning, so you do not need to provide any prompt about settlement time.
Handling Errors

Things don’t always go according to plan. Make sure you are surfacing error messages that are informative to your users. Avoid going into too much technical detail and instead focus on helping them understand what they can do to fix the problem.
Expired invoice error

Sometimes lightning invoices can expire before users have a chance to pay them. The user can fix this by getting a new invoice.
Unsupported format error

If you do not support a specific bitcoin payment format, it may help give your user a sense of clarity to acknowledge you don’t support it.
Invalid input error

If the user puts in a string that’s not a valid bitcoin format (e.g. an ethereum address), provide some examples for what they should give you.
Recipient node offline error

Any kind of lightning payment can fail if the recipient’s node is offline. In this case, they can try again later or get a new format.
BIP-353 validation error

With a BIP-353 address, it could fail its validation. Validation could fail due to a typo, or it could just be a bad address.