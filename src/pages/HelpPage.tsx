import { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  Search, BookOpen, MessageCircle, Mail, ArrowRight,
  Map, Bell, FileText, Shield, CreditCard, Users, HelpCircle
} from 'lucide-react';

const CATEGORIES = [
  {
    icon: Map,
    title: 'Getting Started',
    articles: [
      'How to set up your first county monitor',
      'Understanding the opportunity map',
      'Setting up alert preferences',
      'Reading your daily brief',
    ],
  },
  {
    icon: Bell,
    title: 'Alerts & Notifications',
    articles: [
      'Configuring email and SMS alerts',
      'Setting confidence thresholds',
      'Managing quiet hours',
      'Understanding alert types',
    ],
  },
  {
    icon: FileText,
    title: 'Reports & Exporting',
    articles: [
      'Generating executive reports',
      'Exporting opportunity data',
      'Scheduling recurring reports',
      'Custom report templates',
    ],
  },
  {
    icon: Shield,
    title: 'Security & Privacy',
    articles: [
      'How we protect your data',
      'Two-factor authentication',
      'Team access controls',
      'Data retention policies',
    ],
  },
  {
    icon: CreditCard,
    title: 'Billing & Plans',
    articles: [
      'Upgrading your plan',
      'Understanding usage limits',
      'Billing cycle and invoices',
      'Canceling your subscription',
    ],
  },
  {
    icon: Users,
    title: 'Team Management',
    articles: [
      'Adding team members',
      'Setting role permissions',
      'Managing county access',
      'Activity audit logs',
    ],
  },
];

const POPULAR_QUESTIONS = [
  'How do I add a new county to monitor?',
  'What is the confidence score?',
  'How often is data refreshed?',
  'Can I export my opportunity list?',
  'How do alert thresholds work?',
];

export default function HelpPage() {
  const { setCurrentPage } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const filteredCategories = searchQuery
    ? CATEGORIES.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.articles.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : CATEGORIES;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-[720px] mx-auto px-6 pt-10 pb-6 text-center">
        <h1 className="text-3xl font-semibold text-ink-primary tracking-tight mb-3">
          How Can We Help?
        </h1>
        <p className="text-sm text-ink-secondary max-w-[400px] mx-auto leading-relaxed">
          Search our knowledge base or browse by category to find answers.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-[480px] mx-auto px-6 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-ink-wash text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-accent-indigo/50 focus:ring-1 focus:ring-accent-indigo/20"
          />
        </div>

        {/* Popular searches */}
        {!searchQuery && (
          <div className="flex flex-wrap gap-2 mt-3">
            {POPULAR_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => setSearchQuery(q)}
                className="px-3 py-1.5 rounded-lg bg-surface border border-ink-wash text-[11px] text-ink-secondary hover:border-ink-secondary/50 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="max-w-[720px] mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;
            const isExpanded = expandedCategory === cat.title;

            return (
              <div
                key={cat.title}
                className="bg-surface rounded-xl border border-ink-wash overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedCategory(isExpanded ? null : cat.title)
                  }
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-accent-indigo" />
                    </div>
                    <span className="text-sm font-medium text-ink-primary">
                      {cat.title}
                    </span>
                  </div>
                  <span
                    className={`text-ink-tertiary transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-3 space-y-1">
                    {cat.articles.map((article) => (
                      <button
                        key={article}
                        onClick={() => {}}
                        className="w-full flex items-center gap-2 p-2.5 rounded-lg text-xs text-ink-secondary hover:bg-canvas hover:text-ink-primary transition-colors text-left"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-ink-tertiary shrink-0" />
                        {article}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-8 h-8 text-ink-tertiary mx-auto mb-3" />
            <p className="text-sm text-ink-secondary">
              No articles found for &ldquo;{searchQuery}&rdquo;
            </p>
            <p className="text-xs text-ink-tertiary mt-1">
              Try a different search term or contact support below.
            </p>
          </div>
        )}
      </div>

      {/* Contact support CTA */}
      <div className="border-y border-ink-wash bg-surface/50">
        <div className="max-w-[720px] mx-auto px-6 py-10">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-ink-primary mb-2">
              Still Need Help?
            </h2>
            <p className="text-sm text-ink-secondary">
              Our support team is available Monday through Friday, 9am-6pm ET.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setCurrentPage('contact')}
              className="flex items-center justify-center gap-2 p-4 rounded-xl bg-canvas border border-ink-wash hover:border-accent-indigo/30 hover:bg-surface transition-all"
            >
              <MessageCircle className="w-4 h-4 text-accent-indigo" />
              <span className="text-xs font-medium text-ink-primary">Live Chat</span>
            </button>
            <button
              onClick={() => setCurrentPage('contact')}
              className="flex items-center justify-center gap-2 p-4 rounded-xl bg-canvas border border-ink-wash hover:border-accent-indigo/30 hover:bg-surface transition-all"
            >
              <Mail className="w-4 h-4 text-accent-indigo" />
              <span className="text-xs font-medium text-ink-primary">Email Support</span>
            </button>
            <button
              onClick={() => setCurrentPage('contact')}
              className="flex items-center justify-center gap-2 p-4 rounded-xl bg-canvas border border-ink-wash hover:border-accent-indigo/30 hover:bg-surface transition-all"
            >
              <ArrowRight className="w-4 h-4 text-accent-indigo" />
              <span className="text-xs font-medium text-ink-primary">Contact Sales</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
