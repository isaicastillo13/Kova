import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTodayIndex } from "@/src/components/utils/date";

type WorkoutStatus = "pending" | "completed";

type Activity = {
  id: string;
  title: string;
  subtitle: string;
  dateLabel: string;
};

type TodayWorkout = {
  type: string;
  title: string;
  day: string;
  duration: string;
  difficulty: string;
  metric: string;
  heartRate: string;
  status: WorkoutStatus;
};

type WeeklyGoal = {
  distance: number;
  unit: string;
  progressCurrent: number;
  progressTotal: number;
  completedSessions: number;
  totalSessions: number;
};

type GeneratedPlan = {
  weeklyGoal: WeeklyGoal;
  todayWorkout: TodayWorkout;
};

type HomeState = {
  weeklyGoal: WeeklyGoal;
  todayWorkout: TodayWorkout;
  completedDays: number[];
  activities: Activity[];

  toggleTodayWorkout: () => void;
  setPlanFromOnboarding: (plan: GeneratedPlan) => void;
  resetHomeProgress: () => void;
};

export const useHomeStore = create<HomeState>()(
  persist(
    (set, get) => ({
      weeklyGoal: {
        distance: 41,
        unit: "km",
        progressCurrent: 0,
        progressTotal: 41,
        completedSessions: 0,
        totalSessions: 7,
      },

      todayWorkout: {
        type: "Intervalos",
        title: "Rodaje de velocidad",
        day: "Martes",
        duration: "55 min",
        difficulty: "Media",
        metric: "6x400",
        heartRate: "FC 160 - 175",
        status: "pending",
      },

      completedDays: [],
      activities: [],

      setPlanFromOnboarding: (plan) => {
        set({
          weeklyGoal: plan.weeklyGoal,
          todayWorkout: {
            ...plan.todayWorkout,
            status: "pending",
          },
          completedDays: [],
          activities: [],
        });
      },

      resetHomeProgress: () => {
        set((state) => ({
          weeklyGoal: {
            ...state.weeklyGoal,
            progressCurrent: 0,
            completedSessions: 0,
          },
          todayWorkout: {
            ...state.todayWorkout,
            status: "pending",
          },
          completedDays: [],
          activities: [],
        }));
      },

      toggleTodayWorkout: () => {
        const state = get();
        const isCompleted = state.todayWorkout.status === "completed";
        const todayIndex = getTodayIndex();

        const updatedCompletedDays = isCompleted
          ? state.completedDays.filter((day) => day !== todayIndex)
          : [...new Set([...state.completedDays, todayIndex])];

        const updatedCompletedSessions = isCompleted
          ? Math.max(state.weeklyGoal.completedSessions - 1, 0)
          : state.weeklyGoal.completedSessions + 1;

        const updatedProgressCurrent = isCompleted
          ? Math.max(state.weeklyGoal.progressCurrent - 1, 0)
          : state.weeklyGoal.progressCurrent + 1;

        const updatedActivities = isCompleted
          ? state.activities.filter((item) => item.id !== "today-workout")
          : [
              {
                id: "today-workout",
                dateLabel: "Hoy",
                title: state.todayWorkout.title,
                subtitle: `${state.todayWorkout.metric} · ${state.todayWorkout.duration}`,
              },
              ...state.activities,
            ];

        set({
          todayWorkout: {
            ...state.todayWorkout,
            status: isCompleted ? "pending" : "completed",
          },
          completedDays: updatedCompletedDays,
          activities: updatedActivities,
          weeklyGoal: {
            ...state.weeklyGoal,
            completedSessions: updatedCompletedSessions,
            progressCurrent: updatedProgressCurrent,
          },
        });
      },
    }),
    {
      name: "home-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);