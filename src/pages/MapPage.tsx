import { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  Map, Layers, Filter, Crosshair, X,
  Navigation, ZoomIn, ZoomOut,
  Building2, HardHat, Zap, Droplets, Route,
  ChevronDown, Target
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                          */
/* ------------------------------------------------------------------ */

const MAP_MARKERS = [
  { id: 1, lat: 35.8, lng: -78.6, name: 'Apex Town Center', type: 'mixed-use', confidence: 92, signals: 47, x: 65, y: 45 },
  { id: 2, lat: 35.8, lng: -78.8, name: 'Morrisville Station', type: 'transit', confidence: 78, signals: 31, x: 45, y: 40 },
  { id: 3, lat: 35.9, lng: -78.7, name: 'Duke Substation', type: 'utility', confidence: 85, signals: 23, x: 55, y: 30 },
  { id: 4, lat: 35.7, lng: -78.5, name: 'Garner Industrial', type: 'industrial', confidence: 72, signals: 18, x: 75, y: 55 },
  { id: 5, lat: 35.9, lng: -78.5, name: 'Wake Schools Phase 3', type: 'education', confidence: 88, signals: 15, x: 75, y: 25 },
  { id: 6, lat: 35.7, lng: -78.8, name: 'Cary Medical Center', type: 'healthcare', confidence: 68, signals: 12, x: 42, y: 58 },
];

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  'mixed-use': { icon: Building2, color: 'text-accent-indigo', bg: 'bg-accent-indigo', label: 'Mixed-Use' },
  'transit': { icon: Route, color: 'text-accent-teal', bg: 'bg-accent-teal', label: 'Transit' },
  'utility': { icon: Zap, color: 'text-accent-amber', bg: 'bg-accent-amber', label: 'Utility' },
  'industrial': { icon: HardHat, color: 'text-accent-violet', bg: 'bg-accent-violet', label: 'Industrial' },
  'education': { icon: Building2, color: 'text-accent-crimson', bg: 'bg-accent-crimson', label: 'Education' },
  'healthcare': { icon: Droplets, color: 'text-accent-indigo', bg: 'bg-accent-indigo', label: 'Healthcare' },
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function MapPage() {
  const { setCurrentPage } = useStore();
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [selectedMarker, setSelectedMarker] = useState<typeof MAP_MARKERS[0] | null>(null);
  const [showLegend, setShowLegend] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [zoom, setZoom] = useState(1);

  const toggleFilter = (type: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const filteredMarkers = activeFilters.size === 0
    ? MAP_MARKERS
    : MAP_MARKERS.filter((m) => activeFilters.has(m.type));

  const getMarkerColor = (confidence: number) => {
    if (confidence >= 85) return 'bg-accent-teal';
    if (confidence >= 70) return 'bg-accent-indigo';
    return 'bg-accent-amber';
  };

  return (
    <div className="h-[calc(100vh-64px)] relative flex flex-col -mt-2">
      {/* Header bar */}
      <div className="shrink-0 bg-surface border-b border-ink-wash px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center">
            <Map className="w-4 h-4 text-accent-indigo" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-ink-primary">Intelligence Map</h1>
            <p className="text-[10px] text-ink-tertiary">
              {filteredMarkers.length} opportunities visible
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              showFilters ? 'bg-accent-indigo/10 border-accent-indigo/30 text-accent-indigo' : 'bg-canvas border-ink-wash text-ink-secondary hover:bg-surface-hover'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
          <button
            onClick={() => setShowLegend(!showLegend)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              showLegend ? 'bg-accent-indigo/10 border-accent-indigo/30 text-accent-indigo' : 'bg-canvas border-ink-wash text-ink-secondary hover:bg-surface-hover'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Legend</span>
          </button>
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 relative overflow-hidden bg-canvas">
        {/* Simulated map background */}
        <div
          className="absolute inset-0 transition-transform duration-300"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Grid lines to simulate map */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Simulated county outlines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon
              points="40,20 70,25 75,50 65,75 35,70 30,45"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.3"
              className="text-ink-secondary opacity-30"
            />
            <polygon
              points="70,25 90,30 95,55 80,80 65,75 75,50"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.3"
              className="text-ink-secondary opacity-20"
            />
            <polygon
              points="20,40 30,45 35,70 25,85 10,70 15,50"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.3"
              className="text-ink-secondary opacity-20"
            />
            {/* Major roads */}
            <line x1="0" y1="40" x2="100" y2="45" stroke="currentColor" strokeWidth="0.2" className="text-accent-amber opacity-20" />
            <line x1="55" y1="0" x2="60" y2="100" stroke="currentColor" strokeWidth="0.2" className="text-accent-amber opacity-20" />
          </svg>

          {/* County labels */}
          <div className="absolute top-[30%] left-[45%] text-[10px] text-ink-tertiary font-medium opacity-50">Wake County</div>
          <div className="absolute top-[35%] left-[78%] text-[10px] text-ink-tertiary font-medium opacity-40">Johnston</div>
          <div className="absolute top-[60%] left-[25%] text-[10px] text-ink-tertiary font-medium opacity-40">Chatham</div>
        </div>

        {/* Markers */}
        {filteredMarkers.map((marker) => {
          const config = TYPE_CONFIG[marker.type];
          return (
            <button
              key={marker.id}
              onClick={() => setSelectedMarker(marker)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            >
              {/* Pulse ring for high confidence */}
              {marker.confidence >= 85 && (
                <span className="absolute inset-0 animate-ping rounded-full bg-accent-teal/30 w-6 h-6 -m-1" />
              )}
              {/* Marker dot */}
              <div className={`w-4 h-4 rounded-full ${getMarkerColor(marker.confidence)} border-2 border-surface shadow-lg group-hover:scale-125 transition-transform`} />
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-surface border border-ink-wash rounded-lg px-2.5 py-1.5 shadow-xl whitespace-nowrap">
                  <p className="text-[10px] font-medium text-ink-primary">{marker.name}</p>
                  <p className="text-[9px] text-ink-tertiary">{config.label} — {marker.confidence}% confidence</p>
                </div>
              </div>
            </button>
          );
        })}

        {/* Zoom controls */}
        <div className="absolute right-3 top-3 flex flex-col gap-1">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
            className="w-8 h-8 rounded-lg bg-surface border border-ink-wash flex items-center justify-center hover:bg-surface-hover transition-colors shadow-md"
          >
            <ZoomIn className="w-4 h-4 text-ink-secondary" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
            className="w-8 h-8 rounded-lg bg-surface border border-ink-wash flex items-center justify-center hover:bg-surface-hover transition-colors shadow-md"
          >
            <ZoomOut className="w-4 h-4 text-ink-secondary" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="w-8 h-8 rounded-lg bg-surface border border-ink-wash flex items-center justify-center hover:bg-surface-hover transition-colors shadow-md"
            title="Reset view"
          >
            <Crosshair className="w-4 h-4 text-ink-secondary" />
          </button>
        </div>

        {/* Legend panel */}
        {showLegend && (
          <div className="absolute left-3 bottom-3 bg-surface border border-ink-wash rounded-xl p-3 shadow-lg max-w-[180px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-ink-primary uppercase tracking-wider">Legend</span>
              <button onClick={() => setShowLegend(false)} className="w-5 h-5 rounded hover:bg-canvas flex items-center justify-center">
                <X className="w-3 h-3 text-ink-tertiary" />
              </button>
            </div>

            {/* Project types */}
            <div className="space-y-1.5 mb-3">
              {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <button
                    key={type}
                    onClick={() => toggleFilter(type)}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-[10px] transition-all ${
                      activeFilters.has(type)
                        ? 'bg-accent-indigo/10 text-accent-indigo'
                        : activeFilters.size > 0
                        ? 'text-ink-tertiary opacity-50'
                        : 'text-ink-secondary hover:bg-canvas'
                    }`}
                  >
                    <Icon className={`w-3 h-3 ${cfg.color}`} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>

            {/* Confidence legend */}
            <div className="border-t border-ink-wash/50 pt-2">
              <span className="text-[9px] text-ink-tertiary uppercase tracking-wider">Confidence</span>
              <div className="mt-1.5 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-teal" />
                  <span className="text-[10px] text-ink-secondary">85%+ High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-indigo" />
                  <span className="text-[10px] text-ink-secondary">70-84% Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-amber" />
                  <span className="text-[10px] text-ink-secondary">&lt;70% Early</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legend toggle (when collapsed) */}
        {!showLegend && (
          <button
            onClick={() => setShowLegend(true)}
            className="absolute left-3 bottom-3 w-8 h-8 rounded-lg bg-surface border border-ink-wash flex items-center justify-center hover:bg-surface-hover shadow-md transition-colors"
          >
            <Layers className="w-4 h-4 text-ink-secondary" />
          </button>
        )}
      </div>

      {/* Selected marker detail panel */}
      {selectedMarker && (
        <div className="shrink-0 bg-surface border-t border-ink-wash p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${TYPE_CONFIG[selectedMarker.type]?.bg || 'bg-accent-indigo'}/10`}>
                {(() => {
                  const Icon = TYPE_CONFIG[selectedMarker.type]?.icon || Target;
                  return <Icon className={`w-5 h-5 ${TYPE_CONFIG[selectedMarker.type]?.color || 'text-accent-indigo'}`} />;
                })()}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink-primary">{selectedMarker.name}</h3>
                <p className="text-[11px] text-ink-secondary mt-0.5">
                  {TYPE_CONFIG[selectedMarker.type]?.label} — {selectedMarker.signals} signals
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Target className="w-3 h-3 text-accent-teal" />
                    <span className="text-ink-secondary">{selectedMarker.confidence}% confidence</span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Navigation className="w-3 h-3 text-ink-tertiary" />
                    <span className="text-ink-tertiary">{selectedMarker.lat.toFixed(2)}, {selectedMarker.lng.toFixed(2)}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="px-4 py-2 rounded-lg bg-accent-indigo text-white text-xs font-semibold hover:bg-accent-indigo-dim transition-all"
              >
                View Details
              </button>
              <button
                onClick={() => setSelectedMarker(null)}
                className="w-8 h-8 rounded-lg hover:bg-canvas flex items-center justify-center"
              >
                <X className="w-4 h-4 text-ink-tertiary" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter panel (mobile slide-up) */}
      {showFilters && (
        <div className="absolute inset-x-0 bottom-0 bg-surface border-t border-ink-wash rounded-t-2xl shadow-2xl z-10 max-h-[50vh] overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b border-ink-wash/50">
            <span className="text-sm font-semibold text-ink-primary">Filter Opportunities</span>
            <button onClick={() => setShowFilters(false)} className="w-7 h-7 rounded-lg hover:bg-canvas flex items-center justify-center">
              <ChevronDown className="w-4 h-4 text-ink-tertiary" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider">Project Type</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
                  const Icon = cfg.icon;
                  const isActive = activeFilters.has(type);
                  return (
                    <button
                      key={type}
                      onClick={() => toggleFilter(type)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border transition-all ${
                        isActive
                          ? 'bg-accent-indigo/10 border-accent-indigo/30 text-accent-indigo'
                          : 'bg-canvas border-ink-wash text-ink-secondary hover:border-ink-secondary/50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              onClick={() => setActiveFilters(new Set())}
              className="w-full py-2.5 rounded-lg bg-canvas border border-ink-wash text-xs font-medium text-ink-secondary hover:bg-surface-hover transition-all"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
