import type {
  DayWorkout,
  GeneratePlanInput,
  GeneratedPlan,
  InjuryHistory,
  Level,
  RaceDistance,
  TodayWorkout,
  WorkoutCategory,
  WorkoutDetailBlock,
} from "@/src/types/training";
import { getDateStringForWeekday } from "@/src/components/utils/date";

type RunningSessionKind = Extract<
  WorkoutCategory,
  "easy_run" | "intervals" | "tempo" | "long_run" | "rest"
>;

function getTodayIndex(): number {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

function formatIntensity(intensity: DayWorkout["intensity"]) {
  return intensity.charAt(0).toUpperCase() + intensity.slice(1);
}

function resolveRaceDistance(input: GeneratePlanInput): RaceDistance {
  if (input.raceDistance) return input.raceDistance;

  if (input.goal === "competencia") return "10k";
  if (input.goal === "rendimiento") return "5k";

  return "general";
}

function getRaceDistanceLabel(raceDistance: RaceDistance) {
  switch (raceDistance) {
    case "5k":
      return "5K";
    case "10k":
      return "10K";
    case "21k":
      return "21K";
    case "42k":
      return "maratón";
    default:
      return "base aeróbica";
  }
}

function getBaseWeeklyKm(level: Level, goal: GeneratePlanInput["goal"]) {
  const matrix: Record<Level, Record<GeneratePlanInput["goal"], number>> = {
    principiante: {
      resistencia: 12,
      rendimiento: 10,
      mantenerme: 10,
      competencia: 14,
    },
    intermedio: {
      resistencia: 24,
      rendimiento: 22,
      mantenerme: 18,
      competencia: 28,
    },
    avanzado: {
      resistencia: 36,
      rendimiento: 34,
      mantenerme: 28,
      competencia: 42,
    },
  };

  return matrix[level][goal];
}

function getRaceTargetKm(raceDistance: RaceDistance, level: Level) {
  const targets: Record<RaceDistance, Record<Level, number>> = {
    general: {
      principiante: 12,
      intermedio: 22,
      avanzado: 34,
    },
    "5k": {
      principiante: 14,
      intermedio: 26,
      avanzado: 38,
    },
    "10k": {
      principiante: 18,
      intermedio: 32,
      avanzado: 46,
    },
    "21k": {
      principiante: 24,
      intermedio: 42,
      avanzado: 58,
    },
    "42k": {
      principiante: 32,
      intermedio: 54,
      avanzado: 72,
    },
  };

  return targets[raceDistance][level];
}

function getGrowthLimit(level: Level, injuryHistory?: InjuryHistory) {
  if (injuryHistory === "recent") return 1.05;
  if (injuryHistory === "minor") return 1.08;
  if (level === "principiante") return 1.1;
  if (level === "intermedio") return 1.13;
  return 1.15;
}

function getPlannedWeeklyKm(input: GeneratePlanInput, sessionsPerWeek: number) {
  if (sessionsPerWeek <= 0) return 0;

  const raceDistance = resolveRaceDistance(input);
  const baseKm = Math.round(
    getBaseWeeklyKm(input.level, input.goal) * (sessionsPerWeek / 3),
  );
  const targetKm = Math.max(getRaceTargetKm(raceDistance, input.level), baseKm);
  const currentKm = input.currentWeeklyKm ?? baseKm;

  if (currentKm <= 0) {
    return Math.min(targetKm, sessionsPerWeek * 4);
  }

  const plannedKm = Math.ceil(currentKm * getGrowthLimit(input.level, input.injuryHistory));

  return Math.max(1, Math.min(targetKm, plannedKm));
}

function getRunningSessionKinds(
  input: GeneratePlanInput,
  sessions: number,
): RunningSessionKind[] {
  if (sessions <= 0) return [];

  const raceDistance = resolveRaceDistance(input);
  const protectLoad =
    input.injuryHistory === "recent" || input.runningExperience === "new";
  const speedFocus =
    input.goal === "rendimiento" ||
    raceDistance === "5k" ||
    raceDistance === "10k";

  if (sessions === 1) return ["easy_run"];

  if (sessions === 2) {
    return protectLoad
      ? ["easy_run", "long_run"]
      : speedFocus
        ? ["tempo", "long_run"]
        : ["easy_run", "long_run"];
  }

  if (sessions === 3) {
    return protectLoad
      ? ["easy_run", "easy_run", "long_run"]
      : speedFocus
        ? ["easy_run", "intervals", "long_run"]
        : ["easy_run", "tempo", "long_run"];
  }

  if (protectLoad) {
    return [
      "easy_run",
      "easy_run",
      "easy_run",
      "long_run",
      ...Array(Math.max(sessions - 4, 0)).fill("easy_run"),
    ];
  }

  if (speedFocus) {
    return [
      "easy_run",
      "intervals",
      "easy_run",
      "long_run",
      ...Array(Math.max(sessions - 4, 0)).fill("easy_run"),
    ];
  }

  return [
    "easy_run",
    "tempo",
    "easy_run",
    "long_run",
    ...Array(Math.max(sessions - 4, 0)).fill("easy_run"),
  ];
}

function getKmWeight(kind: RunningSessionKind): number {
  switch (kind) {
    case "easy_run":
      return 1;
    case "intervals":
      return 0.75;
    case "tempo":
      return 0.9;
    case "long_run":
      return 1.4;
    default:
      return 0;
  }
}

function capLongRun(
  distribution: number[],
  kinds: RunningSessionKind[],
  input: GeneratePlanInput,
) {
  const longRunIndex = kinds.findIndex((kind) => kind === "long_run");

  if (longRunIndex < 0 || !input.longRunKm) return distribution;

  const capMultiplier = input.injuryHistory === "recent" ? 1.05 : 1.15;
  const longRunCap = Math.max(1, Math.ceil(input.longRunKm * capMultiplier));
  const plannedLongRun = distribution[longRunIndex] ?? 0;

  if (plannedLongRun <= longRunCap) return distribution;

  const adjusted = [...distribution];
  const excess = plannedLongRun - longRunCap;
  adjusted[longRunIndex] = longRunCap;

  const receiverIndexes = kinds
    .map((kind, index) => ({ kind, index }))
    .filter(({ kind, index }) => kind !== "long_run" && getKmWeight(kind) > 0 && index !== longRunIndex)
    .map(({ index }) => index);

  if (!receiverIndexes.length) return adjusted;

  receiverIndexes.forEach((index, offset) => {
    adjusted[index] += Math.floor(excess / receiverIndexes.length);
    if (offset < excess % receiverIndexes.length) {
      adjusted[index] += 1;
    }
  });

  return adjusted;
}

function distributeKmBySessionKind(
  totalKm: number,
  kinds: RunningSessionKind[],
  input: GeneratePlanInput,
) {
  const weights = kinds.map(getKmWeight);
  const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);

  if (totalWeight === 0) {
    return kinds.map(() => 0);
  }

  const rawDistribution = weights.map((weight) =>
    Math.max(weight > 0 ? 1 : 0, Math.round((weight / totalWeight) * totalKm)),
  );
  const difference = totalKm - rawDistribution.reduce((acc, km) => acc + km, 0);

  if (difference !== 0) {
    const longRunIndex = kinds.findIndex((kind) => kind === "long_run");
    const targetIndex = longRunIndex >= 0 ? longRunIndex : 0;
    rawDistribution[targetIndex] = Math.max(0, rawDistribution[targetIndex] + difference);
  }

  return capLongRun(rawDistribution, kinds, input);
}

function getSessionMeta(
  category: RunningSessionKind,
  input: GeneratePlanInput,
): {
  title: string;
  description: string;
  intensity: DayWorkout["intensity"];
  targetHeartRate: string;
  targetPace?: string;
} {
  const easyPace = input.easyPace?.trim();

  switch (category) {
    case "easy_run":
      return {
        title: "Rodaje suave",
        description: "Sesión aeróbica cómoda para construir base y constancia.",
        intensity: "baja",
        targetHeartRate: "FC Z2 / esfuerzo 3-4 de 10",
        targetPace: easyPace ? `Cerca de ${easyPace}` : "Ritmo conversacional",
      };

    case "intervals":
      return {
        title: input.level === "principiante" ? "Cambios cortos" : "Intervalos",
        description:
          "Trabajo de velocidad controlada con recuperaciones suficientes.",
        intensity: input.level === "avanzado" ? "alta" : "media",
        targetHeartRate: "FC Z4-Z5 / esfuerzo 8-9 de 10",
        targetPace: "Rápido, controlado y sin perder técnica",
      };

    case "tempo":
      return {
        title: "Tempo controlado",
        description:
          "Bloque sostenido a intensidad moderada-alta para mejorar umbral.",
        intensity: "media",
        targetHeartRate: "FC Z3-Z4 / esfuerzo 7 de 10",
        targetPace: "Fuerte sostenible",
      };

    case "long_run":
      return {
        title: "Fondo progresivo",
        description:
          "Sesión larga de baja intensidad para mejorar resistencia aeróbica.",
        intensity: "media",
        targetHeartRate: "FC Z2 / esfuerzo 4-5 de 10",
        targetPace: easyPace ? `${easyPace} o más suave` : "Cómodo y constante",
      };

    default:
      return {
        title: "Descanso",
        description: "Día de recuperación para asimilar la carga.",
        intensity: "recuperación",
        targetHeartRate: "Recuperación",
      };
  }
}

function getWorkoutDetails(
  kind: RunningSessionKind,
  km: number,
  duration: number,
  input: GeneratePlanInput,
): WorkoutDetailBlock[] {
  const raceLabel = getRaceDistanceLabel(resolveRaceDistance(input));

  if (kind === "rest") {
    return [
      {
        type: "notes",
        label: "Recuperación",
        description:
          "Día sin carrera. Prioriza sueño, hidratación y movilidad ligera si lo necesitas.",
      },
    ];
  }

  if (kind === "easy_run") {
    return [
      {
        type: "warmup",
        label: "Inicio",
        description: "5-8 min muy suaves antes de entrar en ritmo cómodo.",
      },
      {
        type: "main",
        label: "Bloque principal",
        description: `Rodaje continuo de ${km} km a esfuerzo conversacional.`,
      },
      {
        type: "notes",
        label: "Objetivo",
        description: `Construir base para ${raceLabel} sin acumular fatiga innecesaria.`,
      },
      {
        type: "cooldown",
        label: "Cierre",
        description: "3-5 min suaves y respiración controlada.",
      },
    ];
  }

  if (kind === "intervals") {
    const prescription =
      input.level === "principiante"
        ? "6x1 min rápido con 90 seg suaves"
        : input.level === "intermedio"
          ? "6x400 m a ritmo 5K con 90 seg suaves"
          : "8x400 m a ritmo 5K-10K con 90 seg suaves";

    return [
      {
        type: "warmup",
        label: "Calentamiento",
        description: "10 min suaves + movilidad dinámica + 3 progresiones.",
      },
      {
        type: "main",
        label: "Bloque principal",
        description: `${prescription}. Volumen aproximado: ${km} km.`,
      },
      {
        type: "recovery",
        label: "Recuperación",
        description: "Trote muy suave o caminata entre repeticiones.",
      },
      {
        type: "cooldown",
        label: "Vuelta a la calma",
        description: "8 min suaves al terminar.",
      },
    ];
  }

  if (kind === "tempo") {
    const tempoBlock =
      input.level === "principiante"
        ? "10 min sostenidos"
        : input.level === "intermedio"
          ? "15-20 min sostenidos"
          : "20-25 min sostenidos";

    return [
      {
        type: "warmup",
        label: "Calentamiento",
        description: "10 min suaves antes del bloque fuerte.",
      },
      {
        type: "main",
        label: "Bloque principal",
        description: `${tempoBlock} a ritmo fuerte pero sostenible dentro de ${km} km totales.`,
      },
      {
        type: "notes",
        label: "Control",
        description:
          "Debe sentirse exigente, pero no como sprint. Si se descontrola, baja ritmo.",
      },
      {
        type: "cooldown",
        label: "Cierre",
        description: "5-8 min suaves.",
      },
    ];
  }

  return [
    {
      type: "warmup",
      label: "Inicio",
      description: "Empieza muy suave durante los primeros 10 min.",
    },
    {
      type: "main",
      label: "Bloque principal",
      description: `Fondo de ${km} km a ritmo cómodo y constante.`,
    },
    {
      type: "notes",
      label: "Objetivo",
      description:
        input.injuryHistory === "recent"
          ? "Mantener carga controlada. Si aparece molestia, corta la sesión."
          : `Desarrollar resistencia específica para ${raceLabel}.`,
    },
    {
      type: "cooldown",
      label: "Cierre",
      description: "Camina 3-5 min, hidrátate y registra cómo te sentiste.",
    },
  ];
}

function buildTodayWorkoutFromDay(dayWorkout: DayWorkout): TodayWorkout {
  const isRest = dayWorkout.type === "rest";

  return {
    id: dayWorkout.id,
    type: isRest ? "Descanso" : "running",
    category: dayWorkout.category,
    title: dayWorkout.title,
    description: dayWorkout.description,
    day: "Hoy",
    duration: isRest ? "—" : `${dayWorkout.duration ?? 0} min`,
    difficulty: formatIntensity(dayWorkout.intensity),
    metric: isRest ? "Sin carga" : `${dayWorkout.km ?? 0} km`,
    heartRate: dayWorkout.targetHeartRate ?? "FC Z2",
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

export function generatePlan(input: GeneratePlanInput): GeneratedPlan {
  const selectedDays = [...new Set(input.days)]
    .filter((day) => day >= 0 && day <= 6)
    .sort((a, b) => a - b);
  const sessionsPerWeek = selectedDays.length;
  const totalKm = getPlannedWeeklyKm(input, sessionsPerWeek);
  const kinds = getRunningSessionKinds(input, sessionsPerWeek);
  const kmDistribution = distributeKmBySessionKind(totalKm, kinds, input);
  const weekPlan: DayWorkout[] = [];

  let trainingDayCounter = 0;

  for (let day = 0; day < 7; day += 1) {
    if (selectedDays.includes(day)) {
      const kind = kinds[trainingDayCounter] ?? "easy_run";
      const currentKm = kmDistribution[trainingDayCounter] ?? 0;
      const meta = getSessionMeta(kind, input);

      weekPlan.push({
        id: `day-${day}-${kind}`,
        day,
        type: "running",
        category: kind,
        title: meta.title,
        description: meta.description,
        intensity: meta.intensity,
        status: "pending",
        plannedDate: getDateStringForWeekday(day),
        km: currentKm,
        duration: input.duration,
        targetPace: meta.targetPace,
        targetHeartRate: meta.targetHeartRate,
        details: getWorkoutDetails(kind, currentKm, input.duration, input),
      });

      trainingDayCounter += 1;
    } else {
      const restMeta = getSessionMeta("rest", input);

      weekPlan.push({
        id: `day-${day}-rest`,
        day,
        type: "rest",
        category: "rest",
        title: restMeta.title,
        description: restMeta.description,
        intensity: restMeta.intensity,
        status: "pending",
        plannedDate: getDateStringForWeekday(day),
        targetHeartRate: restMeta.targetHeartRate,
        details: getWorkoutDetails("rest", 0, input.duration, input),
      });
    }
  }

  const todayIndex = getTodayIndex();
  const today = weekPlan.find((item) => item.day === todayIndex) ?? weekPlan[0];

  return {
    weeklyGoal: {
      distance: totalKm,
      unit: "km",
      progressCurrent: 0,
      progressTotal: totalKm,
      completedSessions: 0,
      totalSessions: sessionsPerWeek,
    },
    todayWorkout: buildTodayWorkoutFromDay(today),
    weekPlan,
  };
}
