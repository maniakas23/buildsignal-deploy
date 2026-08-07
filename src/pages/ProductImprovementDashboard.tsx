import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Zap,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  Target,
  Lightbulb,
  Bug,
  Clock,
  Users,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ImprovementMetric {
  name: string;
  current: number;
  previous: number;
  unit: string;
  trend: "up" | "down" | "flat";
}

interface FeedbackItem {
  id: string;
  type: "praise" | "complaint" | "suggestion" | "bug";
  content: string;
  source: string;
  date: string;
  sentiment: "positive" | "negative" | "neutral";
  resolved: boolean;
}

const metrics: ImprovementMetric[] = [
  { name: "Report Generation Speed", current: 2.3, previous: 4.1, unit: "s", trend: "up" },
  { name: "Prediction Accuracy", current: 87, previous: 82, unit: "%", trend: "up" },
  { name: "API Response Time", current: 180, previous: 240, unit: "ms", trend: "up" },
  { name: "User Satisfaction (NPS)", current: 68, previous: 58, unit: "", trend: "up" },
  { name: "Uptime", current: 99.97, previous: 99.92, unit: "%", trend: "up" },
  { name: "Support Response Time", current: 3.2, previous: 5.8, unit: "h", trend: "up" },
];

const feedbackItems: FeedbackItem[] = [
  {
    id: "FB-001",
    type: "praise",
    content: "The new dashboard layout is fantastic. Much easier to find what I need.",
    source: "Customer Survey Q4 2024",
    date: "Dec 15, 2024",
    sentiment: "positive",
    resolved: true,
  },
  {
    id: "FB-002",
    type: "suggestion",
    content: "Would love to see export to PowerPoint in addition to PDF.",
    source: "Feature Request #FR-001",
    date: "Jan 5, 2025",
    sentiment: "neutral",
    resolved: false,
  },
  {
    id: "FB-003",
    type: "bug",
    content: "Watchlist export occasionally fails for counties with >500 permits.",
    source: "Support Ticket #TKT-86521",
    date: "Jan 5, 2025",
    sentiment: "negative",
    resolved: false,
  },
  {
    id: "FB-004",
    type: "complaint",
    content: "Loading times on the mobile dashboard are too slow on 3G connections.",
    source: "App Store Review",
    date: "Jan 8, 2025",
    sentiment: "negative",
    resolved: false,
  },
  {
    id: "FB-005",
    type: "praise",
    content: "Customer support was incredibly helpful. Resolved my API issue within an hour.",
    source: "Email Feedback",
    date: "Jan 10, 2025",
    sentiment: "positive",
    resolved: true,
  },
];

const roadmapItems = [
  {
    quarter: "Q1 2025",
    items: [
      { title: "PowerPoint Export", status: "planned", progress: 0 },
      { title: "Dark Mode", status: "in-progress", progress: 65 },
      { title: "Slack Webhooks", status: "completed", progress: 100 },
    ],
  },
  {
    quarter: "Q2 2025",
    items: [
      { title: "Custom Alert Thresholds", status: "planned", progress: 0 },
      { title: "Multi-County Comparisons", status: "planned", progress: 0 },
      { title: "API v2 with Webhooks", status: "planned", progress: 10 },
    ],
  },
  {
    quarter: "Q3 2025",
    items: [
      { title: "Mobile App v2", status: "planned", progress: 0 },
      { title: "AI-Powered Summaries", status: "planned", progress: 0 },
      { title: "Salesforce Integration", status: "planned", progress: 0 },
    ],
  },
];

const typeConfig = {
  praise: { icon: ThumbsUp, color: "text-green-500", label: "Praise" },
  complaint: { icon: ThumbsDown, color: "text-red-500", label: "Complaint" },
  suggestion: { icon: Lightbulb, color: "text-amber-500", label: "Suggestion" },
  bug: { icon: Bug, color: "text-red-500", label: "Bug" },
};

const sentimentConfig = {
  positive: "bg-green-500/10 text-green-600 border-green-200",
  negative: "bg-red-500/10 text-red-600 border-red-200",
  neutral: "bg-muted text-muted-foreground",
};

export function ProductImprovementDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("metrics");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Product Improvement Dashboard</h1>
              <p className="text-muted-foreground text-sm">
                Transparency into how we're making BuildSignal better, every day.
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="metrics" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Performance Metrics
            </TabsTrigger>
            <TabsTrigger value="feedback" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Customer Feedback
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="gap-2">
              <Target className="h-4 w-4" />
              Roadmap
            </TabsTrigger>
          </TabsList>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {metrics.map((metric) => {
                const improvement = metric.trend === "up" 
                  ? ((metric.current - metric.previous) / metric.previous * 100).toFixed(1)
                  : ((metric.previous - metric.current) / metric.previous * 100).toFixed(1);
                
                return (
                  <Card key={metric.name} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground mb-1">{metric.name}</div>
                      <div className="text-2xl font-bold">
                        {metric.current}{metric.unit}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {metric.trend === "up" ? (
                          <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                        ) : metric.trend === "down" ? (
                          <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                        ) : (
                          <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <span className={cn(
                          "text-xs font-medium",
                          metric.trend === "up" ? "text-green-600" : metric.trend === "down" ? "text-red-600" : "text-muted-foreground"
                        )}>
                          {improvement}% from last quarter
                        </span>
                      </div>
                      <div className="mt-3">
                        <Progress 
                          value={(metric.current / (metric.current * 1.2)) * 100} 
                          className="h-1.5"
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* NPS Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  NPS Trend (Last 6 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      NPS trend chart coming soon
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Current NPS: 68 (Up from 58 last quarter)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {feedbackItems.filter((f) => f.sentiment === "positive").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Positive</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {feedbackItems.filter((f) => f.sentiment === "negative").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Negative</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-muted-foreground">
                    {feedbackItems.filter((f) => f.sentiment === "neutral").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Neutral</div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/contact")} className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Submit Feedback
              </Button>
            </div>

            <div className="space-y-3">
              {feedbackItems.map((item) => {
                const TypeIcon = typeConfig[item.type].icon;
                return (
                  <Card key={item.id} className={cn(
                    "hover:shadow-md transition-shadow",
                    item.resolved && "opacity-70"
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", typeConfig[item.type].color.replace("text-", "bg-").replace("500", "500/10"))}>
                          <TypeIcon className={cn("h-4 w-4", typeConfig[item.type].color)} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-mono text-xs text-muted-foreground">{item.id}</span>
                            <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", sentimentConfig[item.sentiment])}>
                              {item.sentiment}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              {typeConfig[item.type].label}
                            </Badge>
                            {item.resolved && (
                              <Badge className="text-[10px] px-1.5 py-0 bg-green-500 text-white">
                                Resolved
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm mb-2">{item.content}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {item.source}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap" className="space-y-6">
            {roadmapItems.map((quarter) => (
              <div key={quarter.quarter}>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  {quarter.quarter}
                </h3>
                <div className="space-y-3">
                  {quarter.items.map((item) => (
                    <Card key={item.title} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{item.title}</span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] px-1.5 py-0",
                              item.status === "completed"
                                ? "bg-green-500/10 text-green-600 border-green-200"
                                : item.status === "in-progress"
                                ? "bg-amber-500/10 text-amber-600 border-amber-200"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {item.status === "completed" ? "Completed" : item.status === "in-progress" ? "In Progress" : "Planned"}
                          </Badge>
                        </div>
                        <Progress value={item.progress} className="h-2" />
                        <div className="text-xs text-muted-foreground mt-1 text-right">
                          {item.progress}%
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}

            <div className="text-center pt-4">
              <Button variant="outline" onClick={() => navigate("/feature-request")} className="gap-2">
                <Lightbulb className="h-4 w-4" />
                Suggest a Feature
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
