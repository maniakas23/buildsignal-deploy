import { useState } from "react";
import { RefreshCw } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  submessage?: string;
}

export function LoadingState({ message = "Loading intelligence data...", submessage = "Kestovar Engine is analyzing signals" }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-10 h-10 rounded-xl bg-accent-indigo/10 flex items-center justify-center mb-4 animate-pulse">
        <RefreshCw className="w-5 h-5 text-accent-indigo animate-spin" />
      </div>
      <p className="text-sm font-medium text-ink-primary">{message}</p>
      <p className="text-xs text-ink-tertiary mt-1">{submessage}</p>
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title = "No data yet", description = "Kestovar hasn't detected any signals matching your criteria.", action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-10 h-10 rounded-xl bg-accent-indigo/10 flex items-center justify-center mb-4">
        <RefreshCw className="w-5 h-5 text-accent-indigo" />
      </div>
      <p className="text-sm font-medium text-ink-primary">{title}</p>
      <p className="text-xs text-ink-tertiary mt-1 max-w-sm">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 rounded-lg bg-accent-indigo text-white text-xs font-semibold hover:bg-accent-indigo-dim transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  error: Error | string;
  onRetry?: () => void;
  onLoadSample?: () => void;
}

export function ErrorState({ error, onRetry, onLoadSample }: ErrorStateProps) {
  const [showDetails, setShowDetails] = useState(false);
  const message = typeof error === "string" ? error : error.message;

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-10 h-10 rounded-xl bg-accent-indigo/10 flex items-center justify-center mb-4">
        <RefreshCw className="w-5 h-5 text-accent-indigo" />
      </div>

      <p className="text-sm font-medium text-ink-primary">
        Setting up your intelligence feed
      </p>
      <p className="text-xs text-ink-tertiary mt-1 max-w-sm">
        Kestovar Engine is initializing. This may take a few moments on first load.
      </p>

      <div className="flex items-center gap-2 mt-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-indigo text-white text-xs font-semibold hover:bg-accent-indigo-dim transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
        )}
        {onLoadSample && (
          <button
            onClick={onLoadSample}
            className="px-4 py-2 rounded-lg border border-ink-wash text-xs font-medium text-ink-secondary hover:bg-surface-hover transition-all"
          >
            Load Sample Data
          </button>
        )}
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-3 text-[11px] text-ink-tertiary hover:text-ink-secondary transition-colors"
      >
        {showDetails ? "Hide" : "Show"} details
      </button>

      {showDetails && (
        <p className="mt-2 text-[11px] text-ink-tertiary font-mono bg-canvas rounded-lg px-3 py-2 max-w-sm">
          {message}
        </p>
      )}
    </div>
  );
}
