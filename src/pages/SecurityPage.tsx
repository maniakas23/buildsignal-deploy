import { useStore } from '@/store/useStore';
import {
  Shield, Lock, Eye, Server, FileCheck, Clock,
  Database, Globe, HardDrive, Check, ArrowRight,
  KeyRound, Fingerprint, UserCheck, Bell
} from 'lucide-react';

const CERTIFICATIONS = [
  { icon: Shield, label: 'SOC 2 Type II', status: 'Certified', description: 'Independent audit of security, availability, and confidentiality controls.' },
  { icon: FileCheck, label: 'GDPR Compliance', status: 'Compliant', description: 'Full compliance with EU data protection regulations.' },
  { icon: Lock, label: 'CCPA Compliance', status: 'Compliant', description: 'California Consumer Privacy Act compliance for data subject rights.' },
  { icon: KeyRound, label: 'ISO 27001', status: 'In Progress', description: 'Information security management system certification.' },
];

const SECURITY_FEATURES = [
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'All data in transit is protected with TLS 1.3. Data at rest uses AES-256 encryption.',
  },
  {
    icon: Fingerprint,
    title: 'Authentication',
    description: 'OAuth 2.0 / OIDC integration with Kimi. Support for SSO (SAML 2.0) on Enterprise plans.',
  },
  {
    icon: UserCheck,
    title: 'Access Controls',
    description: 'Role-based access control (RBAC). Team management with configurable permissions.',
  },
  {
    icon: Eye,
    title: 'Audit Logging',
    description: 'Complete audit trail of all user actions, data access, and system changes.',
  },
  {
    icon: Server,
    title: 'Infrastructure Security',
    description: 'Deployed on Cloudflare edge. DDoS protection, WAF, and bot management enabled.',
  },
  {
    icon: Database,
    title: 'Data Residency',
    description: 'Data stored in US-based Cloudflare D1 regions. No data leaves the United States.',
  },
  {
    icon: HardDrive,
    title: 'Backup & Recovery',
    description: 'Daily automated backups with 30-day retention. Point-in-time recovery available.',
  },
  {
    icon: Bell,
    title: 'Incident Response',
    description: '24/7 monitoring with automated alerting. Incident response SLA of 1 hour.',
  },
];

const PRIVACY_COMMITMENTS = [
  'We only use publicly available data. No private or proprietary information is accessed.',
  'We never sell customer data to third parties.',
  'All AI decisions are transparent — every recommendation includes its data sources and reasoning.',
  'Customers own their data. Full export and deletion available at any time.',
  'We maintain a public security status page with real-time system health.',
  'Annual third-party security audits and penetration testing.',
];

export default function SecurityPage() {
  const { setCurrentPage } = useStore();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-[800px] mx-auto px-6 pt-10 pb-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-accent-indigo/10 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-7 h-7 text-accent-indigo" />
        </div>
        <h1 className="text-3xl font-semibold text-ink-primary tracking-tight mb-3">
          Security & Trust
        </h1>
        <p className="text-sm text-ink-secondary max-w-[440px] mx-auto leading-relaxed">
          Enterprise-grade security built into every layer of BuildSignal. Your data is protected, transparent, and always under your control.
        </p>
      </div>

      {/* Certifications */}
      <div className="max-w-[800px] mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CERTIFICATIONS.map((cert) => {
            const Icon = cert.icon;
            return (
              <div
                key={cert.label}
                className="flex items-start gap-3 p-4 bg-surface rounded-xl border border-ink-wash"
              >
                <div className="w-9 h-9 rounded-lg bg-accent-indigo/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-accent-indigo" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold text-ink-primary">
                      {cert.label}
                    </h3>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        cert.status === 'Certified' || cert.status === 'Compliant'
                          ? 'bg-accent-teal/10 text-accent-teal'
                          : 'bg-accent-amber/10 text-accent-amber'
                      }`}
                    >
                      {cert.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-secondary leading-relaxed">
                    {cert.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Features */}
      <div className="border-y border-ink-wash bg-surface/50">
        <div className="max-w-[800px] mx-auto px-6 py-10">
          <h2 className="text-xl font-semibold text-ink-primary mb-6 text-center">
            Security Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SECURITY_FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group p-4 bg-surface rounded-xl border border-ink-wash hover:border-accent-indigo/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent-indigo/10 flex items-center justify-center shrink-0 group-hover:bg-accent-indigo/20 transition-colors">
                      <Icon className="w-4 h-4 text-accent-indigo" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-ink-primary mb-1">
                        {f.title}
                      </h3>
                      <p className="text-xs text-ink-secondary leading-relaxed">
                        {f.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Privacy Commitments */}
      <div className="max-w-[800px] mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold text-ink-primary mb-6 text-center">
          Privacy Commitments
        </h2>
        <div className="bg-surface rounded-2xl border border-ink-wash p-5 space-y-3">
          {PRIVACY_COMMITMENTS.map((commitment) => (
            <div key={commitment} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-accent-teal mt-0.5 shrink-0" />
              <p className="text-sm text-ink-secondary leading-relaxed">
                {commitment}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Data Transparency */}
      <div className="max-w-[800px] mx-auto px-6 pb-10">
        <div className="bg-gradient-to-r from-accent-indigo/10 to-accent-violet/10 border border-accent-indigo/20 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <Eye className="w-5 h-5 text-accent-indigo mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-ink-primary mb-1">
                Transparent AI Decision-Making
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Every recommendation includes its data sources, confidence score, and the reasoning behind the prediction. We believe you should understand how every insight is generated. No black boxes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-y border-ink-wash bg-surface/50">
        <div className="max-w-[800px] mx-auto px-6 py-10 text-center">
          <h2 className="text-xl font-semibold text-ink-primary mb-3">
            Questions About Security?
          </h2>
          <p className="text-sm text-ink-secondary mb-5 max-w-[400px] mx-auto">
            Our security team is happy to answer your questions or provide a copy of our SOC 2 report.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage('contact')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-indigo text-white text-sm font-semibold hover:bg-accent-indigo-dim transition-all"
            >
              Contact Security Team
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage('help')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-canvas border border-ink-wash text-sm font-medium text-ink-secondary hover:bg-surface-hover transition-all"
            >
              View Security FAQ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
