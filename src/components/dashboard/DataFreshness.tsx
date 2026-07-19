import { useState, useEffect } from 'react';
import { RefreshCw, Clock, Database, Wifi, WifiOff } from 'lucide-react';

interface DataFreshnessProps {
  lastUpdate?: string;
  nextScan?: string;
  sourcesOnline?: number;
  sourcesTotal?: number;
}

function timeAgo(dateStr: string): string {
  const then = new Date(dateStr);
  const now = new Date();
  const mins = Math.floor((now.getTime() - then.getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function DataFreshness({
  lastUpdate = new Date().toISOString(),
  nextScan,
  sourcesOnline = 2387,
  sourcesTotal = 2400,
}: DataFreshnessProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const healthPercent = Math.round((sourcesOnline / sourcesTotal) * 100);
  const isHealthy = healthPercent >= 95;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ink-tertiary">
      {/* Live indicator */}
      <span className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-teal" />
        </span>
        <span className="text-accent-teal font-medium">Live</span>
      </span>

      {/* Last update */}
      <span className="flex items-center gap-1">
        <RefreshCw className="w-3 h-3" />
        Updated {timeAgo(lastUpdate)}
      </span>

      {/* Next scan */}
      {nextScan && (
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Next scan {timeAgo(nextScan).replace(' ago', '')}
        </span>
      )}

      {/* Source health */}
      <span className="flex items-center gap-1">
        {isHealthy ? (
          <Wifi className="w-3 h-3 text-accent-teal" />
        ) : (
          <WifiOff className="w-3 h-3 text-accent-amber" />
        )}
        <span className={isHealthy ? 'text-accent-teal' : 'text-accent-amber'}>
          {sourcesOnline.toLocaleString()}/{sourcesTotal.toLocaleString()} sources
        </span>
      </span>

      {/* Coverage */}
      <span className="flex items-center gap-1">
        <Database className="w-3 h-3" />
        3,100+ counties
      </span>
    </div>
  );
}
