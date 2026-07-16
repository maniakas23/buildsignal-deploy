import { FlowCanvas } from "@/components/flow-canvas";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

export const HomePage = () => (
  <PageShell
    title="Infrastructure intelligence for modern deal teams"
    description="BuildSignal ingests permits, zoning, utility and market data into SignalCore to surface opportunities early."
  >
    <div className="grid gap-4 md:grid-cols-2">
      <FlowCanvas />
      <div className="space-y-3 text-sm text-slate-300">
        <p>28 sprints of product depth: acquisition signals, billing, alerts, portfolios, and monitoring-ready delivery.</p>
        <p>Use the map and signal dashboards to move from lead discovery to underwriting in one workflow.</p>
        <div className="flex gap-2">
          <Button>View Signals</Button>
          <Button variant="ghost">Open Pricing</Button>
        </div>
      </div>
    </div>
  </PageShell>
);
