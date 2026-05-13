import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
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

type Insight = {
  label: string;
  text: string;
  icon:
    | React.ComponentProps<typeof MaterialCommunityIcons>["name"]
    | React.ComponentProps<typeof Ionicons>["name"];
  family: "material" | "ion";
  tone: "primary" | "success" | "recovery";
};

function getInsightMessage({
  streakDays,
  todayWorkout,
  weeklyGoal,
}: Props): Insight {
  const isRestDay =
    todayWorkout.type.toLowerCase() === "descanso" || todayWorkout.km === 0;

  const progressPercent =
    weeklyGoal.progressTotal > 0
      ? weeklyGoal.progressCurrent / weeklyGoal.progressTotal
      : 0;

  if (isRestDay) {
    return {
      family: "material",
      icon: "sleep",
      label: "Recuperación",
      tone: "recovery",
      text: "Hoy baja la carga. Recuperar bien también suma al plan.",
    };
  }

  if (todayWorkout.status === "completed") {
    return {
      family: "ion",
      icon: "checkmark-done",
      label: "Sesión cerrada",
      tone: "success",
      text: `Ya sumaste ${todayWorkout.km} ${weeklyGoal.unit}. Buen avance para esta semana.`,
    };
  }

  if (streakDays >= 3) {
    return {
      family: "material",
      icon: "fire",
      label: "Racha activa",
      tone: "primary",
      text: `Llevas ${streakDays} días seguidos. Mantén el ritmo sin forzar de más.`,
    };
  }

  if (progressPercent >= 0.75) {
    return {
      family: "material",
      icon: "chart-line",
      label: "Casi listo",
      tone: "primary",
      text: "Estás cerca de completar la meta semanal. Cuida la ejecución.",
    };
  }

  if (weeklyGoal.completedSessions === 0) {
    return {
      family: "material",
      icon: "run-fast",
      label: "Primera sesión",
      tone: "primary",
      text: `Hoy toca ${todayWorkout.title}. Buen día para abrir la semana.`,
    };
  }

  return {
    family: "material",
    icon: "map-marker-distance",
    label: "Construyendo base",
    tone: "primary",
    text: `Vas ${weeklyGoal.progressCurrent}/${weeklyGoal.progressTotal} ${weeklyGoal.unit}. Sigue acumulando trabajo útil.`,
  };
}

export default function HomeInsight({
  streakDays,
  todayWorkout,
  weeklyGoal,
}: Props) {
  const insight = getInsightMessage({
    streakDays,
    todayWorkout,
    weeklyGoal,
  });

  const iconColor =
    insight.tone === "success"
      ? theme.colors.success
      : insight.tone === "recovery"
        ? theme.colors.info
        : theme.colors.primary;

  return (
    <View style={styles.banner}>
      <View style={[styles.iconWrap, { backgroundColor: `${iconColor}18` }]}>
        {insight.family === "ion" ? (
          <Ionicons name={insight.icon as never} size={22} color={iconColor} />
        ) : (
          <MaterialCommunityIcons
            name={insight.icon as never}
            size={24}
            color={iconColor}
          />
        )}
      </View>

      <View style={styles.messageBlock}>
        <Text style={styles.label}>{insight.label}</Text>
        <Text style={styles.message}>{insight.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  messageBlock: {
    flex: 1,
  },

  label: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.bold,
    marginBottom: 2,
  },

  message: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    fontWeight: theme.fontWeight.medium,
  },
});
