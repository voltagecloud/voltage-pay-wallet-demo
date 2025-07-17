function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="w-full bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-center mb-8">Lightning Wallet</h1>
          
          <div className="mb-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-600 mb-3">Balance</p>
              <p className="text-4xl font-bold">0 sats</p>
              <p className="text-lg text-gray-500 mt-2">$0.00 USD</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button className="bg-orange-500 text-white py-4 px-6 rounded-lg font-medium hover:bg-orange-600 text-lg">
              Send
            </button>
            <button className="bg-blue-500 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-600 text-lg">
              Receive
            </button>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium">Payment received</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
                <p className="text-green-600 font-medium">+50,000 sats</p>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium">Payment sent</p>
                  <p className="text-sm text-gray-500">1 day ago</p>
                </div>
                <p className="text-red-600 font-medium">-25,000 sats</p>
              </div>
              <div className="flex justify-between items-center py-3">
                <div>
                  <p className="font-medium">Payment received</p>
                  <p className="text-sm text-gray-500">3 days ago</p>
                </div>
                <p className="text-green-600 font-medium">+100,000 sats</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
