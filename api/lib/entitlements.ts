import { TRPCError } from "@trpc/server";

// Plan entitlement matrix
// DEPRECATED / NOT DEPLOYED: production entitlement truth is PLAN_LIMITS in
// buildsignal-worker (enforced atomically at write time). This file is kept
// only for type/reference compatibility and MUST mirror the worker exactly.
export const PLAN_ENTITLEMENTS = {
  scout: {
    name: "Scout",
    price: 99,
    maxUsers: 1,
    maxCounties: 1,
    maxWatchlists: 1,
    maxAlerts: 3, // alert deliveries per UTC day
    searchLevel: "basic",
    reportFrequency: "weekly",
    apiAccess: false,
    customReports: false,
    prioritySupport: false,
    dataRetentionDays: 90,
  },
  professional: {
    name: "Professional",
    price: 249,
    maxUsers: 5,
    maxCounties: 10,
    maxWatchlists: 10,
    maxAlerts: 50, // alert deliveries per UTC day
    searchLevel: "advanced",
    reportFrequency: "daily",
    apiAccess: true,
    customReports: false,
    prioritySupport: false,
    dataRetentionDays: 365,
  },
  business: {
    name: "Business",
    price: 599,
    maxUsers: 999, // finite configured limit (do not market as unlimited)
    maxCounties: -1, // unlimited
    maxWatchlists: 999, // finite configured limit (do not market as unlimited)
    maxAlerts: -1, // unlimited alert deliveries per UTC day
    searchLevel: "full",
    reportFrequency: "realtime",
    apiAccess: true,
    customReports: true,
    prioritySupport: true,
    dataRetentionDays: 730,
  },
  enterprise: {
    name: "Enterprise",
    price: null, // custom
    maxUsers: -1,
    maxCounties: -1,
    maxWatchlists: -1,
    maxAlerts: -1,
    searchLevel: "full",
    reportFrequency: "realtime",
    apiAccess: true,
    customReports: true,
    prioritySupport: true,
    dataRetentionDays: -1, // unlimited
  },
} as const;

export type PlanId = keyof typeof PLAN_ENTITLEMENTS;

export function getEntitlements(plan: string) {
  return PLAN_ENTITLEMENTS[plan as PlanId] || PLAN_ENTITLEMENTS.scout;
}

export function featureAvailable(plan: string, feature: keyof typeof PLAN_ENTITLEMENTS.scout): boolean {
  const entitlements = getEntitlements(plan);
  const value = entitlements[feature];
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  return !!value;
}

export function withinLimit(plan: string, limit: keyof typeof PLAN_ENTITLEMENTS.scout, current: number): boolean {
  const entitlements = getEntitlements(plan);
  const max = entitlements[limit] as number;
  if (max === -1) return true; // unlimited
  return current < max;
}

// Middleware helper to check plan feature
export function requireFeature(feature: keyof typeof PLAN_ENTITLEMENTS.scout) {
  return async ({ ctx }: { ctx: any }) => {
    if (!featureAvailable(ctx.user.plan, feature)) {
      throw new TRPCError({ code: "FORBIDDEN", message: `This feature requires a higher plan. Upgrade to access ${feature}.` });
    }
  };
}

// Middleware helper to check usage limit
export function requireLimit(limit: keyof typeof PLAN_ENTITLEMENTS.scout, currentGetter: (ctx: any) => Promise<number> | number) {
  return async ({ ctx }: { ctx: any }) => {
    const current = await currentGetter(ctx);
    if (!withinLimit(ctx.user.plan, limit, current)) {
      throw new TRPCError({ code: "FORBIDDEN", message: `You have reached your ${limit} limit. Upgrade your plan for more.` });
    }
  };
}
