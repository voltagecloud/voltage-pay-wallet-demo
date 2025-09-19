Sweeping a Lightning Wallet

Helping your customers shut down their service
Design Guide
The time will come to say goodbye

There is going to come a time when your user is ready to stop using your app. Even if their experience is perfectly great, they may simply no longer need your service anymore. You want to make it as easy as possible for a user to withdraw funds from your app. Afterall, you want them to leave with a positive experience, and most importantly, it’s their money.
Issues users face when withdrawing funds
Imperfect numbers

We rarely have perfectly clean denominations of money in our wallets. Instead of $100, we have $121.69, and instead of 1,000 sats, we have 1,337 sats. During this stage where the user is trying to withdraw all their funds, it can be annoyance if they type in the wrong number and then have to go back and do a second transaction.
Calculating fees

With on-chain bitcoin payments, fee calculations are a little more straightforward; to put it simply, you select a fee, and eventually your transaction is included in a block, depending on how busy the bitcoin network is.

However, Lightning fees are less straight-forward. Instead, you are defining a maximum fee you are willing to pay. From there, the Lightning wallet will attempt to succesfully make the payment by paying as small a fee as possible.

While smaller fees are typically great, it becomes an annoyance when trying to sweep a wallet because it can result in “loose change” left behind in the wallet.
Send Max Button

A “Send Max” button is a helpful tool that will prevent the user from doing a lot of guesswork. Instead of checking their balance and copying that number, the user can simply press the button to indicate their intentions to send everything. Your app can handle calculating the appropriate Lightning routing fees — just be sure to indicate to your user that fees will be deducted from the amount.

This is a subtle but important difference. In the ordinary Sending flow, your app can tell the user exctly how much bitcoin will get to it’s destination. In the Send Max, you can only provide an estimate, contigent upon fees. Be sure to indicate this transparently. Check out the examples below.
UI of a send screen with a keypad

User opens the app to withdraw their funds.
Send screen UI with Send Max button engaged

They use the "Send Max" button to indicate they want to send everything.
Sending UI with a lightning address entered into the destination input.

Typically, formats like Lightning address work better for sending the maximum amount.
Payment review UI

When reviewing, indicate that the amount is in estimate because fees will be subtracted.
Payment complete UI

After the Lightning payment is complete, reveal the final sent amount.
Alternative Approaches

Depending on the fee structure of the product, you might choose to simply give your users a flat fee. While some users may not appreciate it if the price is slightly higher, it can reduce the uncertainty when sweeping a Lightning wallet.

Regardless of how you proceed, aim to make sweeping the wallet just as smooth as onboarding to the wallet for your customers.