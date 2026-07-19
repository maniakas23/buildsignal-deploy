import { useState } from 'react';
import { ThumbsUp, ThumbsDown, X, Bookmark, BookmarkCheck, Eye, MessageSquare, TrendingUp, Shield, Target, CheckCircle2 } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-13: Recommendation Feedback Capture
// Inline feedback on recommendations — thumbs, dismissals, saves,
// and "why" explanations. Drives the SignalCore learning loop.
// ═══════════════════════════════════════════════════════════════

interface FeedbackState {
  vote: 'up' | 'down' | null;
  saved: boolean;
  dismissed: boolean;
  reason: string | null;
}

interface Props {
  recommendationId: string;
  title?: string;
  onFeedback?: (feedback: { id: string; vote: 'up' | 'down' | null; saved: boolean; dismissed: boolean; reason: string | null }) => void;
}

const DISMISS_REASONS = [
  'Not relevant to me',
  'Already knew this',
  'Too far away',
  'Wrong project type',
  'Out of my scope',
  'Outdated information',
];

export default function RecommendationFeedback({ recommendationId, title = 'this recommendation', onFeedback }: Props) {
  const [feedback, setFeedback] = useState<FeedbackState>(() => {
    const saved = localStorage.getItem(`bs_feedback_${recommendationId}`);
    return saved ? JSON.parse(saved) : { vote: null, saved: false, dismissed: false, reason: null };
  });
  const [showReasons, setShowReasons] = useState(false);
  const [showWhy, setShowWhy] = useState(false);

  const persist = (next: FeedbackState) => {
    setFeedback(next);
    localStorage.setItem(`bs_feedback_${recommendationId}`, JSON.stringify(next));
    onFeedback?.({ id: recommendationId, ...next });
  };

  const handleVote = (vote: 'up' | 'down') => {
    const next = { ...feedback, vote: feedback.vote === vote ? null : vote };
    persist(next);
  };

  const handleSave = () => {
    const next = { ...feedback, saved: !feedback.saved };
    persist(next);
  };

  const handleDismiss = () => {
    if (!showReasons) {
      setShowReasons(true);
      return;
    }
    const next = { ...feedback, dismissed: true };
    persist(next);
  };

  const handleReason = (reason: string) => {
    const next = { ...feedback, dismissed: true, reason };
    persist(next);
    setShowReasons(false);
  };

  const handleUndoDismiss = () => {
    const next = { ...feedback, dismissed: false, reason: null };
    persist(next);
  };

  if (feedback.dismissed) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-ink-wash/30 border border-ink-wash">
        <CheckCircle2 className="w-3.5 h-3.5 text-ink-tertiary" />
        <span className="text-[11px] text-ink-tertiary">Dismissed{feedback.reason ? `: ${feedback.reason}` : ''}</span>
        <button onClick={handleUndoDismiss} className="text-[11px] text-accent-indigo hover:underline ml-auto">Undo</button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Action bar */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleVote('up')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
            feedback.vote === 'up' ? 'bg-accent-teal/10 text-accent-teal' : 'text-ink-tertiary hover:bg-canvas hover:text-ink-secondary'
          }`}
          title="This is helpful"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          Helpful
        </button>
        <button
          onClick={() => handleVote('down')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
            feedback.vote === 'down' ? 'bg-accent-crimson/10 text-accent-crimson' : 'text-ink-tertiary hover:bg-canvas hover:text-ink-secondary'
          }`}
          title="This is not helpful"
        >
          <ThumbsDown className="w-3.5 h-3.5" />
          Not helpful
        </button>
        <div className="w-px h-4 bg-ink-wash mx-1" />
        <button
          onClick={handleSave}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
            feedback.saved ? 'bg-accent-indigo/10 text-accent-indigo' : 'text-ink-tertiary hover:bg-canvas hover:text-ink-secondary'
          }`}
          title={feedback.saved ? 'Remove from saved' : 'Save for later'}
        >
          {feedback.saved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
          {feedback.saved ? 'Saved' : 'Save'}
        </button>
        <button
          onClick={() => setShowWhy(!showWhy)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
            showWhy ? 'bg-accent-amber/10 text-accent-amber' : 'text-ink-tertiary hover:bg-canvas hover:text-ink-secondary'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Why
        </button>
        <button
          onClick={handleDismiss}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-ink-tertiary hover:bg-canvas hover:text-accent-crimson transition-colors ml-auto"
        >
          <X className="w-3.5 h-3.5" />
          Dismiss
        </button>
      </div>

      {/* Dismissal reasons */}
      {showReasons && (
        <div className="flex flex-wrap gap-1.5 p-3 rounded-lg bg-canvas border border-ink-wash animate-in fade-in slide-in-from-top-1">
          <p className="w-full text-[10px] text-ink-tertiary mb-1">Why are you dismissing {title}?</p>
          {DISMISS_REASONS.map((reason) => (
            <button
              key={reason}
              onClick={() => handleReason(reason)}
              className="px-2.5 py-1 rounded-md bg-surface border border-ink-wash text-[11px] text-ink-secondary hover:border-accent-crimson/30 hover:text-accent-crimson transition-colors"
            >
              {reason}
            </button>
          ))}
          <button onClick={() => setShowReasons(false)} className="text-[11px] text-ink-tertiary hover:text-ink-primary ml-auto">Cancel</button>
        </div>
      )}

      {/* Why explanation */}
      {showWhy && (
        <div className="p-3 rounded-lg bg-canvas border border-ink-wash space-y-2 animate-in fade-in slide-in-from-top-1">
          <WhyRow icon={<Target className="w-3.5 h-3.5 text-accent-indigo" />} title="Why this surfaced" text="Multiple early signals correlated across permit filings, zoning changes, and utility expansion requests." />
          <WhyRow icon={<TrendingUp className="w-3.5 h-3.5 text-accent-teal" />} title="Why it matters" text="This pattern typically indicates projects going to market within 60-90 days. Early engagement increases win rate 3-4x." />
          <WhyRow icon={<Shield className="w-3.5 h-3.5 text-accent-amber" />} title="Confidence basis" text="91% from signal count (92), source diversity (85), historical accuracy (94), data freshness (88), cross-provider validation (90)." />
        </div>
      )}
    </div>
  );
}

function WhyRow({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-[10px] font-medium text-ink-primary">{title}</p>
        <p className="text-[10px] text-ink-secondary leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
