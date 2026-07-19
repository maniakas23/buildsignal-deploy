import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { trackEvent } from '@/hooks/useTelemetry';
import {
  Lock, ArrowRight, Check, Sparkles, Mail,
  Shield, Users, Clock, Zap, X
} from 'lucide-react';

const VALID_BETA_CODES = ['BETA2026', 'SIGNALVIP', 'BUILDALPHA', 'EARLYACCESS'];

interface BetaAccessGateProps {
  onAccessGranted: () => void;
}

export default function BetaAccessGate({ onAccessGranted }: BetaAccessGateProps) {
  const { addToast } = useStore();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [mode, setMode] = useState<'code' | 'waitlist'>('code');
  const [submitted, setSubmitted] = useState(false);

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = code.trim().toUpperCase();

    if (VALID_BETA_CODES.includes(normalized)) {
      trackEvent('signup_complete', { source: 'beta_gate', code: normalized });
      localStorage.setItem('buildsignal-beta-access', 'granted');
      localStorage.setItem('buildsignal-beta-code', normalized);
      addToast('Welcome to the BuildSignal Private Beta!', 'success');
      onAccessGranted();
    } else {
      addToast('Invalid access code. Please check and try again.', 'error');
      trackEvent('error', { type: 'invalid_beta_code', code: normalized });
    }
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim() || !waitlistEmail.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    trackEvent('signup_start', { source: 'beta_waitlist', email: waitlistEmail });
    setSubmitted(true);
    addToast('You are on the waitlist! We will be in touch soon.', 'success');
  };

  // Check if already granted
  const alreadyGranted = localStorage.getItem('buildsignal-beta-access') === 'granted';
  if (alreadyGranted) {
    onAccessGranted();
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-canvas">
      <div className="w-full max-w-[440px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent-indigo/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-accent-indigo" />
          </div>
          <h1 className="text-2xl font-semibold text-ink-primary tracking-tight mb-2">
            BuildSignal Private Beta
          </h1>
          <p className="text-sm text-ink-secondary">
            Early access to construction intelligence for select professionals.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-surface border border-ink-wash rounded-xl p-3 text-center">
            <Shield className="w-4 h-4 text-accent-teal mx-auto mb-1" />
            <p className="text-lg font-semibold text-ink-primary font-mono">2,400+</p>
            <p className="text-[10px] text-ink-tertiary">Data Sources</p>
          </div>
          <div className="bg-surface border border-ink-wash rounded-xl p-3 text-center">
            <Users className="w-4 h-4 text-accent-indigo mx-auto mb-1" />
            <p className="text-lg font-semibold text-ink-primary font-mono">3,100+</p>
            <p className="text-[10px] text-ink-tertiary">Counties</p>
          </div>
          <div className="bg-surface border border-ink-wash rounded-xl p-3 text-center">
            <Clock className="w-4 h-4 text-accent-amber mx-auto mb-1" />
            <p className="text-lg font-semibold text-ink-primary font-mono">60-90</p>
            <p className="text-[10px] text-ink-tertiary">Day Lead</p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex mb-4 bg-canvas rounded-xl p-1 border border-ink-wash">
          <button
            onClick={() => setMode('code')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
              mode === 'code'
                ? 'bg-surface text-ink-primary shadow-sm'
                : 'text-ink-tertiary hover:text-ink-secondary'
            }`}
          >
            <Lock className="w-3 h-3 inline mr-1" />
            Have an Invite Code
          </button>
          <button
            onClick={() => setMode('waitlist')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
              mode === 'waitlist'
                ? 'bg-surface text-ink-primary shadow-sm'
                : 'text-ink-tertiary hover:text-ink-secondary'
            }`}
          >
            <Mail className="w-3 h-3 inline mr-1" />
            Join Waitlist
          </button>
        </div>

        {/* Code entry */}
        {mode === 'code' && (
          <div className="bg-surface border border-ink-wash rounded-2xl p-5">
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink-primary mb-1.5">
                  Beta Access Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter your invite code"
                  className="w-full px-4 py-3 rounded-xl bg-canvas border border-ink-wash text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-accent-indigo/50 uppercase tracking-wider font-mono"
                  autoFocus
                />
                <p className="text-[10px] text-ink-tertiary mt-1.5">
                  Codes are case-insensitive. Contact your account manager if you need one.
                </p>
              </div>

              <button
                type="submit"
                disabled={!code.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent-indigo text-white text-sm font-semibold hover:bg-accent-indigo-dim transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4" />
                Enter Private Beta
              </button>
            </form>
          </div>
        )}

        {/* Waitlist */}
        {mode === 'waitlist' && (
          <div className="bg-surface border border-ink-wash rounded-2xl p-5">
            {submitted ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-accent-teal/10 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-accent-teal" />
                </div>
                <h3 className="text-sm font-semibold text-ink-primary mb-1">
                  You Are on the List
                </h3>
                <p className="text-xs text-ink-secondary">
                  We will email you when a spot opens up. Thank you for your interest!
                </p>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-ink-primary mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-canvas border border-ink-wash text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-accent-indigo/50"
                    autoFocus
                  />
                  <p className="text-[10px] text-ink-tertiary mt-1.5">
                    Limited spots available. We are adding users weekly.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-primary mb-1.5">
                    What best describes you?
                  </label>
                  <select
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-canvas border border-ink-wash text-sm text-ink-primary focus:outline-none focus:border-accent-indigo/50"
                  >
                    <option value="">Select your role...</option>
                    <option value="contractor">General Contractor</option>
                    <option value="developer">Real Estate Developer</option>
                    <option value="supplier">Material Supplier</option>
                    <option value="consultant">Construction Consultant</option>
                    <option value="investor">Infrastructure Investor</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!waitlistEmail.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent-indigo text-white text-sm font-semibold hover:bg-accent-indigo-dim transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mail className="w-4 h-4" />
                  Join the Waitlist
                </button>
              </form>
            )}
          </div>
        )}

        {/* Trust footer */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-ink-tertiary">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-accent-teal" />
            SOC 2 Compliant
          </span>
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-accent-teal" />
            Encrypted
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3 text-accent-teal" />
            Private Beta
          </span>
        </div>
      </div>
    </div>
  );
}
