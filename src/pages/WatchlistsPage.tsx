import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Search,
  MapPin,
  Star,
  Trash2,
  Bell,
  BellOff,
  TrendingUp,
  TrendingDown,
  Minus,
  Building2,
  FileText,
  Eye,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle2,
  Pin,
  PinOff,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface WatchlistItem {
  id: string;
  county: string;
  state: string;
  alertsEnabled: boolean;
  pinned: boolean;
  trend: "up" | "down" | "flat";
  permitsLast30d: number;
  permitsChange: number;
  prediction: "surge" | "decline" | "stable";
  lastReport: string;
  addedDate: string;
}

const initialWatchlist: WatchlistItem[] = [
  {
    id: "WL-001",
    county: "Travis County",
    state: "TX",
    alertsEnabled: true,
    pinned: true,
    trend: "up",
    permitsLast30d: 342,
    permitsChange: 12.5,
    prediction: "surge",
    lastReport: "Jan 12, 2025",
    addedDate: "Nov 15, 2024",
  },
  {
    id: "WL-002",
    county: "Maricopa County",
    state: "AZ",
    alertsEnabled: true,
    pinned: true,
    trend: "up",
    permitsLast30d: 518,
    permitsChange: 8.3,
    prediction: "surge",
    lastReport: "Jan 10, 2025",
    addedDate: "Oct 3, 2024",
  },
  {
    id: "WL-003",
    county: "Dallas County",
    state: "TX",
    alertsEnabled: false,
    pinned: false,
    trend: "flat",
    permitsLast30d: 289,
    permitsChange: -1.2,
    prediction: "stable",
    lastReport: "Jan 11, 2025",
    addedDate: "Dec 1, 2024",
  },
  {
    id: "WL-004",
    county: "Hillsborough County",
    state: "FL",
    alertsEnabled: true,
    pinned: false,
    trend: "down",
    permitsLast30d: 156,
    permitsChange: -5.8,
    prediction: "decline",
    lastReport: "Jan 8, 2025",
    addedDate: "Sep 20, 2024",
  },
  {
    id: "WL-005",
    county: "King County",
    state: "WA",
    alertsEnabled: true,
    pinned: false,
    trend: "up",
    permitsLast30d: 267,
    permitsChange: 15.2,
    prediction: "surge",
    lastReport: "Jan 13, 2025",
    addedDate: "Aug 10, 2024",
  },
];

const predictionConfig = {
  surge: { color: "bg-green-500/10 text-green-600 border-green-200", label: "Surge Expected" },
  decline: { color: "bg-red-500/10 text-red-600 border-red-200", label: "Decline Expected" },
  stable: { color: "bg-muted text-muted-foreground", label: "Stable" },
};

export function WatchlistsPage() {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(initialWatchlist);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCounty, setNewCounty] = useState("");

  const toggleAlert = (id: string) => {
    setWatchlist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, alertsEnabled: !item.alertsEnabled } : item
      )
    );
  };

  const togglePin = (id: string) => {
    setWatchlist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, pinned: !item.pinned } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddCounty = () => {
    if (!newCounty.trim()) return;
    const newItem: WatchlistItem = {
      id: `WL-${String(watchlist.length + 1).padStart(3, "0")}`,
      county: newCounty,
      state: "—",
      alertsEnabled: true,
      pinned: false,
      trend: "flat",
      permitsLast30d: 0,
      permitsChange: 0,
      prediction: "stable",
      lastReport: "—",
      addedDate: "Just now",
    };
    setWatchlist((prev) => [...prev, newItem]);
    setNewCounty("");
    setShowAddModal(false);
  };

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const filteredWatchlist = sortedWatchlist.filter(
    (item) =>
      item.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const alertCount = watchlist.filter((item) => item.alertsEnabled).length;

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
                <Star className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Watchlists</h1>
                <p className="text-muted-foreground text-sm">
                  Track the counties and markets that matter most to you.
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Bell className="h-4 w-4" />
              {alertCount} Alert{alertCount !== 1 ? "s" : ""}
            </Button>
            <Button
              className="gap-2"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="h-4 w-4" />
              Add County
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{watchlist.length}</div>
              <div className="text-xs text-muted-foreground">Counties Tracked</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {watchlist.filter((w) => w.prediction === "surge").length}
              </div>
              <div className="text-xs text-muted-foreground">Surge Predictions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {watchlist.filter((w) => w.prediction === "decline").length}
              </div>
              <div className="text-xs text-muted-foreground">Decline Predictions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {watchlist.reduce((sum, w) => sum + w.permitsLast30d, 0).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Permits (30d)</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your watchlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Watchlist Items */}
        <div className="space-y-3">
          {filteredWatchlist.length > 0 ? (
            filteredWatchlist.map((item) => (
              <Card
                key={item.id}
                className={cn(
                  "hover:shadow-md transition-shadow",
                  item.pinned && "border-primary/30 ring-1 ring-primary/10"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Pin */}
                    <button
                      onClick={() => togglePin(item.id)}
                      className="shrink-0 p-1 rounded hover:bg-accent transition-colors"
                    >
                      {item.pinned ? (
                        <Pin className="h-4 w-4 text-primary fill-primary" />
                      ) : (
                        <PinOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>

                    {/* County Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold">{item.county}</h3>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {item.state}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] px-1.5 py-0",
                            predictionConfig[item.prediction].color
                          )}
                        >
                          {predictionConfig[item.prediction].label}
                        </Badge>
                        {item.pinned && (
                          <Badge className="text-[10px] px-1.5 py-0 bg-primary text-primary-foreground">
                            Pinned
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-xs text-muted-foreground">Permits (30d)</div>
                          <div className="font-medium flex items-center gap-1">
                            {item.permitsLast30d.toLocaleString()}
                            {item.permitsChange !== 0 && (
                              <span
                                className={cn(
                                  "text-xs",
                                  item.permitsChange > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                )}
                              >
                                {item.permitsChange > 0 ? "+" : ""}
                                {item.permitsChange}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Trend</div>
                          <div className="font-medium flex items-center gap-1">
                            {item.trend === "up" ? (
                              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                            ) : item.trend === "down" ? (
                              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                            ) : (
                              <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                            <span className="capitalize">{item.trend}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Last Report</div>
                          <div className="font-medium">{item.lastReport}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Added</div>
                          <div className="font-medium">{item.addedDate}</div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleAlert(item.id)}
                        className="p-2 rounded-lg hover:bg-accent transition-colors"
                        title={item.alertsEnabled ? "Disable alerts" : "Enable alerts"}
                      >
                        {item.alertsEnabled ? (
                          <Bell className="h-4 w-4 text-primary" />
                        ) : (
                          <BellOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 rounded-lg hover:bg-accent transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Star className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "No counties match your search."
                  : "Your watchlist is empty. Add counties to get started."}
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowAddModal(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your First County
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add County Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add County to Watchlist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">County Name</label>
                <Input
                  placeholder="e.g., Travis County, TX"
                  value={newCounty}
                  onChange={(e) => setNewCounty(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCounty()}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddCounty} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add County
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
