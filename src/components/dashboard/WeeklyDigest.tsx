import { useState, useEffect } from 'react';
import { Mail, TrendingUp, MapPin, Bell, CheckCircle2 } from 'lucide-react';

interface DigestItem {
  type: 'opportunity' | 'trend' | 'alert';
  title: string;
  county: string;
  confidence: number;
  timestamp: number;
}

const SAMPLE_DIGEST: DigestItem[] = [
  {
    type: 'opportunity',
    title: 'New commercial permits filed',
    county: 'Travis County, TX',
    confidence: 92,
    timestamp: Date.now() - 86400000,
  },
  {
    type: 'trend',
    title: 'Utility expansion signals up 23%',
    county: 'Harris County, TX',
    confidence: 88,
    timestamp: Date.now() - 172800000,
  },
  {
    type: 'alert',
    title: 'Zoning change detected',
    county: 'Dallas County, TX',
    confidence: 85,
    timestamp: Date.now() - 259200000,
  },
];

export default function WeeklyDigest() {
  const [digest, setDigest] = useState<DigestItem[]>([]);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Check if subscribed
    const sub = localStorage.getItem('buildsignal_digest_subscribed');
    if (sub) setSubscribed(true);

    // Load digest data
    setDigest(SAMPLE_DIGEST);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('buildsignal_digest_subscribed', 'true');
    localStorage.setItem('buildsignal_digest_email', email);
    setSubscribed(true);
  };

  const handleUnsubscribe = () => {
    localStorage.removeItem('buildsignal_digest_subscribed');
    localStorage.removeItem('buildsignal_digest_email');
    setSubscribed(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp className="w-3.5 h-3.5 text-accent-teal" />;
      case 'trend':
        return <TrendingUp className="w-3.5 h-3.5 text-accent-indigo" />;
      case 'alert':
        return <Bell className="w-3.5 h-3.5 text-accent-amber" />;
      default:
        return <TrendingUp className="w-3.5 h-3.5 text-ink-tertiary" />;
    }
  };

  return (
    <div className="bg-surface rounded-2xl p-5 shadow-card border border-ink-wash">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-4 h-4 text-accent-indigo" />
        <h3 className="text-sm font-semibold text-ink-primary">Weekly Digest</h3>
      </div>

      {!subscribed ? (
        <form onSubmit={handleSubscribe} className="space-y-3">
          <p className="text-xs text-ink-secondary leading-relaxed">
            Get a weekly summary of new opportunities, trends, and alerts in your monitored areas.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-3 py-2 rounded-lg bg-canvas border border-ink-wash text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-accent-indigo/30"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-accent-indigo text-white text-sm font-medium hover:bg-accent-indigo/90 transition-colors"
            >
              Subscribe
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent-teal" />
            <span className="text-xs text-accent-teal font-medium">Subscribed</span>
            <button
              onClick={handleUnsubscribe}
              className="text-[10px] text-ink-tertiary hover:text-accent-crimson ml-auto transition-colors"
            >
              Unsubscribe
            </button>
          </div>

          <div className="space-y-2">
            {digest.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-canvas">
                {getIcon(item.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-ink-primary font-medium">{item.title}</p>
                  <p className="text-[10px] text-ink-tertiary flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" /> {item.county}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-accent-teal">{item.confidence}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
