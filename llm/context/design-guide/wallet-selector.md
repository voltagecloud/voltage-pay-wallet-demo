Lightning Wallet Selector

Helping your customers find a Lightning wallet
Design Guide
The Importance of a Lightning Wallet Selector

In the world of Bitcoin, ensuring a seamless user experience is crucial, especially when it comes to integrating Lightning capabilities. One of the primary challenges your users might face is the lack of a Lightning wallet. This can be a significant barrier, preventing them from fully benefiting from the Lightning features of your product. If using Lightning feels cumbersome, users might opt for on-chain transactions, incurring unnecessary fees for both parties.
Making the Process Frictionless

To address this, a Lightning wallet selector can be an invaluable tool. It simplifies the process for users, making it as frictionless as possible. By providing a wallet selector, you can facilitate easy inter-app switching and suggest wallets for download, enhancing the overall user experience.
Facilitating Inter-App Switching

Switching between Bitcoin wallets can often be cumbersome. For instance, users might need to switch from an exchange app to a wallet app, create an invoice, return to the exchange app to paste it, and then go back to the wallet app to confirm payment. This process can be streamlined by creating hotlinks to existing wallets on their devices using deep linking. Custom protocol strings, such as lightning or bitcoin, can be used instead of standard HTTP links. However, it’s worth noting that on iOS, users have limited control over which installed wallet these protocols redirect to, making a wallet selector a practical workaround.
Bitcoin Rewards UI

In this example, the customer has earned bitcoin rewards and is offered withdrawal to self-custody.
App selector menu from the operating system

After tapping the withdraw button, some operating systems may provide a contextual menu to choose a bitcoin or lightning app. However, results will vary between operating systems.
Lightning Wallet Selector UI

Instead, you could attempt to detect installed Lightning wallets and offer a choice to open those apps directly.
Suggesting Wallets

It’s likely that some users may not have a Lightning wallet at all. Providing them with links to download Lightning wallets can be incredibly helpful. These links should be easily accessible in their current context, whether it’s the Apple App Store, Google Play Store, or other platforms.
Lightning Wallet Selector UI

If no Lightning wallets are detected, you can offer up a list of popular wallets with install links.
Lightning Wallet Selector UI

After installing a Lightning wallet, you could continue to present the user's installed wallets with a list of other wallets in the same UI.

By offering a Lightning wallet selector, you can make the process of getting started with Lightning and using it much smoother for your customers.