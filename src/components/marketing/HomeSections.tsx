// Home mid/trust sections (extracted verbatim from Home.tsx, m1(24C)).
import {
  Mail, Phone, Shield, Lock, Eye,
  MapPin, FileText, BarChart3, Users, Zap,
  Download, Building2, LocateFixed, Mountain, Handshake,
} from "lucide-react";

const capabilities = [
  { icon: MapPin, title: "County Coverage", description: "Monitor construction activity across covered US counties with daily data aggregation and automated coverage expansion." },
  { icon: FileText, title: "Permit Tracking", description: "Track municipal building permits as they are published. Filter by type, value, and geography to find relevant opportunities." },
  { icon: BarChart3, title: "AI Predictions", description: "Machine learning models forecast construction surges with confidence scores. Methodology documented and transparent." },
  { icon: Users, title: "User Analytics", description: "Per-account metrics and reporting dashboards. Track your research activity, saved searches, and team engagement." },
  { icon: Zap, title: "ROI Tools", description: "Investment analysis and market comparison tools. Evaluate opportunity costs and projected returns across target regions." },
  { icon: Download, title: "Reports", description: "Generate intelligence briefs with charts and narrative summaries from your dashboard." },
];

const useCases = [
  { icon: Building2, title: "Commercial Real Estate", description: "Spot emerging submarkets before land prices surge. Track permit velocity, zoning changes, and infrastructure investments across your target regions to identify development opportunities early." },
  { icon: LocateFixed, title: "Site Selection", description: "Deliver data-backed location recommendations with confidence scores. Compare markets on growth trajectory, labor availability, and regulatory climate to make informed decisions." },
  { icon: Mountain, title: "Land Investors", description: "Identify counties with accelerating construction activity. Get early signals on where demand is heating up so you can acquire ahead of the curve and maximize returns." },
  { icon: Handshake, title: "Commercial Brokers", description: "Know which markets are primed for leasing activity before your competitors. Use permit data to time your outreach and win more listings in high-growth areas." },
];

export function HomeCapabilities() {
  return (
    <section className="py-20 md:py-28 bg-canvas">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">
            <Zap className="w-4 h-4" /><span>Platform Capabilities</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">What BuildSignal Delivers</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">Core capabilities of the platform. Actual coverage and performance metrics are available to authenticated users.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap) => (
            <div key={cap.title} className="bg-surface border border-border rounded-2xl p-6 hover:border-emerald-500/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                <cap.icon className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-ink mb-2">{cap.title}</h3>
              <p className="text-muted leading-relaxed">{cap.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeUseCases() {
  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">
            <Users className="w-4 h-4" /><span>Use Cases</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">Built for Every Player in the Construction Ecosystem</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {useCases.map((uc) => (
            <div key={uc.title} className="bg-canvas border border-border rounded-2xl p-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                <uc.icon className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-ink mb-2">{uc.title}</h3>
              <p className="text-muted leading-relaxed">{uc.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeTrust() {
  return (
    <section className="py-20 md:py-28 bg-canvas border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">Trust and Contact</h2>
          <p className="text-lg text-muted">Enterprise-Grade Security and Support</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: "SOC 2 Type II (In Progress)", desc: "Security controls aligned to SOC 2 Type II. Certification audit not yet completed — not verified." },
            { icon: Lock, title: "256-bit Encryption", desc: "AES-256 encryption at rest and in transit. Your data is never sold or shared with third parties." },
            { icon: Eye, title: "No Data Selling", desc: "We never sell, rent, or share your proprietary data with external parties. Your intelligence stays yours." },
            { icon: Mail, title: "Email Support", desc: "Reach our team at support@buildsignal.net. We typically respond within one business day." },
            { icon: Phone, title: "Phone Support", desc: "Available for Business plan customers. Contact support to schedule a call with our team." },
            { icon: FileText, title: "Contact Page", desc: "Visit our contact page for general inquiries, partnership requests, and media relations." },
          ].map((item) => (
            <div key={item.title} className="bg-surface border border-border rounded-2xl p-6">
              <item.icon className="w-6 h-6 text-emerald-400 mb-3" />
              <h3 className="text-lg font-semibold text-ink mb-2">{item.title}</h3>
              <p className="text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
