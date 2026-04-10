import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { spacing, theme } from "@/src/constants/theme";

type Status = "pending" | "completed";

type Props = {
  type: string;
  title: string;
  day: string;
  duration: string;
  difficulty: string;
  metric: string;
  heartRate: string;
  status?: Status;
};

export default function TodayWorkout({
  type,
  title,
  day,
  duration,
  difficulty,
  metric,
  heartRate,
  status = "pending",
}: Props) {
  const isCompleted = status === "completed";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.type}>{type}</Text>

        {isCompleted && (
          <View style={styles.badge}>
            <AntDesign name="check-circle" size={16} color={theme.colors.primary} />
            <Text style={styles.badgeText}>Completado</Text>
          </View>
        )}
      </View>

      {/* Main info */}
      <View style={styles.block}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>
          {day} · {duration} · {difficulty}
        </Text>
      </View>

      {/* Metrics */}
      <View style={styles.block}>
        <Text style={styles.metric}>{metric}</Text>
        <Text style={styles.meta}>{heartRate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  type: {
    fontSize: theme.typography.titleSM,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  badgeText: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },

  block: {
    marginBottom: spacing.md,
  },

  title: {
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 4,
  },

  meta: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
  },

  metric: {
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },
});