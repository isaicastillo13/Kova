import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTodayIndex } from "@/src/components/utils/date";

type WorkoutStatus = "pending" | "completed";

type DayWorkoutType = "running" | "swimming" | "strength" | "mixed" | "rest";

type DayWorkout = {
  day: number;
  type: DayWorkoutType;
  title: string;
  km?: number;
  duration?: number;
};

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
  km: number;
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
  weekPlan: DayWorkout[];
};

type HomeState = {
  weeklyGoal: WeeklyGoal;
  todayWorkout: TodayWorkout;
  weekPlan: DayWorkout[];
  completedDays: number[];
  activities: Activity[];

  toggleTodayWorkout: () => void;
  setPlanFromOnboarding: (plan: GeneratedPlan) => void;
  resetHomeProgress: () => void;
};

function buildTodayWorkoutFromDay(dayWorkout: DayWorkout): TodayWorkout {
  const isRest = dayWorkout.type === "rest";

  return {
    type: isRest ? "Descanso" : dayWorkout.type,
    title: dayWorkout.title,
    day: "Hoy",
    duration: isRest ? "—" : `${dayWorkout.duration ?? 0} min`,
    difficulty: isRest ? "Recuperación" : "Media",
    metric: isRest
      ? "Sin carga"
      : dayWorkout.type === "running"
      ? `${dayWorkout.km ?? 0} km`
      : "Sesión",
    heartRate: isRest ? "Recuperación" : "FC 140-160",
    km: dayWorkout.km ?? 0,
    status: "pending",
  };
}

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
        day: "Hoy",
        duration: "55 min",
        difficulty: "Media",
        metric: "6x400",
        heartRate: "FC 160 - 175",
        km: 6,
        status: "pending",
      },

      weekPlan: [],

      completedDays: [],
      activities: [],

      setPlanFromOnboarding: (plan) => {
        const todayIndex = getTodayIndex();
        const todayFromPlan =
          plan.weekPlan.find((item) => item.day === todayIndex) ??
          plan.weekPlan[0];

        set({
          weeklyGoal: plan.weeklyGoal,
          todayWorkout: todayFromPlan
            ? buildTodayWorkoutFromDay(todayFromPlan)
            : {
                ...plan.todayWorkout,
                km: plan.todayWorkout.km ?? 0,
                status: "pending",
              },
          weekPlan: plan.weekPlan,
          completedDays: [],
          activities: [],
        });
      },

      resetHomeProgress: () => {
        const state = get();
        const todayIndex = getTodayIndex();
        const todayFromPlan =
          state.weekPlan.find((item) => item.day === todayIndex) ??
          state.weekPlan[0];

        set({
          weeklyGoal: {
            ...state.weeklyGoal,
            progressCurrent: 0,
            completedSessions: 0,
          },
          todayWorkout: todayFromPlan
            ? buildTodayWorkoutFromDay(todayFromPlan)
            : {
                ...state.todayWorkout,
                status: "pending",
              },
          completedDays: [],
          activities: [],
        });
      },

      toggleTodayWorkout: () => {
        const state = get();
        const isCompleted = state.todayWorkout.status === "completed";
        const todayIndex = getTodayIndex();
        const workoutKm = state.todayWorkout.km ?? 0;

        // Si hoy es descanso, no hacer nada
        if (
          state.todayWorkout.type.toLowerCase() === "descanso" ||
          state.todayWorkout.km === 0
        ) {
          return;
        }

        const updatedCompletedDays = isCompleted
          ? state.completedDays.filter((day) => day !== todayIndex)
          : [...new Set([...state.completedDays, todayIndex])];

        const updatedCompletedSessions = isCompleted
          ? Math.max(state.weeklyGoal.completedSessions - 1, 0)
          : state.weeklyGoal.completedSessions + 1;

        const updatedProgressCurrent = isCompleted
          ? Math.max(state.weeklyGoal.progressCurrent - workoutKm, 0)
          : state.weeklyGoal.progressCurrent + workoutKm;

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