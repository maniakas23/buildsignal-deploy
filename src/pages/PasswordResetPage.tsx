// Password Reset Page — Platform Completion Mode
// BuildSignal uses Kimi OAuth for authentication.
// Users manage their password through Kimi's account settings.
// This page explains that and provides the redirect.

import { useStore } from '@/store/useStore';
import { ArrowLeft, ExternalLink, ShieldCheck, KeyRound } from 'lucide-react';

function getKimiAccountUrl(): string {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  return `${kimiAuthUrl}/settings/account`;
}

export default function PasswordResetPage() {
  const { setCurrentPage } = useStore();

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Back to login */}
        <button
          onClick={() => setCurrentPage('login')}
          className="flex items-center gap-1 text-sm text-ink-tertiary hover:text-ink-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-accent-indigo/10 flex items-center justify-center">
            <KeyRound className="w-6 h-6 text-accent-indigo" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-ink-primary mb-2">Password Management</h1>
          <p className="text-sm text-ink-secondary">
            BuildSignal uses Kimi for authentication. Your password is managed by your Kimi account.
          </p>
        </div>

        {/* Explanation */}
        <div className="bg-surface rounded-2xl p-5 shadow-card border border-ink-wash mb-5 space-y-3">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-accent-teal flex-shrink-0 mt-0.5" />
            <p className="text-sm text-ink-secondary">
              Your account credentials are handled securely by Kimi's authentication system.
              BuildSignal never stores your password.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <KeyRound className="w-4 h-4 text-accent-indigo flex-shrink-0 mt-0.5" />
            <p className="text-sm text-ink-secondary">
              To change your password, update it in your Kimi account settings.
            </p>
          </div>
        </div>

        {/* CTA */}
        <a
          href={getKimiAccountUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent-indigo text-white text-sm font-medium hover:bg-accent-indigo/90 transition-colors"
        >
          Manage My Kimi Account
          <ExternalLink className="w-4 h-4" />
        </a>

        {/* Alternative */}
        <p className="text-center text-xs text-ink-tertiary mt-4">
          Need help?{' '}
          <button onClick={() => setCurrentPage('contact')} className="text-accent-indigo hover:underline">
            Contact support
          </button>
        </p>
      </div>
    </div>
  );
}
