import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Download,
  Share2,
  Calendar,
  Clock,
  Filter,
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  BarChart3,
  MapPin,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Eye,
  ChevronRight,
  PieChart,
  Activity,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Report {
  id: string;
  title: string;
  type: "market" | "county" | "trend" | "custom" | "alert";
  county: string;
  date: string;
  status: "ready" | "generating" | "scheduled";
  pages: number;
  isFavorite: boolean;
  thumbnail: string;
}

const reports: Report[] = [
  {
    id: "RPT-001",
    title: "Austin MSA Construction Forecast Q1 2025",
    type: "market",
    county: "Travis County, TX",
    date: "Jan 12, 2025",
    status: "ready",
    pages: 24,
    isFavorite: true,
    thumbnail: "market",
  },
  {
    id: "RPT-002",
    title: "Maricopa County Permit Analysis",
    type: "county",
    county: "Maricopa County, AZ",
    date: "Jan 10, 2025",
    status: "ready",
    pages: 18,
    isFavorite: false,
    thumbnail: "county",
  },
  {
    id: "RPT-003",
    title: "Top 10 Growth Markets — Annual Review",
    type: "trend",
    county: "Multi-County",
    date: "Jan 8, 2025",
    status: "ready",
    pages: 42,
    isFavorite: true,
    thumbnail: "trend",
  },
  {
    id: "RPT-004",
    title: "Custom: Bay Area Development Tracker",
    type: "custom",
    county: "San Francisco, CA",
    date: "Jan 5, 2025",
    status: "ready",
    pages: 12,
    isFavorite: false,
    thumbnail: "custom",
  },
  {
    id: "RPT-005",
    title: "Alert: Dallas Surge Detected",
    type: "alert",
    county: "Dallas County, TX",
    date: "Jan 14, 2025",
    status: "ready",
    pages: 8,
    isFavorite: false,
    thumbnail: "alert",
  },
  {
    id: "RPT-006",
    title: "Weekly Intelligence Brief — Jan W2",
    type: "market",
    county: "National",
    date: "Jan 13, 2025",
    status: "generating",
    pages: 0,
    isFavorite: false,
    thumbnail: "market",
  },
];

const reportTypeConfig = {
  market: { icon: TrendingUp, color: "bg-blue-500/10 text-blue-600", label: "Market" },
  county: { icon: MapPin, color: "bg-green-500/10 text-green-600", label: "County" },
  trend: { icon: BarChart3, color: "bg-purple-500/10 text-purple-600", label: "Trend" },
  custom: { icon: FileText, color: "bg-amber-500/10 text-amber-600", label: "Custom" },
  alert: { icon: AlertTriangle, color: "bg-red-500/10 text-red-600", label: "Alert" },
};

const statusConfig = {
  ready: { icon: CheckCircle2, color: "text-green-500", label: "Ready" },
  generating: { icon: Clock, color: "text-amber-500", label: "Generating" },
  scheduled: { icon: Calendar, color: "text-blue-500", label: "Scheduled" },
};

export function ReportsHubPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [favorites, setFavorites] = useState<string[]>(
    reports.filter((r) => r.isFavorite).map((r) => r.id)
  );

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.county.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "favorites"
        ? favorites.includes(r.id)
        : activeTab === "market"
        ? r.type === "market"
        : activeTab === "alerts"
        ? r.type === "alert"
        : activeTab === "scheduled"
        ? r.status === "scheduled"
        : true;
    return matchesSearch && matchesTab;
  });

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

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Reports Hub</h1>
                <p className="text-muted-foreground text-sm">
                  Generate, manage, and share your intelligence reports.
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Report
            </Button>
            <Button className="gap-2">
              <FileText className="h-4 w-4" />
              Generate New
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{reports.length}</div>
              <div className="text-xs text-muted-foreground">Total Reports</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{favorites.length}</div>
              <div className="text-xs text-muted-foreground">Favorites</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {reports.filter((r) => r.status === "generating").length}
              </div>
              <div className="text-xs text-muted-foreground">Generating</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {reports.reduce((sum, r) => sum + r.pages, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Pages</div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="favorites" className="gap-1">
              <Star className="h-3.5 w-3.5" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-3">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => {
                const TypeIcon = reportTypeConfig[report.type].icon;
                const StatusIcon = statusConfig[report.status].icon;
                return (
                  <Card
                    key={report.id}
                    className="hover:shadow-md transition-shadow group"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Thumbnail */}
                        <div className={cn(
                          "h-12 w-12 rounded-lg flex items-center justify-center shrink-0",
                          reportTypeConfig[report.type].color.split(" ")[0]
                        )}>
                          <TypeIcon className={cn("h-5 w-5", reportTypeConfig[report.type].color.split(" ")[1])} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-mono text-xs text-muted-foreground">
                              {report.id}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] px-1.5 py-0",
                                reportTypeConfig[report.type].color
                              )}
                            >
                              {reportTypeConfig[report.type].label}
                            </Badge>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <StatusIcon className={cn("h-3 w-3", statusConfig[report.status].color)} />
                              {statusConfig[report.status].label}
                            </span>
                          </div>
                          <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                            {report.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {report.county}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {report.date}
                            </span>
                            {report.pages > 0 && (
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {report.pages} pages
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => toggleFavorite(report.id)}
                            className="p-2 rounded-lg hover:bg-accent transition-colors"
                          >
                            <Star
                              className={cn(
                                "h-4 w-4",
                                favorites.includes(report.id)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground"
                              )}
                            />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                            <Download className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                            <Share2 className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No reports found.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
