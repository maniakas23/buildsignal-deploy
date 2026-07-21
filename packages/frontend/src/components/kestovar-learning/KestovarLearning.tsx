import { useState } from 'react';
import { Brain, ThumbsUp, ThumbsDown, Bookmark, XCircle, Search, Eye, TrendingUp, RefreshCw, Star, Zap, Activity, Target, ChevronDown, ChevronUp, Lightbulb, BarChart3, CheckCircle2, AlertTriangle, Filter, Clock } from 'lucide-react';

const LEARNING_METRICS = [
  { label: 'Saved Opps', value: '52', change: '+8', icon: Bookmark, color: 'text-emerald-600' },
  { label: 'Dismissed', value: '18', change: '-3', icon: XCircle, color: 'text-ink-tertiary' },
  { label: 'Rated', value: '156', change: '+28', icon: Star, color: 'text-amber-500' },
  { label: 'Avg Rating', value: '4.7', change: '+0.2', icon: ThumbsUp, color: 'text-emerald-600' },
  { label: 'Searches', value: '234', change: '+45', icon: Search, color: 'text-accent-indigo' },
  { label: 'Watchlist Adds', value: '89', change: '+17', icon: Eye, color: 'text-accent-indigo' },
];

const USER_FEEDBACK = [
  { id: 'uf1', opp: 'Highway 287 Corridor', action: 'saved', rating: 5, note: 'Exact match for our strategy.', user: 'Sarah Chen', time: '1h ago', tags: ['DOT', 'High Confidence'] },
  { id: 'uf2', opp: 'Weld County School RFP', action: 'saved', rating: 5, note: 'Forwarded to estimating.', user: 'Marcus Johnson', time: '2h ago', tags: ['Public', 'RFP'] },
  { id: 'uf3', opp: 'Longmont Retail Dev', action: 'dismissed', rating: 1, note: 'Outside service area.', user: 'Sarah Chen', time: '4h ago', tags: ['Geographic'] },
];

const BEHAVIORAL_INSIGHTS = [
  { id: 'bi1', insight: 'DOT-corridor opportunities are saved 3.4x more than other types', confidence: 95, category: 'Preference', trend: 'up' },
  { id: 'bi2', insight: 'Recommendations >90% confidence receive 5.1x more saves', confidence: 93, category: 'Quality', trend: 'up' },
  { id: 'bi3', insight: 'Executive summaries increase engagement by 2.3x', confidence: 90, category: 'Format', trend: 'up' },
];

function ActionBadge({ action }: { action: string }) {
  const colors: Record<string, string> = { saved: 'bg-emerald-50 text-emerald-700', dismissed: 'bg-ink-wash text-ink-tertiary' };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${colors[action] || colors.saved}`}>{action.toUpperCase()}</span>;
}

function RatingStars({ rating }: { rating: number }) {
  return <div className="flex items-center gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-ink-wash'}`} />)}</div>;
}

export default function KestovarLearning() {
  const [tab, setTab] = useState<'feedback' | 'insights' | 'improvements'>('feedback');
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {LEARNING_METRICS.map(m => (
          <div key={m.label} className="bg-surface border border-ink-wash rounded-xl p-3 text-center">
            <m.icon className={`w-4 h-4 ${m.color} mx-auto mb-1`} />
            <div className="text-lg font-bold text-ink-primary">{m.value}</div>
            <div className="text-[8px] text-ink-tertiary">{m.label}</div>
            <div className="text-[9px] text-emerald-600 font-medium">{m.change}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 p-1 bg-canvas border border-ink-wash rounded-xl w-fit">
        {[{id:'feedback',label:'User Feedback',icon:ThumbsUp},{id:'insights',label:'Insights',icon:Brain},{id:'improvements',label:'Improvements',icon:TrendingUp}].map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${tab===t.id?'bg-accent-indigo text-white':'text-ink-secondary hover:bg-surface'}`}>
            <t.icon className="w-3.5 h-3.5" />{t.label}
          </button>
        ))}
      </div>
      {tab==='feedback' && <div className="space-y-2">{USER_FEEDBACK.map(uf=>(
        <div key={uf.id} className="bg-surface border border-ink-wash rounded-xl p-4">
          <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><ActionBadge action={uf.action} /><RatingStars rating={uf.rating} /></div><span className="text-[9px] text-ink-tertiary">{uf.time}</span></div>
          <h4 className="text-sm font-bold text-ink-primary mb-1">{uf.opp}</h4>
          <p className="text-[11px] text-ink-secondary italic mb-2">"{uf.note}"</p>
          <div className="flex items-center justify-between"><span className="text-[10px] text-ink-tertiary">{uf.user}</span><div className="flex items-center gap-1">{uf.tags.map(t=><span key={t} className="text-[8px] px-1.5 py-0.5 bg-accent-indigo/10 text-accent-indigo rounded-full">{t}</span>)}</div></div>
        </div>
      ))}</div>}
      {tab==='insights' && <div className="space-y-2">{BEHAVIORAL_INSIGHTS.map(bi=>(
        <div key={bi.id} className="bg-surface border border-ink-wash rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold bg-accent-indigo/10 text-accent-indigo px-1.5 py-0.5 rounded-full">{bi.category}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${bi.confidence>=90?'bg-emerald-50 text-emerald-700':'bg-amber-50 text-amber-700'}`}>{bi.confidence}%</span>
          </div>
          <p className="text-[12px] font-medium text-ink-primary">{bi.insight}</p>
        </div>
      ))}</div>}
      {tab==='improvements' && <div className="text-center py-8 text-ink-tertiary text-sm">Improvement history will appear here.</div>}
    </div>
  );
}
