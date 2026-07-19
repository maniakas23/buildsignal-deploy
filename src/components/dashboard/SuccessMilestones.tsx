import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  Check, Star, Trophy, Target, Bell, Search,
  FileText, MapPin, Sparkles, X
} from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  storageKey: string;
}

const MILESTONES: Milestone[] = [
  {
    id: 'first-login',
    title: 'Welcome aboard!',
    description: 'Your intelligence dashboard is ready.',
    icon: Sparkles,
    color: 'text-accent-indigo',
    bgColor: 'bg-accent-indigo/10',
    storageKey: 'milestone-first-login',
  },
  {
    id: 'first-search',
    title: 'First Search Complete',
    description: 'You are on your way to finding great opportunities.',
    icon: Search,
    color: 'text-accent-teal',
    bgColor: 'bg-accent-teal/10',
    storageKey: 'milestone-first-search',
  },
  {
    id: 'first-alert',
    title: 'Alert Configured',
    description: 'You will be notified when new opportunities appear.',
    icon: Bell,
    color: 'text-accent-amber',
    bgColor: 'bg-accent-amber/10',
    storageKey: 'milestone-first-alert',
  },
  {
    id: 'first-report',
    title: 'First Report Generated',
    description: 'Your team will love these intelligence briefs.',
    icon: FileText,
    color: 'text-accent-violet',
    bgColor: 'bg-accent-violet/10',
    storageKey: 'milestone-first-report',
  },
  {
    id: 'first-watchlist',
    title: 'Watchlist Created',
    description: 'You are tracking projects that matter to you.',
    icon: Target,
    color: 'text-accent-indigo',
    bgColor: 'bg-accent-indigo/10',
    storageKey: 'milestone-first-watchlist',
  },
  {
    id: 'explorer',
    title: 'Explorer Badge',
    description: 'You have visited 5 different pages. Keep exploring!',
    icon: MapPin,
    color: 'text-accent-teal',
    bgColor: 'bg-accent-teal/10',
    storageKey: 'milestone-explorer',
  },
  {
    id: 'power-user',
    title: 'Power User',
    description: 'You have unlocked all core features. Impressive!',
    icon: Trophy,
    color: 'text-accent-amber',
    bgColor: 'bg-accent-amber/10',
    storageKey: 'milestone-power-user',
  },
];

export function triggerMilestone(milestoneId: string) {
  const milestone = MILESTONES.find((m) => m.id === milestoneId);
  if (!milestone) return;

  const alreadyShown = localStorage.getItem(milestone.storageKey);
  if (alreadyShown) return;

  localStorage.setItem(milestone.storageKey, 'true');

  // Dispatch a custom event that SuccessMilestones listens for
  window.dispatchEvent(
    new CustomEvent('buildsignal-milestone', {
      detail: { milestoneId },
    })
  );
}

export function checkExplorerMilestone() {
  const pages = JSON.parse(localStorage.getItem('buildsignal-pages-visited') || '[]');
  if (pages.length >= 5) {
    triggerMilestone('explorer');
  }
}

export function recordPageVisit(page: string) {
  const pages = JSON.parse(localStorage.getItem('buildsignal-pages-visited') || '[]');
  if (!pages.includes(page)) {
    pages.push(page);
    localStorage.setItem('buildsignal-pages-visited', JSON.stringify(pages));
    checkExplorerMilestone();
  }
}

export default function SuccessMilestones() {
  const { addToast } = useStore();
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent;
      const milestone = MILESTONES.find((m) => m.id === custom.detail?.milestoneId);
      if (milestone) {
        setActiveMilestone(milestone);
      }
    };

    window.addEventListener('buildsignal-milestone', handler);
    return () => window.removeEventListener('buildsignal-milestone', handler);
  }, []);

  // Show first-login milestone on mount (first visit)
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerMilestone('first-login');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeMilestone) {
      addToast(
        `${activeMilestone.title}: ${activeMilestone.description}`,
        'success'
      );
      const timer = setTimeout(() => setActiveMilestone(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [activeMilestone, addToast]);

  return null; // This component works through the toast system
}
