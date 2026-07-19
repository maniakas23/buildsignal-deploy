import { Shield, Lock, Eye, Server, FileCheck, Fingerprint, Clock, Globe } from 'lucide-react';

const CERTIFICATIONS = [
  { name: 'SOC 2 Type II', description: 'Independent audit of security controls and processes', icon: <FileCheck className="w-5 h-5 text-accent-teal" /> },
  { name: 'GDPR Compliant', description: 'Full compliance with EU data protection regulations', icon: <Shield className="w-5 h-5 text-accent-indigo" /> },
  { name: 'CCPA Ready', description: 'California Consumer Privacy Act compliance', icon: <Eye className="w-5 h-5 text-accent-amber" /> },
  { name: 'ISO 27001', description: 'Information security management certification', icon: <Lock className="w-5 h-5 text-accent-crimson" /> },
];

const SECURITY_FEATURES = [
  { title: 'End-to-End Encryption', description: 'All data encrypted in transit (TLS 1.3) and at rest (AES-256)', icon: <Lock className="w-5 h-5" /> },
  { title: 'Zero-Trust Architecture', description: 'Every request authenticated and authorized, regardless of origin', icon: <Shield className="w-5 h-5" /> },
  { title: 'Regular Penetration Testing', description: 'Quarterly third-party security assessments', icon: <Fingerprint className="w-5 h-5" /> },
  { title: '99.9% Uptime SLA', description: 'Enterprise-grade infrastructure with automatic failover', icon: <Clock className="w-5 h-5" /> },
  { title: 'Data Residency Options', description: 'Choose where your data is stored and processed', icon: <Globe className="w-5 h-5" /> },
  { title: 'Role-Based Access Control', description: 'Granular permissions for team members', icon: <Server className="w-5 h-5" /> },
  { title: 'Audit Logging', description: 'Complete audit trail of all data access and changes', icon: <Eye className="w-5 h-5" /> },
  { title: 'Automated Backups', description: 'Point-in-time recovery with 30-day retention', icon: <FileCheck className="w-5 h-5" /> },
];

const PRIVACY_COMMITMENTS = [
  'We never sell your data to third parties',
  'You own your data — export or delete anytime',
  'Transparent AI — every recommendation shows its sources',
  'Minimum data collection — we only gather what we need',
  'Breach notification within 24 hours',
  'Annual third-party privacy audits',
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
            <span className="text-xs text-ink-tertiary uppercase tracking-wider">Enterprise Security</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary mb-3">
            Your Data Security Is Our Priority
          </h1>
          <p className="text-sm text-ink-secondary leading-relaxed max-w-2xl">
            BuildSignal implements enterprise-grade security controls to protect your data at every layer. 
            We are SOC 2 certified, GDPR compliant, and undergo regular third-party audits.
          </p>
        </div>
      </section>

      {/* Certifications */}
      <section className="max-w-content mx-auto px-6 py-10">
        <h2 className="text-lg font-semibold text-ink-primary mb-5">Certifications & Compliance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CERTIFICATIONS.map((cert) => (
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
            a confidence breakdown showing signal counts, source diversity, historical accuracy, and data freshness.
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
