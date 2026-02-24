import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/lib/api-client';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isAuthError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, isAuthError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    const isAuthError = error instanceof ApiError && error.isUnauthorized;
    return { hasError: true, error, isAuthError };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);

    // Auto-redirect on 401 — session expired
    if (error instanceof ApiError && error.isUnauthorized) {
      localStorage.removeItem('auth_token');
      setTimeout(() => {
        window.location.href = '/auth-proadmin2025';
      }, 1500);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, isAuthError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      // Auth error — show session expired message
      if (this.state.isAuthError) {
        return (
          <div className="min-h-[60vh] flex items-center justify-center p-8">
            <div className="text-center max-w-md space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <h2 className="text-xl font-semibold">Session Expired</h2>
              <p className="text-muted-foreground text-sm">
                Your session has expired. Redirecting you to the login page...
              </p>
            </div>
          </div>
        );
      }

      // Generic error
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-8">
          <div className="text-center max-w-md space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
              <span className="text-2xl">⚠</span>
            </div>
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <p className="text-muted-foreground text-sm">
              An unexpected error occurred. Please try again or return to the home page.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <Button variant="outline" onClick={this.handleReset} aria-label="Retry loading this section">
                Try Again
              </Button>
              <Button onClick={() => (window.location.href = '/')} aria-label="Go to home page">
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
