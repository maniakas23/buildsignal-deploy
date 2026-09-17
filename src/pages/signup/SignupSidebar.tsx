// Signup sidebar (extracted verbatim from SignupPage for m1(24C)).
import {
  Lock,
  Shield,
  Check,
  Zap,
  Sparkles,
  TrendingUp,
  Database,
  BrainCircuit,
  FileText,
} from "lucide-react";

export function SignupSidebar() {
  return (
    <div className="hidden lg:block">
      <div className="sticky top-8 space-y-6">
        {/* Value Proposition */}
        <div className="bg-gradient-to-br from-[var(--bs-action)]/8 to-[var(--bs-action)]/4 border border-[var(--bs-action)]/15 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-[var(--bs-action)]" />
            <span className="font-semibold text-[var(--bs-text-primary)]">Why BuildSignal?</span>
          </div>
          <ul className="space-y-2 text-sm text-[var(--bs-text-tertiary)]">
            <li className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[var(--bs-intelligence)] shrink-0" />
              AI-powered trend analysis across construction markets
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[var(--bs-intelligence)] shrink-0" />
              Streamline market research with automated intelligence gathering
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[var(--bs-intelligence)] shrink-0" />
              Bank-grade security &amp; SOC 2 program in progress
            </li>
          </ul>
        </div>

        {/* Trial truth box (m1(24C): must match the certified
            commercial contract — 14-day trial, $0 today, no card) */}
        <div className="bg-[var(--bs-action)]/4 border border-[var(--bs-action)]/10 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-[var(--bs-action)]" />
            <span className="font-semibold text-[var(--bs-text-primary)]">Start with a 14-Day Free Trial</span>
          </div>
          <p className="text-sm text-[var(--bs-text-tertiary)]">
            $0 today — no credit card required. Billing begins only after
            your trial at your plan's monthly price. Cancel anytime.
          </p>
        </div>

        {/* Platform Trust Signals */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[var(--bs-text-tertiary)] uppercase tracking-wide">
            Why professionals trust BuildSignal
          </h3>

          <div className="bg-[var(--bs-surface)] border border-[var(--bs-border)] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-[var(--bs-action)]" />
              <span className="font-medium text-sm text-[var(--bs-text-primary)]">Real-time data coverage</span>
            </div>
            <p className="text-xs text-[var(--bs-text-tertiary)]">
              Multi-county permit monitoring from municipal sources. Daily updates on construction activity across target markets.
            </p>
          </div>

          <div className="bg-[var(--bs-surface)] border border-[var(--bs-border)] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BrainCircuit className="h-4 w-4 text-[var(--bs-action)]" />
              <span className="font-medium text-sm text-[var(--bs-text-primary)]">Transparent AI methodology</span>
            </div>
            <p className="text-xs text-[var(--bs-text-tertiary)]">
              Confidence scores on every prediction. Model performance published monthly. No black boxes.
            </p>
          </div>

          <div className="bg-[var(--bs-surface)] border border-[var(--bs-border)] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-[var(--bs-intelligence)]" />
              <span className="font-medium text-sm text-[var(--bs-text-primary)]">Enterprise-grade security</span>
            </div>
            <p className="text-xs text-[var(--bs-text-tertiary)]">
              SOC 2 Type II program in progress. 256-bit AES encryption. SSO &amp; SAML 2.0 ready. Data never sold.
            </p>
          </div>

          <div className="bg-[var(--bs-surface)] border border-[var(--bs-border)] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-[var(--bs-action)]" />
              <span className="font-medium text-sm text-[var(--bs-text-primary)]">See a sample report</span>
            </div>
            <p className="text-xs text-[var(--bs-text-tertiary)] mb-2">
              Preview the intelligence BuildSignal delivers — real opportunity analysis, confidence scores, and market trends.
            </p>
            <button
              onClick={() => window.open("/sample-report", "_blank")}
              className="text-xs text-[var(--bs-action)] hover:underline font-medium"
            >
              View sample report →
            </button>
          </div>
        </div>

        {/* Security Badges */}
        <div className="bg-[var(--bs-canvas)] rounded-xl p-4 border border-[var(--bs-border)]">
          <h3 className="text-sm font-semibold text-[var(--bs-text-primary)] mb-3">Your data is safe</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-[var(--bs-text-tertiary)]">
              <Lock className="h-4 w-4 text-[var(--bs-intelligence)]" />
              256-bit SSL encryption
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--bs-text-tertiary)]">
              <Shield className="h-4 w-4 text-[var(--bs-intelligence)]" />
              Your data is never sold
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--bs-text-tertiary)]">
              <Check className="h-4 w-4 text-[var(--bs-intelligence)]" />
              SOC 2 Type II (In Progress)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
