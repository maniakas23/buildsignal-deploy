import { Shield, Lock, Eye, Server, FileCheck, KeyRound, Globe, MonitorCheck } from 'lucide-react';

// m1(35): every item below is a presently implemented, verifiable control.
// No certification, audit-status, SLA, or compliance-program claims appear on
// this page — BuildSignal holds none and none may be implied.
const SECURITY_PRACTICES = [
  { name: 'Encrypted Transport', description: 'All traffic served over HTTPS with TLS 1.3', icon: <Lock className="w-5 h-5 text-accent-teal" /> },
  { name: 'Encryption at Rest', description: 'AES-256 encryption for stored data via our platform provider', icon: <Shield className="w-5 h-5 text-accent-indigo" /> },
  { name: 'Signed Webhooks', description: 'Every Stripe webhook is signature-verified before processing', icon: <FileCheck className="w-5 h-5 text-accent-amber" /> },
  { name: 'Tenant Isolation', description: 'Every query is scoped to your organization — no cross-account access', icon: <Eye className="w-5 h-5 text-accent-crimson" /> },
];

const SECURITY_FEATURES = [
  { title: 'Encryption in Transit & at Rest', description: 'TLS 1.3 for data in transit; AES-256 for data at rest', icon: <Lock className="w-5 h-5" /> },
  { title: 'Authenticated API Access', description: 'Every API request requires a valid signed credential', icon: <Shield className="w-5 h-5" /> },
  { title: 'Webhook Signature Verification', description: 'Billing webhooks are cryptographically verified and processed in event order', icon: <FingerprintPlaceholder /> },
  { title: 'Rate-Limited Authentication', description: 'Login and registration endpoints are rate-limited and fail closed', icon: <KeyRound className="w-5 h-5" /> },
  { title: 'Single-Use Password Reset', description: 'Reset links expire after 45 minutes and can be used only once', icon: <Globe className="w-5 h-5" /> },
  { title: 'Organization Access Controls', description: 'Account access is scoped to organization membership and roles', icon: <Server className="w-5 h-5" /> },
  { title: 'Operational Monitoring', description: 'Data ingestion and platform health are continuously monitored', icon: <MonitorCheck className="w-5 h-5" /> },
  { title: 'Account Deletion', description: 'You can permanently delete your account and personal data', icon: <Eye className="w-5 h-5" /> },
];

// Icon wrapper keeps the diff small without claiming anything.
function FingerprintPlaceholder() {
  return <FileCheck className="w-5 h-5" />;
}

const PRIVACY_COMMITMENTS = [
  'We never sell your data to third parties',
  'You own your data — delete your account at any time',
  'Transparent AI — every recommendation shows its sources',
  'Minimum data collection — we only gather what we need',
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero */}
      <section className="bg-surface border-b border-ink-wash">
        <div className="max-w-content mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-indigo/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent-indigo" />
            </div>
            <span className="text-xs text-ink-tertiary uppercase tracking-wider">Security</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary mb-3">
            Your Data Security Is Our Priority
          </h1>
          <p className="text-sm text-ink-secondary leading-relaxed max-w-2xl">
            This page describes the security controls BuildSignal has implemented and operates today.
            Each control listed here is live in production.
          </p>
        </div>
      </section>

      {/* Security Practices */}
      <section className="max-w-content mx-auto px-6 py-10">
        <h2 className="text-lg font-semibold text-ink-primary mb-5">Security Practices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SECURITY_PRACTICES.map((cert) => (
            <div key={cert.name} className="bg-surface rounded-2xl p-5 shadow-card border border-ink-wash text-center">
              <div className="w-10 h-10 rounded-xl bg-accent-indigo/[0.06] flex items-center justify-center mx-auto mb-3">
                {cert.icon}
              </div>
              <h3 className="text-sm font-semibold text-ink-primary mb-1">{cert.name}</h3>
              <p className="text-xs text-ink-secondary">{cert.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security Features */}
      <section className="bg-surface border-y border-ink-wash">
        <div className="max-w-content mx-auto px-6 py-10">
          <h2 className="text-lg font-semibold text-ink-primary mb-5">Security Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SECURITY_FEATURES.map((feat) => (
              <div key={feat.title} className="p-4 rounded-xl bg-canvas border border-ink-wash">
                <div className="text-accent-indigo mb-2">{feat.icon}</div>
                <h3 className="text-sm font-medium text-ink-primary mb-1">{feat.title}</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Commitments */}
      <section className="max-w-content mx-auto px-6 py-10">
        <h2 className="text-lg font-semibold text-ink-primary mb-5">Privacy Commitments</h2>
        <div className="bg-surface rounded-2xl p-6 shadow-card border border-ink-wash">
          <div className="space-y-3">
            {PRIVACY_COMMITMENTS.map((commitment, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-accent-teal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileCheck className="w-3 h-3 text-accent-teal" />
                </div>
                <p className="text-sm text-ink-secondary">{commitment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparent AI */}
      <section className="bg-surface border-y border-ink-wash">
        <div className="max-w-content mx-auto px-6 py-10">
          <h2 className="text-lg font-semibold text-ink-primary mb-3">Transparent AI</h2>
          <p className="text-sm text-ink-secondary leading-relaxed mb-4 max-w-2xl">
            BuildSignal&apos;s AI models are designed for transparency. Every recommendation includes 
            a confidence breakdown showing signal counts, source diversity, and data freshness.
            You can always see why an opportunity was flagged and what data supports it.
          </p>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent-indigo" />
            <span className="text-xs text-ink-secondary">No black-box predictions. Full evidence trail for every recommendation.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
