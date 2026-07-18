import { Sparkles } from 'lucide-react';
import { isDemoMode } from '@/signalcore/engine';

export function DemoBadge() {
  if (!isDemoMode()) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent-amber/10 text-accent-amber text-[10px] font-medium">
      <Sparkles className="w-3 h-3" /> Demo
    </span>
  );
}
