import { useState } from "react";
import { BookOpen, ChevronRight, Star, Clock, User } from "lucide-react";

const STORIES = [
  {
    id: "story-001",
    title: "How Raleigh Developer Won $45M Contract Using Early Signals",
    excerpt: "By monitoring permit filings and utility expansion patterns 8 months ahead of competitors, a mid-size developer secured the Apex Town Center Phase 2 contract before it went to public bid.",
    author: "BuildSignal Editorial",
    readTime: "5 min",
    category: "Case Study",
    featured: true,
  },
  {
    id: "story-002",
    title: "The 6-Month Window: Why Timing Matters in CRE Intelligence",
    excerpt: "Analysis of 200+ successful construction bids shows that companies using early signal detection have a 3.2x higher win rate compared to those relying on public RFPs.",
    author: "Kestovar Research Team",
    readTime: "8 min",
    category: "Research",
    featured: false,
  },
  {
    id: "story-003",
    title: "Transit-Oriented Development: Pattern of the Year",
    excerpt: "Our Kestovar Engine identified Transit-Oriented Development as the strongest growth pattern in North Carolina, with 94% confidence and 47 supporting signals.",
    author: "Data Science Team",
    readTime: "4 min",
    category: "Analysis",
    featured: false,
  },
];

export default function GrowthStoriesPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent-indigo/10 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-accent-indigo" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-ink-primary">Growth Stories</h1>
          <p className="text-xs text-ink-tertiary">Case studies and analysis from Kestovar</p>
        </div>
      </div>

      <div className="space-y-4">
        {STORIES.map((story) => (
          <button
            key={story.id}
            onClick={() => setSelected(selected === story.id ? null : story.id)}
            className="w-full text-left bg-surface border border-ink-wash rounded-xl p-4 hover:border-accent-indigo/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {story.featured && <Star className="w-3 h-3 text-accent-amber" />}
                  <span className="text-[10px] font-medium text-accent-indigo uppercase tracking-wider">{story.category}</span>
                </div>
                <h3 className="text-sm font-semibold text-ink-primary">{story.title}</h3>
                <p className="text-xs text-ink-secondary mt-1 line-clamp-2">{story.excerpt}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-[10px] text-ink-tertiary">
                    <User className="w-3 h-3" />{story.author}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-ink-tertiary">
                    <Clock className="w-3 h-3" />{story.readTime}
                  </span>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-ink-tertiary transition-transform ${selected === story.id ? "rotate-90" : ""}`} />
            </div>

            {selected === story.id && (
              <div className="mt-3 pt-3 border-t border-ink-wash/50">
                <p className="text-xs text-ink-secondary leading-relaxed">{story.excerpt}</p>
                <p className="text-[11px] text-ink-tertiary mt-2">Full article coming soon.</p>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
