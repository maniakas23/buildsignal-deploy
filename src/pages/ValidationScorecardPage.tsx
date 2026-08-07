import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowRight,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Target,
  Zap,
  Shield,
  BarChart3,
  Clock,
  MapPin,
  Building2,
  Search,
  Filter,
  Download,
  Share2,
  ChevronRight,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface CountyScore {
  id: string;
  county: string;
  state: string;
  overall: number;
  dataQuality: number;
  predictionAccuracy: number;
  freshness: number;
  coverage: number;
  trend: "up" | "down" | "flat";
  lastUpdated: string;
  alerts: number;
}

const countyScores: CountyScore[] = [
  {
    id: "CS-001",
    county: "Travis County",
    state: "TX",
    overall: 92,
    dataQuality: 95,
    predictionAccuracy: 88,
    freshness: 96,
    coverage: 89,
    trend: "up",
    lastUpdated: "2 hours ago",
    alerts: 3,
  },
  {
    id: "CS-002",
    county: "Maricopa County",
    state: "AZ",
    overall: 89,
    dataQuality: 91,
    predictionAccuracy: 85,
    freshness: 94,
    coverage: 87,
    trend: "up",
    lastUpdated: "4 hours ago",
    alerts: 1,
  },
  {
    id: "CS-003",
    county: "Dallas County",
    state: "TX",
    overall: 87,
    dataQuality: 88,
    predictionAccuracy: 86,
    freshness: 92,
    coverage: 84,
    trend: "flat",
    lastUpdated: "1 hour ago",
    alerts: 0,
  },
  {
    id: "CS-004",
    county: "Hillsborough County",
    state: "FL",
    overall: 84,
    dataQuality: 86,
    predictionAccuracy: 82,
    freshness: 90,
    coverage: 80,
    trend: "down",
    lastUpdated: "6 hours ago",
    alerts: 2,
  },
  {
    id: "CS-005",
    county: "King County",
    state: "WA",
    overall: 91,
    dataQuality: 93,
    predictionAccuracy: 89,
    freshness: 95,
    coverage: 88,
    trend: "up",
    lastUpdated: "30 min ago",
    alerts: 1,
  },
  {
    id: "CS-006",
    county: "San Diego County",
    state: "CA",
    overall: 86,
    dataQuality: 87,
    predictionAccuracy: 84,
    freshness: 91,
    coverage: 83,
    trend: "flat",
    lastUpdated: "3 hours ago",
    alerts: 0,
  },
];

function ScoreRing({ score, size = 40 }: { score: number; size?: number }) {
  const circumference = 2 * Math.PI * ((size - 4) / 2);
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 90
      ? "text-green-500"
      : score >= 75
      ? "text-amber-500"
      : "text-red-500";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - 4) / 2}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-muted/30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - 4) / 2}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={color}
        />
      </svg>
      <span className="absolute text-xs font-bold">{score}</span>
    </div>
  );
}

export function ValidationScorecardPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"overall" | "dataQuality" | "predictionAccuracy" | "freshness">("overall");

  const filteredScores = countyScores
    .filter(
      (c) =>
        c.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.state.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const averageScore = Math.round(
    countyScores.reduce((sum, c) => sum + c.overall, 0) / countyScores.length
  );

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
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Validation Scorecard</h1>
                <p className="text-muted-foreground text-sm">
                  Data quality, accuracy, and coverage scores for tracked counties.
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <ScoreRing score={averageScore} size={50} />
              <div className="text-xs text-muted-foreground mt-2">Avg. Overall</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {countyScores.filter((c) => c.overall >= 90).length}
              </div>
              <div className="text-xs text-muted-foreground">Excellent (90+)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">
                {countyScores.filter((c) => c.overall >= 75 && c.overall < 90).length}
              </div>
              <div className="text-xs text-muted-foreground">Good (75-89)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {countyScores.filter((c) => c.overall < 75).length}
              </div>
              <div className="text-xs text-muted-foreground">Needs Work (&lt;75)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {countyScores.reduce((sum, c) => sum + c.alerts, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Active Alerts</div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search counties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {(["overall", "dataQuality", "predictionAccuracy", "freshness"] as const).map(
              (key) => (
                <button
                  key={key}
                  onClick={() => setSortBy(key)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    sortBy === key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {key === "predictionAccuracy" ? "Accuracy" : key.replace(/([A-Z])/g, " $1").trim()}
                </button>
              )
            )}
          </div>
        </div>

        {/* Scorecard List */}
        <div className="space-y-3">
          {filteredScores.map((score) => (
            <Card key={score.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Overall Score */}
                  <div className="shrink-0">
                    <ScoreRing score={score.overall} size={56} />
                  </div>

                  {/* County Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-semibold">{score.county}, {score.state}</h3>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {score.id}
                      </Badge>
                      {score.alerts > 0 && (
                        <Badge className="text-[10px] px-1.5 py-0 bg-red-500 text-white">
                          <AlertTriangle className="h-3 w-3 mr-0.5" />
                          {score.alerts} alert{score.alerts > 1 ? "s" : ""}
                        </Badge>
                      )}
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        {score.trend === "up" ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : score.trend === "down" ? (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        ) : (
                          <Minus className="h-3 w-3 text-muted-foreground" />
                        )}
                        <Clock className="h-3 w-3 ml-1" />
                        {score.lastUpdated}
                      </span>
                    </div>

                    {/* Metric Bars */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Data Quality</span>
                          <span className="font-medium">{score.dataQuality}</span>
                        </div>
                        <Progress value={score.dataQuality} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Prediction Acc.</span>
                          <span className="font-medium">{score.predictionAccuracy}</span>
                        </div>
                        <Progress value={score.predictionAccuracy} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Freshness</span>
                          <span className="font-medium">{score.freshness}</span>
                        </div>
                        <Progress value={score.freshness} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Coverage</span>
                          <span className="font-medium">{score.coverage}</span>
                        </div>
                        <Progress value={score.coverage} className="h-1.5" />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0">
                    <Button variant="ghost" size="sm" className="gap-1">
                      Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredScores.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No counties found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
