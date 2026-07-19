import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import {
  X, Signal, BarChart3, FolderOpen, MapPin, Search, Bookmark,
  TrendingUp, Layers, Bell, BookOpen, FileText, Lightbulb,
  Shield, Radio, Globe, Cpu, Activity, Award, Rocket, Brain, Building2,
  ClipboardList, FileCheck, CheckCircle2, PackageCheck,
  Sparkles, Globe2, CreditCard, HelpCircle, UserCircle, Zap,
  Settings, LogIn, LogOut, Menu, Briefcase
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// ═══════════════════════════════════════════════════════════════
// Mobile Navigation Drawer
// Full-featured slide-out menu giving mobile users access to
// all 47 pages organized by category.
// ═══════════════════════════════════════════════════════════════

interface NavGroup {
  label: string;
  items: { id: string; label: string; icon: React.ReactNode }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Primary',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4.5 h-4.5" /> },
      { id: 'portfolio', label: 'Portfolio', icon: <Briefcase className="w-4.5 h-4.5" /> },
      { id: 'projects', label: 'Projects', icon: <FolderOpen className="w-4.5 h-4.5" /> },
      { id: 'map', label: 'Map', icon: <MapPin className="w-4.5 h-4.5" /> },
      { id: 'search', label: 'Search', icon: <Search className="w-4.5 h-4.5" /> },
      { id: 'watchlists', label: 'Watchlists', icon: <Bookmark className="w-4.5 h-4.5" /> },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { id: 'growth-stories', label: 'Growth Stories', icon: <TrendingUp className="w-4.5 h-4.5" /> },
      { id: 'growth-signals', label: 'Growth Signals', icon: <Layers className="w-4.5 h-4.5" /> },
      { id: 'alerts', label: 'Alerts', icon: <Bell className="w-4.5 h-4.5" /> },
      { id: 'summary', label: 'Reports', icon: <BookOpen className="w-4.5 h-4.5" /> },
      { id: 'daily-brief', label: 'Daily Brief', icon: <FileText className="w-4.5 h-4.5" /> },
      { id: 'market-insights', label: 'Insights', icon: <Lightbulb className="w-4.5 h-4.5" /> },
    ],
  },
  {
    label: 'Operations',
    items: [
      { id: 'provider-status', label: 'Providers', icon: <Radio className="w-4.5 h-4.5" /> },
      { id: 'county-coverage', label: 'Counties', icon: <Globe className="w-4.5 h-4.5" /> },
      { id: 'national', label: 'National', icon: <Globe2 className="w-4.5 h-4.5" /> },
      { id: 'operations', label: 'Operations', icon: <Activity className="w-4.5 h-4.5" /> },
      { id: 'intelligence-ops', label: 'Intelligence Ops', icon: <Cpu className="w-4.5 h-4.5" /> },
    ],
  },
  {
    label: 'Launch & Quality',
    items: [
      { id: 'readiness', label: 'RC1 Checklist', icon: <Award className="w-4.5 h-4.5" /> },
      { id: 'rc-validation', label: 'RC2 Validation', icon: <PackageCheck className="w-4.5 h-4.5" /> },
      { id: 'launch-readiness', label: 'Launch Readiness', icon: <Rocket className="w-4.5 h-4.5" /> },
      { id: 'commercial-launch', label: 'Commercial Launch', icon: <Sparkles className="w-4.5 h-4.5" /> },
      { id: 'production-excellence', label: 'Production RC', icon: <Shield className="w-4.5 h-4.5" /> },
      { id: 'production-readiness', label: 'Production Readiness', icon: <Award className="w-4.5 h-4.5" /> },
      { id: 'pricing-revenue', label: 'Pricing & Revenue', icon: <CreditCard className="w-4.5 h-4.5" /> },
      { id: 'enterprise-launch', label: 'Enterprise Launch', icon: <Building2 className="w-4.5 h-4.5" /> },
      { id: 'decision-platform', label: 'Decision Platform', icon: <Brain className="w-4.5 h-4.5" /> },
      { id: 'ai-launch', label: 'AI Launch', icon: <Zap className="w-4.5 h-4.5" /> },
      { id: 'intelligence-excellence', label: 'v1.0 Launch', icon: <Rocket className="w-4.5 h-4.5" /> },
      { id: 'rc-platform', label: 'RC Platform', icon: <Shield className="w-4.5 h-4.5" /> },
      { id: 'system-validation', label: 'QA Validation', icon: <CheckCircle2 className="w-4.5 h-4.5" /> },
      { id: 'release-checklist', label: 'Release Checklist', icon: <ClipboardList className="w-4.5 h-4.5" /> },
      { id: 'validation', label: 'Scorecard', icon: <FileCheck className="w-4.5 h-4.5" /> },
    ],
  },
  {
    label: 'Account',
    items: [
      { id: 'account', label: 'Account', icon: <UserCircle className="w-4.5 h-4.5" /> },
      { id: 'settings', label: 'Settings', icon: <Settings className="w-4.5 h-4.5" /> },
      { id: 'pricing', label: 'Pricing', icon: <CreditCard className="w-4.5 h-4.5" /> },
      { id: 'help', label: 'Help Center', icon: <HelpCircle className="w-4.5 h-4.5" /> },
    ],
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavDrawer({ isOpen, onClose }: Props) {
  const { currentPage, setCurrentPage } = useStore();
  const { user, logout } = useAuth();
  const [expandedGroup, setExpandedGroup] = useState<string | null>('Primary');

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleNav = (pageId: string) => {
    setCurrentPage(pageId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-[360px] bg-surface border-l border-ink-wash flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-wash flex-shrink-0">
          <div className="flex items-center gap-2">
            <Signal className="w-5 h-5 text-accent-indigo" />
            <span className="text-sm font-semibold text-ink-primary">BuildSignal</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-ink-wash transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-ink-secondary" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          {NAV_GROUPS.map((group) => {
            const isExpanded = expandedGroup === group.label;
            return (
              <div key={group.label} className="mb-2">
                <button
                  onClick={() => setExpandedGroup(isExpanded ? null : group.label)}
                  className="w-full flex items-center justify-between py-2 text-[11px] font-medium text-ink-tertiary uppercase tracking-wider"
                >
                  {group.label}
                  <span className={`text-ink-tertiary transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {isExpanded && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleNav(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                          currentPage === item.id
                            ? 'bg-accent-indigo/10 text-accent-indigo'
                            : 'text-ink-secondary hover:bg-canvas hover:text-ink-primary'
                        }`}
                      >
                        <span className={currentPage === item.id ? 'text-accent-indigo' : 'text-ink-tertiary'}>
                          {item.icon}
                        </span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer — Auth */}
        <div className="flex-shrink-0 border-t border-ink-wash px-4 py-3 space-y-2">
          {user ? (
            <button
              onClick={() => { logout(); onClose(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-ink-tertiary hover:bg-canvas hover:text-accent-crimson transition-colors"
            >
              <LogOut className="w-4.5 h-4.5" />
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => handleNav('login')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-medium bg-accent-indigo text-white hover:bg-accent-indigo/90 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
