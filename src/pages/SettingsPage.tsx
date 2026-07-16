import { PageShell } from "@/components/page-shell";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";

export const SettingsPage = () => {
  const monitoringEnabled = useAppStore((state) => state.monitoringEnabled);
  const toggleMonitoring = useAppStore((state) => state.toggleMonitoring);

  return (
    <PageShell title="Settings" description="Environment, notifications, and telemetry controls.">
      <p className="text-sm text-slate-300">Monitoring: {monitoringEnabled ? "enabled" : "disabled"}</p>
      <Button variant="ghost" onClick={toggleMonitoring}>Toggle monitoring</Button>
    </PageShell>
  );
};
