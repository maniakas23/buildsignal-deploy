import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { trackEvent } from '@/hooks/useTelemetry';
import {
  Signal, ArrowRight, Check, Shield, Lock, Eye,
  TrendingUp, Clock, Globe, AlertTriangle, Loader2,
  Building2, HardHat, Zap, Briefcase
} from 'lucide-react';

const BENEFITS = [
  { icon: TrendingUp, text: 'Detect projects 60-90 days early' },
  { icon: Clock, text: 'Setup in under 5 minutes' },
  { icon: Globe, text: '3,100+ US counties covered' },
  { icon: Shield, text: 'SOC 2 Type II compliant' },
];

export default function SignupPage() {
  const { setCurrentPage, addToast } = useStore();
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    agreeTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.company.trim()) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }
    if (!form.email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    if (!form.agreeTerms) {
      addToast('Please agree to the terms of service.', 'error');
      return;
    }

    setIsSubmitting(true);
    trackEvent('signup_start', {
      name: form.name,
      email: form.email,
      company: form.company,
      role: form.role,
    });

    // Simulate signup delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      addToast('Account created successfully! Welcome to BuildSignal.', 'success');
      // Auto-redirect to onboarding
      setTimeout(() => {
        setCurrentPage('onboarding');
      }, 1500);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-accent-teal/10 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-accent-teal" />
          </div>
          <h1 className="text-xl font-semibold text-ink-primary mb-2">
            Welcome to BuildSignal
          </h1>
          <p className="text-sm text-ink-secondary mb-6">
            Your account is ready. Let us get you set up to find your first opportunity.
          </p>
          <button
            onClick={() => setCurrentPage('onboarding')}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-indigo text-white text-sm font-semibold hover:bg-accent-indigo-dim transition-all"
          >
            Start Onboarding
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left: Benefits panel */}
      <div className="hidden lg:flex lg:w-[420px] bg-surface border-r border-ink-wash flex-col justify-center px-10 py-12">
        <div className="flex items-center gap-2 mb-8">
          <Signal className="w-6 h-6 text-accent-indigo" />
          <span className="text-lg font-semibold text-ink-primary tracking-tight">BuildSignal</span>
        </div>

        <h2 className="text-2xl font-semibold text-ink-primary mb-3 leading-tight">
          Start Finding Construction Projects Before Your Competitors
        </h2>
        <p className="text-sm text-ink-secondary mb-8 leading-relaxed">
          Join thousands of construction professionals who use BuildSignal to discover opportunities 60-90 days ahead of the market.
        </p>

        <div className="space-y-4 mb-8">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-accent-indigo" />
                </div>
                <span className="text-sm text-ink-secondary">{b.text}</span>
              </div>
            );
          })}
        </div>

        {/* Trust badges */}
        <div className="flex items-center gap-4 text-[10px] text-ink-tertiary">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" /> AES-256 Encrypted
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" /> Transparent AI
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" /> SOC 2
          </span>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <Signal className="w-6 h-6 text-ink-primary" />
            <span className="text-lg font-semibold text-ink-primary tracking-tight">BuildSignal</span>
          </div>

          <h1 className="text-xl font-semibold text-ink-primary mb-1">
            Create Your Account
          </h1>
          <p className="text-sm text-ink-secondary mb-6">
            14-day free trial. No credit card required.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-ink-primary mb-1.5">
                Full Name <span className="text-accent-crimson">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Smith"
                className="w-full px-4 py-3 rounded-xl bg-canvas border border-ink-wash text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-accent-indigo/50 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-ink-primary mb-1.5">
                Work Email <span className="text-accent-crimson">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl bg-canvas border border-ink-wash text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-accent-indigo/50 transition-colors"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-xs font-medium text-ink-primary mb-1.5">
                Company <span className="text-accent-crimson">*</span>
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Your company name"
                className="w-full px-4 py-3 rounded-xl bg-canvas border border-ink-wash text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-accent-indigo/50 transition-colors"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-medium text-ink-primary mb-1.5">
                Your Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-canvas border border-ink-wash text-sm text-ink-primary focus:outline-none focus:border-accent-indigo/50 transition-colors"
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

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agreeTerms}
                onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
                className="w-4 h-4 rounded border-ink-wash text-accent-indigo mt-0.5 accent-accent-indigo"
              />
              <span className="text-xs text-ink-secondary leading-relaxed">
                I agree to the{' '}
                <button type="button" className="text-accent-indigo hover:underline">Terms of Service</button>
                {' '}and{' '}
                <button type="button" className="text-accent-indigo hover:underline">Privacy Policy</button>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent-indigo text-white text-sm font-semibold hover:bg-accent-indigo-dim transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent-indigo/15"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating your account...
                </>
              ) : (
                <>
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-ink-wash" />
            <span className="text-[11px] text-ink-tertiary">or</span>
            <div className="flex-1 h-px bg-ink-wash" />
          </div>

          {/* Login link */}
          <button
            onClick={() => setCurrentPage('login')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-canvas border border-ink-wash text-sm font-medium text-ink-secondary hover:bg-surface transition-all"
          >
            Already have an account? Sign in
          </button>

          {/* Trust microcopy */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-5 text-[10px] text-ink-tertiary">
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3 text-accent-teal" /> 14-day free trial
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3 text-accent-teal" /> No credit card
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3 text-accent-teal" /> Cancel anytime
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
