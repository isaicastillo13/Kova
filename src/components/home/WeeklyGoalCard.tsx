import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ProgressBar } from "@/src/components/ProgresBar";
import { Badge, BaseCard } from "@/src/components/ui/kova";
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
    <BaseCard variant="elevated" style={styles.container}>
      <View style={styles.header}>
        <View style={styles.goalIcon}>
          <MaterialCommunityIcons
            name="flag-checkered"
            size={22}
            color={theme.colors.onPrimary}
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

        <Badge label={`${progressPercent}%`} />
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>Carga acumulada</Text>
          <Text style={styles.progressValue}>
            Faltan {remaining} {unit}
          </Text>
        </View>
        <ProgressBar
          current={progressCurrent}
          total={progressTotal}
          trackColor={theme.colors.surfaceMuted}
        />
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
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.xxl,
    gap: theme.spacing.lg,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  goalIcon: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.soft,
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    fontSize: theme.typography.label,
    color: theme.colors.textTechnical,
    fontWeight: theme.fontWeight.bold,
    textTransform: "uppercase",
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

  progressBlock: {
    gap: spacing.sm,
  },

  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  progressLabel: {
    fontSize: theme.typography.label,
    color: theme.colors.textTechnical,
    fontWeight: theme.fontWeight.bold,
    textTransform: "uppercase",
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
    paddingTop: spacing.lg,
  },

  stat: {
    flex: 1,
    minWidth: 0,
  },

  statValue: {
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  statLabel: {
    marginTop: 2,
    fontSize: theme.typography.label,
    color: theme.colors.textTechnical,
    textTransform: "uppercase",
  },

  divider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.border,
    marginHorizontal: spacing.md,
  },
});
