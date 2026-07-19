import { useStore } from '@/store/useStore';
import { Signal, Bell, BookOpen, BarChart3, FolderOpen, Layers, TrendingUp, Lightbulb, HelpCircle, CreditCard, Mail, MapPin, LogIn, LogOut, Briefcase, Search, Bookmark, UserCircle, FileText, Radio, Cpu, Globe, Shield, Award, TrendingUp as TrendIcon, Rocket, ClipboardList, FileCheck, Activity, Globe2, CheckCircle2, PackageCheck } from 'lucide-react';
import { DemoModeBanner } from './EngineStates';
import { track } from '@/hooks/useAnalytics';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import NotificationsPanel from './NotificationsPanel';

// ─── Customer Navigation ───
// Clean, focused navigation using commercial real estate professional language.
// Dashboard · Projects · Growth · Signals · Alerts · Reports · Insights

const customerNav = [
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

export default function Navbar() {
  const { currentPage, setCurrentPage, unreadAlertCount } = useStore();
  const { user, logout } = useAuth();

  // Track page views for beta analytics
  useEffect(() => {
    track({ type: 'page_view', page: currentPage });
  }, [currentPage]);

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
  };

  return (
    <>
      <DemoModeBanner />
      <nav className="sticky top-0 z-50 h-16 flex items-center justify-between px-4 lg:px-6 bg-canvas/80 backdrop-blur-md border-b border-ink-wash">
        {/* Logo */}
        <button
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
        >
          <Signal className="w-6 h-6 text-ink-primary" />
          <span className="text-[16px] font-semibold text-ink-primary tracking-tight hidden sm:inline">
            BuildSignal
          </span>
        </button>

        {/* Center Nav — Desktop */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2 overflow-x-auto mx-2">
          {customerNav.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={
                currentPage === item.id
                  ? 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-indigo text-white text-[13px] font-medium whitespace-nowrap transition-colors'
                  : 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-ink-secondary whitespace-nowrap hover:bg-surface hover:text-ink-primary transition-colors'
              }
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
              {item.id === 'alerts' && unreadAlertCount > 0 && (
                <span className="ml-0.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-accent-crimson text-white rounded-full">
                  {unreadAlertCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Right Actions — Secondary nav + Settings */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="md:hidden">
            <NotificationsPanel />
          </div>

          {/* Desktop secondary links */}
          <button
            onClick={() => handleNavClick('pricing')}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === 'pricing' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Pricing
          </button>
          <button
            onClick={() => handleNavClick('help')}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === 'help' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Help
          </button>
          <button
            onClick={() => handleNavClick('account')}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === 'account' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
            }`}
          >
            <UserCircle className="w-3.5 h-3.5" />
            Account
          </button>
          <button
            onClick={() => handleNavClick('national')}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === 'national' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            National
          </button>
          <button
            onClick={() => handleNavClick('provider-status')}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === 'provider-status' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Providers
          </button>
          <button
            onClick={() => handleNavClick('county-coverage')}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === 'county-coverage' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Counties
          </button>
          <button
            onClick={() => handleNavClick('admin')}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === 'admin' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </button>
          <button
            onClick={() => handleNavClick('launch-analytics')}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === 'launch-analytics' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
            }`}
          >
            <TrendIcon className="w-3.5 h-3.5" />
            Analytics
          </button>
          <button
            onClick={() => handleNavClick('readiness')}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === 'readiness' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            RC1
          </button>
          <button
            onClick={() => handleNavClick('launch-docs')}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === 'launch-docs' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            Docs
          </button>
          <button
            onClick={() => handleNavClick('gongo')}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === 'gongo' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            Go/NoGo
          </button>
          <button
            onClick={() => handleNavClick('validation')}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === 'validation' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            Validate
          </button>
          <button
            onClick={() => handleNavClick('enterprise-ops')}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === 'enterprise-ops' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Enterprise
          </button>
          <button
            onClick={() => handleNavClick('patterns')}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === 'patterns' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Patterns
          </button>
          <button
            onClick={() => handleNavClick('learning')}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === 'learning' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Learn
          </button>
          <button
            onClick={() => handleNavClick('intelligence-ops')}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === 'intelligence-ops' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Ops
          </button>
          <button
            onClick={() => handleNavClick('operations')}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === 'operations' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Ops
          </button>
          <button
            onClick={() => handleNavClick('release-checklist')}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === 'release-checklist' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            RC
          </button>
          <button
            onClick={() => handleNavClick('system-validation')}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === 'system-validation' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            QA
          </button>
          {/* PI-12: RC Validation */}
          <button
            onClick={() => handleNavClick('rc-validation')}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === 'rc-validation' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            RC2
          </button>
          {/* PI-13: Launch Readiness */}
          <button
            onClick={() => handleNavClick('launch-readiness')}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === 'launch-readiness' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            Launch
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              currentPage === 'contact' ? 'text-accent-indigo bg-accent-indigo/10' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Contact
          </button>

          {/* Desktop notifications */}
          <div className="hidden md:block">
            <NotificationsPanel />
          </div>

          <div className="w-px h-5 bg-ink-wash hidden lg:block mx-1" />

          <button
            onClick={() => handleNavClick('settings')}
            className="p-2 rounded-full hover:bg-surface transition-colors"
            aria-label="Settings"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-ink-secondary">
              <circle cx="8" cy="8" r="6.5" />
              <circle cx="8" cy="8" r="2.5" />
            </svg>
          </button>

          {/* Auth: Login or Logout */}
          {user ? (
            <button
              onClick={() => logout()}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-ink-tertiary hover:text-accent-crimson hover:bg-accent-crimson/10 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => handleNavClick('login')}
              className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-accent-indigo text-white hover:bg-accent-indigo/90 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Mobile bottom nav — 5 key destinations, 44px min touch target */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-canvas/90 backdrop-blur-md border-t border-ink-wash flex items-center justify-around safe-area-pb">
        {[
          { id: 'dashboard', label: 'Home', icon: BarChart3 },
          { id: 'projects', label: 'Projects', icon: FolderOpen },
          { id: 'map', label: 'Map', icon: MapPin },
          { id: 'daily-brief', label: 'Brief', icon: FileText },
          { id: 'settings', label: 'More', icon: Layers },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[52px] px-2 py-1.5 rounded-lg transition-colors ${
              currentPage === item.id ? 'text-accent-indigo' : 'text-ink-tertiary'
            }`}
            aria-label={item.label}
            aria-current={currentPage === item.id ? 'page' : undefined}
          >
            <item.icon className="w-[18px] h-[18px]" strokeWidth={currentPage === item.id ? 2.5 : 1.5} />
            <span className="text-[9px] font-medium leading-tight">{item.label}</span>
            {item.id === 'alerts' && unreadAlertCount > 0 && (
              <span className="absolute top-1.5 right-1 w-2 h-2 bg-accent-crimson rounded-full" />
            )}
          </button>
        ))}
      </div>
    </>
  );
}
