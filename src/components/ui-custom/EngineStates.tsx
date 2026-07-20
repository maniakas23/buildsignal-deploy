import { useState } from 'react';
import { Loader2, Inbox, MapPin, Bell, RefreshCw, Plus, Database } from 'lucide-react';
import { isDemoMode } from '@/signalcore/engine';

// ═══════════════════════════════════════════════════════════════
// BuildSignal UI States — Loading, Empty, Error, Skeleton
// Powered by Kestovar
// ═══════════════════════════════════════════════════════════════

const LOADING_MESSAGES = [
  "Analyzing infrastructure activity...",
  "Checking data providers...",
  "Scoring opportunities...",
  "Searching permit filings...",
  "Processing growth signals...",
  "Cross-referencing sources...",
  "Updating opportunity scores...",
];

function getLoadingMessage(input?: string): string {
  if (input) return input;
  return LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
}

interface LoadingProps { message?: string; }
interface ErrorProps { message?: string; onRetry?: () => void; }

// ─── Loading State ───
export function LoadingState({ message }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6" role="status" aria-live="polite" aria-busy="true">
      <Loader2 className="w-8 h-8 text-accent-indigo animate-spin mb-4" aria-hidden="true" />
      <p className="text-body text-ink-secondary">{getLoadingMessage(message)}</p>
      <p className="text-caption mt-2">Powered by Kestovar</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Friendly Error State — No red warning triangles
// Uses blue/gray tones to avoid triggering threat response (amygdala)
// Offers multiple paths: retry, demo data, or contact support
// ═══════════════════════════════════════════════════════════════

export function ErrorState({ message, onRetry }: ErrorProps) {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6" role="alert" aria-live="polite">
      <div className="w-14 h-14 rounded-full bg-accent-indigo/10 flex items-center justify-center mb-4" aria-hidden="true">
        <RefreshCw className="w-7 h-7 text-accent-indigo" aria-hidden="true" />
      </div>
      <h3 className="text-[16px] font-semibold text-ink-primary mb-2">Setting up your intelligence feed</h3>
      <p className="text-[13px] text-ink-secondary text-center max-w-md mb-2">
        {message || "We're connecting to your data sources. This usually takes a few moments."}
      </p>
      <p className="text-[11px] text-ink-tertiary text-center mb-6">
        Try loading sample data to explore the platform while we finish the setup.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-5 py-3 bg-accent-indigo text-white rounded-xl text-[12px] font-medium hover:bg-accent-indigo/90 transition-colors"
            aria-label="Retry loading data"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </button>
        )}
        <button
          onClick={() => setShowDemo(!showDemo)}
          className="flex items-center gap-2 px-5 py-3 border border-accent-indigo/30 text-accent-indigo rounded-xl text-[12px] font-medium hover:bg-accent-indigo/10 transition-colors"
          aria-label="Load sample data"
        >
          <Database className="w-4 h-4" />
          {showDemo ? 'Hide Sample Data' : 'Load Sample Data'}
        </button>
      </div>
    </div>
  );
}

// ─── Skeleton Loading ───
export function SkeletonRow({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-surface rounded-xl p-5 border border-[#243444] mb-3 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-surface-hover animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-surface-hover rounded w-1/3 animate-pulse" />
          <div className="h-3 bg-surface-hover rounded w-1/2 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-surface rounded-xl p-5 border border-[#243444] ${className}`}>
      <div className="h-4 bg-surface-hover rounded w-2/3 mb-3 animate-pulse" />
      <div className="h-3 bg-surface-hover rounded w-full mb-2 animate-pulse" />
      <div className="h-3 bg-surface-hover rounded w-4/5 animate-pulse" />
    </div>
  );
}

export function SkeletonGrid({ count = 6, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// ─── Empty State ───
export function EmptyState({ title = 'No results found', description = 'Try adjusting your filters or search criteria.', icon = 'inbox' }: { title?: string; description?: string; icon?: 'inbox' | 'map' | 'bell' | 'database' }) {
  const icons = { inbox: Inbox, map: MapPin, bell: Bell, database: Database };
  const Icon = icons[icon] || Inbox;
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <Icon className="w-10 h-10 text-ink-tertiary mb-4" />
      <p className="text-[16px] font-semibold text-ink-secondary mb-1">{title}</p>
      <p className="text-[12px] text-ink-tertiary max-w-md text-center">{description}</p>
    </div>
  );
}

// ─── Demo Mode Banner ───
export function DemoModeBanner() {
  if (!isDemoMode()) return null;
  return (
    <div className="bg-accent-amber/10 border-b border-accent-amber/20 px-4 py-1.5 text-center">
      <p className="text-[11px] text-accent-amber font-medium">
        Demo Mode — Toggle off for live Kestovar data
      </p>
    </div>
  );
}

export function ConfidenceBadge({ score }: { score: number }) {
  if (score >= 90) return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent-teal/10 text-accent-teal">High</span>;
  if (score >= 70) return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent-amber/10 text-accent-amber">Medium</span>;
  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent-crimson/10 text-accent-crimson">Low</span>;
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-[14px] font-semibold text-ink-primary">{title}</h2>
        {subtitle && <p className="text-[11px] text-ink-tertiary">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
