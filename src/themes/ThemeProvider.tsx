import React, { createContext, useContext, useEffect, useState } from "react";
import { PaletteId } from "./types";
import { palettes, defaultPalette } from "./palettes";

interface ThemeContextValue {
  paletteId: PaletteId;
  setPalette: (id: PaletteId) => void;
  availablePalettes: typeof palettes;
  resetToDefault: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "buildsignal_active_palette";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [paletteId, setPaletteId] = useState<PaletteId>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as PaletteId;
      return palettes.find(p => p.id === stored) ? stored : defaultPalette.id;
    } catch {
      return defaultPalette.id;
    }
  });

  const setPalette = (id: PaletteId) => {
    setPaletteId(id);
    try { localStorage.setItem(STORAGE_KEY, id); } catch {}
  };

  const resetToDefault = () => setPalette(defaultPalette.id);

  // Inject CSS variables on palette change
  useEffect(() => {
    const palette = palettes.find(p => p.id === paletteId) || defaultPalette;
    const root = document.documentElement;
    const c = palette.colors;
    
    root.style.setProperty("--bs-canvas", c.canvas);
    root.style.setProperty("--bs-surface", c.surface);
    root.style.setProperty("--bs-surface-hover", c.surfaceHover);
    root.style.setProperty("--bs-elevated", c.elevated);
    root.style.setProperty("--bs-primary", c.primary);
    root.style.setProperty("--bs-action", c.action);
    root.style.setProperty("--bs-intelligence", c.intelligence);
    root.style.setProperty("--bs-opportunity", c.opportunity);
    root.style.setProperty("--bs-text-primary", c.textPrimary);
    root.style.setProperty("--bs-text-secondary", c.textSecondary);
    root.style.setProperty("--bs-text-tertiary", c.textTertiary);
    root.style.setProperty("--bs-text-inverse", c.textInverse);
    root.style.setProperty("--bs-success", c.success);
    root.style.setProperty("--bs-warning", c.warning);
    root.style.setProperty("--bs-error", c.error);
    root.style.setProperty("--bs-info", c.info);
    root.style.setProperty("--bs-border", c.border);
    root.style.setProperty("--bs-divider", c.divider);
    root.style.setProperty("--bs-chart-1", c.chart1);
    root.style.setProperty("--bs-chart-2", c.chart2);
    root.style.setProperty("--bs-chart-3", c.chart3);
    root.style.setProperty("--bs-chart-4", c.chart4);
    root.style.setProperty("--bs-chart-5", c.chart5);
    
    // Toggle dark class on body for Tailwind dark mode
    if (palette.isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [paletteId]);

  return (
    <ThemeContext.Provider value={{ paletteId, setPalette, availablePalettes: palettes, resetToDefault }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
