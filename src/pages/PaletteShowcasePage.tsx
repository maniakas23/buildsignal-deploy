import { useMemo, useCallback, useState, useEffect } from "react";
import { useTheme } from "@/themes";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Check,
  Eye,
  Contrast,
  RotateCcw,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Sun,
  Moon,
} from "lucide-react";

// ─── WCAG Contrast Utilities ───

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    const [r, g, b] = clean.split("").map((c) => parseInt(c + c, 16));
    if ([r, g, b].some((v) => Number.isNaN(v))) return null;
    return [r, g, b];
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    if ([r, g, b].some((v) => Number.isNaN(v))) return null;
    return [r, g, b];
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getWCAGLevel(ratio: number): "AAA" | "AA" | "AA Large" | "Fail" {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "Fail";
}

function getCssColor(varName: string): string {
  try {
    const val = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
    if (val.startsWith("#")) return val;
    if (val.startsWith("rgb")) {
      const match = val.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        return rgbToHex(
          Number(match[1]),
          Number(match[2]),
          Number(match[3])
        );
      }
    }
    return val || "#000000";
  } catch {
    return "#000000";
  }
}

// ─── Types ───
interface PaletteColor {
  primary: string;
  action: string;
  intelligence: string;
  opportunity: string;
  canvas: string;
  surface: string;
  [key: string]: string;
}

interface PaletteDef {
  id: string;
  name: string;
  description: string;
  colors: PaletteColor;
}

// ─── Contrast Grid Data ───
const TEXT_VARS = [
  { label: "textPrimary", varName: "--bs-text-primary" },
  { label: "textSecondary", varName: "--bs-text-secondary" },
  { label: "textInverse", varName: "--bs-text-inverse" },
];

const BG_VARS = [
  { label: "canvas", varName: "--bs-canvas" },
  { label: "surface", varName: "--bs-surface" },
  { label: "primary", varName: "--bs-primary" },
  { label: "action", varName: "--bs-action" },
];

// ─── Custom Badge Span (existing Badge component does not accept className) ───
function CustomBadge({
  children,
  variant = "neutral",
}: {
  children: React.ReactNode;
  variant?: "success" | "primary" | "warning" | "error" | "neutral";
}) {
  const styles: Record<string, string> = {
    success: "bg-[var(--bs-success)]/15 text-[var(--bs-success)] border-[var(--bs-success)]/25",
    primary: "bg-[var(--bs-primary)]/15 text-[var(--bs-primary)] border-[var(--bs-primary)]/25",
    warning: "bg-[var(--bs-warning)]/15 text-[var(--bs-warning)] border-[var(--bs-warning)]/25",
    error: "bg-[var(--bs-error)]/15 text-[var(--bs-error)] border-[var(--bs-error)]/25",
    neutral: "bg-[var(--bs-surface-hover)] text-[var(--bs-text-secondary)] border-[var(--bs-border)]",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

export function PaletteShowcasePage() {
  const { paletteId, setPalette, availablePalettes, resetToDefault } = useTheme();

  const activePalette = useMemo(
    () =>
      availablePalettes.find((p: PaletteDef) => p.id === paletteId) ||
      availablePalettes[0],
    [availablePalettes, paletteId]
  );

  // Contrast calculations for the active palette (recalculated on palette change)
  const [contrastData, setContrastData] = useState<{
    passRate: number;
    cells: {
      textLabel: string;
      bgLabel: string;
      textVar: string;
      bgVar: string;
      ratio: number;
      level: string;
    }[];
  }>({ passRate: 0, cells: [] });

  useEffect(() => {
    const cells: {
      textLabel: string;
      bgLabel: string;
      textVar: string;
      bgVar: string;
      ratio: number;
      level: string;
    }[] = [];
    let passCount = 0;
    let total = 0;

    for (const text of TEXT_VARS) {
      for (const bg of BG_VARS) {
        const textColor = getCssColor(text.varName);
        const bgColor = getCssColor(bg.varName);
        const ratio = getContrastRatio(textColor, bgColor);
        const level = getWCAGLevel(ratio);
        if (level !== "Fail") passCount++;
        total++;
        cells.push({
          textLabel: text.label,
          bgLabel: bg.label,
          textVar: text.varName,
          bgVar: bg.varName,
          ratio,
          level,
        });
      }
    }

    setContrastData({
      passRate: total > 0 ? Math.round((passCount / total) * 100) : 0,
      cells,
    });
  }, [paletteId]);

  const handleApply = useCallback(
    (id: string) => {
      setPalette(id as any);
    },
    [setPalette]
  );

  return (
    <div className="min-h-screen bg-[var(--bs-canvas)] text-[var(--bs-text-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ─── Hero Section ─── */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Design System
              </h1>
              <Badge>
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "var(--bs-action)" }}
                  />
                  Active: {activePalette?.name || "BuildSignal Official"}
                </span>
              </Badge>
            </div>
            <p className="text-lg text-[var(--bs-text-secondary)] max-w-2xl">
              Color Palettes &amp; Themes
            </p>
            <p className="mt-3 text-[var(--bs-text-secondary)] max-w-2xl">
              BuildSignal uses a psychology-driven color system designed to
              communicate trust, intelligence, and opportunity. Switch between
              palettes to see how the interface adapts.
            </p>
          </div>
          <Button
            onClick={resetToDefault}
            className="bg-[var(--bs-surface)] text-[var(--bs-text-primary)] border border-[var(--bs-border)] hover:bg-[var(--bs-surface-hover)]"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
        </div>

        {/* ─── Palette Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {availablePalettes.map((palette: PaletteDef) => {
            const isActive = palette.id === paletteId;
            const swatches = [
              palette.colors.primary,
              palette.colors.action,
              palette.colors.intelligence,
              palette.colors.opportunity,
              palette.colors.canvas,
              palette.colors.surface,
            ];
            return (
              <Card
                key={palette.id}
                className={`group relative border transition-all duration-200 hover:shadow-lg ${
                  isActive
                    ? "border-[var(--bs-action)] ring-1 ring-[var(--bs-action)]"
                    : "border-[var(--bs-border)] hover:border-[var(--bs-primary)]"
                } bg-[var(--bs-surface)]`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg font-semibold text-[var(--bs-text-primary)]">
                      {palette.name}
                    </CardTitle>
                    {isActive && (
                      <CustomBadge variant="primary">
                        <Check className="w-3 h-3 mr-1" />
                        Active
                      </CustomBadge>
                    )}
                  </div>
                  <p className="text-sm text-[var(--bs-text-secondary)] truncate">
                    {palette.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {swatches.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-md border border-[var(--bs-border)] shadow-sm"
                        style={{ backgroundColor: color }}
                        title={
                          [
                            "primary",
                            "action",
                            "intelligence",
                            "opportunity",
                            "canvas",
                            "surface",
                          ][idx]
                        }
                      />
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  {!isActive ? (
                    <Button
                      onClick={() => handleApply(palette.id)}
                      className="w-full bg-[var(--bs-action)] text-[var(--bs-text-inverse)] hover:opacity-90"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Apply
                    </Button>
                  ) : (
                    <Button
                      disabled
                      className="w-full bg-[var(--bs-surface-hover)] text-[var(--bs-text-tertiary)] border border-[var(--bs-border)]"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Applied
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* ─── Preview Section ─── */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Eye className="w-5 h-5 text-[var(--bs-primary)]" />
            Live Preview
          </h2>
          <Card className="border border-[var(--bs-border)] bg-[var(--bs-surface)] overflow-hidden">
            <CardContent className="p-6 space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[var(--bs-canvas)] rounded-lg p-4 border border-[var(--bs-border)]">
                  <p className="text-sm text-[var(--bs-text-secondary)] mb-1">
                    Total Opportunities
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[var(--bs-text-primary)]">
                      1,247
                    </span>
                    <CustomBadge variant="success">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12%
                    </CustomBadge>
                  </div>
                  <p className="text-xs text-[var(--bs-text-tertiary)] mt-2">
                    vs. last month
                  </p>
                </div>
                <div className="bg-[var(--bs-canvas)] rounded-lg p-4 border border-[var(--bs-border)]">
                  <p className="text-sm text-[var(--bs-text-secondary)] mb-1">
                    Active Signals
                  </p>
                  <div className="text-2xl font-bold text-[var(--bs-text-primary)]">
                    89
                  </div>
                  <p className="text-xs text-[var(--bs-text-tertiary)] mt-2">
                    3 pending review
                  </p>
                </div>
                <div className="bg-[var(--bs-canvas)] rounded-lg p-4 border border-[var(--bs-border)]">
                  <p className="text-sm text-[var(--bs-text-secondary)] mb-1">
                    Verified Projects
                  </p>
                  <div className="text-2xl font-bold text-[var(--bs-text-primary)]">
                    342
                  </div>
                  <p className="text-xs text-[var(--bs-text-tertiary)] mt-2">
                    98% accuracy rate
                  </p>
                </div>
              </div>

              {/* Button Row */}
              <div className="flex flex-wrap gap-3">
                <Button className="bg-[var(--bs-primary)] text-[var(--bs-text-inverse)] hover:opacity-90">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button className="bg-[var(--bs-surface)] text-[var(--bs-text-primary)] border border-[var(--bs-border)] hover:bg-[var(--bs-surface-hover)]">
                  View Pricing
                </Button>
                <Button className="bg-[var(--bs-success)]/20 text-[var(--bs-success)] border border-[var(--bs-success)]/30 hover:bg-[var(--bs-success)]/30">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Verified
                </Button>
                <Button className="bg-[var(--bs-warning)]/20 text-[var(--bs-warning)] border border-[var(--bs-warning)]/30 hover:bg-[var(--bs-warning)]/30">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Alert
                </Button>
              </div>

              {/* Alert Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bs-info)]/10 border border-[var(--bs-info)]/20 text-[var(--bs-info)]">
                  <Info className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">New opportunity detected</p>
                    <p className="text-xs opacity-80">
                      Infrastructure project in Austin, TX
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bs-success)]/10 border border-[var(--bs-success)]/20 text-[var(--bs-success)]">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Project verified</p>
                    <p className="text-xs opacity-80">
                      All checks passed successfully
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bs-warning)]/10 border border-[var(--bs-warning)]/20 text-[var(--bs-warning)]">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Deadline approaching</p>
                    <p className="text-xs opacity-80">RFQ closes in 48 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bs-error)]/10 border border-[var(--bs-error)]/20 text-[var(--bs-error)]">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Risk detected</p>
                    <p className="text-xs opacity-80">
                      Budget variance exceeds 15%
                    </p>
                  </div>
                </div>
              </div>

              {/* Mini Bar Chart */}
              <div className="bg-[var(--bs-canvas)] rounded-lg p-4 border border-[var(--bs-border)]">
                <p className="text-sm font-medium text-[var(--bs-text-secondary)] mb-4">
                  Weekly Signals
                </p>
                <div className="flex items-end gap-3 h-32">
                  {[45, 72, 58, 91, 67].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-md transition-all duration-500"
                        style={{
                          height: `${h}%`,
                          backgroundColor: `var(--bs-chart-${i + 1})`,
                        }}
                      />
                      <span className="text-xs text-[var(--bs-text-tertiary)]">
                        {["Mon", "Tue", "Wed", "Thu", "Fri"][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Text Hierarchy */}
              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-[var(--bs-text-primary)]">
                  Opportunity Discovery
                </h1>
                <p className="text-base text-[var(--bs-text-secondary)]">
                  BuildSignal identifies infrastructure opportunities across
                  federal, state, and local jurisdictions. Our AI-powered platform
                  scans thousands of data sources to surface projects aligned with
                  your capabilities.
                </p>
                <p className="text-sm text-[var(--bs-text-tertiary)]">
                  Updated 2 minutes ago · Showing 12 of 247 results
                </p>
              </div>

              {/* Theme toggle preview */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-[var(--bs-text-secondary)]">
                  <Sun className="w-4 h-4" />
                  <span className="text-sm">Light</span>
                </div>
                <div className="w-10 h-5 rounded-full bg-[var(--bs-primary)] relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-[var(--bs-text-inverse)]" />
                </div>
                <div className="flex items-center gap-2 text-[var(--bs-text-secondary)]">
                  <Moon className="w-4 h-4" />
                  <span className="text-sm">Dark</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── WCAG Accessibility Section ─── */}
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Contrast className="w-5 h-5 text-[var(--bs-primary)]" />
            WCAG Accessibility
          </h2>
          <p className="text-[var(--bs-text-secondary)] mb-6">
            Contrast ratios for the active palette. AA requires 4.5:1, AAA
            requires 7:1.
          </p>

          <Card className="border border-[var(--bs-border)] bg-[var(--bs-surface)]">
            <CardHeader>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <CardTitle className="text-lg">
                  Contrast Grid — {activePalette?.name}
                </CardTitle>
                <CustomBadge variant={contrastData.passRate >= 80 ? "success" : contrastData.passRate >= 50 ? "primary" : "warning"}>
                  Pass rate: {contrastData.passRate}%
                </CustomBadge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--bs-border)]">
                      <th className="text-left py-2 px-3 text-[var(--bs-text-secondary)] font-medium">
                        Text / Background
                      </th>
                      {BG_VARS.map((bg) => (
                        <th
                          key={bg.label}
                          className="text-center py-2 px-3 text-[var(--bs-text-secondary)] font-medium"
                        >
                          {bg.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TEXT_VARS.map((text) => (
                      <tr
                        key={text.label}
                        className="border-b border-[var(--bs-border)] last:border-0"
                      >
                        <td className="py-3 px-3 font-medium text-[var(--bs-text-primary)]">
                          {text.label}
                        </td>
                        {contrastData.cells
                          .filter((c) => c.textLabel === text.label)
                          .map((cell, idx) => (
                            <td key={idx} className="py-3 px-3 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <span
                                  className="text-xs font-mono"
                                  style={{
                                    color: getCssColor(cell.textVar),
                                  }}
                                >
                                  {cell.ratio.toFixed(2)}:1
                                </span>
                                <CustomBadge
                                  variant={
                                    cell.level === "AAA"
                                      ? "success"
                                      : cell.level === "AA"
                                      ? "primary"
                                      : cell.level === "AA Large"
                                      ? "warning"
                                      : "error"
                                  }
                                >
                                  {cell.level}
                                </CustomBadge>
                                <div
                                  className="w-16 h-8 rounded border border-[var(--bs-border)] mt-1 flex items-center justify-center text-[10px] font-mono"
                                  style={{
                                    backgroundColor: getCssColor(cell.bgVar),
                                    color: getCssColor(cell.textVar),
                                  }}
                                >
                                  Aa
                                </div>
                              </div>
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="mt-6 flex flex-wrap gap-4 text-xs text-[var(--bs-text-secondary)]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[var(--bs-success)]" />
                  <span>AAA (7:1+)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[var(--bs-primary)]" />
                  <span>AA (4.5:1+)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[var(--bs-warning)]" />
                  <span>AA Large (3:1+)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[var(--bs-error)]" />
                  <span>Fail (&lt;3:1)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
