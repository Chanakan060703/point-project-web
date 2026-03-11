import { create } from 'zustand';
import { getCurrentPoints } from '@/lib/auth';

interface PointState {
  points: number | null;
  loading: boolean;
  currentUserId: number | null;
  lastFetchedAt: number | null;
  fetchPoints: (userId: number, force?: boolean) => Promise<void>;
  reset: () => void;
}

const REFRESH_COOLDOWN_MS = 20_000;

export const usePointStore = create<PointState>()((set, get) => ({
  points: null,
  loading: false,
  currentUserId: null,
  lastFetchedAt: null,
  fetchPoints: async (userId, force = false) => {
    const { currentUserId, lastFetchedAt, loading } = get();

    if (!force && loading && currentUserId === userId) {
      return;
    }

    if (
      !force &&
      currentUserId === userId &&
      lastFetchedAt !== null &&
      Date.now() - lastFetchedAt < REFRESH_COOLDOWN_MS
    ) {
      return;
    }

    set((state) => ({
      loading: state.currentUserId !== userId || state.points === null,
      currentUserId: userId,
    }));

    try {
      const points = await getCurrentPoints(userId);
      set({
        points,
        loading: false,
        currentUserId: userId,
        lastFetchedAt: Date.now(),
      });
    } catch (error) {
      console.error('Failed to fetch points:', error);
      set({ loading: false });
    }
  },
  reset: () =>
    set({
      points: null,
      loading: false,
      currentUserId: null,
      lastFetchedAt: null,
    }),
}));
