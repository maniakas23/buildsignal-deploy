import React from "react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FileText,
  TrendingUp,
  PieChart as PieChartIcon,
  Brain,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Footer } from "@/components/ui-custom/Footer";

// ── Sample Data ────────────────────────────────────────────

const trendData = [
  { month: "Aug", velocity: 100 },
  { month: "Sep", velocity: 120 },
  { month: "Oct", velocity: 115 },
  { month: "Nov", velocity: 140 },
  { month: "Dec", velocity: 165 },
  { month: "Jan", velocity: 180 },
];

const sectorData = [
  { name: "Commercial", value: 35, color: "#1F5EFF" },
  { name: "Residential", value: 28, color: "#18A999" },
  { name: "Infrastructure", value: 22, color: "#F4A261" },
  { name: "Industrial", value: 15, color: "#0B1F33" },
];

const opportunities = [
  {
    project: "Austin Metro Rail Extension",
    location: "Austin, TX",
    sector: "Infrastructure",
    value: "$420M",
    confidence: "94%",
    status: "Active",
  },
  {
    project: "Denver Tech Center Tower B",
    location: "Denver, CO",
    sector: "Commercial",
    value: "$85M",
    confidence: "88%",
    status: "Monitoring",
  },
  {
    project: "Riverside Mixed-Use",
    location: "Portland, OR",
    sector: "Residential",
    value: "$32M",
    confidence: "91%",
    status: "Active",
  },
  {
    project: "Phoenix Solar Farm Phase 2",
    location: "Phoenix, AZ",
    sector: "Industrial",
    value: "$120M",
    confidence: "85%",
    status: "Monitoring",
  },
  {
    project: "Seattle Waterfront Revitalization",
    location: "Seattle, WA",
    sector: "Infrastructure",
    value: "$210M",
    confidence: "79%",
    status: "Monitoring",
  },
];

// ── Components ─────────────────────────────────────────────

const ProgressBar = ({ value, label }: { value: number; label?: string }) => (
  <div className="w-full">
    <div className="flex justify-between mb-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="text-sm font-bold" style={{ color: "#18A999" }}>
        {value}/100
      </span>
    </div>
    <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
      <div
        className="h-2.5 rounded-full transition-all"
        style={{
          width: `${value}%`,
          background: `linear-gradient(90deg, #1F5EFF, #18A999)`,
        }}
      />
    </div>
  </div>
);

const AmberBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: "#F4A261", color: "#0B1F33" }}>
    <AlertTriangle className="h-3 w-3" />
    {children}
  </span>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border" style={{ borderColor: "#F4A261", color: "#F4A261" }}>
    {children}
  </span>
);

// ── Page ───────────────────────────────────────────────────

export function SampleReportPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: "#0B1F33" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-2 text-sm mb-4">
            <span className="text-white/60">BuildSignal</span>
            <ChevronRight className="h-4 w-4 text-white/40" />
            <span className="text-white/90">Sample Report</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
            <AmberBadge>Sample Data — Illustrative Example</AmberBadge>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Sample Intelligence Report
          </h1>
          <p className="text-lg text-white/70 max-w-2xl">
            Illustrative example of the insights BuildSignal delivers. All data below is for
            demonstration purposes.
          </p>
        </div>
        {/* Decorative gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 opacity-30"
          style={{
            background: "linear-gradient(to top, #0B1F33, transparent)",
          }}
        />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* ── Executive Summary Card ── */}
        <Card className="border-l-4" style={{ borderLeftColor: "#F4A261" }}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-5 w-5" style={{ color: "#1F5EFF" }} />
              <CardTitle className="text-lg">Executive Summary</CardTitle>
              <SectionLabel>Sample</SectionLabel>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Market</p>
                <p className="text-sm font-semibold mt-1">Austin, TX Metro</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Analysis Period</p>
                <p className="text-sm font-semibold mt-1">January 2025</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Key Finding</p>
                <p className="text-sm font-semibold mt-1">Permit velocity up 23% QoQ in commercial</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Action</p>
                <AmberBadge>Strong Buy Signal</AmberBadge>
                <p className="text-xs text-muted-foreground mt-1">Not financial advice</p>
              </div>
            </div>
            <div className="pt-2">
              <ProgressBar value={87} label="Confidence Score" />
            </div>
          </CardContent>
        </Card>

        {/* ── Opportunity Table ── */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-5 w-5" style={{ color: "#1F5EFF" }} />
              <CardTitle className="text-lg">Sample Opportunities</CardTitle>
              <SectionLabel>Sample</SectionLabel>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Project</TableHead>
                    <TableHead className="font-semibold">Location</TableHead>
                    <TableHead className="font-semibold">Sector</TableHead>
                    <TableHead className="font-semibold">Value</TableHead>
                    <TableHead className="font-semibold">Confidence</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opportunities.map((row, idx) => (
                    <TableRow
                      key={idx}
                      className={idx % 2 === 0 ? "bg-background" : "bg-muted/20"}
                    >
                      <TableCell className="font-medium">{row.project}</TableCell>
                      <TableCell className="text-muted-foreground">{row.location}</TableCell>
                      <TableCell>
                        <span
                          className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor:
                              row.sector === "Infrastructure"
                                ? "#F4A26120"
                                : row.sector === "Commercial"
                                ? "#1F5EFF20"
                                : row.sector === "Residential"
                                ? "#18A99920"
                                : "#0B1F3320",
                            color:
                              row.sector === "Infrastructure"
                                ? "#F4A261"
                                : row.sector === "Commercial"
                                ? "#1F5EFF"
                                : row.sector === "Residential"
                                ? "#18A999"
                                : "#0B1F33",
                          }}
                        >
                          {row.sector}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{row.value}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-muted rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full"
                              style={{
                                width: `${parseInt(row.confidence)}%`,
                                backgroundColor: "#18A999",
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium">{row.confidence}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5">
                          {row.status === "Active" ? (
                            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                          <span className="text-sm">{row.status}</span>
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend Chart */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" style={{ color: "#1F5EFF" }} />
                  <CardTitle className="text-lg">Permit Velocity Trend (Sample)</CardTitle>
                </div>
                <SectionLabel>Sample</SectionLabel>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1F5EFF" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#1F5EFF" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" domain={[80, 200]} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        fontSize: 12,
                      }}
                      formatter={(value: number) => [`Velocity: ${value}`, ""]}
                    />
                    <Area
                      type="monotone"
                      dataKey="velocity"
                      stroke="#1F5EFF"
                      strokeWidth={2.5}
                      fill="url(#trendGradient)"
                      dot={{ r: 4, fill: "#1F5EFF", stroke: "#fff", strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: "#18A999" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Sector Breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" style={{ color: "#18A999" }} />
                  <CardTitle className="text-lg">Sector Distribution (Sample)</CardTitle>
                </div>
                <SectionLabel>Sample</SectionLabel>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      formatter={(value: string) => (
                        <span className="text-xs text-muted-foreground">{value}</span>
                      )}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        fontSize: 12,
                      }}
                      formatter={(value: number, name: string) => [`${value}%`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Methodology Box ── */}
        <Card className="border-l-4" style={{ borderLeftColor: "#18A999" }}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5" style={{ color: "#18A999" }} />
              <CardTitle className="text-lg">How This Prediction Was Generated</CardTitle>
              <SectionLabel>Sample</SectionLabel>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                <div className="mt-0.5 min-w-[20px] h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#1F5EFF20", color: "#1F5EFF" }}>1</div>
                <div>
                  <p className="text-sm font-semibold">Data Sources</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Municipal permit filings, zoning board records, infrastructure spend reports
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                <div className="mt-0.5 min-w-[20px] h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#18A99920", color: "#18A999" }}>2</div>
                <div>
                  <p className="text-sm font-semibold">Model</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Ensemble of gradient-boosted trees and time-series forecasting
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                <div className="mt-0.5 min-w-[20px] h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#F4A26120", color: "#F4A261" }}>3</div>
                <div>
                  <p className="text-sm font-semibold">Confidence Score</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Derived from historical accuracy, data freshness, and market volatility
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                <div className="mt-0.5 min-w-[20px] h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#0B1F3320", color: "#0B1F33" }}>4</div>
                <div>
                  <p className="text-sm font-semibold">Update Frequency</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Weekly model retraining with daily data ingestion
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── CTA Section ── */}
        <section className="rounded-2xl p-8 sm:p-12 text-center" style={{ backgroundColor: "#0B1F33" }}>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Get Real Intelligence for Your Markets
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            Start your 14-day free trial. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button
                size="lg"
                className="gap-2 font-semibold text-white"
                style={{ backgroundColor: "#1F5EFF" }}
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="font-semibold border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
