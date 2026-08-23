import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "@/hooks/usePageTracking";
import {
  Check,
  Building2,
  Shield,
  Lock,
  CreditCard,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Users,
  Zap,
  HelpCircle,
  ArrowRight,
  MessageSquare,
  Star,
} from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function PricingPage() {
  const navigate = useNavigate();
  const [expandedComparison, setExpandedComparison] = useState(false);
  const { isAuthenticated } = useAuth();

  const { data: plansData } = trpc.billing.plans.useQuery();