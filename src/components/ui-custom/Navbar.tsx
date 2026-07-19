import { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  Signal, Bell, BookOpen, BarChart3, FolderOpen, Layers, TrendingUp,
  Lightbulb, HelpCircle, CreditCard, Mail, MapPin, LogIn, LogOut,
  Briefcase, Search, Bookmark, UserCircle, FileText, Radio, Cpu,
  Globe, Shield, Award, Rocket, ClipboardList, FileCheck, Activity,
  Globe2, CheckCircle2, PackageCheck, Sparkles, Menu, ChevronDown,
  XCircle, TrendingUp as TrendIcon
} from 'lucide-react';
import { DemoModeBanner } from './EngineStates';
import { track } from '@/hooks/useAnalytics';
import { useAuth } from '@/hooks/useAuth';
import NotificationsPanel from './NotificationsPanel';
import MobileNavDrawer from './MobileNavDrawer';

// ═══════════════════════════════════════════════════════════════
// Responsive Navbar
// Desktop: Primary nav + compact secondary dropdown
// Mobile: Hamburger drawer with full page access + bottom shortcut nav
// ═══════════════════════════════════════════════════════════════

const primaryNav = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'map', label: 'Map', icon: MapPin },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'watchlists', label: 'Watchlists', icon: Bookmark },
  { id: 'growth-stories', label: 'Growth', icon: TrendingUp },
  { id: 'growth-signals', label: 'Signals', icon: Layers },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'summary', label: 'Reports', icon: BookOpen },
  { id: 'daily-brief', label: 'Brief', icon: FileText },
  { id: 'market-insights', label: 'Insights', icon: Lightbulb },
] as const;

const opsLinks = [
  { id: 'provider-status', label: 'Providers', icon: <Radio className="w-3.5 h-3.5" /> },
  { id: 'county-coverage', label: 'Counties', icon: <Globe className="w-3.5 h-3.5" /> },
  { id: 'national', label: 'National', icon: <Globe2 className="w-3.5 h-3.5" /> },
  { id: 'operations', label: 'Operations', icon: <Activity className="w-3.5 h-3.5" /> },
  { id: 'intelligence-ops', label: 'Ops', icon: <Cpu className="w-3.5 h-3.5" /> },
];

const qualityLinks = [
  { id: 'readiness', label: 'RC1', icon: <Award className="w-3.5 h-3.5" /> },
  { id: 'rc-validation', label: 'RC2', icon: <PackageCheck className="w-3.5 h-3.5" /> },
  { id: 'launch-readiness', label: 'Launch', icon: <Rocket className="w-3.5 h-3.5" /> },
  { id: 'commercial-launch', label: 'CLC', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'production-excellence', label: 'RC', icon: <Shield className="w-3.5 h-3.5" /> },
  { id: 'system-validation', label: 'QA', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
];

const miscLinks = [
  { id: 'release-checklist', label: 'Checklist', icon: <ClipboardList className="w-3.5 h-3.5" /> },
  { id: 'validation', label: 'Scorecard', icon: <FileCheck className="w-3.5 h-3.5" /> },
  { id: 'enterprise-ops', label: 'Enterprise', icon: <Cpu className="w-3.5 h-3.5" /> },
  { id: 'patterns', label: 'Patterns', icon: <Activity className="w-3.5 h-3.5" /> },
  { id: 'learning', label: 'Learn', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { id: 'launch-analytics', label: 'Analytics', icon: <TrendIcon className="w-3.5 h-3.5" /> },
  { id: 'admin', label: 'Admin', icon: <Shield className="w-3.5 h-3.5" /> },
];

export default function Navbar() {
  const { currentPage, setCurrentPage, unreadAlertCount } = useStore();
  const { user, logout } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [opsDropdown, setOpsDropdown] = useState(false);
  const [qualityDropdown, setQualityDropdown] = useState(false);
  const [moreDropdown, setMoreDropdown] = useState(false);

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    track({ type: 'page_view', page: pageId });
    // Close all dropdowns
    setOpsDropdown(false);
    setQualityDropdown(false);
    setMoreDropdown(false);
  };

  const closeAllDropdowns = () => {
    setOpsDropdown(false);
    setQualityDropdown(false);
    setMoreDropdown(false);
  };

  return (
    <>
      <DemoModeBanner />

      {/* ─── Desktop + Mobile Top Navbar ─── */}
      <nav className="sticky top-0 z-50 h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 lg:px-6 bg-canvas/80 backdrop-blur-md border-b border-ink-wash">
        {/* Logo */}
        <button
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
        >
          <Signal className="w-5 h-5 sm:w-6 sm:h-6 text-ink-primary" />
          <span className="text-sm sm:text-[16px] font-semibold text-ink-primary tracking-tight">
            BuildSignal
          </span>
        </button>

        {/* Center Nav — Desktop Only */}
        <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 overflow-x-auto mx-2 scrollbar-hide">
          {primaryNav.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={
                currentPage === item.id
                  ? 'flex items-center gap-1.5 px-2 xl:px-3 py-1.5 rounded-lg bg-accent-indigo text-white text-[12px] xl:text-[13px] font-medium whitespace-nowrap transition-colors'
                  : 'flex items-center gap-1.5 px-2 xl:px-3 py-1.5 rounded-lg text-[12px] xl:text-[13px] font-medium text-ink-secondary whitespace-nowrap hover:bg-surface hover:text-ink-primary transition-colors'
              }
            >
              <item.icon className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          {/* Desktop notifications */}
          <div className="hidden md:block">
            <NotificationsPanel />
          </div>

          {/* Desktop secondary nav — grouped dropdowns */}
          <div className="hidden lg:flex items-center gap-0.5">
            {/* Ops dropdown */}
            <div className="relative">
              <button
                onClick={() => { closeAllDropdowns(); setOpsDropdown(!opsDropdown); }}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                  opsLinks.some(l => l.id === currentPage) || opsDropdown
                    ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Ops</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${opsDropdown ? 'rotate-180' : ''}`} />
              </button>
              {opsDropdown && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-surface border border-ink-wash rounded-xl shadow-modal py-1 z-50">
                  {opsLinks.map((link) => (
                    <button key={link.id} onClick={() => handleNavClick(link.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] font-medium transition-colors ${
                        currentPage === link.id ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-secondary hover:bg-canvas hover:text-ink-primary'
                      }`}>
                      {link.icon} {link.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality dropdown */}
            <div className="relative">
              <button
                onClick={() => { closeAllDropdowns(); setQualityDropdown(!qualityDropdown); }}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                  qualityLinks.some(l => l.id === currentPage) || qualityDropdown
                    ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Quality</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${qualityDropdown ? 'rotate-180' : ''}`} />
              </button>
              {qualityDropdown && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-ink-wash rounded-xl shadow-modal py-1 z-50">
                  {qualityLinks.map((link) => (
                    <button key={link.id} onClick={() => handleNavClick(link.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] font-medium transition-colors ${
                        currentPage === link.id ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-secondary hover:bg-canvas hover:text-ink-primary'
                      }`}>
                      {link.icon} {link.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => { closeAllDropdowns(); setMoreDropdown(!moreDropdown); }}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                  miscLinks.some(l => l.id === currentPage) || moreDropdown
                    ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
                }`}
              >
                <Menu className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">More</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${moreDropdown ? 'rotate-180' : ''}`} />
              </button>
              {moreDropdown && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-ink-wash rounded-xl shadow-modal py-1 z-50">
                  {miscLinks.map((link) => (
                    <button key={link.id} onClick={() => handleNavClick(link.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] font-medium transition-colors ${
                        currentPage === link.id ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-secondary hover:bg-canvas hover:text-ink-primary'
                      }`}>
                      {link.icon} {link.label}
                    </button>
                  ))}
                  <div className="border-t border-ink-wash my-1" />
                  <button onClick={() => handleNavClick('pricing')}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] font-medium transition-colors ${
                      currentPage === 'pricing' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-secondary hover:bg-canvas hover:text-ink-primary'
                    }`}>
                    <CreditCard className="w-3.5 h-3.5" /> Pricing
                  </button>
                  <button onClick={() => handleNavClick('help')}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] font-medium transition-colors ${
                      currentPage === 'help' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-secondary hover:bg-canvas hover:text-ink-primary'
                    }`}>
                    <HelpCircle className="w-3.5 h-3.5" /> Help
                  </button>
                  <button onClick={() => handleNavClick('account')}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] font-medium transition-colors ${
                      currentPage === 'account' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-secondary hover:bg-canvas hover:text-ink-primary'
                    }`}>
                    <UserCircle className="w-3.5 h-3.5" /> Account
                  </button>
                  <button onClick={() => handleNavClick('contact')}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] font-medium transition-colors ${
                      currentPage === 'contact' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-secondary hover:bg-canvas hover:text-ink-primary'
                    }`}>
                    <Mail className="w-3.5 h-3.5" /> Contact
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Settings gear — desktop */}
          <button
            onClick={() => handleNavClick('settings')}
            className="hidden md:flex p-2 rounded-full hover:bg-surface transition-colors"
            aria-label="Settings"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-ink-secondary">
              <circle cx="8" cy="8" r="6.5" />
              <circle cx="8" cy="8" r="2.5" />
            </svg>
          </button>

          {/* Desktop auth */}
          {user ? (
            <button
              onClick={() => logout()}
              className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium text-ink-tertiary hover:text-accent-crimson hover:bg-accent-crimson/10 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => handleNavClick('login')}
              className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-accent-indigo text-white hover:bg-accent-indigo/90 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Sign In</span>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-surface transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-ink-secondary" />
          </button>
        </div>
      </nav>

      {/* ─── Mobile Bottom Shortcut Nav ─── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-canvas/95 backdrop-blur-md border-t border-ink-wash flex items-center justify-around"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {[
          { id: 'dashboard', label: 'Home', icon: BarChart3 },
          { id: 'projects', label: 'Projects', icon: FolderOpen },
          { id: 'map', label: 'Map', icon: MapPin },
          { id: 'alerts', label: 'Alerts', icon: Bell },
          { id: 'search', label: 'Search', icon: Search },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[52px] px-1.5 py-1 rounded-lg transition-colors ${
              currentPage === item.id ? 'text-accent-indigo' : 'text-ink-tertiary'
            }`}
            aria-label={item.label}
            aria-current={currentPage === item.id ? 'page' : undefined}
          >
            <item.icon className="w-[18px] h-[18px]" strokeWidth={currentPage === item.id ? 2.5 : 1.5} />
            <span className="text-[9px] font-medium leading-tight">{item.label}</span>
            {item.id === 'alerts' && unreadAlertCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[14px] h-[14px] flex items-center justify-center text-[8px] font-bold bg-accent-crimson text-white rounded-full px-0.5">
                {unreadAlertCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── Mobile Navigation Drawer ─── */}
      <MobileNavDrawer isOpen={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} />

      {/* ─── Click-outside to close dropdowns ─── */}
      {(opsDropdown || qualityDropdown || moreDropdown) && (
        <div className="fixed inset-0 z-40" onClick={closeAllDropdowns} />
      )}
    </>
  );
}
