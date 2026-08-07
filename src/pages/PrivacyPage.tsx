import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  Cookie,
  Globe,
  Server,
  FileText,
  Clock,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Footer } from "@/components/ui-custom/Footer";

interface PrivacySection {
  id: string;
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

export function PrivacyPage() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const lastUpdated = "January 15, 2025";

  const sections: PrivacySection[] = [
    {
      id: "overview",
      title: "Overview",
      icon: Shield,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            BuildSignal is committed to protecting your privacy. This Privacy
            Policy explains how we collect, use, store, and protect your personal
            information when you use our platform.
          </p>
          <p>
            By using BuildSignal, you consent to the practices described in this
            policy. We may update this policy from time to time, and will notify
            you of significant changes.
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>We collect only what we need to provide our services</li>
            <li>We never sell your personal data to third parties</li>
            <li>We use industry-standard security measures</li>
            <li>You control your data and can request deletion at any time</li>
          </ul>
        </div>
      ),
    },
    {
      id: "collection",
      title: "Information We Collect",
      icon: Database,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>We collect the following types of information:</p>
          <div className="space-y-2">
            <div>
              <span className="font-medium text-foreground">
                Account Information:
              </span>{" "}
              Name, email address, company name, and billing information when you
              register for an account.
            </div>
            <div>
              <span className="font-medium text-foreground">
                Usage Data:
              </span>{" "}
              How you interact with our platform, including pages visited,
              features used, and search queries.
            </div>
            <div>
              <span className="font-medium text-foreground">
                Device Information:
              </span>{" "}
              IP address, browser type, operating system, and device identifiers.
            </div>
            <div>
              <span className="font-medium text-foreground">
                Communications:
              </span>{" "}
              Emails, support tickets, and other communications you send us.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "usage",
      title: "How We Use Your Information",
      icon: Eye,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>We use your information for the following purposes:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and manage your subscription</li>
            <li>Send you service-related notifications and updates</li>
            <li>Respond to your inquiries and support requests</li>
            <li>Detect and prevent fraud and abuse</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p>
            We may use aggregated, anonymized data for analytics and to improve
            our machine learning models. This data cannot be used to identify you.
          </p>
        </div>
      ),
    },
    {
      id: "sharing",
      title: "Data Sharing & Third Parties",
      icon: Globe,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            We do <strong>not</strong> sell your personal data to third parties.
            We may share data with:
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>
              <strong>Service Providers:</strong> Cloud hosting (AWS), payment
              processing (Stripe), and email delivery (SendGrid)
            </li>
            <li>
              <strong>Legal Compliance:</strong> When required by law or to
              protect our rights
            </li>
            <li>
              <strong>Business Transfers:</strong> In the event of a merger,
              acquisition, or sale of assets
            </li>
          </ul>
          <p>
            All third-party service providers are bound by strict confidentiality
            and data protection agreements.
          </p>
        </div>
      ),
    },
    {
      id: "security",
      title: "Security Measures",
      icon: Lock,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            We implement comprehensive security measures to protect your data:
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>
              <strong>Encryption:</strong> TLS 1.3 for data in transit, AES-256
              for data at rest
            </li>
            <li>
              <strong>Access Controls:</strong> Role-based access with SSO and
              SAML 2.0 support
            </li>
            <li>
              <strong>Monitoring:</strong> 24/7 security monitoring and automated
              threat detection
            </li>
            <li>
              <strong>Audits:</strong> Annual SOC 2 Type II and penetration
              testing
            </li>
            <li>
              <strong>Backups:</strong> Encrypted, geographically distributed
              backups
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "cookies",
      title: "Cookies & Tracking",
      icon: Cookie,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            We use cookies and similar technologies to enhance your experience:
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>
              <strong>Essential:</strong> Required for the platform to function
            </li>
            <li>
              <strong>Analytics:</strong> Help us understand how users interact
              with our site
            </li>
            <li>
              <strong>Preferences:</strong> Remember your settings and
              preferences
            </li>
            <li>
              <strong>Marketing:</strong> Used for targeted advertising (opt-in)
            </li>
          </ul>
          <p>
            You can manage your cookie preferences in your browser settings or
            using the controls below.
          </p>
        </div>
      ),
    },
    {
      id: "rights",
      title: "Your Rights",
      icon: UserCheck,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>Depending on your location, you may have the following rights:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>
              <strong>Access:</strong> Request a copy of your personal data
            </li>
            <li>
              <strong>Correction:</strong> Update or correct inaccurate data
            </li>
            <li>
              <strong>Deletion:</strong> Request deletion of your data (right to
              be forgotten)
            </li>
            <li>
              <strong>Portability:</strong> Export your data in a standard
              format
            </li>
            <li>
              <strong>Objection:</strong> Opt out of certain data processing
            </li>
            <li>
              <strong>Restriction:</strong> Limit how we process your data
            </li>
          </ul>
          <p>
            To exercise these rights, contact us at{" "}
            <a
              href="mailto:privacy@buildsignal.net"
              className="text-primary hover:underline"
            >
              privacy@buildsignal.net
            </a>
            .
          </p>
        </div>
      ),
    },
    {
      id: "retention",
      title: "Data Retention",
      icon: Clock,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>We retain your data for as long as necessary to:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Provide our services to you</li>
            <li>Comply with legal obligations</li>
            <li>Resolve disputes and enforce our agreements</li>
          </ul>
          <p>
            When you delete your account, we remove your personal data within 30
            days, except where retention is required by law. Aggregated,
            anonymized data may be retained for analytics purposes.
          </p>
        </div>
      ),
    },
    {
      id: "deletion",
      title: "Account Deletion",
      icon: Trash2,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            You can request complete account deletion at any time. Upon deletion:
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>All personal data is permanently removed within 30 days</li>
            <li>
              Aggregated, anonymized analytics data may be retained
            </li>
            <li>
              Legal and billing records may be retained as required by law
            </li>
          </ul>
          <p>
            To delete your account, go to{" "}
            <span className="font-medium text-foreground">Settings → Account</span>{" "}
            or contact{" "}
            <a
              href="mailto:privacy@buildsignal.net"
              className="text-primary hover:underline"
            >
              privacy@buildsignal.net
            </a>
            .
          </p>
        </div>
      ),
    },
    {
      id: "contact",
      title: "Contact Us",
      icon: Server,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>If you have questions about this Privacy Policy or your data:</p>
          <ul className="space-y-1">
            <li>
              Email:{" "}
              <a
                href="mailto:privacy@buildsignal.net"
                className="text-primary hover:underline"
              >
                privacy@buildsignal.net
              </a>
            </li>
            <li>Address: 123 Market Street, Suite 456, San Francisco, CA 94105</li>
            <li>
              DPO: Jane Smith, Chief Privacy Officer
            </li>
          </ul>
          <p>
            We will respond to all privacy inquiries within 30 days.
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
          <Shield className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Last updated: {lastUpdated}</span>
        </div>
      </div>

      {/* Intro */}
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            At BuildSignal, we take your privacy seriously. This policy describes
            how we handle your personal information and your rights regarding that
            data. We've designed this page to be transparent and easy to
            understand. If you have any questions, please{" "}
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
          <Card
            key={section.id}
            className="overflow-hidden"
          >
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

      {/* Cookie Consent Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Cookie Preferences</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Essential Cookies</div>
                <div className="text-xs text-muted-foreground">
                  Required for the platform to function. Cannot be disabled.
                </div>
              </div>
              <Badge variant="secondary">Required</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Analytics Cookies</div>
                <div className="text-xs text-muted-foreground">
                  Help us understand how users interact with our platform.
                </div>
              </div>
              <Switch
                checked={analyticsConsent}
                onCheckedChange={setAnalyticsConsent}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Marketing Cookies</div>
                <div className="text-xs text-muted-foreground">
                  Used for targeted advertising and promotional content.
                </div>
              </div>
              <Switch
                checked={marketingConsent}
                onCheckedChange={setMarketingConsent}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Footer */}
      <div className="text-center space-y-2 text-sm text-muted-foreground">
        <p>
          This Privacy Policy is part of our{" "}
          <button
            onClick={() => navigate("/terms")}
            className="text-primary hover:underline"
          >
            Terms of Service
          </button>
          .
        </p>
        <p>
          If you have concerns about how we handle your data, you may also
          contact your local data protection authority.
        </p>
      </div>

      <Footer />
    </div>
  );
}
