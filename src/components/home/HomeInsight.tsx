import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BaseCard } from "@/src/components/ui/kova";
import { spacing, theme } from "@/src/constants/theme";
import {
  getCoachRecommendation,
  type CoachRecommendationSeverity,
} from "@/src/services/coachRecommendation";
import type { TrainingReadiness } from "@/src/services/trainingReadiness";
import type {
  Activity,
  DayWorkout,
  TodayWorkout,
  WeeklyGoal,
} from "@/src/types/training";

type Props = {
  todayWorkout: TodayWorkout;
  weeklyGoal: WeeklyGoal;
  weekPlan: DayWorkout[];
  activities?: Activity[];
  readiness?: TrainingReadiness;
};

type SeverityMeta = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
  backgroundColor: string;
  borderColor: string;
};

const severityMeta: Record<CoachRecommendationSeverity, SeverityMeta> = {
  positive: {
    icon: "check-decagram",
    color: theme.colors.success,
    backgroundColor: theme.colors.successLight,
    borderColor: "rgba(53, 208, 127, 0.34)",
  },
  neutral: {
    icon: "compass-outline",
    color: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.borderStrong,
  },
  warning: {
    icon: "alert-circle-outline",
    color: theme.colors.warning,
    backgroundColor: theme.colors.warningLight,
    borderColor: "rgba(245, 184, 75, 0.34)",
  },
  recovery: {
    icon: "heart-pulse",
    color: theme.colors.info,
    backgroundColor: theme.colors.infoLight,
    borderColor: "rgba(120, 199, 255, 0.34)",
  },
};

type InsightMessage = {
  title: string;
  message: string;
  severity: CoachRecommendationSeverity;
};

function getReadinessInsight(
  readiness?: TrainingReadiness,
): InsightMessage | null {
  if (!readiness || readiness.status === "normal") return null;

  switch (readiness.status) {
    case "caution":
      return {
        title: "Baja intensidad hoy",
        message:
          "Hoy conviene evitar intensidad. Prioriza técnica, movilidad o descanso si las señales siguen cargadas.",
        severity: "warning",
      };
    case "recovery":
      return {
        title: "Descarga inteligente",
        message:
          "Enfoca la sesión en recuperación activa, movilidad o trabajo suave para asimilar la carga.",
        severity: "recovery",
      };
    case "ready":
      return {
        title: "Buen momento para ejecutar",
        message:
          "Puedes seguir el plan, manteniendo la técnica y sin convertir una buena sensación en carga extra.",
        severity: "positive",
      };
    default:
      return null;
  }
}

export default function HomeInsight({
  todayWorkout,
  weeklyGoal,
  weekPlan,
  activities,
  readiness,
}: Props) {
  const coachRecommendation = getCoachRecommendation({
    activities: activities ?? [],
    weekPlan,
    weeklyGoal,
    todayWorkout,
  });
  const recommendation =
    getReadinessInsight(readiness) ?? coachRecommendation;
  const meta = severityMeta[recommendation.severity];

  return (
    <BaseCard
      variant="glass"
      compact
      style={[styles.banner, { borderColor: meta.borderColor }]}
    >
      <View style={[styles.iconWrap, { backgroundColor: meta.backgroundColor }]}>
        <MaterialCommunityIcons
          name={meta.icon}
          size={24}
          color={meta.color}
        />
      </View>

      <View style={styles.messageBlock}>
        <Text style={[styles.label, { color: meta.color }]}>
          {recommendation.title}
        </Text>
        <Text style={styles.message}>{recommendation.message}</Text>
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: theme.colors.surface,
  },

  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  messageBlock: {
    flex: 1,
  },

  label: {
    fontSize: theme.typography.label,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.bold,
    textTransform: "uppercase",
    marginBottom: 2,
  },

  message: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    fontWeight: theme.fontWeight.medium,
  },
});
