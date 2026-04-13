import { create } from "zustand";

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

type HomeState = {
  weeklyGoal: {
    distance: number;
    goal: number;
    unit: string;
    progressCurrent: number;
    progressTotal: number;
    completedSessions: number;
    totalSessions: number;
  };
  todayWorkout: TodayWorkout;
  completedDays: number[];
  activities: Activity[];
  toggleTodayWorkout: () => void;
};

export const useHomeStore = create<HomeState>((set, get) => ({
  weeklyGoal: {
    distance: 41,
    goal: 60,
    unit: "km",
    progressCurrent: 2,
    progressTotal: 41,
    completedSessions: 1,
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

  activities: [
    {
      id: "1",
      dateLabel: "Ayer",
      title: "Rodaje suave",
      subtitle: "5 km · 30 min",
    },
    {
      id: "2",
      dateLabel: "Hace 2 días",
      title: "Intervalos",
      subtitle: "6x400 · FC 160-175",
    },
  ],

  toggleTodayWorkout: () => {
    const state = get();
    const isCompleted = state.todayWorkout.status === "completed";

    const newStatus: WorkoutStatus = isCompleted ? "pending" : "completed";

    // ejemplo simple: usar índice 4 como "hoy"
    const todayIndex = 0;

    const updatedCompletedDays = isCompleted
      ? state.completedDays.filter((day) => day !== todayIndex)
      : [...new Set([...state.completedDays, todayIndex])];

    const updatedCompletedSessions = isCompleted
      ? Math.max(state.weeklyGoal.completedSessions - 1, 0)
      : state.weeklyGoal.completedSessions + 1;

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
        status: newStatus,
      },
      completedDays: updatedCompletedDays,
      activities: updatedActivities,
      weeklyGoal: {
        ...state.weeklyGoal,
        completedSessions: updatedCompletedSessions,
      },
    });
  },
}));