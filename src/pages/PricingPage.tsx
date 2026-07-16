import { PageShell } from "@/components/page-shell";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";

export const PricingPage = () => {
  const setBillingPlan = useAppStore((state) => state.setBillingPlan);

  return (
    <PageShell title="Pricing" description="Stripe-backed plans for teams from pilot to enterprise scale.">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setBillingPlan("starter")}>Starter</Button>
        <Button onClick={() => setBillingPlan("pro")}>Pro</Button>
        <Button onClick={() => setBillingPlan("enterprise")}>Enterprise</Button>
      </div>
    </PageShell>
  );
};
