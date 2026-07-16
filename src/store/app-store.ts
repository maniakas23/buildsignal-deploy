import { create } from "zustand";

type BillingPlan = "starter" | "pro" | "enterprise";

type AppState = {
  userEmail?: string;
  billingPlan: BillingPlan;
  signalCoreStatus: "connected" | "degraded";
  monitoringEnabled: boolean;
  setUserEmail: (value?: string) => void;
  setBillingPlan: (plan: BillingPlan) => void;
  toggleMonitoring: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  userEmail: undefined,
  billingPlan: "starter",
  signalCoreStatus: "connected",
  monitoringEnabled: true,
  setUserEmail: (value) => set({ userEmail: value }),
  setBillingPlan: (billingPlan) => set({ billingPlan }),
  toggleMonitoring: () => set((state) => ({ monitoringEnabled: !state.monitoringEnabled })),
}));
