import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Voltage Wallet Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="surface-shell flex min-h-screen items-center justify-center px-6">
          <div className="surface-panel w-full max-w-md space-y-4 text-center">
            <div className="text-6xl">⚡️</div>
            <h1 className="text-display-md font-semibold">Something went wrong</h1>
            <p className="text-body-muted">
              The wallet encountered an unexpected error. Refresh the page to reset the session and try again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-primary w-full justify-center"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
