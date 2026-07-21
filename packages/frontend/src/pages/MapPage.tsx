import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useStore } from '@/store/useStore';
import {
  MapPin, Layers, Filter, X,
  Building2, HardHat, Zap, Landmark, Hospital, Home, Store
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fetchProjects, EngineError } from '@/kestovar/engine';
import type { Project } from '@/types';
import { LoadingState, ErrorState } from '@/components/ui-custom/EngineStates';

// Fix Leaflet default icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Project type icons and colors
const TYPE_ICONS: Record<string, { color: string; label: string; Icon: React.ElementType }> = {
  infrastructure: { color: '#f59e0b', label: 'Infrastructure', Icon: Zap },
  commercial:     { color: '#14b8a6', label: 'Commercial',     Icon: Store },
  industrial:     { color: '#8b5cf6', label: 'Industrial',     Icon: HardHat },
  education:      { color: '#ef4444', label: 'Education',      Icon: Landmark },
  healthcare:     { color: '#3b82f6', label: 'Healthcare',     Icon: Hospital },
  residential:    { color: '#10b981', label: 'Residential',    Icon: Home },
  mixed_use:      { color: '#6366f1', label: 'Mixed-Use',      Icon: Building2 },
  zoning:         { color: '#ec4899', label: 'Zoning',         Icon: Landmark },
  utility:        { color: '#06b6d4', label: 'Utility',        Icon: Zap },
};

// North Carolina center
const NC_CENTER: [number, number] = [35.5, -79.0];
const NC_BOUNDS = L.latLngBounds([33.8, -84.5], [36.6, -75.2]);

function MapBounds() {
  const map = useMap();
  useEffect(() => { map.fitBounds(NC_BOUNDS, { padding: [20, 20] }); }, [map]);
  return null;
}

export default function MapPage() {
  const { setCurrentPage } = useStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(true);

  // Load projects from Kestovar Engine
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchProjects();
        if (!cancelled) {
          setProjects(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof EngineError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Failed to load map data';
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Transform projects to markers
  const markers = useMemo(() => {
    return projects.map((p) => {
      const typeConfig = TYPE_ICONS[p.type] || TYPE_ICONS.mixed_use;
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        lat: p.lat || (35.5 + (Math.random() - 0.5) * 2),
        lng: p.lng || (-79.0 + (Math.random() - 0.5) * 3),
        type: p.type,
        status: p.status,
        confidence: p.confidence,
        score: p.score,
        county: p.county,
        location: p.location,
        signalCount: p.signalCount,
        typeConfig,
      };
    });
  }, [projects]);

  const filteredMarkers = activeFilters.size === 0
    ? markers
    : markers.filter((m) => activeFilters.has(m.type));

  const toggleFilter = (type: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  if (loading) return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center">
      <LoadingState message="Loading map data..." />
    </div>
  );

  if (error) return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center">
      <ErrorState message={error} onRetry={() => window.location.reload()} />
    </div>
  );

  return (
    <div className="h-[calc(100vh-64px)] relative flex flex-col -mt-2">
      {/* Header */}
      <div className="shrink-0 bg-surface border-b border-ink-wash px-4 py-2.5 flex items-center justify-between z-[1000]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-accent-indigo" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-ink-primary">Intelligence Map</h1>
            <p className="text-[10px] text-ink-tertiary">{filteredMarkers.length} opportunities visible</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilters(new Set())}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-ink-wash bg-canvas text-ink-secondary hover:bg-surface-hover transition-all"
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
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

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={NC_CENTER}
          zoom={7}
          minZoom={6}
          maxZoom={16}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapBounds />

          {filteredMarkers.map((m) => (
            <Marker
              key={m.id}
              position={[m.lat, m.lng]}
              eventHandlers={{
                click: () => setSelectedMarker(m.id),
              }}
            >
              <Popup>
                <div className="min-w-[220px]">
                  <h3 className="text-sm font-semibold text-ink-primary">{m.name}</h3>
                  <p className="text-[11px] text-ink-secondary mt-1">{m.description?.substring(0, 100)}...</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: m.typeConfig.color + '20', color: m.typeConfig.color }}
                    >
                      {m.typeConfig.label}
                    </span>
                    <span className="text-[10px] text-ink-tertiary">{m.confidence}% confidence</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-ink-tertiary">
                    <span>Score: {m.score}</span>
                    <span>{m.signalCount} signals</span>
                  </div>
                  <p className="text-[10px] text-ink-tertiary mt-1">{m.location}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend panel */}
        {showLegend && (
          <div className="absolute left-3 bottom-3 bg-surface/95 backdrop-blur border border-ink-wash rounded-xl p-3 shadow-lg max-w-[180px] z-[1000]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-ink-primary uppercase tracking-wider">Project Types</span>
              <button onClick={() => setShowLegend(false)} className="w-5 h-5 rounded hover:bg-canvas flex items-center justify-center">
                <X className="w-3 h-3 text-ink-tertiary" />
              </button>
            </div>
            <div className="space-y-1.5 max-h-[240px] overflow-y-auto">
              {Object.entries(TYPE_ICONS).map(([type, cfg]) => {
                const isActive = activeFilters.has(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleFilter(type)}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-[10px] transition-all ${
                      isActive ? 'bg-accent-indigo/10 text-accent-indigo' : activeFilters.size > 0 ? 'text-ink-tertiary opacity-50' : 'text-ink-secondary hover:bg-canvas'
                    }`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
