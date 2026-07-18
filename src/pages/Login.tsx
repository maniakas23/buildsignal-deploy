// Login Page — Platform Completion Mode
// Authenticates via Kimi OAuth. No local password system.
// Shows loading state during redirect. Handles OAuth errors.

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Signal, ArrowRight, AlertTriangle, Loader2 } from 'lucide-react';

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set('client_id', appID);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'profile');
  url.searchParams.set('state', state);

  return url.toString();
}

// Parse OAuth error from URL if redirected back with an error
function getOAuthError(): string | null {
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');
  const errorDescription = params.get('error_description');
  if (error === 'access_denied') return 'Login was cancelled. Please try again.';
  if (error) return errorDescription || `Authentication failed: ${error}`;
  return null;
}

export default function Login() {
  const { setCurrentPage } = useStore();
  const [isRedirecting, setIsRedirecting] = useState(false);
  // Read OAuth error from URL during initial render (not in an effect)
  const [oauthError] = useState<string | null>(() => {
    const error = getOAuthError();
    // Clean error from URL synchronously
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    return error;
  });

  const handleSignIn = () => {
    setIsRedirecting(true);
    window.location.href = getOAuthUrl();
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Signal className="w-7 h-7 text-ink-primary" />
          <span className="text-xl font-semibold text-ink-primary tracking-tight">BuildSignal</span>
        </div>

        {/* Error Banner */}
        {oauthError && (
          <div className="mb-4 bg-accent-crimson/[0.06] border border-accent-crimson/20 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
            <AlertTriangle className="w-4 h-4 text-accent-crimson flex-shrink-0 mt-0.5" />
            <p className="text-sm text-accent-crimson">{oauthError}</p>
          </div>
        )}

        {/* Sign In Card */}
        <div className="bg-surface rounded-2xl p-6 shadow-card border border-ink-wash">
          <h1 className="text-lg font-semibold text-ink-primary text-center mb-1">
            {isRedirecting ? 'Redirecting to Kimi...' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-ink-tertiary text-center mb-6">
            {isRedirecting
              ? 'Please wait while we authenticate you.'
              : 'Sign in with your Kimi account to continue.'}
          </p>

          <button
            onClick={handleSignIn}
            disabled={isRedirecting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent-indigo text-white text-sm font-medium hover:bg-accent-indigo/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRedirecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                Sign in with Kimi
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-ink-wash" />
            <span className="text-[11px] text-ink-tertiary">or</span>
            <div className="flex-1 h-px bg-ink-wash" />
          </div>

          {/* Sign up link */}
          <button
            onClick={() => setCurrentPage('signup')}
            disabled={isRedirecting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-canvas border border-ink-wash text-sm font-medium text-ink-secondary hover:bg-surface transition-colors disabled:opacity-50"
          >
            Create a new account
          </button>
        </div>

        {/* Password hint */}
        <p className="text-center text-xs text-ink-tertiary mt-4">
          BuildSignal uses Kimi for authentication. Your password is managed by Kimi.
        </p>
      </div>
    </div>
  );
}
