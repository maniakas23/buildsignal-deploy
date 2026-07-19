import { useState } from 'react';
import { MessageSquare, X, Send, CheckCircle2, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function CustomerFeedback() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<'up' | 'down' | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState('general');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Store feedback
    const feedback = JSON.parse(localStorage.getItem('buildsignal_feedback') || '[]');
    feedback.push({
      rating,
      comment,
      category,
      timestamp: Date.now(),
      page: window.location.pathname,
    });
    localStorage.setItem('buildsignal_feedback', JSON.stringify(feedback));

    // Also track as telemetry event
    const events = JSON.parse(localStorage.getItem('buildsignal_telemetry') || '[]');
    events.push({
      type: 'feedback_submitted',
      rating,
      category,
      timestamp: Date.now(),
    });
    if (events.length > 500) events.shift();
    localStorage.setItem('buildsignal_telemetry', JSON.stringify(events));

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setOpen(false);
      setRating(null);
      setComment('');
    }, 2000);
  };

  return (
    <>
      {/* Floating trigger */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-surface border border-ink-wash shadow-lg flex items-center justify-center hover:bg-canvas transition-colors group"
          aria-label="Send feedback"
        >
          <MessageSquare className="w-5 h-5 text-ink-secondary group-hover:text-accent-indigo transition-colors" />
        </button>
      )}

      {/* Feedback panel */}
      {open && (
        <div className="fixed bottom-6 left-6 z-50 w-80 bg-surface rounded-2xl shadow-xl border border-ink-wash animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-ink-wash">
            <h3 className="text-sm font-semibold text-ink-primary">Feedback</h3>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-canvas transition-colors"
            >
              <X className="w-3.5 h-3.5 text-ink-tertiary" />
            </button>
          </div>

          {submitted ? (
            <div className="p-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-accent-teal mx-auto mb-3" />
              <p className="text-sm font-medium text-ink-primary">Thank you!</p>
              <p className="text-xs text-ink-secondary mt-1">Your feedback helps us improve.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-xs font-medium text-ink-secondary mb-2">
                  How is your experience?
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRating('up')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border transition-colors ${
                      rating === 'up'
                        ? 'bg-accent-teal/10 border-accent-teal text-accent-teal'
                        : 'bg-canvas border-ink-wash text-ink-secondary hover:bg-canvas'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-xs">Good</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRating('down')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border transition-colors ${
                      rating === 'down'
                        ? 'bg-accent-crimson/10 border-accent-crimson text-accent-crimson'
                        : 'bg-canvas border-ink-wash text-ink-secondary hover:bg-canvas'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span className="text-xs">Needs work</span>
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-ink-secondary mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-canvas border border-ink-wash text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-accent-indigo/30"
                >
                  <option value="general">General</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="data">Data Quality</option>
                  <option value="ui">Design/UI</option>
                </select>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-medium text-ink-secondary mb-2">
                  Comments (optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us more..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-canvas border border-ink-wash text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-accent-indigo/30 resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!rating}
                className="w-full py-2.5 rounded-lg bg-accent-indigo text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-accent-indigo/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" /> Send Feedback
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
