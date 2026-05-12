type WorkoutStatus = "pending" | "completed";

type DayWorkoutType = "running" | "swimming" | "strength" | "mixed" | "rest";

type WorkoutDetailBlockType =
  | "warmup"
  | "main"
  | "recovery"
  | "cooldown"
  | "notes";

type WorkoutDetailBlock = {
  type: WorkoutDetailBlockType;
  label: string;
  description: string;
};

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

type Goal = "resistencia" | "rendimiento" | "mantenerme" | "competencia";
type Level = "principiante" | "intermedio" | "avanzado";
type TrainingType = "running" | "swimming" | "strength" | "mixed";

type Input = {
  goal: Goal;
  level: Level;
  days: number[];
  duration: number;
  trainingType: TrainingType;
};

type SessionKind =
  | "easy_run"
  | "intervals"
  | "tempo"
  | "long_run"
  | "strength"
  | "swim_technique"
  | "swim_endurance"
  | "mixed_conditioning"
  | "rest";

function getWeeklyKmBase(level: Level, goal: Goal) {
  const matrix: Record<Level, Record<Goal, number>> = {
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

function distributeKm(totalKm: number, sessions: number) {
  if (sessions <= 0) return [];

  const base = Math.floor(totalKm / sessions);
  let remainder = totalKm % sessions;

  const result = Array.from({ length: sessions }, () => base);

  let i = 0;
  while (remainder > 0) {
    result[i] += 1;
    remainder -= 1;
    i += 1;
  }

  return result;
}

function getRunningSessionKinds(
  goal: Goal,
  level: Level,
  sessions: number,
): SessionKind[] {
  if (sessions <= 0) return [];

  if (level === "principiante") {
    if (goal === "rendimiento" || goal === "competencia") {
      return sessions === 1
        ? ["easy_run"]
        : sessions === 2
          ? ["easy_run", "intervals"]
          : [
              "easy_run",
              "easy_run",
              "long_run",
              ...Array(Math.max(sessions - 3, 0)).fill("easy_run"),
            ];
    }

    return sessions === 1
      ? ["easy_run"]
      : sessions === 2
        ? ["easy_run", "long_run"]
        : [
            "easy_run",
            "easy_run",
            "long_run",
            ...Array(Math.max(sessions - 3, 0)).fill("easy_run"),
          ];
  }

  if (level === "intermedio") {
    if (goal === "rendimiento" || goal === "competencia") {
      if (sessions === 1) return ["tempo"];
      if (sessions === 2) return ["easy_run", "tempo"];
      if (sessions === 3) return ["easy_run", "intervals", "long_run"];
      return [
        "easy_run",
        "intervals",
        "easy_run",
        "long_run",
        ...Array(Math.max(sessions - 4, 0)).fill("easy_run"),
      ];
    }

    if (sessions === 1) return ["easy_run"];
    if (sessions === 2) return ["easy_run", "long_run"];
    if (sessions === 3) return ["easy_run", "tempo", "long_run"];
    return [
      "easy_run",
      "tempo",
      "easy_run",
      "long_run",
      ...Array(Math.max(sessions - 4, 0)).fill("easy_run"),
    ];
  }

  // avanzado
  if (goal === "competencia") {
    if (sessions <= 2) return ["tempo", "long_run"];
    if (sessions === 3) return ["easy_run", "intervals", "long_run"];
    if (sessions === 4) return ["easy_run", "intervals", "tempo", "long_run"];
    return [
      "easy_run",
      "intervals",
      "easy_run",
      "tempo",
      "long_run",
      ...Array(Math.max(sessions - 5, 0)).fill("easy_run"),
    ];
  }

  if (goal === "rendimiento") {
    if (sessions <= 2) return ["easy_run", "tempo"];
    if (sessions === 3) return ["easy_run", "intervals", "long_run"];
    return [
      "easy_run",
      "intervals",
      "easy_run",
      "long_run",
      ...Array(Math.max(sessions - 4, 0)).fill("easy_run"),
    ];
  }

  if (sessions === 1) return ["easy_run"];
  if (sessions === 2) return ["easy_run", "long_run"];
  if (sessions === 3) return ["easy_run", "tempo", "long_run"];
  return [
    "easy_run",
    "tempo",
    "easy_run",
    "long_run",
    ...Array(Math.max(sessions - 4, 0)).fill("easy_run"),
  ];
}

function getSessionTitle(kind: SessionKind): string {
  switch (kind) {
    case "easy_run":
      return "Rodaje suave";
    case "intervals":
      return "Intervalos";
    case "tempo":
      return "Tempo";
    case "long_run":
      return "Fondo progresivo";
    case "strength":
      return "Fuerza funcional";
    case "swim_technique":
      return "Técnica en piscina";
    case "swim_endurance":
      return "Resistencia en piscina";
    case "mixed_conditioning":
      return "Acondicionamiento mixto";
    case "rest":
      return "Descanso";
    default:
      return "Entrenamiento";
  }
}

function getDifficulty(level: Level, kind: SessionKind) {
  if (kind === "rest") return "Recuperación";
  if (kind === "easy_run" || kind === "swim_technique") return "Baja";
  if (kind === "long_run" || kind === "strength" || kind === "swim_endurance")
    return level === "principiante" ? "Media" : "Media";
  if (kind === "tempo" || kind === "intervals")
    return level === "avanzado" ? "Alta" : "Media";
  return "Media";
}

function getHeartRate(kind: SessionKind) {
  switch (kind) {
    case "easy_run":
    case "long_run":
      return "FC 135-150";
    case "tempo":
      return "FC 150-165";
    case "intervals":
      return "FC 160-175";
    case "rest":
      return "Recuperación";
    default:
      return "FC 140-160";
  }
}

function getWorkoutDetails(
  kind: SessionKind,
  km: number,
  duration: number,
  level: Level,
): WorkoutDetailBlock[] {
  switch (kind) {
    case "easy_run":
      return [
        {
          type: "warmup",
          label: "Calentamiento",
          description: "8-10 min suaves + movilidad básica",
        },
        {
          type: "main",
          label: "Bloque principal",
          description: `Rodaje continuo de ${km} km a ritmo conversacional, sin forzar.`,
        },
        {
          type: "notes",
          label: "Objetivo",
          description: "Construir base aeróbica y mantener técnica estable.",
        },
        {
          type: "cooldown",
          label: "Vuelta a la calma",
          description: "5 min suaves + respiración controlada",
        },
      ];

    case "intervals": {
      const prescription =
        level === "principiante"
          ? "4x100 a ritmo controlado"
          : level === "intermedio"
            ? "6x400 a ritmo 5K"
            : "8x400 a ritmo 5K-10K";

      const recovery =
        level === "principiante"
          ? "1 min caminando o trote muy suave entre repeticiones"
          : "90 seg suaves entre repeticiones";

      return [
        {
          type: "warmup",
          label: "Calentamiento",
          description:
            "10 min suaves + movilidad dinámica + 3 progresiones cortas",
        },
        {
          type: "main",
          label: "Bloque principal",
          description: `${prescription}. Volumen total aproximado: ${km} km`,
        },
        {
          type: "recovery",
          label: "Recuperación",
          description: recovery,
        },
        {
          type: "notes",
          label: "Pace / intención",
          description:
            "Buscar ritmo firme, controlado y técnicamente limpio, no salir demasiado rápido.",
        },
        {
          type: "cooldown",
          label: "Vuelta a la calma",
          description: "8 min suaves y estiramientos ligeros",
        },
      ];
    }

    case "tempo": {
      const tempoBlock =
        level === "principiante"
          ? "10-12 min sostenidos a ritmo moderado-alto"
          : level === "intermedio"
            ? "15-20 min sostenidos a ritmo umbral controlado"
            : "20-25 min sostenidos a ritmo umbral";

      return [
        {
          type: "warmup",
          label: "Calentamiento",
          description: "10 min suaves + movilidad dinámica",
        },
        {
          type: "main",
          label: "Bloque principal",
          description: `${tempoBlock} dentro de una sesión total de ${km} km`,
        },
        {
          type: "notes",
          label: "Pace / intención",
          description:
            "Ritmo exigente pero sostenible; debes sentir esfuerzo estable, no sprint.",
        },
        {
          type: "cooldown",
          label: "Vuelta a la calma",
          description: "5-8 min suaves al terminar",
        },
      ];
    }

    case "long_run":
      return [
        {
          type: "warmup",
          label: "Inicio",
          description: "Comienza muy suave durante los primeros 8-10 min",
        },
        {
          type: "main",
          label: "Bloque principal",
          description: `Rodaje largo de ${km} km con enfoque aeróbico y ritmo constante.`,
        },
        {
          type: "notes",
          label: "Objetivo",
          description:
            "Construir resistencia, mantener control y evitar aceleraciones innecesarias.",
        },
        {
          type: "cooldown",
          label: "Cierre",
          description: "5 min suaves + hidratación y recuperación",
        },
      ];

    case "strength":
      return [
        {
          type: "warmup",
          label: "Activación",
          description: "5-8 min de movilidad, activación de core y glúteos",
        },
        {
          type: "main",
          label: "Bloque principal",
          description:
            "3 bloques de fuerza: pierna, empuje/tracción y core. 3-4 series por ejercicio.",
        },
        {
          type: "notes",
          label: "Objetivo",
          description: `Sesión de ${duration} min enfocada en control, técnica y estabilidad.`,
        },
      ];

    case "swim_technique":
      return [
        {
          type: "warmup",
          label: "Calentamiento",
          description: "200m suaves + técnica básica",
        },
        {
          type: "main",
          label: "Bloque principal",
          description:
            "Trabajo técnico de brazada, respiración y alineación corporal.",
        },
        {
          type: "notes",
          label: "Objetivo",
          description: "Mejorar eficiencia antes que velocidad.",
        },
        {
          type: "cooldown",
          label: "Vuelta a la calma",
          description: "100m suaves",
        },
      ];

    case "swim_endurance":
      return [
        {
          type: "warmup",
          label: "Calentamiento",
          description: "200-300m suaves",
        },
        {
          type: "main",
          label: "Bloque principal",
          description:
            "Series aeróbicas sostenidas con descansos cortos y ritmo uniforme.",
        },
        {
          type: "notes",
          label: "Objetivo",
          description: "Construir resistencia manteniendo técnica eficiente.",
        },
        {
          type: "cooldown",
          label: "Vuelta a la calma",
          description: "100m suaves y movilidad ligera",
        },
      ];

    case "mixed_conditioning":
      return [
        {
          type: "main",
          label: "Bloque principal",
          description: `Sesión combinada de ${duration} min: cardio suave + fuerza básica + movilidad.`,
        },
        {
          type: "notes",
          label: "Objetivo",
          description:
            "Mejorar acondicionamiento general sin concentrar toda la carga en una sola capacidad.",
        },
      ];

    case "rest":
      return [
        {
          type: "notes",
          label: "Recuperación",
          description:
            "Día de descanso o movilidad ligera. Prioriza sueño, hidratación y descarga.",
        },
      ];

    default:
      return [];
  }
}

function getKindsForTrainingType(
  trainingType: TrainingType,
  goal: Goal,
  level: Level,
  sessions: number,
): SessionKind[] {
  if (trainingType === "running") {
    return getRunningSessionKinds(goal, level, sessions);
  }

  if (trainingType === "strength") {
    return Array.from({ length: sessions }, () => "strength");
  }

  if (trainingType === "swimming") {
    return Array.from({ length: sessions }, (_, i) =>
      i % 2 === 0 ? "swim_technique" : "swim_endurance",
    );
  }

  // mixed
  const mixedBase: SessionKind[] = [
    "easy_run",
    "strength",
    "mixed_conditioning",
  ];
  const result: SessionKind[] = [];
  for (let i = 0; i < sessions; i++) {
    result.push(mixedBase[i % mixedBase.length]);
  }
  return result;
}

function getTodayIndex(): number {
  const jsDay = new Date().getDay(); // domingo 0
  return jsDay === 0 ? 6 : jsDay - 1; // lunes 0
}

function getSessionMeta(
  category: WorkoutCategory,
  level: Level,
): {
  title: string;
  description: string;
  intensity: "baja" | "media" | "alta" | "recuperación";
  targetHeartRate: string;
  targetPace?: string;
} {
  switch (category) {
    case "easy_run":
      return {
        title: "Rodaje suave",
        description: "Sesión aeróbica cómoda para construir base y constancia.",
        intensity: "baja",
        targetHeartRate: "FC 135-150",
        targetPace: "Ritmo conversacional",
      };

    case "intervals":
      return {
        title: level === "principiante" ? "Intervalos cortos" : "Intervalos",
        description:
          "Trabajo de velocidad controlada con recuperaciones activas.",
        intensity: level === "avanzado" ? "alta" : "media",
        targetHeartRate: "FC 160-175",
        targetPace:
          level === "principiante"
            ? "Rápido pero controlado"
            : "Ritmo aproximado 5K",
      };

    case "tempo":
      return {
        title: "Tempo controlado",
        description:
          "Bloque sostenido a intensidad moderada-alta para mejorar tolerancia al esfuerzo.",
        intensity: "media",
        targetHeartRate: "FC 150-165",
        targetPace: "Ritmo fuerte sostenible",
      };

    case "long_run":
      return {
        title: "Fondo progresivo",
        description:
          "Sesión larga de baja intensidad para mejorar resistencia aeróbica.",
        intensity: "media",
        targetHeartRate: "FC 135-155",
        targetPace: "Ritmo cómodo y constante",
      };

    case "strength":
      return {
        title: "Fuerza funcional",
        description:
          "Trabajo de fuerza general para mejorar estabilidad, potencia y prevención de lesiones.",
        intensity: "media",
        targetHeartRate: "Control técnico",
      };

    case "swim_technique":
      return {
        title: "Técnica en piscina",
        description:
          "Sesión enfocada en eficiencia de brazada, respiración y posición corporal.",
        intensity: "baja",
        targetHeartRate: "Suave / técnico",
      };

    case "swim_endurance":
      return {
        title: "Resistencia en piscina",
        description:
          "Series aeróbicas sostenidas para mejorar capacidad cardiovascular en agua.",
        intensity: "media",
        targetHeartRate: "Moderado",
      };

    case "mixed_conditioning":
      return {
        title: "Acondicionamiento mixto",
        description:
          "Combinación de cardio, fuerza y movilidad para desarrollo general.",
        intensity: "media",
        targetHeartRate: "FC 140-160",
      };

    case "rest":
      return {
        title: "Descanso",
        description:
          "Día de recuperación para asimilar la carga de entrenamiento.",
        intensity: "recuperación",
        targetHeartRate: "Recuperación",
      };
  }
}

function getKmWeight(kind: SessionKind): number {
  switch (kind) {
    case "easy_run":
      return 1;

    case "intervals":
      return 0.75;

    case "tempo":
      return 0.9;

    case "long_run":
      return 1.4;

    case "mixed_conditioning":
      return 0.7;

    default:
      return 0;
  }
}

function distributeKmBySessionKind(totalKm: number, kinds: SessionKind[]) {
  const weights = kinds.map(getKmWeight);
  const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);

  if (totalWeight === 0) {
    return kinds.map(() => 0);
  }

  const rawDistribution = weights.map((weight) =>
    Math.round((weight / totalWeight) * totalKm),
  );

  const difference = totalKm - rawDistribution.reduce((acc, km) => acc + km, 0);

  if (difference !== 0) {
    const longRunIndex = kinds.findIndex((kind) => kind === "long_run");
    const targetIndex = longRunIndex >= 0 ? longRunIndex : 0;

    rawDistribution[targetIndex] += difference;
  }

  return rawDistribution;
}

export function generatePlan(input: Input): GeneratedPlan {
  const sessionsPerWeek = input.days.length;
  const weekPlan: DayWorkout[] = [];

  const totalKm =
    input.trainingType === "running" || input.trainingType === "mixed"
      ? Math.round(
          getWeeklyKmBase(input.level, input.goal) * (sessionsPerWeek / 3),
        )
      : 0;

  const kinds = getKindsForTrainingType(
    input.trainingType,
    input.goal,
    input.level,
    sessionsPerWeek,
  );

  const kmDistribution = distributeKmBySessionKind(totalKm, kinds);
 

  let trainingDayCounter = 0;

  for (let i = 0; i < 7; i++) {
    if (input.days.includes(i)) {
      const kind = kinds[trainingDayCounter] ?? "easy_run";
      const currentKm =
        kind === "easy_run" ||
        kind === "intervals" ||
        kind === "tempo" ||
        kind === "long_run" ||
        kind === "mixed_conditioning"
          ? (kmDistribution[trainingDayCounter] ?? 0)
          : 0;

      const meta = getSessionMeta(kind, input.level);

      weekPlan.push({
        day: i,
        type:
          kind === "strength"
            ? "strength"
            : kind === "swim_technique" || kind === "swim_endurance"
              ? "swimming"
              : kind === "mixed_conditioning"
                ? "mixed"
                : "running",
        category: kind,
        title: meta.title,
        description: meta.description,
        intensity: meta.intensity,
        km: currentKm,
        duration: input.duration,
        targetPace: meta.targetPace,
        targetHeartRate: meta.targetHeartRate,
        details: getWorkoutDetails(
          kind,
          currentKm,
          input.duration,
          input.level,
        ),
      });

      trainingDayCounter += 1;
    } else {
      const restMeta = getSessionMeta("rest", input.level);

      weekPlan.push({
        day: i,
        type: "rest",
        category: "rest",
        title: restMeta.title,
        description: restMeta.description,
        intensity: restMeta.intensity,
        targetHeartRate: restMeta.targetHeartRate,
        details: getWorkoutDetails("rest", 0, input.duration, input.level),
      });
    }
  }

  const todayIndex = getTodayIndex();
  const today = weekPlan.find((item) => item.day === todayIndex) ?? weekPlan[0];
  const todayKind =
    today.type === "rest"
      ? "rest"
      : today.type === "strength"
        ? "strength"
        : today.type === "swimming"
          ? "swim_endurance"
          : today.type === "mixed"
            ? "mixed_conditioning"
            : "easy_run";

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
      type: today.type === "rest" ? "Descanso" : today.type,
      title: today.title,
      day: "Hoy",
      duration:
        today.type === "rest" ? "—" : `${today.duration ?? input.duration} min`,
      difficulty: getDifficulty(input.level, todayKind),
      metric:
        today.type === "running" || today.type === "mixed"
          ? `${today.km ?? 0} km`
          : today.type === "rest"
            ? "Sin carga"
            : "Sesión",
      heartRate: getHeartRate(todayKind),
      status: "pending",
      km: today.km ?? 0,
      details: today.details ?? [],
    },
    weekPlan,
  };
}
