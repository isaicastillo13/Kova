type WorkoutStatus = "pending" | "completed";

type DayWorkoutType = "running" | "swimming" | "strength" | "mixed" | "rest";

type DayWorkout = {
  day: number;
  type: DayWorkoutType;
  title: string;
  km?: number;
  duration?: number;
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
  km: number;
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

type Input = {
  goal: string;
  level: string;
  days: number[];
  duration: number;
  trainingType: "running" | "swimming" | "strength" | "mixed";
};

export function generatePlan(input: Input): GeneratedPlan {
  const sessionsPerWeek = input.days.length;
  const weekPlan: DayWorkout[] = [];

  let baseKm = 0;

  if (input.level === "principiante") baseKm = 10;
  if (input.level === "intermedio") baseKm = 25;
  if (input.level === "avanzado") baseKm = 40;

  const totalKm = Math.round(baseKm * (sessionsPerWeek / 3));

  for (let i = 0; i < 7; i++) {
    if (input.days.includes(i)) {
      weekPlan.push({
        day: i,
        type: input.trainingType,
        km: input.trainingType === "running" ? 5 : 0,
        duration: input.duration,
        title: "Entrenamiento base",
      });
    } else {
      weekPlan.push({
        day: i,
        type: "rest",
        title: "Descanso",
      });
    }
  }

  return {
    weeklyGoal: {
      distance: totalKm,
      unit: "km",
      progressCurrent: 0,
      progressTotal: totalKm,
      completedSessions: 0,
      totalSessions: sessionsPerWeek,
    },
    todayWorkout: {
      type: input.trainingType,
      title: "Entrenamiento base",
      day: "Hoy",
      duration: `${input.duration} min`,
      difficulty:
        input.level === "principiante"
          ? "Baja"
          : input.level === "intermedio"
          ? "Media"
          : "Alta",
      metric: input.trainingType === "running" ? "5 km" : "Sesión",
      heartRate: "FC 140-160",
      status: "pending",
      km: input.trainingType === "running" ? 5 : 0,
    },
    weekPlan,
  };
}