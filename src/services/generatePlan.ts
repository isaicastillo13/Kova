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

type DayWorkout = {
  day: number;
  type: DayWorkoutType;
  title: string;
  km?: number;
  duration?: number;
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

type Input = {
  goal: string;
  level: string;
  days: number[];
  duration: number;
  trainingType: "running" | "swimming" | "strength" | "mixed";
};

function getBaseKmByLevel(level: string) {
  if (level === "principiante") return 12;
  if (level === "intermedio") return 24;
  if (level === "avanzado") return 36;
  return 12;
}

function getRunningTitles(level: string, sessionIndex: number) {
  const beginner = ["Rodaje suave", "Trote continuo", "Fondo corto"];
  const intermediate = ["Rodaje suave", "Intervalos", "Fondo progresivo"];
  const advanced = ["Intervalos", "Tempo", "Fondo largo"];

  if (level === "principiante") return beginner[sessionIndex % beginner.length];
  if (level === "intermedio")
    return intermediate[sessionIndex % intermediate.length];
  return advanced[sessionIndex % advanced.length];
}

function getStrengthTitles(sessionIndex: number) {
  const titles = ["Tren inferior", "Core", "Tren superior"];
  return titles[sessionIndex % titles.length];
}

function getSwimmingTitles(sessionIndex: number) {
  const titles = ["Técnica", "Resistencia en piscina", "Series cortas"];
  return titles[sessionIndex % titles.length];
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

function getWorkoutDetails(
  trainingType: "running" | "swimming" | "strength" | "mixed",
  title: string,
  km: number,
  duration: number,
): WorkoutDetailBlock[] {
  if (trainingType === "running") {
    if (title.toLowerCase().includes("intervalos")) {
      return [
        {
          type: "warmup",
          label: "Calentamiento",
          description: "10 min de trote suave + movilidad articular",
        },
        {
          type: "main",
          label: "Bloque principal",
          description: `4x100 a ritmo controlado. Objetivo total aproximado: ${km} km`,
        },
        {
          type: "recovery",
          label: "Recuperación",
          description: "1 min suave entre repeticiones",
        },
        {
          type: "cooldown",
          label: "Vuelta a la calma",
          description: "8 min de trote suave y estiramientos ligeros",
        },
      ];
    }

    if (title.toLowerCase().includes("fondo")) {
      return [
        {
          type: "warmup",
          label: "Calentamiento",
          description: "8 min suaves antes de entrar en ritmo",
        },
        {
          type: "main",
          label: "Bloque principal",
          description: `Rodaje continuo de ${km} km a ritmo cómodo`,
        },
        {
          type: "cooldown",
          label: "Vuelta a la calma",
          description: "5 min suaves + respiración controlada",
        },
      ];
    }

    return [
      {
        type: "warmup",
        label: "Calentamiento",
        description: "10 min suaves",
      },
      {
        type: "main",
        label: "Bloque principal",
        description: `Rodaje de ${km} km manteniendo técnica estable`,
      },
      {
        type: "cooldown",
        label: "Vuelta a la calma",
        description: "5 min suaves al terminar",
      },
    ];
  }

  if (trainingType === "strength") {
    return [
      {
        type: "warmup",
        label: "Activación",
        description: "5-8 min de movilidad y activación general",
      },
      {
        type: "main",
        label: "Bloque principal",
        description: "Trabajo estructurado por series según el enfoque del día",
      },
      {
        type: "notes",
        label: "Notas",
        description: `Duración estimada: ${duration} min`,
      },
    ];
  }

  if (trainingType === "swimming") {
    return [
      {
        type: "warmup",
        label: "Calentamiento",
        description: "200m suaves + técnica básica",
      },
      {
        type: "main",
        label: "Bloque principal",
        description: "Series principales según objetivo del día",
      },
      {
        type: "cooldown",
        label: "Vuelta a la calma",
        description: "100m suaves",
      },
    ];
  }

  return [
    {
      type: "main",
      label: "Sesión",
      description: `Entrenamiento mixto de ${duration} min`,
    },
  ];
}

export function generatePlan(input: Input): GeneratedPlan {
  const sessionsPerWeek = input.days.length;
  const weekPlan: DayWorkout[] = [];

  const baseKm = getBaseKmByLevel(input.level);
  const totalKm = Math.round(baseKm * (sessionsPerWeek / 3));
  const kmDistribution = distributeKm(totalKm, sessionsPerWeek);

  let trainingDayCounter = 0;

  for (let i = 0; i < 7; i++) {
    if (input.days.includes(i)) {
      const currentKm =
        input.trainingType === "running" || input.trainingType === "mixed"
          ? (kmDistribution[trainingDayCounter] ?? 0)
          : 0;

      let title = "Entrenamiento base";

      if (input.trainingType === "running") {
        title = getRunningTitles(input.level, trainingDayCounter);
      } else if (input.trainingType === "strength") {
        title = getStrengthTitles(trainingDayCounter);
      } else if (input.trainingType === "swimming") {
        title = getSwimmingTitles(trainingDayCounter);
      } else if (input.trainingType === "mixed") {
        const mixedTitles = [
          "Rodaje suave",
          "Fuerza funcional",
          "Técnica + movilidad",
        ];
        title = mixedTitles[trainingDayCounter % mixedTitles.length];
      }

      weekPlan.push({
        day: i,
        type: input.trainingType,
        km: currentKm,
        duration: input.duration,
        title,
        details: getWorkoutDetails(
          input.trainingType,
          title,
          currentKm,
          input.duration,
        ),
      });
      trainingDayCounter += 1;
    } else {
      weekPlan.push({
        day: i,
        type: "rest",
        title: "Descanso",
        details: [
          {
            type: "notes",
            label: "Recuperación",
            description: "Día de descanso o movilidad ligera",
          },
        ],
      });
    }
  }

  const firstTrainingDay =
    weekPlan.find((item) => item.type !== "rest") ?? weekPlan[0];

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
      type:
        firstTrainingDay.type === "rest" ? "Descanso" : firstTrainingDay.type,
      title: firstTrainingDay.title,
      day: "Hoy",
      duration:
        firstTrainingDay.type === "rest"
          ? "—"
          : `${firstTrainingDay.duration ?? input.duration} min`,
      difficulty:
        firstTrainingDay.type === "rest"
          ? "Recuperación"
          : input.level === "principiante"
            ? "Baja"
            : input.level === "intermedio"
              ? "Media"
              : "Alta",
      metric:
        firstTrainingDay.type === "running" || firstTrainingDay.type === "mixed"
          ? `${firstTrainingDay.km ?? 0} km`
          : firstTrainingDay.type === "rest"
            ? "Sin carga"
            : "Sesión",
      heartRate:
        firstTrainingDay.type === "rest" ? "Recuperación" : "FC 140-160",
      status: "pending",
      km: firstTrainingDay.km ?? 0,
    },
    weekPlan,
  };
}
