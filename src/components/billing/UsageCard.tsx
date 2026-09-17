// Usage card — extracted from BillingPage (m1(24C)), behavior-identical.
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UsageCardProps {
  usage: any;
  usageLoading: boolean;
}

export function UsageCard({ usage, usageLoading }: UsageCardProps) {
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
        ) : usage ? (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Counties", used: usage.counties.used, limit: usage.counties.limit },
              { label: "Searches", used: usage.searches.used, limit: usage.searches.limit },
              { label: "Reports", used: usage.reports.used, limit: usage.reports.limit },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-xs text-[var(--bs-text-tertiary)] uppercase tracking-wider mb-1">
                  {item.label}
                </p>
                <p className="font-mono text-2xl font-medium text-[var(--bs-text-primary)]">
                  {item.limit >= 9999 ? "∞" : `${item.used} / ${item.limit}`}
                </p>
                {item.limit < 9999 && (
                  <div className="mt-1.5 h-1.5 bg-[var(--bs-surface-hover)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--bs-action)] rounded-full transition-all"
                      style={{
                        width: `${Math.min((item.used / item.limit) * 100, 100)}%`,
                      }}
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
