import type {
  Activity,
  DayWorkout,
  TodayWorkout,
  WeeklyGoal,
  WorkoutFeedback,
} from "@/src/types/training";

export type TrainingReadinessStatus =
  | "ready"
  | "normal"
  | "recovery"
  | "caution";

export type TrainingReadiness = {
  score: number;
  status: TrainingReadinessStatus;
  title: string;
  message: string;
  factors: string[];
};

type TrainingReadinessInput = {
  activities: readonly Activity[];
  weekPlan: readonly DayWorkout[];
  weeklyGoal: WeeklyGoal;
  todayWorkout: TodayWorkout;
  streakDays: number;
};

const BASE_SCORE = 75;
const RECENT_WINDOW_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function clampScore(score: number): number {
  return Math.min(Math.max(Math.round(score), 0), 100);
}

function parseDateValue(dateString?: string): number | null {
  if (!dateString) return null;

  const [yearValue, monthValue, dayValue] = dateString.split("-");
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);

  if (!year || !month || !day) return null;

  const value = new Date(year, month - 1, day).getTime();
  return Number.isNaN(value) ? null : value;
}

function getTodayStartValue(): number {
  const today = new Date();
  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).getTime();
}

function isRecentDate(dateString?: string): boolean {
  const dateValue = parseDateValue(dateString);

  if (dateValue === null) return false;

  const elapsedDays = (getTodayStartValue() - dateValue) / MS_PER_DAY;
  return elapsedDays >= 0 && elapsedDays <= RECENT_WINDOW_DAYS;
}

function sortActivitiesByDate(activities: readonly Activity[]): Activity[] {
  return [...activities]
    .map((activity, index) => ({
      activity,
      index,
      dateValue: parseDateValue(activity.date) ?? Number.NEGATIVE_INFINITY,
    }))
    .sort((left, right) => {
      if (left.dateValue !== right.dateValue) {
        return right.dateValue - left.dateValue;
      }

      return left.index - right.index;
    })
    .map(({ activity }) => activity);
}

function sortWorkoutsByExecutionDate(
  workouts: readonly DayWorkout[],
): DayWorkout[] {
  return [...workouts]
    .map((workout, index) => ({
      workout,
      index,
      dateValue:
        parseDateValue(
          workout.completedAt ?? workout.skippedAt ?? workout.plannedDate,
        ) ??
        Number.NEGATIVE_INFINITY,
    }))
    .sort((left, right) => {
      if (left.dateValue !== right.dateValue) {
        return right.dateValue - left.dateValue;
      }

      return left.index - right.index;
    })
    .map(({ workout }) => workout);
}

function getLatestFeedback({
  sortedActivities,
  weekPlan,
}: {
  sortedActivities: readonly Activity[];
  weekPlan: readonly DayWorkout[];
}): WorkoutFeedback | undefined {
  const activityWithFeedback = sortedActivities.find(
    (activity) => activity.status === "completed" && activity.feedback,
  );

  if (activityWithFeedback?.feedback) {
    return activityWithFeedback.feedback;
  }

  return sortWorkoutsByExecutionDate(weekPlan).find(
    (workout) => workout.status === "completed" && workout.feedback,
  )?.feedback;
}

function getRecentSkippedCount({
  activities,
  weekPlan,
}: {
  activities: readonly Activity[];
  weekPlan: readonly DayWorkout[];
}): number {
  const skippedWorkoutIds = new Set<string>();

  activities.forEach((activity) => {
    if (activity.status === "skipped" && isRecentDate(activity.date)) {
      skippedWorkoutIds.add(activity.workoutId);
    }
  });

  weekPlan.forEach((workout) => {
    if (
      workout.status === "skipped" &&
      isRecentDate(workout.skippedAt ?? workout.plannedDate)
    ) {
      skippedWorkoutIds.add(workout.id);
    }
  });

  return skippedWorkoutIds.size;
}

function getWeeklyProgress(weeklyGoal: WeeklyGoal): number {
  const distanceProgress =
    weeklyGoal.progressTotal > 0
      ? weeklyGoal.progressCurrent / weeklyGoal.progressTotal
      : 0;
  const sessionProgress =
    weeklyGoal.totalSessions > 0
      ? weeklyGoal.completedSessions / weeklyGoal.totalSessions
      : 0;

  return Math.min(Math.max(Math.max(distanceProgress, sessionProgress), 0), 1);
}

function isRestToday(todayWorkout: TodayWorkout): boolean {
  const normalizedType = todayWorkout.type.toLowerCase();
  return (
    normalizedType === "rest" ||
    normalizedType === "descanso" ||
    todayWorkout.km === 0
  );
}

function getStatus(score: number): TrainingReadinessStatus {
  if (score >= 80) return "ready";
  if (score >= 60) return "normal";
  if (score >= 40) return "recovery";
  return "caution";
}

function getStatusCopy(status: TrainingReadinessStatus): {
  title: string;
  message: string;
} {
  switch (status) {
    case "ready":
      return {
        title: "Listo para entrenar",
        message:
          "Tu cuerpo parece responder bien. Mantén el plan con control.",
      };
    case "recovery":
      return {
        title: "Prioriza recuperación",
        message: "Conviene priorizar recuperación activa o bajar intensidad.",
      };
    case "caution":
      return {
        title: "Entrena con cautela",
        message:
          "Señales de fatiga o dolor. Evita intensidad y considera descanso.",
      };
    default:
      return {
        title: "Preparación normal",
        message:
          "Buen punto para entrenar, escucha sensaciones y mantén técnica.",
      };
  }
}

export function getTrainingReadiness({
  activities,
  weekPlan,
  weeklyGoal,
  todayWorkout,
  streakDays,
}: TrainingReadinessInput): TrainingReadiness {
  const sortedActivities = sortActivitiesByDate(activities);
  const latestFeedback = getLatestFeedback({ sortedActivities, weekPlan });
  const recentSkippedCount = getRecentSkippedCount({ activities, weekPlan });
  const weeklyProgress = getWeeklyProgress(weeklyGoal);
  const factors: string[] = [];
  let score = BASE_SCORE;

  if (latestFeedback?.pain === true) {
    score -= 30;
    factors.push("Dolor reportado en el último feedback");
  }

  if (typeof latestFeedback?.rpe === "number") {
    if (latestFeedback.rpe >= 9) {
      score -= 25;
      factors.push(`RPE muy alto (${latestFeedback.rpe}/10)`);
    } else if (latestFeedback.rpe >= 8) {
      score -= 15;
      factors.push(`RPE alto (${latestFeedback.rpe}/10)`);
    } else {
      factors.push(`Último RPE ${latestFeedback.rpe}/10`);
    }
  }

  if (latestFeedback?.energy === "low") {
    score -= 15;
    factors.push("Energía baja en la última sesión");
  }

  if (latestFeedback?.energy === "high") {
    score += 8;
    factors.push("Energía alta en la última sesión");
  }

  const skippedPenalty = Math.min(recentSkippedCount * 10, 20);
  if (skippedPenalty > 0) {
    score -= skippedPenalty;
    factors.push(
      recentSkippedCount === 1
        ? "1 sesión omitida reciente"
        : `${recentSkippedCount} sesiones omitidas recientes`,
    );
  }

  if (streakDays >= 3) {
    score += 5;
    factors.push(`Racha activa de ${streakDays} días`);
  }

  if (weeklyProgress >= 0.75) {
    score -= 5;
    factors.push("Progreso semanal alto: controla la carga");
  }

  if (weeklyGoal.completedSessions > 0) {
    factors.push(
      `${weeklyGoal.completedSessions}/${weeklyGoal.totalSessions} sesiones completadas`,
    );
  }

  if (!latestFeedback) {
    factors.push("Sin feedback reciente: score base conservador");
  }

  const normalizedScore = clampScore(score);

  if (isRestToday(todayWorkout)) {
    return {
      score: normalizedScore,
      status: "recovery",
      title: "Día de recuperación",
      message:
        "Hoy toca descargar. Usa movilidad, sueño y actividad suave para asimilar la carga.",
      factors: ["Entrenamiento de hoy marcado como descanso", ...factors],
    };
  }

  const status = getStatus(normalizedScore);
  const copy = getStatusCopy(status);

  return {
    score: normalizedScore,
    status,
    title: copy.title,
    message: copy.message,
    factors,
  };
}
