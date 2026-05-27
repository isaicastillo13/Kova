export type Goal = "resistencia" | "rendimiento" | "mantenerme" | "competencia";

export type Level = "principiante" | "intermedio" | "avanzado";

export type TrainingType = "running" | "swimming" | "strength" | "mixed";

export type RaceDistance = "general" | "5k" | "10k" | "21k" | "42k";

export type RunningExperience =
  | "new"
  | "returning"
  | "consistent"
  | "competitive";

export type InjuryHistory = "none" | "minor" | "recent";

export type WorkoutStatus =
  | "pending"
  | "completed"
  | "skipped"
  | "rescheduled";

export type WorkoutFeedback = {
  rpe: number;
  energy: "low" | "normal" | "high";
  pain: boolean;
  note?: string;
  completedKm?: number;
  actualDuration?: number;
};

export type DayWorkoutType =
  | "running"
  | "swimming"
  | "strength"
  | "mixed"
  | "rest";

export type WorkoutDetailBlockType =
  | "warmup"
  | "main"
  | "recovery"
  | "cooldown"
  | "notes";

export type WorkoutCategory =
  | "easy_run"
  | "intervals"
  | "tempo"
  | "long_run"
  | "strength"
  | "swim_technique"
  | "swim_endurance"
  | "mixed_conditioning"
  | "rest";

export type WorkoutDetailBlock = {
  type: WorkoutDetailBlockType;
  label: string;
  description: string;
};

export type DayWorkout = {
  id: string;
  day: number;
  type: DayWorkoutType;
  category: WorkoutCategory;
  title: string;
  description: string;
  intensity: "baja" | "media" | "alta" | "recuperación";
  status: WorkoutStatus;
  completedAt?: string;
  skippedAt?: string;
  plannedDate?: string;
  completedKm?: number;
  actualDuration?: number;
  feedback?: WorkoutFeedback;
  km?: number;
  duration?: number;
  targetPace?: string;
  targetHeartRate?: string;
  details?: WorkoutDetailBlock[];
};

export type TodayWorkout = {
  id?: string;
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
  completedAt?: string;
  skippedAt?: string;
  plannedDate?: string;
  completedKm?: number;
  actualDuration?: number;
  feedback?: WorkoutFeedback;
  details?: WorkoutDetailBlock[];
};

export type WeeklyGoal = {
  distance: number;
  unit: string;
  progressCurrent: number;
  progressTotal: number;
  completedSessions: number;
  totalSessions: number;
};

export type Activity = {
  id: string;
  workoutId: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  date: string;
  type: string;
  plannedKm: number;
  completedKm: number;
  actualDuration?: number;
  km: number;
  duration: string;
  status: Extract<WorkoutStatus, "completed" | "skipped">;
  feedback?: WorkoutFeedback;
};

export type GeneratedPlan = {
  weeklyGoal: WeeklyGoal;
  todayWorkout: TodayWorkout;
  weekPlan: DayWorkout[];
};

export type RunningProfile = {
  raceDistance?: RaceDistance;
  targetDate?: string;
  currentWeeklyKm?: number;
  longRunKm?: number;
  easyPace?: string;
  runningExperience?: RunningExperience;
  injuryHistory?: InjuryHistory;
};

export type GeneratePlanInput = RunningProfile & {
  goal: Goal;
  level: Level;
  days: number[];
  duration: number;
  trainingType: TrainingType;
};
