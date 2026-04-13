type WorkoutStatus = "pending" | "completed";

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

type Input = {
  goal: string;
  level: string;
  days: number[];
  duration: number;
  trainingType: string;
};

export function generatePlan(input: Input): GeneratedPlan {
  const sessionsPerWeek = input.days.length;

  let baseKm = 0;

  if (input.level === "principiante") baseKm = 10;
  if (input.level === "intermedio") baseKm = 25;
  if (input.level === "avanzado") baseKm = 40;

  const totalKm = Math.round(baseKm * (sessionsPerWeek / 3));

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
    },
  };
}