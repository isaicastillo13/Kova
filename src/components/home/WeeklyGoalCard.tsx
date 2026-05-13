import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ProgressBar } from "@/src/components/ProgresBar";
import { spacing, theme } from "@/src/constants/theme";

type Props = {
  unit?: string;
  completedSessions: number;
  totalSessions: number;
  progressCurrent: number;
  progressTotal: number;
};

export default function WeeklyGoalCard({
  unit = "km",
  completedSessions,
  totalSessions,
  progressCurrent,
  progressTotal,
}: Props) {
  const progressPercent =
    progressTotal > 0
      ? Math.round(Math.min(progressCurrent / progressTotal, 1) * 100)
      : 0;
  const remaining = Math.max(progressTotal - progressCurrent, 0);
  const remainingSessions = Math.max(totalSessions - completedSessions, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.goalIcon}>
          <MaterialCommunityIcons
            name="flag-checkered"
            size={22}
            color={theme.colors.white}
          />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>Meta semanal</Text>
          <Text style={styles.title}>
            {progressCurrent}
            <Text style={styles.titleMuted}> / {progressTotal}</Text>
            <Text style={styles.unit}> {unit}</Text>
          </Text>
        </View>

        <View style={styles.percentPill}>
          <Text style={styles.percentText}>{progressPercent}%</Text>
        </View>
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>Carga acumulada</Text>
          <Text style={styles.progressValue}>
            Faltan {remaining} {unit}
          </Text>
        </View>
        <ProgressBar current={progressCurrent} total={progressTotal} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {completedSessions}/{totalSessions}
          </Text>
          <Text style={styles.statLabel}>Sesiones</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.stat}>
          <Text style={styles.statValue}>{remainingSessions}</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.stat}>
          <Text style={styles.statValue}>{progressTotal}</Text>
          <Text style={styles.statLabel}>{unit} objetivo</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xxl,
    padding: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: 2,
  },

  title: {
    fontSize: theme.typography.titleMD,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  titleMuted: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.titleSM,
  },

  unit: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodyMD,
  },

  percentPill: {
    minWidth: 54,
    height: 34,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },

  percentText: {
    color: theme.colors.primaryDark,
    fontSize: theme.typography.bodySM,
    fontWeight: theme.fontWeight.bold,
  },

  progressBlock: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },

  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  progressLabel: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
  },

  progressValue: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.semibold,
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
  },

  stat: {
    flex: 1,
  },

  statValue: {
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  statLabel: {
    marginTop: 2,
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
  },

  divider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.border,
    marginHorizontal: spacing.md,
  },
});
