import { useState } from "react";
import { Palette, Check, X } from "lucide-react";
import { useTheme } from "@/themes";

export function ThemeSwitcher() {
  const { paletteId, setPalette, availablePalettes, resetToDefault } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-[var(--bs-primary)] text-[var(--bs-text-inverse)] shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        title="Change theme"
      >
        {open ? <X className="w-4 h-4" /> : <Palette className="w-4 h-4" />}
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute bottom-12 left-0 w-64 bg-[var(--bs-surface)] border border-[var(--bs-border)] rounded-xl shadow-xl p-3">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold text-[var(--bs-text-primary)]">Themes</span>
            <button onClick={resetToDefault} className="text-[10px] text-[var(--bs-action)] hover:underline">
              Reset
            </button>
          </div>
          <div className="space-y-1 max-h-72 overflow-y-auto">
            {availablePalettes.map((palette) => (
              <button
                key={palette.id}
                onClick={() => { setPalette(palette.id as any); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors ${
                  paletteId === palette.id
                    ? "bg-[var(--bs-action)]/10 text-[var(--bs-action)]"
                    : "hover:bg-[var(--bs-surface-hover)] text-[var(--bs-text-primary)]"
                }`}
              >
                {/* Mini swatches */}
                <div className="flex gap-0.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: palette.colors.primary }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: palette.colors.action }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: palette.colors.intelligence }} />
                </div>
                <span className="text-xs font-medium flex-1">{palette.name}</span>
                {paletteId === palette.id && <Check className="w-3 h-3" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
