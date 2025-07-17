import { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import WalletBalance from './components/WalletBalance';
import SendPayment from './components/SendPayment';
import ReceivePayment from './components/ReceivePayment';
import TransactionHistory from './components/TransactionHistory';
import Notification from './components/Notification';
import { useNotification } from './hooks/useNotification';

type ActiveTab = 'balance' | 'send' | 'receive' | 'history';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('balance');
  const { notification, showSuccess, showError, hideNotification } = useNotification();

  const handlePaymentSuccess = (message: string) => {
    showSuccess(message);
    setActiveTab('history');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'balance':
        return <WalletBalance onError={showError} />;
      case 'send':
        return (
          <SendPayment
            onSuccess={() => handlePaymentSuccess('Payment sent successfully!')}
            onError={showError}
          />
        );
      case 'receive':
        return (
          <ReceivePayment
            onSuccess={() => handlePaymentSuccess('Payment received successfully!')}
            onError={showError}
          />
        );
      case 'history':
        return <TransactionHistory onError={showError} />;
      default:
        return <WalletBalance onError={showError} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Voltage Pay Wallet Demo
          </h1>
          
          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('balance')}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'balance'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Balance
              </button>
              <button
                onClick={() => setActiveTab('send')}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'send'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Send
              </button>
              <button
                onClick={() => setActiveTab('receive')}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'receive'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Receive
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'history'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                History
              </button>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {activeTab === 'balance' && (
              <div className="lg:col-span-1">
                <WalletBalance onError={showError} />
              </div>
            )}
            <div className={activeTab === 'balance' ? 'lg:col-span-2' : 'lg:col-span-3'}>
              {renderContent()}
            </div>
          </div>
        </div>
        
        {/* Notifications */}
        {notification.isVisible && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={hideNotification}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
