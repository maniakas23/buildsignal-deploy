import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { trackEvent } from '@/hooks/useTelemetry';
import {
  MessageSquare, X, Send, Bug, Lightbulb, Star,
  ThumbsUp, ThumbsDown, Check, ChevronRight
} from 'lucide-react';

type FeedbackMode = 'menu' | 'feature' | 'bug' | 'rating' | 'general' | 'submitted';

const RATING_LABELS = ['Poor', 'Fair', 'Good', 'Great', 'Excellent'];

export default function CustomerFeedback() {
  const { addToast } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FeedbackMode>('menu');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!message.trim() && mode !== 'rating') {
      addToast('Please enter your feedback.', 'error');
      return;
    }

    trackEvent('feedback_submit', {
      mode,
      rating: rating > 0 ? rating : undefined,
      category,
      messageLength: message.length,
    });

    setMode('submitted');
    addToast('Thank you for your feedback!', 'success');

    // Reset after 3 seconds
    setTimeout(() => {
      setMode('menu');
      setMessage('');
      setRating(0);
      setCategory('');
    }, 3000);
  };

  const handleQuickRate = (value: number) => {
    setRating(value);
    trackEvent('feedback_submit', { mode: 'rating', rating: value });
    setMode('submitted');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-accent-indigo text-white shadow-lg shadow-accent-indigo/30 hover:bg-accent-indigo-dim transition-all flex items-center justify-center"
        title="Send feedback"
      >
        <MessageSquare className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div ref={ref} className="fixed bottom-5 right-5 z-50 w-[340px] bg-surface border border-ink-wash rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-ink-wash/50 bg-canvas/30">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-accent-indigo" />
          <span className="text-sm font-semibold text-ink-primary">Feedback</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="w-7 h-7 rounded-lg hover:bg-canvas flex items-center justify-center transition-colors"
        >
          <X className="w-3.5 h-3.5 text-ink-tertiary" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {mode === 'menu' && (
          <div className="space-y-2">
            <p className="text-xs text-ink-secondary mb-3">
              Help us improve BuildSignal. What would you like to share?
            </p>

            {/* Quick rating */}
            <div className="flex items-center justify-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleQuickRate(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= (hoverRating || rating)
                        ? 'text-accent-amber fill-accent-amber'
                        : 'text-ink-wash'
                    }`}
                  />
                </button>
              ))}
            </div>
            {(hoverRating || rating) > 0 && (
              <p className="text-[11px] text-center text-ink-tertiary mb-2">
                {RATING_LABELS[(hoverRating || rating) - 1]}
              </p>
            )}

            {/* Options */}
            <button
              onClick={() => setMode('feature')}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-canvas border border-ink-wash hover:border-accent-indigo/30 hover:bg-surface-hover transition-all text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center shrink-0">
                <Lightbulb className="w-4 h-4 text-accent-indigo" />
              </div>
              <div>
                <p className="text-xs font-medium text-ink-primary">Feature Request</p>
                <p className="text-[10px] text-ink-tertiary">Suggest a new feature</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-ink-tertiary ml-auto" />
            </button>

            <button
              onClick={() => setMode('bug')}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-canvas border border-ink-wash hover:border-accent-crimson/30 hover:bg-accent-crimson/5 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-accent-crimson/10 flex items-center justify-center shrink-0">
                <Bug className="w-4 h-4 text-accent-crimson" />
              </div>
              <div>
                <p className="text-xs font-medium text-ink-primary">Report a Bug</p>
                <p className="text-[10px] text-ink-tertiary">Something not working?</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-ink-tertiary ml-auto" />
            </button>

            <button
              onClick={() => setMode('general')}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-canvas border border-ink-wash hover:border-ink-secondary/30 hover:bg-surface-hover transition-all text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-accent-teal/10 flex items-center justify-center shrink-0">
                <ThumbsUp className="w-4 h-4 text-accent-teal" />
              </div>
              <div>
                <p className="text-xs font-medium text-ink-primary">General Feedback</p>
                <p className="text-[10px] text-ink-tertiary">Share your experience</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-ink-tertiary ml-auto" />
            </button>
          </div>
        )}

        {(mode === 'feature' || mode === 'bug' || mode === 'general') && (
          <div className="space-y-3">
            <button
              onClick={() => setMode('menu')}
              className="text-[11px] text-accent-indigo hover:underline mb-1"
            >
              ← Back
            </button>

            <h4 className="text-sm font-medium text-ink-primary">
              {mode === 'feature' && 'Feature Request'}
              {mode === 'bug' && 'Report a Bug'}
              {mode === 'general' && 'General Feedback'}
            </h4>

            {mode === 'bug' && (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-canvas border border-ink-wash text-xs text-ink-primary focus:outline-none focus:border-accent-indigo/50"
              >
                <option value="">Select issue type...</option>
                <option value="crash">App crashed</option>
                <option value="slow">Slow performance</option>
                <option value="data">Incorrect data</option>
                <option value="ui">UI/layout issue</option>
                <option value="other">Something else</option>
              </select>
            )}

            {mode === 'feature' && (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-canvas border border-ink-wash text-xs text-ink-primary focus:outline-none focus:border-accent-indigo/50"
              >
                <option value="">Select category...</option>
                <option value="search">Search & Discovery</option>
                <option value="alerts">Alerts & Notifications</option>
                <option value="reports">Reports & Export</option>
                <option value="map">Map & Geography</option>
                <option value="integration">Integration</option>
                <option value="other">Other</option>
              </select>
            )}

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                mode === 'feature'
                  ? 'Describe the feature you would like to see...'
                  : mode === 'bug'
                  ? 'Describe what happened and what you expected...'
                  : 'Share your thoughts about BuildSignal...'
              }
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-canvas border border-ink-wash text-xs text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-accent-indigo/50 resize-none"
            />

            <button
              onClick={handleSubmit}
              disabled={!message.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent-indigo text-white text-xs font-semibold hover:bg-accent-indigo-dim transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Feedback
            </button>
          </div>
        )}

        {mode === 'submitted' && (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-accent-teal/10 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-accent-teal" />
            </div>
            <p className="text-sm font-medium text-ink-primary mb-1">
              Thank You!
            </p>
            <p className="text-xs text-ink-secondary">
              Your feedback helps us improve BuildSignal.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
