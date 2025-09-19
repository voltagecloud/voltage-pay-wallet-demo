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
        // Handled directly in the grid layout to avoid duplicating the card
        return null;
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
      <div className="surface-shell px-4 py-8 md:px-10">
        <div className="mx-auto max-w-5xl space-y-10">
          <header className="text-center space-y-3">
            <span className="heading-eyebrow">Voltage</span>
            <h1 className="text-display-lg font-semibold">Payments Demo</h1>
            <p className="text-body-muted">Unified Bitcoin, Lightning, and asset Payments powered by Voltage.</p>
          </header>

          {/* Navigation Tabs */}
          <nav className="tab-bar p-1 shadow-card">
            {([
              ['balance', 'Balance'],
              ['send', 'Send'],
              ['receive', 'Receive'],
              ['history', 'History'],
            ] as [ActiveTab, string][]).map(([value, label]) => (
              <button
                key={value}
                type="button"
                data-active={(activeTab === value).toString()}
                onClick={() => setActiveTab(value)}
                className="tab-trigger"
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Content Area */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 with-grid-gaps">
            {activeTab === 'balance' ? (
              <div className="lg:col-span-3">
                <WalletBalance onError={showError} />
              </div>
            ) : (
              <>
                <div className="lg:col-span-1">
                  <WalletBalance onError={showError} />
                </div>
                <div className="lg:col-span-2">
                  {renderContent()}
                </div>
              </>
            )}
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
