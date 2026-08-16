import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "@/hooks/usePageTracking";
import {
  Search,
  HelpCircle,
  MessageSquare,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Mail,
  MapPin,
  Phone,
  FileText,
  Zap,
  Building2,
  Shield,
  CreditCard,
  Bell,
  ExternalLink,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const categories = [
  { id: "all", label: "All", icon: BookOpen },
  { id: "getting-started", label: "Getting Started", icon: Zap },
  { id: "account", label: "Account & Billing", icon: Shield },
  { id: "data", label: "Data & Signals", icon: FileText },
  { id: "integrations", label: "Integrations", icon: Building2 },
];

const faqs = [
  {
    id: "gs-1",
    category: "getting-started",
    question: "What is BuildSignal?",
    answer:
      "BuildSignal is a construction and building permit intelligence platform. We monitor permit data from counties and municipalities across the United States, extract key project details using AI, and deliver actionable sales signals to help construction industry professionals identify new business opportunities.",
  },
  {
    id: "gs-2",
    category: "getting-started",
    question: "How do I get started?",
    answer:
      "Sign up for a free trial at buildsignal.net. Once registered, select your target counties, set up alert preferences, and start receiving permit signals within minutes. Our onboarding wizard will guide you through each step.",
  },
  {
    id: "gs-3",
    category: "getting-started",
    question: "Is there a free trial?",
    answer:
      "Yes! Every plan includes a 14-day free trial with full access to all features. No credit card is required to start your trial.",
  },
  {
    id: "gs-4",
    category: "getting-started",
    question: "What counties do you cover?",
    answer:
      "Coverage is currently limited to a small set of counties and is expanding over time. Live production data is currently available for Charleston County, SC. You can search for specific counties in your dashboard, or contact us to inquire about a specific market.",
  },
  {
    id: "account-1",
    category: "account",
    question: "How do I change my plan?",
    answer:
      "Go to Settings → Billing in your dashboard. You can upgrade or downgrade your plan at any time. Upgrades take effect immediately; downgrades take effect at the start of your next billing cycle.",
  },
  {
    id: "account-2",
    category: "account",
    question: "How do I update my payment method?",
    answer:
      "Visit Settings → Billing → Payment Methods. You can add, remove, or update your credit card information securely. We use Stripe for payment processing and never store your card details on our servers.",
  },
  {
    id: "account-3",
    category: "account",
    question: "Can I get a refund?",
    answer:
      "We offer refunds within 7 days of your initial subscription purchase if you're not satisfied. Contact support@buildsignal.net with your account details.",
  },
  {
    id: "data-1",
    category: "data",
    question: "How accurate is the permit data?",
    answer:
      "We source data directly from official county and municipal government databases. Our AI extraction achieves 95%+ accuracy on key fields like project value, contractor name, and address. Each signal includes a confidence score so you can prioritize high-confidence leads.",
  },
  {
    id: "data-2",
    category: "data",
    question: "How often is data updated?",
    answer:
      "Most counties are updated daily, with some high-volume markets updated multiple times per day. The refresh frequency depends on how often the source county publishes new permits. Check the Providers page for each county's update schedule.",
  },
  {
    id: "data-3",
    category: "data",
    question: "What is a 'signal'?",
    answer:
      "A signal is a processed building permit record that contains actionable sales intelligence. Each signal includes project details, contact information for contractors and owners, estimated project value, and AI-generated insights about the opportunity.",
  },
  {
    id: "integrations-1",
    category: "integrations",
    question: "Does BuildSignal integrate with CRMs?",
    answer:
      "Yes! We offer native integrations with Salesforce, HubSpot, Pipedrive, and Zoho CRM. You can also use our API to build custom integrations with any CRM or sales tool.",
  },
  {
    id: "integrations-2",
    category: "integrations",
    question: "Can I export data?",
    answer:
      "Yes, you can export signals and watchlists to CSV or Excel format. Business and Enterprise plans also support API access for programmatic data retrieval.",
  },
];

export function HelpPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      search.length < 2 ||
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Help Center</h1>
        <p className="text-muted-foreground">
          Find answers, learn how to use BuildSignal, and get support.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search help articles..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat.id)}
            className="gap-2"
          >
            <cat.icon className="h-4 w-4" />
            {cat.label}
          </Button>
        ))}
      </div>

      {/* FAQ Accordion */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            {search.length >= 2
              ? `Found ${filteredFaqs.length} result${
                  filteredFaqs.length === 1 ? "" : "s"
                } for "${search}"`
              : `${filteredFaqs.length} articles`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No results found. Try a different search term.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Contact CTA */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Can't find what you're looking for? Our team is here to help.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href="mailto:support@buildsignal.net"
                  className="text-primary hover:underline"
                >
                  support@buildsignal.net
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Phone support for Business & Enterprise plans
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/contact")}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Go to Contact Page
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Explore our documentation for detailed guides and API references.
            </p>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => navigate("/docs")}
              >
                <FileText className="h-4 w-4 mr-2" />
                API Documentation
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => navigate("/demo")}
              >
                <Zap className="h-4 w-4 mr-2" />
                Request a Demo
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#4ade80]" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[#4ade80]" />
              <span className="text-sm">All systems operational</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => navigate("/status")}
            >
              View status page
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
