/**
 * BuildSignal Error Boundary
 * Catches React render errors and displays a diagnostic UI instead of a blank page.
 * Essential for debugging production issues.
 */

import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] Caught error:', error);
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  override render() {
    if (this.state.hasError) {
      // Check if this is an auth-related error
      const errorMessage = this.state.error?.message || 'Unknown error';
      const isAuthError = errorMessage.toLowerCase().includes('auth') ||
        errorMessage.toLowerCase().includes('unauthorized') ||
        errorMessage.toLowerCase().includes('login');

      return (
        <div className="min-h-screen bg-[#081018] text-white flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-[#121C27] rounded-2xl border border-[#243444] p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">
                  {isAuthError ? 'Authentication Required' : 'Something went wrong'}
                </h1>
                <p className="text-sm text-white/50">
                  {isAuthError
                    ? 'Please sign in to access this page.'
                    : 'An error prevented the page from loading.'}
                </p>
              </div>
            </div>

            {!isAuthError && (
              <div className="bg-[#081018] rounded-xl p-4 mb-6 border border-[#243444] overflow-auto max-h-48">
                <p className="text-xs font-mono text-red-400 mb-2">{errorMessage}</p>
                {this.state.errorInfo && (
                  <pre className="text-[10px] font-mono text-white/40 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5B8DEF] text-white rounded-xl text-sm font-medium hover:bg-[#5B8DEF]/90 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a2d3d] text-white rounded-xl text-sm font-medium hover:bg-[#243444] transition-colors border border-[#243444]"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
            </div>

            <p className="text-[11px] text-white/30 mt-4 text-center">
              If this persists, check the browser console for more details.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Minimal error boundary that silently catches errors and renders null.
 * Use for non-critical UI sections that shouldn't crash the whole app.
 */
export class SilentErrorBoundary extends Component<{ children: ReactNode; onError?: (error: Error) => void }> {
  override componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.warn('[SilentErrorBoundary] Suppressed error in child:', error.message);
    this.props.onError?.(error);
  }

  override render() {
    return this.props.children;
  }
}
