import { useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Notification({ 
  message, 
  type, 
  onClose, 
  duration = 5000 
}: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const variant = {
    success: {
      container: 'bg-success text-ink-inverse',
      icon: '✅',
    },
    error: {
      container: 'bg-danger text-ink-inverse',
      icon: '⛔',
    },
    info: {
      container: 'bg-brand text-ink-inverse',
      icon: 'ℹ️',
    },
  }[type];

  return (
    <div className={`fixed top-6 right-6 z-50 max-w-md rounded-2xl border border-ink-inverse/20 px-6 py-4 shadow-flyout transition-transform ${variant.container}`}>
      <div className="flex items-start gap-3">
        <span className="text-lg leading-none">{variant.icon}</span>
        <p className="flex-1 text-body-md font-medium leading-snug">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="text-body-md font-semibold text-ink-inverse transition-opacity hover:opacity-80"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}
