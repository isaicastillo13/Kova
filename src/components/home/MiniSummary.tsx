import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme, spacing } from "@/src/constants/theme";

type Props = {
  streakDays: number;
  completedSessions: number;
  totalSessions: number;
  totalTime: string;
};

export default function MiniSummary({
  streakDays,
  completedSessions,
  totalSessions,
  totalTime,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.value}>🔥 {streakDays}</Text>
        <Text style={styles.label}>Días</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.item}>
        <Text style={styles.value}>🏃 {completedSessions}/{totalSessions}</Text>
        <Text style={styles.label}>Sesiones</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.item}>
        <Text style={styles.value}>⏱ {totalTime}</Text>
        <Text style={styles.label}>Tiempo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },

  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  value: {
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  label: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },

  divider: {
    width: 1,
    height: 28,
    backgroundColor: theme.colors.border,
    marginHorizontal: spacing.sm,
  },
});