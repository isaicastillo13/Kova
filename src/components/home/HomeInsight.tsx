import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { spacing, theme } from "@/src/constants/theme";

type TodayWorkout = {
  type: string;
  title: string;
  km: number;
  status: "pending" | "completed";
};

type WeeklyGoal = {
  progressCurrent: number;
  progressTotal: number;
  completedSessions: number;
  totalSessions: number;
  unit: string;
};

type Props = {
  streakDays: number;
  todayWorkout: TodayWorkout;
  weeklyGoal: WeeklyGoal;
};

function getInsightMessage({
  streakDays,
  todayWorkout,
  weeklyGoal,
}: Props): string {
  const isRestDay =
    todayWorkout.type.toLowerCase() === "descanso" || todayWorkout.km === 0;

  const progressPercent =
    weeklyGoal.progressTotal > 0
      ? weeklyGoal.progressCurrent / weeklyGoal.progressTotal
      : 0;

  if (isRestDay) {
    return "Hoy toca recuperación. Descansar también forma parte del progreso.";
  }

  if (todayWorkout.status === "completed") {
    return `Buen trabajo. Ya sumaste ${todayWorkout.km} ${weeklyGoal.unit} al progreso semanal.`;
  }

  if (streakDays >= 3) {
    return `🔥 Llevas ${streakDays} días seguidos. Mantén ese ritmo.`;
  }

  if (progressPercent >= 0.75) {
    return "Estás muy cerca de completar tu meta semanal. Último empujón.";
  }

  if (weeklyGoal.completedSessions === 0) {
    return `Hoy tienes ${todayWorkout.title}. Buen día para empezar fuerte.`;
  }

  return `Vas ${weeklyGoal.progressCurrent}/${weeklyGoal.progressTotal} ${weeklyGoal.unit} esta semana. Sigue construyendo constancia.`;
}

export default function HomeInsight({
  streakDays,
  todayWorkout,
  weeklyGoal,
}: Props) {
  const message = getInsightMessage({
    streakDays,
    todayWorkout,
    weeklyGoal,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Insight del día</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },

  label: {
    fontSize: theme.typography.bodySM,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: spacing.xs,
  },

  message: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.text,
    lineHeight: 22,
    fontWeight: theme.fontWeight.medium,
  },
});