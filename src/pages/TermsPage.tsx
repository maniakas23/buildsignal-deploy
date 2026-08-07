import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  FileText,
  Scale,
  Shield,
  UserCheck,
  AlertTriangle,
  Globe,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Footer } from "@/components/ui-custom/Footer";

interface TermsSection {
  id: string;
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

export function TermsPage() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const lastUpdated = "January 15, 2025";
  const effectiveDate = "February 1, 2025";

  const sections: TermsSection[] = [
    {
      id: "agreement",
      title: "Agreement to Terms",
      icon: FileText,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            By accessing or using BuildSignal, you agree to be bound by these
            Terms of Service and all applicable laws and regulations. If you do
            not agree with any of these terms, you are prohibited from using or
            accessing this platform.
          </p>
          <p>
            These terms apply to all users of the platform, including visitors,
            registered users, and subscribers. We may update these terms at any
            time, and your continued use of the platform constitutes acceptance of
            the updated terms.
          </p>
        </div>
      ),
    },
    {
      id: "accounts",
      title: "User Accounts",
      icon: UserCheck,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>To access certain features, you must create an account. You agree to:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Promptly notify us of any unauthorized access</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>
          <p>
            We reserve the right to suspend or terminate accounts that violate
            these terms or are inactive for an extended period.
          </p>
        </div>
      ),
    },
    {
      id: "subscriptions",
      title: "Subscriptions & Billing",
      icon: Clock,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            BuildSignal offers subscription plans with different features and
            limits. By subscribing:
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>
              You authorize us to charge your payment method on a recurring basis
            </li>
            <li>
              Subscriptions auto-renew unless cancelled before the renewal date
            </li>
            <li>
              You may upgrade or downgrade your plan at any time
            </li>
            <li>
              Refunds are provided per our 14-day money-back guarantee policy
            </li>
          </ul>
          <p>
            All fees are exclusive of taxes. You are responsible for any
            applicable taxes based on your jurisdiction.
          </p>
        </div>
      ),
    },
    {
      id: "acceptable-use",
      title: "Acceptable Use",
      icon: Shield,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>You agree not to use BuildSignal to:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Distribute malware, spam, or harmful content</li>
            <li>Scrape, crawl, or harvest data without authorization</li>
            <li>Interfere with the operation of the platform</li>
            <li>Resell or redistribute access without written permission</li>
          </ul>
          <p>
            Violation of these rules may result in immediate account suspension
            or termination, and may be reported to relevant authorities.
          </p>
        </div>
      ),
    },
    {
      id: "data",
      title: "Data Ownership & Usage",
      icon: Globe,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            You retain ownership of any data you input into BuildSignal. By using
            the platform, you grant us a limited license to process and store your
            data solely for the purpose of providing our services.
          </p>
          <p>
            BuildSignal data and insights (including predictions, reports, and
            analytics) are the property of BuildSignal, Inc. You may use these
            for your internal business purposes but may not resell or redistribute
            them without written consent.
          </p>
          <p>
            See our{" "}
            <button
              onClick={() => navigate("/privacy")}
              className="text-primary hover:underline"
            >
              Privacy Policy
            </button>{" "}
            for details on how we handle personal data.
          </p>
        </div>
      ),
    },
    {
      id: "ip",
      title: "Intellectual Property",
      icon: FileText,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            All content, software, and materials on BuildSignal are the
            intellectual property of BuildSignal, Inc. or our licensors. This
            includes text, graphics, logos, icons, software, and AI models.
          </p>
          <p>
            You are granted a limited, non-exclusive, non-transferable license to
            access and use the platform for your internal business purposes. You
            may not:
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Modify, copy, or create derivative works</li>
            <li>Reverse engineer or decompile any software</li>
            <li>Remove any copyright or proprietary notices</li>
            <li>Use our trademarks without written permission</li>
          </ul>
        </div>
      ),
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: Scale,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            BuildSignal provides intelligence and predictions based on available
            data. While we strive for accuracy, we do not guarantee that our
            predictions will always be correct. You agree that:
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>
              BuildSignal is provided "as is" without warranties of any kind
            </li>
            <li>
              We are not liable for any business decisions made based on our data
            </li>
            <li>
              Our total liability shall not exceed the amount you paid in the
              last 12 months
            </li>
            <li>
              We are not liable for indirect, incidental, or consequential damages
            </li>
          </ul>
          <p>
            You should always conduct your own due diligence before making
            investment or business decisions.
          </p>
        </div>
      ),
    },
    {
      id: "termination",
      title: "Termination",
      icon: AlertTriangle,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Either party may terminate the agreement at any time. Upon
            termination:
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Your access to the platform will be suspended</li>
            <li>
              You remain liable for all charges incurred prior to termination
            </li>
            <li>
              We will delete your personal data per our{" "}
              <button
                onClick={() => navigate("/privacy")}
                className="text-primary hover:underline"
              >
                Privacy Policy
              </button>
            </li>
            <li>
              Provisions related to intellectual property and liability survive
              termination
            </li>
          </ul>
          <p>
            We reserve the right to terminate accounts that violate these terms
            without prior notice.
          </p>
        </div>
      ),
    },
    {
      id: "disputes",
      title: "Dispute Resolution",
      icon: Scale,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Any disputes arising from these terms shall first be addressed
            through good-faith negotiation. If unresolved, disputes shall be
            settled by binding arbitration in San Francisco, California, under
            the rules of the American Arbitration Association.
          </p>
          <p>
            You waive any right to participate in class actions. Each party
            bears its own legal costs unless the arbitrator determines
            otherwise.
          </p>
          <p>
            These terms are governed by the laws of the State of California,
            without regard to conflict of law principles.
          </p>
        </div>
      ),
    },
    {
      id: "contact",
      title: "Contact Information",
      icon: Globe,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>For questions about these Terms of Service:</p>
          <ul className="space-y-1">
            <li>
              Email:{" "}
              <a
                href="mailto:legal@buildsignal.net"
                className="text-primary hover:underline"
              >
                legal@buildsignal.net
              </a>
            </li>
            <li>Address: 123 Market Street, Suite 456, San Francisco, CA 94105</li>
          </ul>
          <p>
            We will respond to legal inquiries within 5 business days.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="text-center space-y-3">
        <div className="mx-auto h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center">
          <Scale className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            Last updated: {lastUpdated}
          </span>
          <span className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            Effective: {effectiveDate}
          </span>
        </div>
      </div>

      {/* Intro */}
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            These Terms of Service govern your use of BuildSignal. Please read
            them carefully. By using our platform, you agree to these terms. If
            you have any questions, please{" "}
            <button
              onClick={() => navigate("/contact")}
              className="text-primary hover:underline"
            >
              contact us
            </button>
            .
          </p>
        </CardContent>
      </Card>

      {/* Collapsible Sections */}
      <div className="space-y-3">
        {sections.map((section) => (
          <Card key={section.id} className="overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <section.icon className="h-5 w-5 text-primary" />
                <span className="font-medium">{section.title}</span>
              </div>
              {expandedSection === section.id ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {expandedSection === section.id && (
              <CardContent className="pt-0 pb-5 px-4">
                {section.content}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Agreement Checkbox */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            By continuing to use BuildSignal, you acknowledge that you have read,
            understood, and agree to be bound by these Terms of Service and our{" "}
            <button
              onClick={() => navigate("/privacy")}
              className="text-primary hover:underline"
            >
              Privacy Policy
            </button>
            .
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" onClick={() => navigate("/privacy")}>
              Privacy Policy
            </Button>
            <Button onClick={() => navigate("/contact")}>
              Contact Legal
            </Button>
          </div>
        </CardContent>
      </Card>

      <Footer />
    </div>
  );
}
