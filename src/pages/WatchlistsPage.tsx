import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Search,
  Plus,
  Pin,
  Bell,
  Edit3,
  Trash2,
  MapPin,
  AlertTriangle,
  Eye,
  EyeOff,
  RotateCcw,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WatchlistFormData {
  name: string;
  states: string;
  counties: string;
  eventTypes: string;
  alertEnabled: boolean;
}

const defaultForm: WatchlistFormData = {
  name: "",
  states: "",
  counties: "",
  eventTypes: "",
  alertEnabled: true,
};

function parseCommaList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function WatchlistsPage() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<WatchlistFormData>(defaultForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const {
    data: rawWatchlists,
    isLoading,
    error,
    refetch,
  } = trpc.watchlist.list.useQuery();

  // The watchlist API stores a single state/county string per row; the UI
  // works with arrays. Normalize at the boundary (comma-joined values are
  // split back into arrays). createdAt arrives as unix seconds.
  const watchlists = useMemo(() => {
    if (!Array.isArray(rawWatchlists)) return rawWatchlists;
    return rawWatchlists.map((w) => ({
      ...w,
      states: typeof w.state === "string" && w.state ? w.state.split(",").map((s) => s.trim()).filter(Boolean) : [],
      counties: typeof w.county === "string" && w.county ? w.county.split(",").map((s) => s.trim()).filter(Boolean) : [],
      eventTypes: Array.isArray(w.eventTypes) ? w.eventTypes : [],
      updatedAt: w.updatedAt ?? (typeof w.createdAt === "number" ? w.createdAt * 1000 : null),
    }));
  }, [rawWatchlists]);

  const { data: alertsData } = trpc.watchlist.checkAlerts.useQuery();

  const alertMap = useMemo(() => {
    const map = new Map<number, number>();
    if (!Array.isArray(alertsData)) return map;
    for (const entry of alertsData) {
      map.set(entry.watchlist.id, entry.alertCount);
    }
    return map;
  }, [alertsData]);

  const createMutation = trpc.watchlist.create.useMutation({
    onSuccess: () => {
      toast.success("Watchlist created");
      utils.watchlist.list.invalidate();
      utils.watchlist.checkAlerts.invalidate();
      closeModal();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create watchlist");
    },
  });

  const updateMutation = trpc.watchlist.update.useMutation({
    onSuccess: () => {
      toast.success("Watchlist updated");
      utils.watchlist.list.invalidate();
      utils.watchlist.checkAlerts.invalidate();
      closeModal();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update watchlist");
    },
  });

  const deleteMutation = trpc.watchlist.delete.useMutation({
    onSuccess: () => {
      toast.success("Watchlist deleted");
      utils.watchlist.list.invalidate();
      utils.watchlist.checkAlerts.invalidate();
      setDeleteConfirmId(null);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete watchlist");
    },
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (watchlist: NonNullable<typeof watchlists>[number]) => {
    setEditingId(watchlist.id);
    setForm({
      name: watchlist.name,
      states: watchlist.states.join(", "),
      counties: watchlist.counties?.join(", ") ?? "",
      eventTypes: watchlist.eventTypes?.join(", ") ?? "",
      alertEnabled: watchlist.alertEnabled,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(defaultForm);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const states = parseCommaList(form.states);
    if (states.length === 0) {
      toast.error("At least one state is required");
      return;
    }

    // API contract: single state/county string per watchlist (comma-joined
    // for multiple values); eventTypes is not yet supported server-side.
    const payload = {
      name: form.name.trim(),
      state: states.join(", "),
      county: parseCommaList(form.counties).join(", "),
      alertEnabled: form.alertEnabled,
    };

    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const toggleAlertEnabled = (watchlist: NonNullable<typeof watchlists>[number]) => {
    updateMutation.mutate({
      id: watchlist.id,
      alertEnabled: !watchlist.alertEnabled,
    });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id });
  };

  const filteredWatchlists = useMemo(() => {
    if (!watchlists) return [];
    if (!searchQuery.trim()) return watchlists;
    const q = searchQuery.toLowerCase();
    return watchlists.filter((w) => {
      const nameMatch = w.name.toLowerCase().includes(q);
      const stateMatch = w.states.some((s) => s.toLowerCase().includes(q));
      const countyMatch = w.counties?.some((c) => c.toLowerCase().includes(q));
      return nameMatch || stateMatch || countyMatch;
    });
  }, [watchlists, searchQuery]);

  const alertEnabledCount = watchlists?.filter((w) => w.alertEnabled).length ?? 0;
  const totalAlerts = Array.isArray(alertsData) ? alertsData.reduce((sum, a) => sum + a.alertCount, 0) : 0;

  return (
    <div className="min-h-screen bg-canvas">
      <div className="container mx-auto py-8 px-4 max-w-content">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 gap-2 text-ink-secondary hover:text-ink-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-accent-indigo/10 rounded-lg flex items-center justify-center">
              <Star className="h-5 w-5 text-accent-indigo" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-ink-primary">Watchlists</h1>
              <p className="text-ink-secondary text-sm">
                Track the counties and markets that matter most to you.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Bell className="h-4 w-4" />
              {alertEnabledCount} Alert{alertEnabledCount !== 1 ? "s" : ""}
            </Button>
            <Button className="gap-2" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Create Watchlist
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-ink-primary">
                {isLoading ? (
                  <Skeleton className="h-8 w-12 mx-auto" />
                ) : (
                  watchlists?.length ?? 0
                )}
              </div>
              <div className="text-xs text-ink-secondary">Watchlists</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent-teal">
                {isLoading ? (
                  <Skeleton className="h-8 w-12 mx-auto" />
                ) : (
                  alertEnabledCount
                )}
              </div>
              <div className="text-xs text-ink-secondary">Alerts Enabled</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent-amber">
                {isLoading ? (
                  <Skeleton className="h-8 w-12 mx-auto" />
                ) : (
                  totalAlerts
                )}
              </div>
              <div className="text-xs text-ink-secondary">New Events (24h)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-ink-primary">
                {isLoading ? (
                  <Skeleton className="h-8 w-12 mx-auto" />
                ) : (
                  watchlists?.reduce((sum, w) => sum + (w.states?.length ?? 0), 0) ?? 0
                )}
              </div>
              <div className="text-xs text-ink-secondary">States Tracked</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-tertiary" />
          <Input
            placeholder="Search watchlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50/50">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-3" />
              <p className="text-ink-primary font-medium mb-1">Failed to load watchlists</p>
              <p className="text-ink-secondary text-sm mb-4">
                {error.message || "Something went wrong. Please try again."}
              </p>
              <Button variant="outline" onClick={() => refetch()} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading Skeletons */}
        {isLoading && !error && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-8 w-8 rounded shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Watchlist Items */}
        {!isLoading && !error && (
          <div className="space-y-3">
            {filteredWatchlists.length > 0 ? (
              filteredWatchlists.map((watchlist) => {
                const alertCount = alertMap.get(watchlist.id) ?? 0;
                return (
                  <Card
                    key={watchlist.id}
                    className={cn(
                      "hover:shadow-md transition-shadow",
                      watchlist.alertEnabled && "border-accent-indigo/30 ring-1 ring-accent-indigo/10"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Pin icon placeholder */}
                        <button className="shrink-0 p-1 rounded hover:bg-accent transition-colors">
                          <Pin className="h-4 w-4 text-ink-tertiary" />
                        </button>

                        {/* Watchlist Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-semibold text-ink-primary">
                              {watchlist.name}
                            </h3>
                            {alertCount > 0 && (
                              <Badge className="text-[10px] px-1.5 py-0 bg-accent-amber text-white gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {alertCount} alert{alertCount !== 1 ? "s" : ""}
                              </Badge>
                            )}
                            {watchlist.alertEnabled && (
                              <Badge className="text-[10px] px-1.5 py-0 bg-accent-indigo text-white">
                                Alerts On
                              </Badge>
                            )}
                          </div>

                          {/* States */}
                          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                            <MapPin className="h-3.5 w-3.5 text-ink-tertiary" />
                            {watchlist.states.map((state) => (
                              <Badge
                                key={state}
                                variant="outline"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {state}
                              </Badge>
                            ))}
                          </div>

                          {/* Counties */}
                          {watchlist.counties && watchlist.counties.length > 0 && (
                            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                              <span className="text-xs text-ink-tertiary">Counties:</span>
                              {watchlist.counties.map((county) => (
                                <Badge
                                  key={county}
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 text-accent-teal border-accent-teal/30"
                                >
                                  {county}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Event Types */}
                          {watchlist.eventTypes && watchlist.eventTypes.length > 0 && (
                            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                              <span className="text-xs text-ink-tertiary">Events:</span>
                              {watchlist.eventTypes.map((et) => (
                                <Badge
                                  key={et}
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 text-accent-indigo border-accent-indigo/30"
                                >
                                  {et}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Meta */}
                          <div className="text-xs text-ink-tertiary mt-1">
                            Updated{" "}
                            {watchlist.updatedAt
                              ? new Date(watchlist.updatedAt).toLocaleDateString()
                              : "—"}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => toggleAlertEnabled(watchlist)}
                            className="p-2 rounded-lg hover:bg-accent transition-colors"
                            title={
                              watchlist.alertEnabled
                                ? "Disable alerts"
                                : "Enable alerts"
                            }
                          >
                            {watchlist.alertEnabled ? (
                              <Bell className="h-4 w-4 text-accent-indigo" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-ink-tertiary" />
                            )}
                          </button>
                          <button
                            onClick={() => openEdit(watchlist)}
                            className="p-2 rounded-lg hover:bg-accent transition-colors"
                            title="Edit watchlist"
                          >
                            <Edit3 className="h-4 w-4 text-ink-secondary" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(watchlist.id)}
                            className="p-2 rounded-lg hover:bg-accent transition-colors"
                            title="Delete watchlist"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Star className="h-8 w-8 text-ink-tertiary mx-auto mb-2" />
                <p className="text-ink-secondary mb-4">
                  {searchQuery
                    ? "No watchlists match your search."
                    : "Your watchlist is empty. Create one to get started."}
                </p>
                {!searchQuery && (
                  <Button onClick={openCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Your First Watchlist
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg bg-surface">
            <CardHeader>
              <CardTitle className="text-ink-primary">
                {editingId !== null ? "Edit Watchlist" : "Create Watchlist"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-ink-primary">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g., Texas Growth Markets"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-ink-primary">
                  States <span className="text-red-500">*</span>
                  <span className="text-ink-tertiary font-normal ml-1">
                    (comma-separated, e.g. TX, FL, CA)
                  </span>
                </label>
                <Input
                  placeholder="TX, FL, CA"
                  value={form.states}
                  onChange={(e) => setForm((f) => ({ ...f, states: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-ink-primary">
                  Counties
                  <span className="text-ink-tertiary font-normal ml-1">
                    (comma-separated, optional)
                  </span>
                </label>
                <Input
                  placeholder="Travis County, Maricopa County"
                  value={form.counties}
                  onChange={(e) => setForm((f) => ({ ...f, counties: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-ink-primary">
                  Event Types
                  <span className="text-ink-tertiary font-normal ml-1">
                    (coming soon — not yet saved)
                  </span>
                </label>
                <Input
                  placeholder="PERMIT, INSPECTION, COMPLETION"
                  value={form.eventTypes}
                  disabled
                  onChange={(e) => setForm((f) => ({ ...f, eventTypes: e.target.value }))}
                />
              </div>

              <div className="flex items-center gap-3 py-1">
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, alertEnabled: !f.alertEnabled }))
                  }
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    form.alertEnabled ? "bg-accent-indigo" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      form.alertEnabled ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
                <span className="text-sm text-ink-secondary">
                  {form.alertEnabled ? "Alerts enabled" : "Alerts disabled"}
                </span>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="gap-2"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Eye className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingId !== null ? (
                    <>
                      <Edit3 className="h-4 w-4" />
                      Update Watchlist
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Watchlist
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm bg-surface">
            <CardHeader>
              <CardTitle className="text-ink-primary flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-500" />
                Delete Watchlist?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-ink-secondary">
                This action cannot be undone. The watchlist and all its
                associated alerts will be permanently removed.
              </p>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirmId(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(deleteConfirmId)}
                  disabled={deleteMutation.isPending}
                  className="gap-2"
                >
                  {deleteMutation.isPending ? (
                    <>
                      <Eye className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
