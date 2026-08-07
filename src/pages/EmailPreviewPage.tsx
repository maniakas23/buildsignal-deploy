import { useState } from "react";
import {
  Mail,
  Copy,
  Send,
  Eye,
  ChevronRight,
  Sparkles,
  Zap,
  BarChart,
  Shield,
  CheckCircle2,
  Code2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/* ------------------------------------------------------------------ */
/*  EMAIL CONFIGURATION                                                  */
/* ------------------------------------------------------------------ */

const EMAILS = [
  {
    id: "welcome",
    label: "1. Welcome",
    subject: "Welcome to BuildSignal — Your markets are waiting",
    icon: Sparkles,
    preview: "Welcome email sent immediately after signup. Introduces the dashboard, watchlists, and alert features. Includes a direct link to the user's dashboard.",
    cta: "Go to Dashboard",
    ctaLink: "https://buildsignal.net/dashboard",
  },
  {
    id: "getting-started",
    label: "2. Getting Started",
    subject: "Getting started: 3 ways to win with BuildSignal",
    icon: Zap,
    preview: "Day 2 onboarding tip. Explains watchlists, filters by sector/permit value, and alert setup. Encourages users to save their first project and set notification preferences.",
    cta: "Set Up Watchlists",
    ctaLink: "https://buildsignal.net/watchlists",
  },
  {
    id: "first-report",
    label: "3. First Report",
    subject: "Your first weekly intelligence report is ready",
    icon: BarChart,
    preview: "Weekly summary of new permits, high-confidence opportunities, and market surges in the user's tracked counties. Includes a sample data table (clearly labeled as illustrative).",
    cta: "View Full Report",
    ctaLink: "https://buildsignal.net/reports",
  },
  {
    id: "feature-tips",
    label: "4. Feature Tips",
    subject: "Pro tip: API access & custom integrations",
    icon: Shield,
    preview: "Highlights advanced features: REST API, Slack notifications, and custom scoring models. Explains which plans include each feature and links to integration documentation.",
    cta: "Explore Integrations",
    ctaLink: "https://buildsignal.net/integrations",
  },
  {
    id: "upgrade-prompt",
    label: "5. Upgrade Prompt",
    subject: "Your trial ends in 3 days — here's what you'll miss",
    icon: ChevronRight,
    preview: "Sent near trial end. Shows feature comparison table (Current vs Scout vs Professional). Includes upgrade CTA with EARLY20 discount code and an option to extend the trial.",
    cta: "Upgrade Now — Save 20%",
    ctaLink: "https://buildsignal.net/upgrade?code=EARLY20",
  },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function EmailPreviewPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  const activeEmail = EMAILS[activeIndex];
  const Icon = activeEmail.icon;

  const handleCopy = () => {
    const text = `Subject: ${activeEmail.subject}\n\n${activeEmail.preview}\n\nCTA: ${activeEmail.cta} (${activeEmail.ctaLink})`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSendTest = () => {
    setSent(true);
    setTimeout(() => setSent(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#1F5EFF]/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-[#1F5EFF]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Email Templates</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Onboarding sequence for new BuildSignal users</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-700">
          {EMAILS.map((email, index) => {
            const TabIcon = email.icon;
            const isActive = index === activeIndex;
            return (
              <button
                key={email.id}
                onClick={() => {
                  setActiveIndex(index);
                  setCopied(false);
                  setSent(false);
                }}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-lg text-xs font-medium transition-all whitespace-nowrap border-b-2 ${
                  isActive
                    ? "border-[#1F5EFF] text-[#1F5EFF] bg-[#1F5EFF]/5"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                {email.label}
              </button>
            );
          })}
        </div>

        {/* Subject Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="px-3 py-1 rounded-full bg-[#1F5EFF]/10 border border-[#1F5EFF]/20 text-xs font-medium text-[#1F5EFF] flex items-center gap-1.5">
            <Mail className="w-3 h-3" />
            Subject: {activeEmail.subject}
          </div>
        </div>

        {/* Preview Card */}
        <Card className="mb-6 overflow-hidden border-slate-200 dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Email Preview</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="text-xs gap-1.5"
              >
                {copied ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copied ? "Copied" : "Copy Text"}
              </Button>
              <Button
                size="sm"
                onClick={handleSendTest}
                className="text-xs gap-1.5 bg-[#1F5EFF] hover:bg-[#1F5EFF]/90 text-white"
              >
                {sent ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                {sent ? "Sent" : "Send Test"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-[#F3F4F6] dark:bg-slate-800">
            {/* Email Client Simulation */}
            <div className="max-w-[600px] mx-auto bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Email Header */}
              <div className="px-6 py-4 bg-[#0B1F33] text-white">
                <p className="text-xs font-bold tracking-wider text-[#1F5EFF] mb-1">BUILDSIGNAL</p>
                <h2 className="text-lg font-bold">{activeEmail.subject}</h2>
              </div>
              {/* Email Body */}
              <div className="px-6 py-5">
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">Hi {"{{firstName}}"},</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {activeEmail.preview}
                </p>
                {/* CTA Button */}
                <div className="text-center mb-4">
                  <a
                    href={activeEmail.ctaLink}
                    className="inline-block px-6 py-3 bg-[#1F5EFF] text-white text-sm font-semibold rounded-lg hover:bg-[#1F5EFF]/90 transition-colors"
                  >
                    {activeEmail.cta}
                  </a>
                </div>
                {/* Footer */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 text-center">
                  <p className="text-xs text-slate-400">
                    You're receiving this because you signed up at{" "}
                    <a href="https://buildsignal.net" className="text-[#1F5EFF] hover:underline">
                      buildsignal.net
                    </a>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    <a href="#" className="text-[#1F5EFF] hover:underline">Unsubscribe</a>
                    {" "}&nbsp;|&nbsp;{" "}
                    <a href="#" className="text-[#1F5EFF] hover:underline">Update Preferences</a>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Send Trigger</p>
              <p className="text-sm text-slate-700 dark:text-slate-200">
                {activeIndex === 0 && "Immediately after signup"}
                {activeIndex === 1 && "Day 2 after signup"}
                {activeIndex === 2 && "First weekly report (Day 7)"}
                {activeIndex === 3 && "Day 10 after signup"}
                {activeIndex === 4 && "3 days before trial ends"}
              </p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Target Audience</p>
              <p className="text-sm text-slate-700 dark:text-slate-200">
                {activeIndex === 0 && "All new free trial users"}
                {activeIndex === 1 && "Users who haven't set up watchlists"}
                {activeIndex === 2 && "All active trial users"}
                {activeIndex === 3 && "Professional+ plan prospects"}
                {activeIndex === 4 && "All trial users nearing expiration"}
              </p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Personalization</p>
              <p className="text-sm text-slate-700 dark:text-slate-200">
                {"{{firstName}}"}, {"{{company}}"}, {"{{trialDaysLeft}}"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Backend Integration Note */}
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <strong>Backend Integration:</strong> These are preview templates. For production, connect to an email service (SendGrid, Postmark, AWS SES) via{" "}
            <code className="text-xs bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded">POST /api/v1/email/send</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
