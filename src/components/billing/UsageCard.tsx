// Usage card — extracted from BillingPage (m1(24C)); m1(28): consume the real
// billing.usage envelope ({ plan, usage: {...}, apiAccess, period }) and the
// backend's truthful semantics (allowed/unlimited/status), never fabricate usage.
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UsageCardProps {
  usage: any;
  usageLoading: boolean;
}

interface UsageRow {
  label: string;
  display: string;
  ratio: number | null; // null → no progress bar
}

/** Map the production billing.usage envelope to display rows. */
export function mapUsageEnvelope(envelope: any): UsageRow[] | null {
  if (!envelope || typeof envelope !== "object") return null;
  // Unwrap the { plan, usage, ... } envelope; tolerate a bare usage object too.
  const u = envelope.usage && typeof envelope.usage === "object" ? envelope.usage : envelope;
  if (!u.counties || typeof u.counties !== "object") return null;

  const num = (v: any) => (typeof v === "number" && Number.isFinite(v) ? v : null);
  // Field name contract: backend uses `allowed` (null = explicit unlimited);
  // tolerate legacy `limit`.
  const limitOf = (c: any) => num(c?.allowed) ?? num(c?.limit);

  const metered = (label: string, c: any): UsageRow => {
    const used = num(c?.used);
    const limit = limitOf(c);
    if (c?.unlimited === true || (limit === null && c?.allowed === null)) {
      return { label, display: used === null ? "—" : `${used} · Unlimited`, ratio: null };
    }
    if (used === null || limit === null) return { label, display: "—", ratio: null };
    return { label, display: `${used} / ${limit}`, ratio: limit > 0 ? Math.min((used / limit) * 100, 100) : null };
  };

  const rows: UsageRow[] = [metered("Counties", u.counties)];

  // Searches are honestly unmetered/unavailable server-side — show status, never a fake number.
  const searches = u.searches;
  if (searches && searches.status === "UNAVAILABLE") {
    rows.push({ label: "Searches", display: "Unavailable", ratio: null });
  } else if (searches) {
    rows.push(metered("Searches", searches));
  }

  const reports = u.reports;
  if (reports) {
    if (reports.status === "UNMETERED") {
      const used = num(reports.used);
      rows.push({ label: "Reports", display: used === null ? "—" : `${used} · Unmetered`, ratio: null });
    } else {
      rows.push(metered("Reports", reports));
    }
  }
  return rows;
}

export function UsageCard({ usage, usageLoading }: UsageCardProps) {
  const rows = mapUsageEnvelope(usage);
  return (
    <Card className="border-[var(--bs-surface-hover)] shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-[var(--bs-text-primary)]">Usage This Period</CardTitle>
      </CardHeader>
      <CardContent>
        {usageLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--bs-action)]" />
          </div>
        ) : rows ? (
          <div className="grid grid-cols-3 gap-4">
            {rows.map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-xs text-[var(--bs-text-tertiary)] uppercase tracking-wider mb-1">
                  {item.label}
                </p>
                <p className="font-mono text-lg font-medium text-[var(--bs-text-primary)]">
                  {item.display}
                </p>
                {item.ratio !== null && (
                  <div className="mt-1.5 h-1.5 bg-[var(--bs-surface-hover)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--bs-action)] rounded-full transition-all"
                      style={{ width: `${item.ratio}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--bs-text-tertiary)] text-center py-6">
            No usage data available
          </p>
        )}
      </CardContent>
    </Card>
  );
}
