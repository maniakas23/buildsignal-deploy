import { create } from 'zustand';
import type { StoreApi } from 'zustand';
import type { Project, Signal, Pattern, Alert, Zone, Summary, AlertSettings, User, ProjectStatus, SurgeAlert, ProjectType } from '@/types';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  projects: Project[];
  selectedProject: Project | null;
  projectFilter: { status: ProjectStatus | 'all'; type: ProjectType | 'all'; search: string };
  setProjectFilter: (filter: Partial<AppState['projectFilter']>) => void;
  selectProject: (project: Project | null) => void;
  toggleFavorite: (projectId: string) => void;
  monitorProject: (projectId: string) => void;
  ignoreProject: (projectId: string) => void;
  getFilteredProjects: () => Project[];
  signals: Signal[];
  getProjectSignals: (projectId: string) => Signal[];
  patterns: Pattern[];
  togglePattern: (patternId: string) => void;
  alerts: Alert[];
  unreadAlertCount: number;
  acknowledgeAlert: (alertId: string) => void;
  alertSettings: AlertSettings;
  updateAlertSettings: (settings: Partial<AlertSettings>) => void;
  zones: Zone[];
  recentSurges: SurgeAlert[];
  summary: Summary | null;
  activeSignals: number;
  projectsTracked: number;
  savedStoryIds: string[];
  saveStory: (storyId: string) => void;
  unsaveStory: (storyId: string) => void;
  recentlyViewed: { type: 'project' | 'story'; id: string; title: string; viewedAt: string }[];
  addRecentlyViewed: (item: { type: 'project' | 'story'; id: string; title: string }) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  showScoreCalculator: boolean;
  setShowScoreCalculator: (show: boolean) => void;
  activeSurgeAlert: Alert | null;
  showSurgeModal: boolean;
  triggerSurgeAlert: (alert: Alert) => void;
  dismissSurgeAlert: () => void;
  toasts: ToastItem[];
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

let toastId = 0;

export const useStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  login: () => set({ user: null, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  projects: [],
  selectedProject: null,
  projectFilter: { status: 'all', type: 'all', search: '' },
  setProjectFilter: (filter) => set((state) => ({ projectFilter: { ...state.projectFilter, ...filter } })),
  selectProject: (project) => set({ selectedProject: project }),
  toggleFavorite: (projectId) => set((state) => ({ projects: state.projects.map((p) => p.id === projectId ? { ...p, isFavorite: !p.isFavorite } : p) })),
  monitorProject: (projectId) => set((state) => ({ projects: state.projects.map((p) => p.id === projectId ? { ...p, status: 'monitored' as ProjectStatus } : p) })),
  ignoreProject: (projectId) => set((state) => ({ projects: state.projects.map((p) => p.id === projectId ? { ...p, status: 'ignored' as ProjectStatus } : p) })),
  getFilteredProjects: () => {
    const { projects, projectFilter } = get();
    return projects.filter((p) => {
      const statusMatch = projectFilter.status === 'all' || p.status === projectFilter.status;
      const typeMatch = projectFilter.type === 'all' || p.type === projectFilter.type;
      const searchMatch = !projectFilter.search || p.name.toLowerCase().includes(projectFilter.search.toLowerCase()) || p.location.toLowerCase().includes(projectFilter.search.toLowerCase());
      return statusMatch && typeMatch && searchMatch;
    });
  },
  signals: [],
  getProjectSignals: (projectId) => get().signals.filter((s) => s.projectId === projectId),
  patterns: [],
  togglePattern: (patternId) => set((state) => ({ patterns: state.patterns.map((p) => p.id === patternId ? { ...p, isActive: !p.isActive } : p) })),
  alerts: [],
  unreadAlertCount: 0,
  acknowledgeAlert: (alertId) => set((state) => {
    const updatedAlerts = state.alerts.map((a) => a.id === alertId ? { ...a, isAcknowledged: true, acknowledgedAt: new Date().toISOString() } : a);
    return { alerts: updatedAlerts, unreadAlertCount: updatedAlerts.filter((a) => !a.isAcknowledged).length };
  }),
  alertSettings: { emailEnabled: true, pushEnabled: false, inappEnabled: true, scoreThreshold: 75, surgeVelocity: 3, quietHoursStart: '22:00', quietHoursEnd: '07:00' },
  updateAlertSettings: (settings) => set((state) => ({ alertSettings: { ...state.alertSettings, ...settings } })),
  zones: [],
  recentSurges: [],
  summary: null,
  activeSignals: 0,
  projectsTracked: 0,
  savedStoryIds: [],
  saveStory: (storyId) => set((state) => ({ savedStoryIds: state.savedStoryIds.includes(storyId) ? state.savedStoryIds : [...state.savedStoryIds, storyId] })),
  unsaveStory: (storyId) => set((state) => ({ savedStoryIds: state.savedStoryIds.filter((id) => id !== storyId) })),
  recentlyViewed: [],
  addRecentlyViewed: (item) => set((state) => {
    const filtered = state.recentlyViewed.filter((r) => !(r.type === item.type && r.id === item.id));
    return { recentlyViewed: [{ ...item, viewedAt: new Date().toISOString() }, ...filtered].slice(0, 10) };
  }),
  currentPage: 'dashboard',
  setCurrentPage: (page) => set({ currentPage: page }),
  showScoreCalculator: false,
  setShowScoreCalculator: (show) => set({ showScoreCalculator: show }),
  activeSurgeAlert: null,
  showSurgeModal: false,
  triggerSurgeAlert: (alert) => set({ activeSurgeAlert: alert, showSurgeModal: true }),
  dismissSurgeAlert: () => set({ activeSurgeAlert: null, showSurgeModal: false }),
  toasts: [],
  addToast: (message, type) => {
    const id = `toast-${++toastId}`;
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => { set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })); }, 4000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export type AppStore = StoreApi<AppState>;
