import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BaseCard } from "@/src/components/ui/kova";
import { spacing, theme } from "@/src/constants/theme";
import {
  getCoachRecommendation,
  type CoachRecommendationSeverity,
} from "@/src/services/coachRecommendation";
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

export default function HomeInsight({
  todayWorkout,
  weeklyGoal,
  weekPlan,
  activities,
}: Props) {
  const recommendation = getCoachRecommendation({
    activities: activities ?? [],
    weekPlan,
    weeklyGoal,
    todayWorkout,
  });
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
