import { useState } from "react";
import { History, Bell, AlertCircle, CheckCircle2 } from "lucide-react";
import { trpc } from "@/providers/trpc";

type ChangeFilter = "all" | "unread";

export function WhatChangedPage() {
  const [filter, setFilter] = useState<ChangeFilter>("all");

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = trpc.notification.history.useQuery({ limit: 50, offset: 0 });

  const items = data?.notifications ?? data?.items ?? [];
  const visible =
    filter === "unread" ? items.filter((n: any) => !n.readAt && !n.read) : items;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">What Changed</h1>
        <p className="text-muted-foreground mt-2">
          Recent signals and alerts across your tracked markets. Entries appear
          here as the Kestovar engine detects changes in permit activity,
          coverage, and watchlisted counties.
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as ChangeFilter)}
          className="rounded-lg border border-input bg-background px-4 py-2 text-sm"
        >
          <option value="all">All changes</option>
          <option value="unread">Unread only</option>
        </select>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="p-4 border rounded-lg bg-card animate-pulse">
              <div className="h-4 w-1/3 rounded bg-muted mb-2" />
              <div className="h-3 w-2/3 rounded bg-muted" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="p-6 border rounded-lg bg-card text-center">
          <AlertCircle className="mx-auto h-8 w-8 mb-3 text-muted-foreground" />
          <p className="font-medium">Couldn&rsquo;t load recent changes</p>
          <p className="text-sm text-muted-foreground mb-4">
            The change feed is temporarily unavailable.
          </p>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="space-y-4">
          {visible.map((n: any) => (
            <div key={n.id} className="p-4 border rounded-lg bg-card">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-blue-500 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold">{n.title || n.type || "Signal update"}</h3>
                  {n.body && (
                    <p className="text-sm text-muted-foreground">{n.body}</p>
                  )}
                  {n.message && !n.body && (
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                  )}
                  <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                    {n.type && <span>{n.type}</span>}
                    {n.createdAt && (
                      <span>{new Date(n.createdAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>
                {(n.readAt || n.read) && (
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-1" />
                )}
              </div>
            </div>
          ))}

          {visible.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <History className="mx-auto h-12 w-12 mb-4" />
              <p>No changes recorded yet</p>
              <p className="text-sm">
                Changes will appear here once your markets generate new signals.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
