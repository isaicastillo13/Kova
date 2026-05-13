import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  Goal,
  InjuryHistory,
  Level,
  RaceDistance,
  RunningExperience,
  RunningProfile,
  TrainingType,
} from "@/src/types/training";

type OnboardingState = {
  goal?: Goal;
  level?: Level;
  days: number[];
  duration?: number;
  trainingType?: TrainingType;
  raceDistance?: RaceDistance;
  targetDate?: string;
  currentWeeklyKm?: number;
  longRunKm?: number;
  easyPace?: string;
  runningExperience?: RunningExperience;
  injuryHistory?: InjuryHistory;
  completed: boolean;

  setGoal: (goal: Goal) => void;
  setLevel: (level: Level) => void;
  setDays: (days: number[]) => void;
  toggleDay: (day: number) => void;
  setDuration: (duration: number) => void;
  setTrainingType: (type: TrainingType) => void;
  setRunningProfile: (profile: Partial<RunningProfile>) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
};

export type OnboardingStoreState = OnboardingState;

export function isRunningProfileComplete(state: Pick<
  OnboardingState,
  | "raceDistance"
  | "currentWeeklyKm"
  | "longRunKm"
  | "runningExperience"
  | "injuryHistory"
>) {
  return (
    !!state.raceDistance &&
    state.currentWeeklyKm !== undefined &&
    state.longRunKm !== undefined &&
    !!state.runningExperience &&
    !!state.injuryHistory
  );
}

export function isOnboardingReady(state: OnboardingState) {
  return (
    !!state.goal &&
    !!state.level &&
    state.days.length > 0 &&
    !!state.duration &&
    isRunningProfileComplete(state)
  );
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      goal: undefined,
      level: undefined,
      days: [],
      duration: undefined,
      trainingType: "running",
      raceDistance: undefined,
      targetDate: undefined,
      currentWeeklyKm: undefined,
      longRunKm: undefined,
      easyPace: undefined,
      runningExperience: undefined,
      injuryHistory: undefined,
      completed: false,

      setGoal: (goal) => set({ goal }),

      setLevel: (level) => set({ level }),

      setDays: (days) =>
        set({ days: [...new Set(days)].sort((a, b) => a - b) }),

      toggleDay: (day) => {
        const current = get().days;

        const exists = current.includes(day);

        set({
          days: exists
            ? current.filter((d) => d !== day)
            : [...current, day].sort((a, b) => a - b),
        });
      },

      setDuration: (duration) => set({ duration }),

      setTrainingType: (type) => set({ trainingType: type }),

      setRunningProfile: (profile) => set(profile),

      completeOnboarding: () => set({ completed: true }),

      resetOnboarding: () =>
        set({
          goal: undefined,
          level: undefined,
          days: [],
          duration: undefined,
          trainingType: "running",
          raceDistance: undefined,
          targetDate: undefined,
          currentWeeklyKm: undefined,
          longRunKm: undefined,
          easyPace: undefined,
          runningExperience: undefined,
          injuryHistory: undefined,
          completed: false,
        }),
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
