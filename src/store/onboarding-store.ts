import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Goal = "resistencia" | "rendimiento" | "mantenerme" | "competencia";

type Level = "principiante" | "intermedio" | "avanzado";

type TrainingType = "running" | "swimming" | "strength" | "mixed";

type OnboardingState = {
  goal?: Goal;
  level?: Level;
  days: number[];
  duration?: number;
  trainingType?: TrainingType;
  completed: boolean;

  setGoal: (goal: Goal) => void;
  setLevel: (level: Level) => void;
  toggleDay: (day: number) => void;
  setDuration: (duration: number) => void;
  setTrainingType: (type: TrainingType) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      goal: undefined,
      level: undefined,
      days: [],
      duration: undefined,
      trainingType: undefined,
      completed: false,

      setGoal: (goal) => set({ goal }),

      setLevel: (level) => set({ level }),

      toggleDay: (day) => {
        const current = get().days;

        const exists = current.includes(day);

        set({
          days: exists ? current.filter((d) => d !== day) : [...current, day],
        });
      },

      setDuration: (duration) => set({ duration }),

      setTrainingType: (type) => set({ trainingType: type }),

      completeOnboarding: () => set({ completed: true }),

      resetOnboarding: () =>
        set({
          goal: undefined,
          level: undefined,
          days: [],
          duration: undefined,
          trainingType: undefined,
          completed: false,
        }),
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
