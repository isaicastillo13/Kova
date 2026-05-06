import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { spacing, theme } from "@/src/constants/theme";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';


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

function getInsightMessage({ streakDays, todayWorkout, weeklyGoal }: Props): {
  text: string;
  emoji: React.ReactNode;
} {
  const isRestDay =
    todayWorkout.type.toLowerCase() === "descanso" || todayWorkout.km === 0;

  const progressPercent =
    weeklyGoal.progressTotal > 0
      ? weeklyGoal.progressCurrent / weeklyGoal.progressTotal
      : 0;

  if (isRestDay)
    return {
      emoji: <MaterialCommunityIcons name="sleep" size={32} color={theme.colors.primaryLight} />, // match emoji font size and color
      text: "Hoy toca recuperación. Descansar también forma parte del progreso.",
    };

  if (todayWorkout.status === "completed")
    return {
      emoji: <Ionicons name="checkmark-done" size={24} color={theme.colors.blue} />,
      text: `Buen trabajo. Ya sumaste ${todayWorkout.km} ${weeklyGoal.unit} al progreso semanal.`,
    };

  if (streakDays >= 3)
    return {
      emoji: <AntDesign name="fire" size={24} color="black" />,
      text: `Llevas ${streakDays} días seguidos. Mantén ese ritmo.`,
    };

  if (progressPercent >= 0.75)
    return {
      emoji: <MaterialCommunityIcons name="run" size={24} color="black" />,
      text: "Estás muy cerca de completar tu meta semanal. Último empujón.",
    };

  if (weeklyGoal.completedSessions === 0)
    return {
      emoji: "🚀",
      text: `Hoy tienes ${todayWorkout.title}. Buen día para empezar fuerte.`,
    };

  return {
    emoji: "📈",
    text: `Vas ${weeklyGoal.progressCurrent}/${weeklyGoal.progressTotal} ${weeklyGoal.unit} esta semana. Sigue construyendo constancia.`,
  };
}

export default function HomeInsight({
  streakDays,
  todayWorkout,
  weeklyGoal,
}: Props) {
  const { emoji, text } = getInsightMessage({
    streakDays,
    todayWorkout,
    weeklyGoal,
  });

  return (
    <View style={styles.wrapper}>
      {/* Floating pill */}
      <View style={styles.pill}>
        <Text style={styles.pillText}>✦ Insight del día</Text>
      </View>

      {/* Dark banner */}
      <View style={styles.banner}>
        {typeof emoji === 'string' ? (
          <Text style={styles.emoji}>{emoji}</Text>
        ) : (
          <View style={styles.emoji}>{emoji}</View>
        )}
        <Text style={styles.message}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: theme.spacing.lg,
    // Extra top margin so the pill doesn't get clipped
    marginTop: spacing.sm,
  },

  // ── Floating pill ──────────────────────────
  pill: {
    position: "absolute",
    top: -10,
    right: 14,
    zIndex: 1,
    backgroundColor: theme.colors.primary,        // tu rojo #c0392b
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },

  pillText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 0.8,
    color: "#fff",
    textTransform: "uppercase",
  },

  // ── Dark banner ────────────────────────────
  banner: {
    backgroundColor: theme.colors.blue,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  emoji: {
    fontSize: 32,
    flexShrink: 0,
  },

  message: {
    flex: 1,
    fontSize: theme.typography.bodySM,
    color: "rgba(255, 255, 255, 0.88)",
    lineHeight: 21,
    fontWeight: theme.fontWeight.medium,
  },
});