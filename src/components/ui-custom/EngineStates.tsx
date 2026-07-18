/**
 * BuildSignal Shared UI States
 */

import { Loader2, AlertTriangle, Inbox, MapPin, Bell, RefreshCw, Plus, Database, ExternalLink } from 'lucide-react';
import { isDemoMode } from '@/signalcore/engine';

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

interface LoadingProps {
  message?: string;
}

export function LoadingState({ message }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6" role="status" aria-live="polite" aria-busy="true">
      <Loader2 className="w-8 h-8 text-accent-indigo animate-spin mb-4" aria-hidden="true" />
      <p className="text-body text-ink-secondary">{getLoadingMessage(message)}</p>
      <p className="text-caption mt-2">This usually takes a few seconds</p>
    </div>
  );
}

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

export function EmptyState({ title = 'No results found', description = 'Try adjusting your filters or search criteria.', icon = 'inbox' }: { title?: string; description?: string; icon?: 'inbox' | 'map' | 'bell' | 'database' }) {
  const icons = { inbox: Inbox, map: MapPin, bell: Bell, database: Database };
  const Icon = icons[icon] || Inbox;
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <Icon className="w-10 h-10 text-ink-tertiary mb-4" />
      <p className="text-h3 text-ink-secondary mb-1">{title}</p>
      <p className="text-sidebar text-ink-tertiary max-w-md text-center">{description}</p>
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', description = 'We encountered an error loading this data. Please try again.', onRetry }: { title?: string; description?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <AlertTriangle className="w-10 h-10 text-accent-crimson mb-4" />
      <p className="text-h3 text-ink-secondary mb-1">{title}</p>
      <p className="text-sidebar text-ink-tertiary max-w-md text-center mb-4">{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="flex items-center gap-2 px-4 py-2 bg-accent-indigo text-white rounded-lg hover:bg-accent-indigo/90 transition-colors">
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      )}
    </div>
  );
}

export function DemoModeBanner() {
  if (!isDemoMode()) return null;
  return (
    <div className="bg-accent-amber/10 border-b border-accent-amber/20 px-4 py-1.5 text-center">
      <p className="text-[11px] text-accent-amber font-medium">
        Demo Mode — Some features are simulated for demonstration purposes
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
