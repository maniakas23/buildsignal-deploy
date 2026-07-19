import { useState } from 'react';
import { Shield, CheckCircle2, XCircle, AlertTriangle, Clock, ChevronRight, Lock, FileText, Zap, Server } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-11: API Certification Badges
// Visual certification status for every public API endpoint.
// ═══════════════════════════════════════════════════════════════

interface ApiEndpoint {
  id: string;
  method: string;
  path: string;
  name: string;
  category: string;
  certified: boolean;
  auth: boolean;
  validation: boolean;
  pagination: boolean;
  caching: boolean;
  latency: string;
  status: 'certified' | 'pending' | 'failed';
}

const ENDPOINTS: ApiEndpoint[] = [
  { id: 'e1', method: 'GET', path: '/api/health', name: 'Health Check', category: 'System', certified: true, auth: false, validation: true, pagination: false, caching: true, latency: '12ms', status: 'certified' },
  { id: 'e2', method: 'GET', path: '/api/version', name: 'Version', category: 'System', certified: true, auth: false, validation: true, pagination: false, caching: true, latency: '8ms', status: 'certified' },
  { id: 'e3', method: 'GET', path: '/api/ready', name: 'Ready Check', category: 'System', certified: true, auth: false, validation: true, pagination: false, caching: false, latency: '45ms', status: 'certified' },
  { id: 'e4', method: 'GET', path: '/api/auth/status', name: 'Auth Status', category: 'Auth', certified: true, auth: true, validation: true, pagination: false, caching: false, latency: '23ms', status: 'certified' },
  { id: 'e5', method: 'POST', path: '/api/auth/login', name: 'Login', category: 'Auth', certified: true, auth: false, validation: true, pagination: false, caching: false, latency: '89ms', status: 'certified' },
  { id: 'e6', method: 'POST', path: '/api/auth/logout', name: 'Logout', category: 'Auth', certified: true, auth: true, validation: true, pagination: false, caching: false, latency: '15ms', status: 'certified' },
  { id: 'e7', method: 'GET', path: '/api/signals/list', name: 'List Signals', category: 'Signals', certified: true, auth: true, validation: true, pagination: true, caching: true, latency: '120ms', status: 'certified' },
  { id: 'e8', method: 'GET', path: '/api/recommendations/list', name: 'List Recommendations', category: 'Signals', certified: true, auth: true, validation: true, pagination: true, caching: true, latency: '156ms', status: 'certified' },
  { id: 'e9', method: 'GET', path: '/api/zones/list', name: 'List Zones', category: 'Zones', certified: true, auth: true, validation: true, pagination: true, caching: true, latency: '98ms', status: 'certified' },
  { id: 'e10', method: 'GET', path: '/api/alerts/list', name: 'List Alerts', category: 'Alerts', certified: true, auth: true, validation: true, pagination: true, caching: true, latency: '67ms', status: 'certified' },
  { id: 'e11', method: 'POST', path: '/api/alerts/ack', name: 'Acknowledge Alert', category: 'Alerts', certified: true, auth: true, validation: true, pagination: false, caching: false, latency: '34ms', status: 'certified' },
  { id: 'e12', method: 'GET', path: '/api/patterns/list', name: 'List Patterns', category: 'Patterns', certified: true, auth: true, validation: true, pagination: true, caching: true, latency: '112ms', status: 'certified' },
  { id: 'e13', method: 'GET', path: '/api/summary', name: 'Summary', category: 'Reports', certified: true, auth: true, validation: true, pagination: false, caching: true, latency: '178ms', status: 'certified' },
  { id: 'e14', method: 'GET', path: '/api/search', name: 'Search', category: 'Search', certified: true, auth: true, validation: true, pagination: true, caching: true, latency: '203ms', status: 'certified' },
  { id: 'e15', method: 'GET', path: '/api/map/clusters', name: 'Map Clusters', category: 'Map', certified: true, auth: true, validation: true, pagination: true, caching: true, latency: '245ms', status: 'certified' },
  { id: 'e16', method: 'GET', path: '/api/providers/status', name: 'Provider Status', category: 'Ops', certified: true, auth: true, validation: true, pagination: false, caching: false, latency: '56ms', status: 'certified' },
  { id: 'e17', method: 'GET', path: '/api/billing/info', name: 'Billing Info', category: 'Billing', certified: true, auth: true, validation: true, pagination: false, caching: false, latency: '34ms', status: 'certified' },
  { id: 'e18', method: 'GET', path: '/api/settings', name: 'Settings', category: 'Settings', certified: true, auth: true, validation: true, pagination: false, caching: false, latency: '28ms', status: 'certified' },
  { id: 'e19', method: 'POST', path: '/api/feedback', name: 'Submit Feedback', category: 'Support', certified: true, auth: false, validation: true, pagination: false, caching: false, latency: '42ms', status: 'certified' },
  { id: 'e20', method: 'GET', path: '/api/telemetry', name: 'Telemetry', category: 'Ops', certified: true, auth: true, validation: true, pagination: true, caching: false, latency: '67ms', status: 'certified' },
];

const CATEGORIES = Array.from(new Set(ENDPOINTS.map((e) => e.category)));

export default function ApiCertification() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);

  const filtered = activeCategory === 'All' ? ENDPOINTS : ENDPOINTS.filter((e) => e.category === activeCategory);
  const certified = ENDPOINTS.filter((e) => e.status === 'certified').length;
  const pending = ENDPOINTS.filter((e) => e.status === 'pending').length;
  const failed = ENDPOINTS.filter((e) => e.status === 'failed').length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-accent-teal" />
          <span className="text-sm font-medium text-accent-teal">{certified}/{ENDPOINTS.length}</span>
          <span className="text-xs text-ink-tertiary">certified</span>
        </div>
        {pending > 0 && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-accent-amber" />
            <span className="text-sm font-medium text-accent-amber">{pending}</span>
            <span className="text-xs text-ink-tertiary">pending</span>
          </div>
        )}
        {failed > 0 && (
          <div className="flex items-center gap-1.5">
            <XCircle className="w-4 h-4 text-accent-crimson" />
            <span className="text-sm font-medium text-accent-crimson">{failed}</span>
            <span className="text-xs text-ink-tertiary">failed</span>
          </div>
        )}
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button onClick={() => setActiveCategory('All')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${activeCategory === 'All' ? 'bg-accent-indigo text-white' : 'bg-canvas text-ink-secondary hover:bg-accent-indigo/10'}`}>
          All ({ENDPOINTS.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = ENDPOINTS.filter((e) => e.category === cat).length;
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${activeCategory === cat ? 'bg-accent-indigo text-white' : 'bg-canvas text-ink-secondary hover:bg-accent-indigo/10'}`}>
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Endpoint list */}
      <div className="space-y-1.5">
        {filtered.map((ep) => {
          const isExpanded = expandedEndpoint === ep.id;
          return (
            <div key={ep.id}
              className={`rounded-lg border transition-colors ${
                ep.status === 'certified' ? 'bg-surface border-ink-wash' :
                ep.status === 'pending' ? 'bg-accent-amber/[0.02] border-accent-amber/15' :
                'bg-accent-crimson/[0.02] border-accent-crimson/15'
              }`}>
              <button onClick={() => setExpandedEndpoint(isExpanded ? null : ep.id)} className="w-full flex items-center gap-3 p-2.5 text-left">
                {ep.status === 'certified' && <CheckCircle2 className="w-4 h-4 text-accent-teal flex-shrink-0" />}
                {ep.status === 'pending' && <Clock className="w-4 h-4 text-accent-amber flex-shrink-0" />}
                {ep.status === 'failed' && <XCircle className="w-4 h-4 text-accent-crimson flex-shrink-0" />}
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  ep.method === 'GET' ? 'bg-accent-teal/10 text-accent-teal' :
                  ep.method === 'POST' ? 'bg-accent-indigo/10 text-accent-indigo' :
                  'bg-accent-amber/10 text-accent-amber'
                }`}>{ep.method}</span>
                <span className="text-xs font-mono text-ink-primary flex-1 truncate">{ep.path}</span>
                <span className="text-xs text-ink-secondary hidden sm:block">{ep.name}</span>
                <span className="text-[10px] font-mono text-ink-tertiary">{ep.latency}</span>
                {isExpanded ? <ChevronRight className="w-3 h-3 text-ink-tertiary rotate-90" /> : <ChevronRight className="w-3 h-3 text-ink-tertiary" />}
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-ink-wash">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2">
                    <CertBadge icon={<Lock className="w-3 h-3" />} label="Auth" passed={ep.auth} />
                    <CertBadge icon={<FileText className="w-3 h-3" />} label="Validation" passed={ep.validation} />
                    <CertBadge icon={<Server className="w-3 h-3" />} label="Pagination" passed={ep.pagination} />
                    <CertBadge icon={<Zap className="w-3 h-3" />} label="Caching" passed={ep.caching} />
                    <CertBadge icon={<Clock className="w-3 h-3" />} label="< 300ms" passed={parseInt(ep.latency) < 300} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CertBadge({ icon, label, passed }: { icon: React.ReactNode; label: string; passed: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded ${passed ? 'bg-accent-teal/[0.04]' : 'bg-accent-crimson/[0.04]'}`}>
      <span className={passed ? 'text-accent-teal' : 'text-accent-crimson'}>{icon}</span>
      <span className={`text-[10px] font-medium ${passed ? 'text-accent-teal' : 'text-accent-crimson'}`}>{label}</span>
      {passed ? <CheckCircle2 className="w-3 h-3 text-accent-teal ml-auto" /> : <AlertTriangle className="w-3 h-3 text-accent-crimson ml-auto" />}
    </div>
  );
}
