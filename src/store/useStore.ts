import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, CalisthenicProgress, GymProgress, GymSet, WeightEntry, LoggedFoodItem } from '../types';

interface AppState {
  onboardingComplete: boolean;
  profile: UserProfile | null;
  calisthenicsProgress: CalisthenicProgress;
  gymProgress: GymProgress;
  selectedProgram: string;
  currentDayIndex: number;
  weightHistory: WeightEntry[];
  workoutDates: string[];
  foodLog: LoggedFoodItem[];

  completeOnboarding: (profile: UserProfile) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  upgradeSkillLevel: (skillId: string) => void;
  setSkillLevel: (skillId: string, level: number) => void;
  logGymSet: (exerciseId: string, set: GymSet) => void;
  clearGymSets: (exerciseId: string) => void;
  selectProgram: (programId: string) => void;
  nextDay: () => void;
  logWorkout: () => void;
  addWeightEntry: (weight: number) => void;
  addFoodLog: (item: LoggedFoodItem) => void;
  removeFoodLog: (id: string) => void;
  reset: () => void;
}

const defaultState = {
  onboardingComplete: false,
  profile: null,
  calisthenicsProgress: {},
  gymProgress: {},
  selectedProgram: 'ppl',
  currentDayIndex: 0,
  weightHistory: [],
  workoutDates: [],
  foodLog: [],
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      ...defaultState,

      completeOnboarding: (profile) =>
        set({
          onboardingComplete: true,
          profile,
          weightHistory: [{ date: new Date().toISOString().split('T')[0], weight: profile.weight }],
        }),

      updateProfile: (partial) =>
        set((s) => ({ profile: s.profile ? { ...s.profile, ...partial } : null })),

      upgradeSkillLevel: (skillId) =>
        set((s) => ({
          calisthenicsProgress: {
            ...s.calisthenicsProgress,
            [skillId]: (s.calisthenicsProgress[skillId] ?? 0) + 1,
          },
        })),

      setSkillLevel: (skillId, level) =>
        set((s) => ({
          calisthenicsProgress: { ...s.calisthenicsProgress, [skillId]: level },
        })),

      logGymSet: (exerciseId, gymSet) =>
        set((s) => ({
          gymProgress: {
            ...s.gymProgress,
            [exerciseId]: [...(s.gymProgress[exerciseId] ?? []), gymSet],
          },
        })),

      clearGymSets: (exerciseId) =>
        set((s) => ({
          gymProgress: { ...s.gymProgress, [exerciseId]: [] },
        })),

      selectProgram: (programId) => set({ selectedProgram: programId, currentDayIndex: 0 }),

      nextDay: () =>
        set((s) => ({ currentDayIndex: s.currentDayIndex + 1 })),

      logWorkout: () =>
        set((s) => {
          const today = new Date().toISOString().split('T')[0];
          if (s.workoutDates.includes(today)) return {};
          return { workoutDates: [...s.workoutDates, today] };
        }),

      addWeightEntry: (weight) =>
        set((s) => {
          const today = new Date().toISOString().split('T')[0];
          const updated = s.weightHistory.filter((e) => e.date !== today);
          updated.push({ date: today, weight });
          const profile = s.profile ? { ...s.profile, weight } : null;
          return { weightHistory: updated, profile };
        }),

      addFoodLog: (item) =>
        set((s) => ({ foodLog: [...s.foodLog, item] })),

      removeFoodLog: (id) =>
        set((s) => ({ foodLog: s.foodLog.filter((f) => f.id !== id) })),

      reset: () => set(defaultState),
    }),
    { name: 'fitness-app-store' }
  )
);
