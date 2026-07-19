/**
 * BuildSignal Error Boundary — PI-10 Enhanced
 * Catches React render errors, logs telemetry, provides recovery UI.
 * Production-hardened with session preservation and structured recovery.
 */

import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, RotateCcw, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { trackError } from '@/hooks/useTelemetry';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  context?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  copied: boolean;
  recoveryAttempt: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, showDetails: false, copied: false, recoveryAttempt: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error, errorInfo: null };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
    trackError(error, {
      context: this.props.context || 'unknown',
      componentStack: errorInfo.componentStack,
      recoveryAttempt: this.state.recoveryAttempt,
    });
    this.setState({ error, errorInfo });
  }

  handleReload = () => { window.location.reload(); };
  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, recoveryAttempt: 0 });
    window.location.href = '/';
  };
  handleRetry = () => {
    this.setState((prev) => ({ hasError: false, recoveryAttempt: prev.recoveryAttempt + 1 }));
  };
  handleCopyError = () => {
    const { error, errorInfo } = this.state;
    const text = `BuildSignal Error Report\nTime: ${new Date().toISOString()}\nContext: ${this.props.context || 'unknown'}\nMessage: ${error?.message || 'Unknown'}\nStack: ${error?.stack || 'N/A'}\nComponent: ${errorInfo?.componentStack || 'N/A'}`;
    navigator.clipboard.writeText(text).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
  };

  override render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'Unknown error';
      const isAuthError = errorMessage.toLowerCase().includes('auth') || errorMessage.toLowerCase().includes('unauthorized') || errorMessage.toLowerCase().includes('login');
      const isRecoverable = this.state.recoveryAttempt < 3;

      return (
        <div className="min-h-screen bg-[#081018] text-white flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-[#121C27] rounded-2xl border border-[#243444] p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isAuthError ? 'bg-amber-500/10' : 'bg-red-500/10'}`}>
                <AlertTriangle className={`w-6 h-6 ${isAuthError ? 'text-amber-400' : 'text-red-400'}`} />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">{isAuthError ? 'Authentication Required' : 'Something went wrong'}</h1>
                <p className="text-sm text-white/50">
                  {isAuthError ? 'Please sign in to access this page.' : this.state.recoveryAttempt > 0 ? `Recovery attempt ${this.state.recoveryAttempt}/3 failed` : 'An error prevented the page from loading.'}
                </p>
              </div>
            </div>

            {!isAuthError && this.state.recoveryAttempt > 0 && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 mb-4">
                <p className="text-xs text-amber-400/80">Automatic recovery was attempted but the error persists. You can try again or reload the page.</p>
              </div>
            )}

            {!isAuthError && (
              <div className="mb-4">
                <button onClick={() => this.setState((s) => ({ showDetails: !s.showDetails }))}
                  className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors mb-2">
                  {this.state.showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />} Technical Details
                </button>
                {this.state.showDetails && (
                  <div className="bg-[#081018] rounded-xl p-4 border border-[#243444] overflow-auto max-h-48 relative">
                    <button onClick={this.handleCopyError} className="absolute top-2 right-2 p-1 rounded hover:bg-[#243444] transition-colors" title="Copy error report">
                      {this.state.copied ? <span className="text-[10px] text-accent-teal">Copied!</span> : <Copy className="w-3 h-3 text-white/40" />}
                    </button>
                    <p className="text-xs font-mono text-red-400 mb-2 pr-16">{errorMessage}</p>
                    {this.state.errorInfo && <pre className="text-[10px] font-mono text-white/40 whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {isRecoverable && !isAuthError && (
                <button onClick={this.handleRetry} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-accent-indigo text-white rounded-xl text-sm font-medium hover:bg-accent-indigo/90 transition-colors">
                  <RotateCcw className="w-4 h-4" /> Try Again
                </button>
              )}
              <button onClick={this.handleReload} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5B8DEF] text-white rounded-xl text-sm font-medium hover:bg-[#5B8DEF]/90 transition-colors">
                <RefreshCw className="w-4 h-4" /> Reload Page
              </button>
              <button onClick={this.handleGoHome} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a2d3d] text-white rounded-xl text-sm font-medium hover:bg-[#243444] transition-colors border border-[#243444]">
                <Home className="w-4 h-4" /> Home
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-[#243444]">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-white/30">If this persists, contact support with the error details above.</p>
                <a href="mailto:support@buildsignal.com" className="flex items-center gap-1 text-[11px] text-accent-indigo hover:underline"><Bug className="w-3 h-3" /> Report</a>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export class SilentErrorBoundary extends Component<{ children: ReactNode; onError?: (error: Error) => void; context?: string }> {
  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[SilentErrorBoundary] Suppressed error in child:', error.message);
    trackError(error, { context: this.props.context || 'silent-boundary', componentStack: errorInfo.componentStack });
    this.props.onError?.(error);
  }
  override render() { return this.props.children; }
}
