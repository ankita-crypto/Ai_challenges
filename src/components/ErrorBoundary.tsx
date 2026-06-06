import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { redactError } from '../utils/security';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown): void {
    console.error(`Recoverable application error: ${redactError(error)}`);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="app-error-boundary" role="alert" aria-live="assertive">
        <AlertTriangle size={36} aria-hidden="true" />
        <h1>We could not load this wellness view.</h1>
        <p>Your local entries stay on this device. Reload the app to return to a safe state.</p>
        <button type="button" className="glass-btn glass-btn-primary" onClick={this.handleReload}>
          <RefreshCw size={16} aria-hidden="true" />
          Reload ZenStudy
        </button>
      </main>
    );
  }
}
