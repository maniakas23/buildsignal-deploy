import { useState } from 'react';
import {
  Bookmark, Clock, Zap, TrendingUp, Lightbulb, ArrowRight,
  Star, History, Settings, Bell, MapPin, FileText,
  Layers, Target, ChevronRight, BookmarkCheck, RotateCcw
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-18: Customer Productivity Hub
// Saved workflows, smart defaults, recently viewed, personalized
// recommendations, and quick actions.
// ═══════════════════════════════════════════════════════════════

interface SavedWorkflow {
  id: string;
  name: string;
  description: string;
  lastRun: string;
  frequency: string;
  runs: number;
  icon: React.ElementType;
}

interface RecentView {
  id: string;
  title: string;
  type: string;
  county: string;
  viewedAt: string;
  icon: React.ElementType;
}

interface PersonalizedRec {
  id: string;
  title: string;
  reason: string;
  confidence: number;
  type: string;
}

const SAVED_WORKFLOWS: SavedWorkflow[] = [
  { id: 'wf1', name: 'Weekly Opportunity Scan', description: 'Review all new high-confidence opportunities across monitored counties', lastRun: '2 hours ago', frequency: 'Weekly', runs: 47, icon: Zap },
  { id: 'wf2', name: 'Permit Alert Check', description: 'Review new building permits in target zip codes', lastRun: '5 hours ago', frequency: 'Daily', runs: 128, icon: FileText },
  { id: 'wf3', name: 'County Growth Report', description: 'Generate growth signal summary for stakeholder meetings', lastRun: '1 day ago', frequency: 'Weekly', runs: 12, icon: TrendingUp },
  { id: 'wf4', name: 'Competitor Tracking', description: 'Monitor permit filings by known competitors', lastRun: '3 days ago', frequency: 'Daily', runs: 89, icon: Target },
  { id: 'wf5', name: 'DOT Project Review', description: 'Review new DOT projects and associated opportunities', lastRun: '8 hours ago', frequency: 'Weekly', runs: 34, icon: Layers },
];

const RECENT_VIEWS: RecentView[] = [
  { id: 'rv1', title: 'Highway 287 Expansion', type: 'DOT Project', county: 'Larimer County, CO', viewedAt: '10 min ago', icon: FileText },
  { id: 'rv2', title: 'Weld County School RFP', type: 'School Construction', county: 'Weld County, CO', viewedAt: '32 min ago', icon: Bookmark },
  { id: 'rv3', title: 'Downtown Fort Collins', type: 'Mixed-Use', county: 'Larimer County, CO', viewedAt: '1 hour ago', icon: MapPin },
  { id: 'rv4', title: 'Xcel Substation Upgrade', type: 'Utilities', county: 'Adams County, CO', viewedAt: '2 hours ago', icon: Zap },
  { id: 'rv5', title: 'Greeley CIP Review', type: 'Capital Improvement', county: 'Weld County, CO', viewedAt: '3 hours ago', icon: TrendingUp },
  { id: 'rv6', title: 'Boulder County Permits', type: 'Building Permits', county: 'Boulder County, CO', viewedAt: '5 hours ago', icon: FileText },
];

const PERSONALIZED_RECS: PersonalizedRec[] = [
  { id: 'pr1', title: 'Set up alert for Highway 287 corridor parcels', reason: 'You viewed related opportunities 4 times this week', confidence: 92, type: 'Quick Action' },
  { id: 'pr2', title: 'Add Weld County to monitored counties', reason: '78% of your high-value leads are in Weld County', confidence: 88, type: 'Insight' },
  { id: 'pr3', title: 'Share weekly report with your team', reason: 'Team members haven\'t seen this week\'s opportunities', confidence: 85, type: 'Collaboration' },
  { id: 'pr4', title: 'Upgrade to Professional plan for 25 counties', reason: 'You\'re tracking 8 counties — 3 over your Scout limit', confidence: 90, type: 'Plan' },
];

const QUICK_ACTIONS = [
  { label: 'New Search', icon: Zap, color: 'bg-accent-indigo text-white' },
  { label: 'Add Watchlist', icon: Bookmark, color: 'bg-emerald-500 text-white' },
  { label: 'Create Alert', icon: Bell, color: 'bg-amber-500 text-white' },
  { label: 'Generate Report', icon: FileText, color: 'bg-violet-500 text-white' },
];

export default function CustomerProductivityHub() {
  const [activeSection, setActiveSection] = useState<'workflows' | 'recent' | 'recommendations'>('workflows');

  return (
    <div className="space-y-6">
      {/* Quick Actions Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            className={`${action.color} rounded-xl p-3 text-left transition-all hover:opacity-90`}
          >
            <action.icon className="w-4 h-4 mb-2 opacity-80" />
            <span className="text-[11px] font-semibold">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Section tabs */}
      <div className="flex items-center gap-1 p-1 bg-canvas border border-ink-wash rounded-xl w-fit">
        {([
          { id: 'workflows' as const, label: 'Saved Workflows', icon: Settings },
          { id: 'recent' as const, label: 'Recently Viewed', icon: History },
          { id: 'recommendations' as const, label: 'For You', icon: Star },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveSection(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              activeSection === t.id ? 'bg-accent-indigo text-white' : 'text-ink-secondary hover:bg-surface'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Workflows */}
      {activeSection === 'workflows' && (
        <div className="space-y-2">
          {SAVED_WORKFLOWS.map((wf) => (
            <div key={wf.id} className="flex items-center gap-3 p-3 bg-surface border border-ink-wash rounded-xl hover:shadow-sm transition-shadow">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-accent-indigo/10 flex items-center justify-center">
                <wf.icon className="w-4 h-4 text-accent-indigo" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-ink-primary">{wf.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-canvas rounded-full text-ink-tertiary font-medium">
                    {wf.frequency}
                  </span>
                </div>
                <p className="text-[10px] text-ink-tertiary truncate">{wf.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] text-ink-tertiary flex items-center gap-0.5">
                    <RotateCcw className="w-2.5 h-2.5" /> {wf.runs} runs
                  </span>
                  <span className="text-[9px] text-ink-tertiary flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" /> {wf.lastRun}
                  </span>
                </div>
              </div>
              <button className="flex-shrink-0 p-2 rounded-lg hover:bg-ink-wash transition-colors">
                <ChevronRight className="w-4 h-4 text-ink-tertiary" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Recently Viewed */}
      {activeSection === 'recent' && (
        <div className="space-y-2">
          {RECENT_VIEWS.map((rv) => (
            <div key={rv.id} className="flex items-center gap-3 p-3 bg-surface border border-ink-wash rounded-xl hover:shadow-sm transition-shadow">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-canvas flex items-center justify-center">
                <rv.icon className="w-4 h-4 text-ink-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-ink-primary truncate">{rv.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] px-1.5 py-0.5 bg-accent-indigo/10 text-accent-indigo rounded-full font-medium">
                    {rv.type}
                  </span>
                  <span className="text-[10px] text-ink-tertiary flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5" /> {rv.county}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-ink-tertiary flex-shrink-0">{rv.viewedAt}</span>
            </div>
          ))}
        </div>
      )}

      {/* Personalized Recommendations */}
      {activeSection === 'recommendations' && (
        <div className="space-y-3">
          {PERSONALIZED_RECS.map((rec) => (
            <div key={rec.id} className="p-4 bg-surface border border-ink-wash rounded-xl">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] px-1.5 py-0.5 bg-canvas rounded-full text-ink-tertiary font-medium">
                      {rec.type}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      rec.confidence >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {rec.confidence}% match
                    </span>
                  </div>
                  <p className="text-[12px] font-medium text-ink-primary mb-1">{rec.title}</p>
                  <p className="text-[10px] text-ink-tertiary leading-relaxed">{rec.reason}</p>
                  <button className="mt-2 flex items-center gap-1 text-[10px] font-medium text-accent-indigo hover:text-accent-indigo/80 transition-colors">
                    Take action <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
