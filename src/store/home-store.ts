import {
  getDateStringForWeekday,
  getRelativeDateLabel,
  getTodayDateString,
  getTodayIndex,
} from "@/src/components/utils/date";
import type {
  Activity,
  DayWorkout,
  DayWorkoutType,
  GeneratedPlan,
  TodayWorkout,
  WeeklyGoal,
  WorkoutCategory,
  WorkoutFeedback,
  WorkoutStatus,
} from "@/src/types/training";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type HomeState = {
  weeklyGoal: WeeklyGoal;
  todayWorkout: TodayWorkout;
  weekPlan: DayWorkout[];
  selectedWorkout: DayWorkout | null;
  completedDays: number[];
  completedDates: string[];
  activities: Activity[];

  toggleTodayWorkout: () => void;
  completeWorkout: (workoutId: string, feedback?: WorkoutFeedback) => void;
  skipWorkout: (workoutId: string) => void;
  resetWorkoutStatus: (workoutId: string) => void;
  setPlanFromOnboarding: (plan: GeneratedPlan) => void;
  resetHomeProgress: () => void;
  setSelectedWorkout: (workout: DayWorkout | null) => void;
  clearSelectedWorkout: () => void;
};

type HomeDataState = Pick<
  HomeState,
  | "weeklyGoal"
  | "todayWorkout"
  | "weekPlan"
  | "selectedWorkout"
  | "completedDays"
  | "completedDates"
  | "activities"
>;

type LegacyActivity = Partial<Activity> & {
  id: string;
  km?: number;
};

const defaultWeeklyGoal: WeeklyGoal = {
  distance: 41,
  unit: "km",
  progressCurrent: 0,
  progressTotal: 41,
  completedSessions: 0,
  totalSessions: 7,
};

const defaultTodayWorkout: TodayWorkout = {
  id: "day-0-intervals",
  type: "Intervalos",
  title: "Rodaje de velocidad",
  day: "Hoy",
  duration: "55 min",
  difficulty: "Media",
  metric: "6x400",
  heartRate: "FC 160 - 175",
  km: 6,
  status: "pending",
};

function isWorkoutStatus(value: unknown): value is WorkoutStatus {
  return (
    value === "pending" ||
    value === "completed" ||
    value === "skipped" ||
    value === "rescheduled"
  );
}

function normalizeWorkoutId(workout: Partial<DayWorkout>, day: number) {
  const category = workout.category ?? (workout.type === "rest" ? "rest" : "easy_run");
  return workout.id ?? `day-${day}-${category}`;
}

function normalizeWorkout(
  workout: Partial<DayWorkout>,
  fallbackDay = 0,
): DayWorkout {
  const day =
    typeof workout.day === "number" && workout.day >= 0 && workout.day <= 6
      ? workout.day
      : fallbackDay;
  const type: DayWorkoutType = workout.type ?? "running";
  const category: WorkoutCategory =
    workout.category ?? (type === "rest" ? "rest" : "easy_run");
  const status = isWorkoutStatus(workout.status) ? workout.status : "pending";
  const isRest = type === "rest";

  return {
    id: normalizeWorkoutId({ ...workout, category, type }, day),
    day,
    type,
    category,
    title: workout.title ?? (isRest ? "Descanso" : "Entrenamiento"),
    description:
      workout.description ??
      (isRest
        ? "Día de recuperación para asimilar la carga."
        : "Sesión del plan semanal."),
    intensity: workout.intensity ?? (isRest ? "recuperación" : "baja"),
    status,
    completedAt: workout.completedAt,
    skippedAt: workout.skippedAt,
    plannedDate: workout.plannedDate ?? getDateStringForWeekday(day),
    completedKm: workout.completedKm,
    feedback: workout.feedback,
    km: workout.km,
    duration: workout.duration,
    targetPace: workout.targetPace,
    targetHeartRate: workout.targetHeartRate,
    details: workout.details ?? [],
  };
}

function normalizeWeekPlan(
  weekPlan: Partial<DayWorkout>[] = [],
  completedDays: number[] = [],
  completedDates: string[] = [],
) {
  return weekPlan.map((workout, index) => {
    const normalized = normalizeWorkout(workout, index);

    if (
      normalized.status === "pending" &&
      completedDays.includes(normalized.day) &&
      normalized.type !== "rest"
    ) {
      return {
        ...normalized,
        status: "completed" as const,
        completedAt:
          completedDates.find((date) => date === normalized.plannedDate) ??
          completedDates[0] ??
          getTodayDateString(),
        completedKm: normalized.completedKm ?? normalized.km ?? 0,
      };
    }

    return normalized;
  });
}

function isTrainableWorkout(workout: DayWorkout) {
  return workout.type !== "rest" && (workout.km ?? 0) > 0;
}

function getWorkoutDate(workout: DayWorkout, status: Activity["status"]) {
  const statusDate =
    status === "completed" ? workout.completedAt : workout.skippedAt;
  return statusDate ?? getTodayDateString();
}

function buildActivity(
  workout: DayWorkout,
  status: Activity["status"],
  feedback?: WorkoutFeedback,
): Activity {
  const date = getWorkoutDate(workout, status);
  const plannedKm = workout.km ?? 0;
  const completedKm =
    status === "completed" ? workout.completedKm ?? plannedKm : 0;
  const duration = workout.type === "rest" ? "—" : `${workout.duration ?? 0} min`;

  return {
    id: `activity-${workout.id}`,
    workoutId: workout.id,
    title: workout.title,
    subtitle:
      status === "completed"
        ? `${completedKm} km · ${duration}`
        : `Omitida · ${duration}`,
    dateLabel: getRelativeDateLabel(date),
    date,
    type: workout.type,
    plannedKm,
    completedKm,
    km: completedKm,
    duration,
    status,
    feedback,
  };
}

function normalizeActivity(activity: LegacyActivity): Activity {
  const date = activity.date ?? getTodayDateString();
  const status =
    activity.status === "skipped" || activity.status === "completed"
      ? activity.status
      : "completed";
  const completedKm =
    typeof activity.completedKm === "number"
      ? activity.completedKm
      : activity.km ?? 0;
  const plannedKm =
    typeof activity.plannedKm === "number" ? activity.plannedKm : completedKm;

  return {
    id: activity.id,
    workoutId: activity.workoutId ?? activity.id,
    title: activity.title ?? "Entrenamiento",
    subtitle:
      activity.subtitle ??
      (status === "completed"
        ? `${completedKm} km · ${activity.duration ?? "—"}`
        : `Omitida · ${activity.duration ?? "—"}`),
    dateLabel: activity.dateLabel ?? getRelativeDateLabel(date),
    date,
    type: activity.type ?? "running",
    plannedKm,
    completedKm,
    km: activity.km ?? completedKm,
    duration: activity.duration ?? "—",
    status,
    feedback: activity.feedback,
  };
}

function buildTodayWorkoutFromDay(dayWorkout: DayWorkout): TodayWorkout {
  const isRest = dayWorkout.type === "rest";

  return {
    id: dayWorkout.id,
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
    status: dayWorkout.status,
    completedAt: dayWorkout.completedAt,
    skippedAt: dayWorkout.skippedAt,
    plannedDate: dayWorkout.plannedDate,
    completedKm: dayWorkout.completedKm,
    feedback: dayWorkout.feedback,
    details: dayWorkout.details ?? [],
  };
}

function deriveExecutionState(
  state: HomeDataState,
  nextWeekPlan: DayWorkout[],
  nextActivities: Activity[],
): HomeDataState {
  const trainableWorkouts = nextWeekPlan.filter(isTrainableWorkout);
  const completedWorkouts = trainableWorkouts.filter(
    (workout) => workout.status === "completed",
  );

  const progressCurrent = Math.min(
    completedWorkouts.reduce(
      (total, workout) => total + (workout.completedKm ?? workout.km ?? 0),
      0,
    ),
    state.weeklyGoal.progressTotal,
  );
  const todayFromPlan =
    nextWeekPlan.find((item) => item.day === getTodayIndex()) ??
    nextWeekPlan[0];

  return {
    ...state,
    weekPlan: nextWeekPlan,
    selectedWorkout: state.selectedWorkout
      ? nextWeekPlan.find((item) => item.id === state.selectedWorkout?.id) ??
        state.selectedWorkout
      : null,
    todayWorkout: todayFromPlan
      ? buildTodayWorkoutFromDay(todayFromPlan)
      : state.todayWorkout,
    completedDays: completedWorkouts.map((workout) => workout.day),
    completedDates: [
      ...new Set(
        completedWorkouts.map(
          (workout) => workout.completedAt ?? getTodayDateString(),
        ),
      ),
    ],
    activities: nextActivities,
    weeklyGoal: {
      ...state.weeklyGoal,
      progressCurrent,
      completedSessions: completedWorkouts.length,
      totalSessions: trainableWorkouts.length || state.weeklyGoal.totalSessions,
    },
  };
}

function normalizeHomeData(data: Partial<HomeDataState>): HomeDataState {
  const weeklyGoal = data.weeklyGoal ?? defaultWeeklyGoal;
  const weekPlan = normalizeWeekPlan(
    data.weekPlan,
    data.completedDays,
    data.completedDates,
  );
  const activities = (data.activities ?? []).map((activity) =>
    normalizeActivity(activity),
  );
  const todayFromPlan =
    weekPlan.find((item) => item.day === getTodayIndex()) ?? weekPlan[0];
  const baseState: HomeDataState = {
    weeklyGoal,
    todayWorkout: todayFromPlan
      ? buildTodayWorkoutFromDay(todayFromPlan)
      : data.todayWorkout ?? defaultTodayWorkout,
    weekPlan,
    selectedWorkout: data.selectedWorkout
      ? normalizeWorkout(data.selectedWorkout, data.selectedWorkout.day)
      : null,
    completedDays: data.completedDays ?? [],
    completedDates: data.completedDates ?? [],
    activities,
  };

  return deriveExecutionState(baseState, weekPlan, activities);
}

export const useHomeStore = create<HomeState>()(
  persist(
    (set, get) => ({
      weeklyGoal: defaultWeeklyGoal,
      todayWorkout: defaultTodayWorkout,
      weekPlan: [],
      selectedWorkout: null,
      completedDays: [],
      completedDates: [],
      activities: [],

      setPlanFromOnboarding: (plan) => {
        const normalizedPlan = normalizeWeekPlan(plan.weekPlan);
        const normalizedData = normalizeHomeData({
          weeklyGoal: plan.weeklyGoal,
          todayWorkout: plan.todayWorkout,
          weekPlan: normalizedPlan,
          selectedWorkout: null,
          completedDays: [],
          completedDates: [],
          activities: [],
        });

        set(normalizedData);
      },

      resetHomeProgress: () => {
        const state = normalizeHomeData(get());
        const resetPlan = state.weekPlan.map((workout) => ({
          ...workout,
          status: "pending" as const,
          completedAt: undefined,
          skippedAt: undefined,
          completedKm: undefined,
          feedback: undefined,
        }));

        set(deriveExecutionState(state, resetPlan, []));
      },

      setSelectedWorkout: (workout) => {
        set({ selectedWorkout: workout ? normalizeWorkout(workout) : null });
      },

      clearSelectedWorkout: () => {
        set({ selectedWorkout: null });
      },

      completeWorkout: (workoutId, feedback) => {
        const state = normalizeHomeData(get());
        const target = state.weekPlan.find((workout) => workout.id === workoutId);

        if (!target || !isTrainableWorkout(target)) return;

        const completedWorkout: DayWorkout = {
          ...target,
          status: "completed",
          completedAt: getTodayDateString(),
          skippedAt: undefined,
          completedKm: target.km ?? 0,
          feedback,
        };
        const nextWeekPlan = state.weekPlan.map((workout) =>
          workout.id === workoutId ? completedWorkout : workout,
        );
        const nextActivity = buildActivity(
          completedWorkout,
          "completed",
          feedback,
        );
        const nextActivities = [
          nextActivity,
          ...state.activities.filter(
            (activity) =>
              activity.workoutId !== workoutId && activity.id !== nextActivity.id,
          ),
        ];

        set(deriveExecutionState(state, nextWeekPlan, nextActivities));
      },

      skipWorkout: (workoutId) => {
        const state = normalizeHomeData(get());
        const target = state.weekPlan.find((workout) => workout.id === workoutId);

        if (!target || !isTrainableWorkout(target)) return;

        const skippedWorkout: DayWorkout = {
          ...target,
          status: "skipped",
          completedAt: undefined,
          skippedAt: getTodayDateString(),
          completedKm: 0,
          feedback: undefined,
        };
        const nextWeekPlan = state.weekPlan.map((workout) =>
          workout.id === workoutId ? skippedWorkout : workout,
        );
        const nextActivity = buildActivity(skippedWorkout, "skipped");
        const nextActivities = [
          nextActivity,
          ...state.activities.filter(
            (activity) =>
              activity.workoutId !== workoutId && activity.id !== nextActivity.id,
          ),
        ];

        set(deriveExecutionState(state, nextWeekPlan, nextActivities));
      },

      resetWorkoutStatus: (workoutId) => {
        const state = normalizeHomeData(get());
        const target = state.weekPlan.find((workout) => workout.id === workoutId);

        if (!target) return;

        const resetWorkout: DayWorkout = {
          ...target,
          status: "pending",
          completedAt: undefined,
          skippedAt: undefined,
          completedKm: undefined,
          feedback: undefined,
        };
        const nextWeekPlan = state.weekPlan.map((workout) =>
          workout.id === workoutId ? resetWorkout : workout,
        );
        const nextActivities = state.activities.filter(
          (activity) =>
            activity.workoutId !== workoutId &&
            activity.id !== `activity-${workoutId}`,
        );

        set(deriveExecutionState(state, nextWeekPlan, nextActivities));
      },

      toggleTodayWorkout: () => {
        const state = normalizeHomeData(get());
        const todayWorkout =
          state.weekPlan.find((workout) => workout.day === getTodayIndex()) ??
          state.weekPlan[0];

        if (!todayWorkout || !isTrainableWorkout(todayWorkout)) return;

        if (todayWorkout.status === "completed") {
          get().resetWorkoutStatus(todayWorkout.id);
          return;
        }

        get().completeWorkout(todayWorkout.id);
      },
    }),
    {
      name: "home-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persistedState) =>
        normalizeHomeData((persistedState as Partial<HomeDataState>) ?? {}),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...normalizeHomeData((persistedState as Partial<HomeDataState>) ?? {}),
      }),
    },
  ),
);
