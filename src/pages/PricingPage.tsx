import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "@/hooks/usePageTracking";
import { Check, ChevronDown, ChevronUp, ArrowRight, MoveHorizontal } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { selectTrial, trialDisclosure } from "@/lib/customerJourney";
import {
  PricingFaq,
  PricingTrustAndCta,
  FeatureValue,
  PRICING_FALLBACK_PLANS,
  PRICING_COMPARISON_FEATURES,
  getPriceDisplay,
} from "@/components/pricing/PricingExtras";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/** Explicit horizontal-scroll affordance for the comparison table on small screens. */
export function MobileComparisonHint() {
  return (
    <p className="sm:hidden flex items-center gap-1.5 text-xs text-muted-foreground">
      <MoveHorizontal className="h-3.5 w-3.5 shrink-0" />
      Swipe sideways to compare Scout, Professional, Business, and Enterprise
    </p>
  );
}

export function PricingPage() {
  const navigate = useNavigate();
  const [expandedComparison, setExpandedComparison] = useState(false);
  const { isAuthenticated } = useAuth();

  // Plans are served by stripe.plans (billing.plans does not exist).
  const { data: plansData } = trpc.stripe.plans.useQuery();
  const trial = selectTrial(plansData as any);

  const rawPlans = (plansData as any)?.plans ?? plansData;
  // Enterprise is custom pricing ("Contact Sales") — never display a fixed monthly price for it
  const plans = (Array.isArray(apiPlans) && apiPlans.length ? apiPlans : null) || PRICING_FALLBACK_PLANS;
