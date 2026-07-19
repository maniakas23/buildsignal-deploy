import { useState } from 'react';
import { Shield, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

const VALID_CODES = ['BETA2026', 'SIGNALVIP', 'BUILDALPHA', 'EARLYACCESS'];

interface Props {
  onAccessGranted: () => void;
}

export default function BetaAccessGate({ onAccessGranted }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [waitlistMode, setWaitlistMode] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistRole, setWaitlistRole] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate validation delay
    await new Promise((r) => setTimeout(r, 800));

    if (VALID_CODES.includes(code.trim().toUpperCase())) {
      localStorage.setItem('buildsignal_beta_access', 'granted');
      localStorage.setItem('buildsignal_beta_date', new Date().toISOString());
      onAccessGranted();
    } else {
      setError('Invalid access code. Please try again or join the waitlist.');
    }

    setLoading(false);
  };

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    // Store waitlist signup
    const waitlist = JSON.parse(localStorage.getItem('buildsignal_waitlist') || '[]');
    waitlist.push({
      email: waitlistEmail,
      role: waitlistRole,
      date: new Date().toISOString(),
    });
    localStorage.setItem('buildsignal_waitlist', JSON.stringify(waitlist));
    setWaitlistSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent-indigo flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent-indigo/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-ink-primary mb-2">BuildSignal</h1>
          <p className="text-sm text-ink-secondary">Private Beta Access</p>
        </div>

        {!waitlistMode ? (
          <div className="bg-surface rounded-2xl p-6 shadow-card border border-ink-wash">
            <h2 className="text-lg font-semibold text-ink-primary mb-2">Enter Access Code</h2>
            <p className="text-sm text-ink-secondary mb-5">
              BuildSignal is currently in private beta. Enter your invite code to access the platform.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. BETA2026"
                  className="w-full px-4 py-3 rounded-xl bg-canvas border border-ink-wash text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-accent-indigo/30 focus:border-accent-indigo text-center text-lg font-mono tracking-wider"
                  autoFocus
                />
                {error && (
                  <p className="text-xs text-accent-crimson mt-2 text-center">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!code.trim() || loading}
                className="w-full py-3 rounded-xl bg-accent-indigo text-white font-medium flex items-center justify-center gap-2 hover:bg-accent-indigo/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Access Platform <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-ink-wash text-center">
              <p className="text-sm text-ink-secondary">
                Don&apos;t have a code?{' '}
                <button
                  onClick={() => { setWaitlistMode(true); setError(''); }}
                  className="text-accent-indigo font-medium hover:underline"
                >
                  Join the waitlist
                </button>
              </p>
            </div>
          </div>
        ) : waitlistSubmitted ? (
          <div className="bg-surface rounded-2xl p-6 shadow-card border border-ink-wash text-center">
            <CheckCircle className="w-12 h-12 text-accent-teal mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-ink-primary mb-2">You&apos;re on the list!</h2>
            <p className="text-sm text-ink-secondary mb-4">
              We&apos;ll email you at <strong>{waitlistEmail}</strong> when access is available.
            </p>
            <button
              onClick={() => { setWaitlistMode(false); setWaitlistSubmitted(false); }}
              className="text-accent-indigo text-sm font-medium hover:underline"
            >
              Back to access code
            </button>
          </div>
        ) : (
          <div className="bg-surface rounded-2xl p-6 shadow-card border border-ink-wash">
            <h2 className="text-lg font-semibold text-ink-primary mb-2">Join the Waitlist</h2>
            <p className="text-sm text-ink-secondary mb-5">
              Get early access to BuildSignal. We&apos;re onboarding new users weekly.
            </p>

            <form onSubmit={handleWaitlist} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink-secondary mb-1.5">Email</label>
                <input
                  type="email"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-canvas border border-ink-wash text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-accent-indigo/30 focus:border-accent-indigo"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-secondary mb-1.5">Role</label>
                <select
                  value={waitlistRole}
                  onChange={(e) => setWaitlistRole(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-canvas border border-ink-wash text-ink-primary focus:outline-none focus:ring-2 focus:ring-accent-indigo/30 focus:border-accent-indigo"
                >
                  <option value="">Select your role</option>
                  <option value="general_contractor">General Contractor</option>
                  <option value="subcontractor">Subcontractor</option>
                  <option value="supplier">Supplier/Material Provider</option>
                  <option value="developer">Developer</option>
                  <option value="architect">Architect/Designer</option>
                  <option value="consultant">Consultant</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-accent-indigo text-white font-medium hover:bg-accent-indigo/90 transition-colors"
              >
                Join Waitlist
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-ink-wash text-center">
              <button
                onClick={() => setWaitlistMode(false)}
                className="text-accent-indigo text-sm font-medium hover:underline"
              >
                I have an access code
              </button>
            </div>
          </div>
        )}

        {/* Trust footer */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-ink-tertiary">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" /> SOC 2 Compliant
          </span>
          <span className="w-1 h-1 rounded-full bg-ink-wash" />
          <span>GDPR Ready</span>
          <span className="w-1 h-1 rounded-full bg-ink-wash" />
          <span>Encrypted</span>
        </div>
      </div>
    </div>
  );
}
