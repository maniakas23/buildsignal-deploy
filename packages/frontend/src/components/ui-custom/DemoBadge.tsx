import { useStore } from "@/store/useStore";

export function DemoBadge() {
  const { useMockData } = useStore();
  if (!useMockData) return null;
  return (
    <div className="fixed top-2 right-2 z-50">
      <span className="px-2 py-1 rounded-full bg-accent-amber/10 border border-accent-amber/20 text-[10px] font-medium text-accent-amber animate-pulse">
        Demo Mode — Toggle off for live Kestovar data
      </span>
    </div>
  );
}
