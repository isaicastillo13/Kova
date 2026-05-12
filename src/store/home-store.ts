import { getTodayDateString, getTodayIndex } from "@/src/components/utils/date";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type WorkoutStatus = "pending" | "completed";

type DayWorkoutType = "running" | "swimming" | "strength" | "mixed" | "rest";

type WorkoutDetailBlockType =
  | "warmup"
  | "main"
  | "recovery"
  | "cooldown"
  | "notes";

type WorkoutCategory =
  | "easy_run"
  | "intervals"
  | "tempo"
  | "long_run"
  | "strength"
  | "swim_technique"
  | "swim_endurance"
  | "mixed_conditioning"
  | "rest";

type DayWorkout = {
  day: number;
  type: DayWorkoutType;
  category: WorkoutCategory;
  title: string;
  description: string;
  intensity: "baja" | "media" | "alta" | "recuperación";
  km?: number;
  duration?: number;
  targetPace?: string;
  targetHeartRate?: string;
  details?: WorkoutDetailBlock[];
};

type WorkoutDetailBlock = {
  type: WorkoutDetailBlockType;
  label: string;
  description: string;
};

type Activity = {
  id: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  type: string;
  km: number;
  duration: string;
};

type TodayWorkout = {
  type: string;
  category?: WorkoutCategory;
  title: string;
  description?: string;
  day: string;
  duration: string;
  difficulty: string;
  metric: string;
  heartRate: string;
  targetPace?: string;
  km: number;
  status: WorkoutStatus;
  details?: WorkoutDetailBlock[];
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
  selectedWorkout: DayWorkout | null;
  completedDays: number[];
  completedDates: string[];
  activities: Activity[];

  toggleTodayWorkout: () => void;
  setPlanFromOnboarding: (plan: GeneratedPlan) => void;
  resetHomeProgress: () => void;
  setSelectedWorkout: (workout: DayWorkout | null) => void;
  clearSelectedWorkout: () => void;
};

function buildTodayWorkoutFromDay(dayWorkout: DayWorkout): TodayWorkout {
  const isRest = dayWorkout.type === "rest";

  return {
    type: isRest ? "Descanso" : dayWorkout.type,
    category: dayWorkout.category,
    title: dayWorkout.title,
    description: dayWorkout.description,
    day: "Hoy",
    duration: isRest ? "—" : `${dayWorkout.duration ?? 0} min`,
    difficulty: dayWorkout.intensity,
    metric: isRest
      ? "Sin carga"
      : dayWorkout.type === "running" || dayWorkout.type === "mixed"
        ? `${dayWorkout.km ?? 0} km`
        : "Sesión",
    heartRate: isRest
      ? "Recuperación"
      : (dayWorkout.targetHeartRate ?? "FC 140-160"),
    targetPace: dayWorkout.targetPace,
    km: dayWorkout.km ?? 0,
    status: "pending",
    details: dayWorkout.details ?? [],
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
      selectedWorkout: null,

      completedDays: [],
      completedDates: [],
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
          selectedWorkout: null,
          completedDays: [],
          completedDates: [],
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
          selectedWorkout: null,
          completedDays: [],
          completedDates: [],
          activities: [],
        });
      },

      setSelectedWorkout: (workout) => {
        set({ selectedWorkout: workout });
      },

      clearSelectedWorkout: () => {
        set({ selectedWorkout: null });
      },

      toggleTodayWorkout: () => {
        const state = get();
        const isCompleted = state.todayWorkout.status === "completed";
        const todayIndex = getTodayIndex();
        const todayDate = getTodayDateString();
        const workoutKm = state.todayWorkout.km ?? 0;

        if (
          state.todayWorkout.type.toLowerCase() === "descanso" ||
          workoutKm <= 0
        ) {
          return;
        }

        const updatedCompletedDays = isCompleted
          ? state.completedDays.filter((day) => day !== todayIndex)
          : [...new Set([...state.completedDays, todayIndex])];

        const updatedCompletedDates = isCompleted
          ? state.completedDates.filter((date) => date !== todayDate)
          : [...new Set([...state.completedDates, todayDate])];

        const updatedCompletedSessions = isCompleted
          ? Math.max(state.weeklyGoal.completedSessions - 1, 0)
          : Math.min(
              state.weeklyGoal.completedSessions + 1,
              state.weeklyGoal.totalSessions,
            );

        const updatedProgressCurrent = isCompleted
          ? Math.max(state.weeklyGoal.progressCurrent - workoutKm, 0)
          : Math.min(
              state.weeklyGoal.progressCurrent + workoutKm,
              state.weeklyGoal.progressTotal,
            );

        const activityId = `workout-${todayDate}`;

        const updatedActivities = isCompleted
          ? state.activities.filter((item) => item.id !== activityId)
          : [
              {
                id: activityId,
                dateLabel: "Hoy",
                title: state.todayWorkout.title,
                subtitle: `${state.todayWorkout.metric} · ${state.todayWorkout.duration}`,
                type: state.todayWorkout.type,
                km: workoutKm,
                duration: state.todayWorkout.duration,
              },
              ...state.activities.filter((item) => item.id !== activityId),
            ];

        set({
          todayWorkout: {
            ...state.todayWorkout,
            status: isCompleted ? "pending" : "completed",
          },
          completedDays: updatedCompletedDays,
          completedDates: updatedCompletedDates,
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
    },
  ),
);
