import { lazy, Suspense } from 'react';

const PersonalizedRecommendations = lazy(() => import('./PersonalizedRecommendations'));
const WeeklyDigest = lazy(() => import('./WeeklyDigest'));
const WorkflowReminders = lazy(() => import('./WorkflowReminders'));
const RecentActivity = lazy(() => import('./RecentActivity'));

export default function DashboardWidgets() {
  return (
    <div className="space-y-4 mt-6">
      <Suspense fallback={<WidgetSkeleton />}>
        <WorkflowReminders />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Suspense fallback={<WidgetSkeleton />}>
          <PersonalizedRecommendations />
        </Suspense>
        <Suspense fallback={<WidgetSkeleton />}>
          <WeeklyDigest />
        </Suspense>
      </div>

      <Suspense fallback={<WidgetSkeleton />}>
        <RecentActivity />
      </Suspense>
    </div>
  );
}

function WidgetSkeleton() {
  return (
    <div className="bg-surface border border-ink-wash rounded-2xl p-4 animate-pulse">
      <div className="h-4 bg-canvas rounded w-1/3 mb-3" />
      <div className="h-3 bg-canvas rounded w-full mb-2" />
      <div className="h-3 bg-canvas rounded w-2/3" />
    </div>
  );
}
