import { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  FileText, TrendingUp, TrendingDown, Minus,
  MapPin, Bell, ArrowRight, Download, Calendar,
  Activity, Target, Zap, BarChart3
} from 'lucide-react';

interface DigestItem {
  id: string;
  type: 'new' | 'updated' | 'trending' | 'alert';
  title: string;
  county: string;
  change: number;
  confidence: number;
}

const DIGEST_ITEMS: DigestItem[] = [
  { id: 'd1', type: 'new', title: 'Apex Town Center Phase 2', county: 'Wake County, NC', change: 0, confidence: 92 },
  { id: 'd2', type: 'updated', title: 'Morrisville Station District', county: 'Wake County, NC', change: +8, confidence: 78 },
  { id: 'd3', type: 'trending', title: 'Duke Energy Substation', county: 'Durham County, NC', change: +12, confidence: 85 },
  { id: 'd4', type: 'alert', title: 'Cary Medical Center', county: 'Wake County, NC', change: -15, confidence: 62 },
  { id: 'd5', type: 'new', title: 'Garner Industrial Park', county: 'Wake County, NC', change: 0, confidence: 72 },
];

const TYPE_CONFIG = {
  new: { label: 'New', icon: Zap, color: 'text-accent-teal', bg: 'bg-accent-teal/10' },
  updated: { label: 'Updated', icon: TrendingUp, color: 'text-accent-indigo', bg: 'bg-accent-indigo/10' },
  trending: { label: 'Trending', icon: Activity, color: 'text-accent-violet', bg: 'bg-accent-violet/10' },
  alert: { label: 'Alert', icon: Bell, color: 'text-accent-amber', bg: 'bg-accent-amber/10' },
};

export default function WeeklyDigest() {
  const { setCurrentPage, addToast } = useStore();
  const [weekOffset, setWeekOffset] = useState(0);

  const handleDownload = () => {
    addToast('Weekly digest downloaded as PDF', 'success');
  };

  const newCount = DIGEST_ITEMS.filter((d) => d.type === 'new').length;
  const updatedCount = DIGEST_ITEMS.filter((d) => d.type === 'updated' || d.type === 'trending').length;
  const avgConfidence = Math.round(
    DIGEST_ITEMS.reduce((sum, d) => sum + d.confidence, 0) / DIGEST_ITEMS.length
  );

  const weekLabel = weekOffset === 0 ? 'This Week' : weekOffset === 1 ? 'Last Week' : `${weekOffset} Weeks Ago`;

  return (
    <div className="bg-surface border border-ink-wash rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-ink-wash/50">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-accent-indigo" />
          <h3 className="text-sm font-semibold text-ink-primary">Weekly Digest</h3>
          <span className="text-[10px] text-ink-tertiary ml-1">{weekLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="w-7 h-7 rounded-lg hover:bg-canvas flex items-center justify-center transition-colors"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5 text-ink-tertiary" />
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-px bg-ink-wash/30 border-b border-ink-wash/30">
        <div className="bg-surface px-3 py-2.5 text-center">
          <p className="text-lg font-semibold text-accent-teal font-mono">{newCount}</p>
          <p className="text-[10px] text-ink-tertiary">New</p>
        </div>
        <div className="bg-surface px-3 py-2.5 text-center">
          <p className="text-lg font-semibold text-accent-indigo font-mono">{updatedCount}</p>
          <p className="text-[10px] text-ink-tertiary">Updated</p>
        </div>
        <div className="bg-surface px-3 py-2.5 text-center">
          <p className="text-lg font-semibold text-accent-violet font-mono">{avgConfidence}%</p>
          <p className="text-[10px] text-ink-tertiary">Avg Confidence</p>
        </div>
      </div>

      {/* Digest items */}
      <div className="divide-y divide-ink-wash/30">
        {DIGEST_ITEMS.map((item) => {
          const config = TYPE_CONFIG[item.type];
          const Icon = config.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage('dashboard')}
              className="w-full flex items-start gap-3 px-4 py-3 hover:bg-canvas/50 transition-colors text-left"
            >
              <div className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-3.5 h-3.5 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-medium ${config.color}`}>{config.label}</span>
                  {item.change !== 0 && (
                    <span
                      className={`flex items-center gap-0.5 text-[10px] font-mono ${
                        item.change > 0 ? 'text-accent-teal' : 'text-accent-crimson'
                      }`}
                    >
                      {item.change > 0 ? (
                        <TrendingUp className="w-2.5 h-2.5" />
                      ) : (
                        <TrendingDown className="w-2.5 h-2.5" />
                      )}
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-ink-primary mt-0.5">{item.title}</p>
                <p className="text-[10px] text-ink-tertiary flex items-center gap-1 mt-0.5">
                  <MapPin className="w-2.5 h-2.5" />
                  {item.county}
                </p>
              </div>
              <span
                className={`shrink-0 text-[10px] font-mono font-medium ${
                  item.confidence >= 85
                    ? 'text-accent-teal'
                    : item.confidence >= 70
                    ? 'text-accent-indigo'
                    : 'text-accent-amber'
                }`}
              >
                {item.confidence}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-ink-wash/50 bg-canvas/30">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setWeekOffset((w) => Math.min(w + 1, 4))}
            disabled={weekOffset >= 4}
            className="text-[10px] text-ink-tertiary hover:text-ink-secondary disabled:opacity-30 transition-colors"
          >
            ← Previous
          </button>
          {weekOffset > 0 && (
            <>
              <span className="text-ink-wash mx-1">|</span>
              <button
                onClick={() => setWeekOffset(0)}
                className="text-[10px] text-accent-indigo hover:underline"
              >
                Current
              </button>
            </>
          )}
        </div>
        <button
          onClick={() => setCurrentPage('daily-brief')}
          className="flex items-center gap-1 text-[10px] text-accent-indigo hover:underline"
        >
          Full brief
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
