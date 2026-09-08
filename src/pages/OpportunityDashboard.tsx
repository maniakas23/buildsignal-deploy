import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { trpc } from '../providers/trpc';
import { formatRelativeTime, fetchDashboard, fetchRecommendations, scrubUnknownPlaceText } from '@/signalcore/engine';
import { EngineGate, EngineError, EmptyState } from '../components/ui-custom/EngineStates';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';
import type { DashboardMetrics, Recommendation } from '@/signalcore/engine';
import { motion, AnimatePresence } from 'framer-motion';

export default function OpportunityDashboard() {
  const navigate = useNavigate();
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [scoreMin, setScoreMin] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [selectedRecId, setSelectedRecId] = useState<string | null>(null);
  const [filterPresets, setFilterPresets] = useState<Array<{ name: string; filters: any }>>([]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dashboardData, recsData] = await Promise.all([
        fetchDashboard(),
        fetchRecommendations({ minScore: scoreMin }),
      ]);
      setMetrics(dashboardData);
      setRecommendations(recsData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load dashboard data'));
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [scoreMin]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredRecommendations = useMemo(() => {
    let filtered = [...recommendations];

    // Filter by county
    if (selectedCounty) {
      filtered = filtered.filter((rec) => rec.countyFips === selectedCounty);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (rec) =>
          rec.headline.toLowerCase().includes(query) ||
          rec.countyName.toLowerCase().includes(query) ||
          rec.stateCode.toLowerCase().includes(query)
      );
    }

    // Filter by minimum score
    filtered = filtered.filter((rec) => rec.score >= scoreMin);

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'confidence':
          return b.confidence - a.confidence;
        default:
          return 0;
      }
    });

    return filtered;
  }, [recommendations, selectedCounty, searchQuery, scoreMin, sortBy]);

  const handleSaveRecommendation = async (recId: string) => {
    try {
      // In a real implementation, this would save to the backend
      toast.success('Recommendation saved to your watchlist');
      setShowSaveDialog(false);
    } catch (err) {
      toast.error('Failed to save recommendation');
    }
  };

  const handleSaveFilterPreset = (name: string) => {
    const preset = {
      name,
      filters: {
        selectedCounty,
        scoreMin,
        searchQuery,
        sortBy,
      },
    };
    setFilterPresets([...filterPresets, preset]);
    toast.success(`Filter preset "${name}" saved`);
  };

  const handleLoadPreset = (preset: any) => {
    setSelectedCounty(preset.filters.selectedCounty);
    setScoreMin(preset.filters.scoreMin);
    setSearchQuery(preset.filters.searchQuery);
    setSortBy(preset.filters.sortBy);
    toast.success(`Filter preset "${preset.name}" loaded`);
  };

  if (error) {
    return <EngineError error={error} onRetry={loadData} />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Opportunity Dashboard</h1>
        <p className="text-muted-foreground">
          AI-powered infrastructure intelligence and recommendations
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-20" /> : metrics?.totalRecommendations || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics?.newThisWeek || 0} new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : metrics?.averageScore ? (
                metrics.averageScore.toFixed(1)
              ) : (
                'N/A'
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Out of 100</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-20" /> : metrics?.highConfidenceCount || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Score ≥ 80</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Counties Tracked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-20" /> : metrics?.countiesTracked || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active markets</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <Select value={selectedCounty || 'all'} onValueChange={(value) => setSelectedCounty(value === 'all' ? null : value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select county" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Counties</SelectItem>
              {metrics?.availableCounties?.map((county) => (
                <SelectItem key={county.fips} value={county.fips}>
                  {scrubUnknownPlaceText(county.name)}, {county.stateCode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Score (High to Low)</SelectItem>
              <SelectItem value="date">Date (Newest)</SelectItem>
              <SelectItem value="confidence">Confidence</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <label htmlFor="score-min" className="text-sm text-muted-foreground">
              Min Score:
            </label>
            <Input
              id="score-min"
              type="number"
              min="0"
              max="100"
              value={scoreMin}
              onChange={(e) => setScoreMin(Number(e.target.value))}
              className="w-20"
            />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Save Preset</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Filter Preset</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Preset name"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveFilterPreset((e.target as HTMLInputElement).value);
                    }
                  }}
                />
                <div className="space-y-2">
                  {filterPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      className="w-full"
                      onClick={() => handleLoadPreset(preset)}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Recommendations List */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'table')}>
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredRecommendations.length === 0 ? (
            <EmptyState
              title="No opportunities found"
              message="Try adjusting your filters or check back later for new recommendations."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredRecommendations.map((rec) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{scrubUnknownPlaceText(rec.headline)}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{scrubUnknownPlaceText(rec.countyName)}, {rec.stateCode}</span>
                              <span>•</span>
                              <span>{formatRelativeTime(rec.createdAt)}</span>
                            </div>
                          </div>
                          <Badge variant={rec.score >= 80 ? 'default' : rec.score >= 60 ? 'secondary' : 'outline'}>
                            {rec.score}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {scrubUnknownPlaceText(rec.summary)}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">
                              {rec.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {rec.confidence}% confidence
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecId(rec.id);
                              setShowSaveDialog(true);
                            }}
                          >
                            Save
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>

        <TabsContent value="table" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="p-4 font-medium">Opportunity</th>
                      <th className="p-4 font-medium">Location</th>
                      <th className="p-4 font-medium">Score</th>
                      <th className="p-4 font-medium">Confidence</th>
                      <th className="p-4 font-medium">Type</th>
                      <th className="p-4 font-medium">Date</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-4">
                            <Skeleton className="h-4 w-48" />
                          </td>
                          <td className="p-4">
                            <Skeleton className="h-4 w-32" />
                          </td>
                          <td className="p-4">
                            <Skeleton className="h-4 w-16" />
                          </td>
                          <td className="p-4">
                            <Skeleton className="h-4 w-16" />
                          </td>
                          <td className="p-4">
                            <Skeleton className="h-4 w-24" />
                          </td>
                          <td className="p-4">
                            <Skeleton className="h-4 w-24" />
                          </td>
                          <td className="p-4">
                            <Skeleton className="h-8 w-20" />
                          </td>
                        </tr>
                      ))
                    ) : filteredRecommendations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-muted-foreground">
                          No opportunities found
                        </td>
                      </tr>
                    ) : (
                      filteredRecommendations.map((rec) => (
                        <tr key={rec.id} className="border-b hover:bg-muted/50 cursor-pointer">
                          <td className="p-4">
                            <div className="font-medium">{scrubUnknownPlaceText(rec.headline)}</div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {scrubUnknownPlaceText(rec.countyName)}, {rec.stateCode}
                          </td>
                          <td className="p-4">
                            <Badge variant={rec.score >= 80 ? 'default' : rec.score >= 60 ? 'secondary' : 'outline'}>
                              {rec.score}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm">{rec.confidence}%</td>
                          <td className="p-4">
                            <Badge variant="outline" className="text-xs">
                              {rec.type}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {formatRelativeTime(rec.createdAt)}
                          </td>
                          <td className="p-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedRecId(rec.id);
                                setShowSaveDialog(true);
                              }}
                            >
                              Save
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Recommendation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Save this recommendation to your watchlist for easy access later.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => selectedRecId && handleSaveRecommendation(selectedRecId)}>
                Save to Watchlist
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
