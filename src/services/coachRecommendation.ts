import type {
  Activity,
  DayWorkout,
  TodayWorkout,
  WeeklyGoal,
  WorkoutFeedback,
} from "@/src/types/training";

export type CoachRecommendationSeverity =
  | "positive"
  | "neutral"
  | "warning"
  | "recovery";

export type CoachRecommendation = {
  title: string;
  message: string;
  severity: CoachRecommendationSeverity;
  actionLabel?: string;
};

type CoachRecommendationInput = {
  activities: readonly Activity[];
  weekPlan: readonly DayWorkout[];
  weeklyGoal: WeeklyGoal;
  todayWorkout: TodayWorkout;
};

const RECENT_WINDOW_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function clampRatio(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

function parseDateValue(dateString?: string): number | null {
  if (!dateString) return null;

  const [yearValue, monthValue, dayValue] = dateString.split("-");
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);

  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);
  const value = date.getTime();

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

function getFeedbackSignals(feedback?: WorkoutFeedback) {
  return {
    pain: feedback?.pain === true,
    rpe: typeof feedback?.rpe === "number" ? feedback.rpe : undefined,
    lowEnergy: feedback?.energy === "low",
  };
}

function isRestToday(todayWorkout: TodayWorkout): boolean {
  const normalizedType = todayWorkout.type.toLowerCase();
  return normalizedType === "rest" || normalizedType === "descanso";
}

function isTrainableWorkout(workout: DayWorkout): boolean {
  return workout.type !== "rest";
}

function isIntenseTodayWorkout(todayWorkout: TodayWorkout): boolean {
  const normalizedTitle = todayWorkout.title.toLowerCase();
  const normalizedDifficulty = todayWorkout.difficulty.toLowerCase();
  const category = todayWorkout.category;

  return (
    normalizedDifficulty.includes("alta") ||
    normalizedDifficulty.includes("intensa") ||
    category === "intervals" ||
    category === "tempo" ||
    category === "long_run" ||
    normalizedTitle.includes("interval") ||
    normalizedTitle.includes("tempo") ||
    normalizedTitle.includes("fondo")
  );
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

  const completedWorkoutWithFeedback =
    sortWorkoutsByExecutionDate(weekPlan).find(
      (workout) => workout.status === "completed" && workout.feedback,
    );

  return completedWorkoutWithFeedback?.feedback;
}

function formatProgress(weeklyGoal: WeeklyGoal): string {
  return `${weeklyGoal.progressCurrent}/${weeklyGoal.progressTotal} ${weeklyGoal.unit}`;
}

export function getCoachRecommendation({
  activities,
  weekPlan,
  weeklyGoal,
  todayWorkout,
}: CoachRecommendationInput): CoachRecommendation {
  const sortedActivities = sortActivitiesByDate(activities);
  const latestCompletedActivity = sortedActivities.find(
    (activity) => activity.status === "completed",
  );
  const latestFeedback = getLatestFeedback({ sortedActivities, weekPlan });
  const feedbackSignals = getFeedbackSignals(latestFeedback);

  const trainableWorkouts = weekPlan.filter(isTrainableWorkout);
  const completedWorkouts = trainableWorkouts.filter(
    (workout) => workout.status === "completed",
  );
  const pendingWorkouts = trainableWorkouts.filter(
    (workout) =>
      workout.status === "pending" || workout.status === "rescheduled",
  );
  const recentSkippedCount = getRecentSkippedCount({ activities, weekPlan });
  const distanceProgress =
    weeklyGoal.progressTotal > 0
      ? clampRatio(weeklyGoal.progressCurrent / weeklyGoal.progressTotal)
      : 0;
  const sessionProgress =
    weeklyGoal.totalSessions > 0
      ? clampRatio(weeklyGoal.completedSessions / weeklyGoal.totalSessions)
      : 0;
  const weeklyProgress = Math.max(distanceProgress, sessionProgress);
  const todayIsRest = isRestToday(todayWorkout);
  const todayIsPending =
    todayWorkout.status === "pending" || todayWorkout.status === "rescheduled";
  const todayIsIntense = isIntenseTodayWorkout(todayWorkout);

  if (feedbackSignals.pain) {
    return {
      title: "Prioriza recuperación",
      message:
        "Reportaste molestia en la última sesión. Mantén la carga baja y considera movilidad, técnica suave o descanso activo antes de volver a exigir.",
      severity: "recovery",
      actionLabel: "Bajar carga",
    };
  }

  if (feedbackSignals.rpe !== undefined && feedbackSignals.rpe >= 8) {
    if (todayIsPending && todayIsIntense) {
      return {
        title: "Evita encadenar intensidad",
        message: `Tu último esfuerzo fue RPE ${feedbackSignals.rpe}. Si haces ${todayWorkout.title}, ejecútala controlada o baja la carga para recuperar mejor.`,
        severity: "warning",
        actionLabel: "Controlar intensidad",
      };
    }

    return {
      title: "Recupera antes de apretar",
      message: `La última sesión se sintió exigente con RPE ${feedbackSignals.rpe}. Prioriza sueño, movilidad y una sesión suave antes del próximo bloque intenso.`,
      severity: "recovery",
      actionLabel: "Recuperar",
    };
  }

  if (feedbackSignals.lowEnergy) {
    return {
      title: "Ajusta por energía baja",
      message:
        "Tu último feedback marcó energía baja. Hoy conviene ir suave, elegir descanso activo o recortar la sesión si notas fatiga acumulada.",
      severity: "recovery",
      actionLabel: "Hacer suave",
    };
  }

  if (recentSkippedCount > 0) {
    return {
      title: "Retoma sin compensar",
      message:
        recentSkippedCount === 1
          ? "Hay una sesión omitida reciente. Vuelve al plan desde la próxima sesión alcanzable sin añadir volumen extra."
          : `Hay ${recentSkippedCount} sesiones omitidas recientes. Retoma con una sesión controlada y evita compensar todo en un solo día.`,
      severity: "warning",
      actionLabel: "Retomar suave",
    };
  }

  if (todayWorkout.status === "completed") {
    return {
      title: "Sesión cerrada",
      message: `Ya sumaste trabajo útil hoy. Vas ${formatProgress(weeklyGoal)} esta semana; mantén la recuperación en orden.`,
      severity: "positive",
      actionLabel: "Mantener",
    };
  }

  if (todayWorkout.status === "skipped") {
    return {
      title: "Reinicio simple",
      message:
        "Hoy quedó omitida. Sigue con la próxima sesión del plan y evita subir el volumen para compensar.",
      severity: "warning",
      actionLabel: "Seguir plan",
    };
  }

  if (pendingWorkouts.length === 0 && completedWorkouts.length > 0) {
    return {
      title: "Semana resuelta",
      message:
        "Completaste las sesiones entrenables de la semana. Mantén movilidad ligera y no agregues carga innecesaria.",
      severity: "positive",
      actionLabel: "Recuperar",
    };
  }

  if (weeklyProgress >= 0.75) {
    return {
      title: "Carga alta, control primero",
      message: `Llevas ${formatProgress(weeklyGoal)}. Estás cerca de cerrar la semana; conserva el ritmo sin sobrecargar.`,
      severity: "neutral",
      actionLabel: "Mantener control",
    };
  }

  if (todayIsRest) {
    return {
      title: "Recuperar también entrena",
      message:
        "Hoy es día de descarga. Usa movilidad, sueño y caminata suave para llegar mejor a la próxima sesión.",
      severity: "recovery",
      actionLabel: "Recuperar",
    };
  }

  if (activities.length === 0 && completedWorkouts.length === 0) {
    return {
      title: "Primera sesión",
      message: `Hoy toca ${todayWorkout.title}. Empieza controlado y usa el feedback post-entreno para ajustar la próxima recomendación.`,
      severity: "neutral",
      actionLabel: "Empezar",
    };
  }

  if (
    weeklyProgress <= 0.25 &&
    weeklyGoal.completedSessions <= 1 &&
    todayIsPending
  ) {
    return {
      title: "Elige una sesión alcanzable",
      message: `El progreso semanal está bajo (${formatProgress(weeklyGoal)}). Completar ${todayWorkout.title} con buena ejecución ya mueve la semana.`,
      severity: "neutral",
      actionLabel: "Empezar suave",
    };
  }

  if (
    weeklyGoal.completedSessions >= 2 &&
    latestCompletedActivity &&
    !latestFeedback
  ) {
    return {
      title: "Buena constancia",
      message:
        "Has completado varias sesiones esta semana. Sigue acumulando trabajo útil y registra feedback cuando puedas para afinar mejor la recomendación.",
      severity: "positive",
      actionLabel: "Registrar feedback",
    };
  }

  if (weeklyGoal.completedSessions >= 2) {
    return {
      title: "Progreso sólido",
      message:
        "Vas construyendo constancia sin señales negativas recientes. Mantén la ejecución limpia y respeta los días suaves.",
      severity: "positive",
      actionLabel: "Seguir plan",
    };
  }

  return {
    title: "Construyendo base",
    message: `Vas ${formatProgress(weeklyGoal)}. Mantén una sesión consistente y deja que el feedback guíe los próximos ajustes.`,
    severity: "neutral",
    actionLabel: "Seguir",
  };
}
