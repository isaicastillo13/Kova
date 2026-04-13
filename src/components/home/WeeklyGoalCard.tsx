import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ProgressBar } from "@/src/components/ProgresBar";
import { spacing, theme, typography } from "@/src/constants/theme";

type Props = {
  distance: number;
  goal: number;
  unit?: string;
  completedSessions: number;
  totalSessions: number;
  progressCurrent: number;
  progressTotal: number;
};

export default function WeeklyGoalCard({
  distance,
  goal,
  unit = "km",
  completedSessions,
  totalSessions,
  progressCurrent,
  progressTotal,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.summaryRow}>
        <View style={styles.summaryLeft}>
          <View style={styles.summaryIconWrapper}>
            <Image
              source={require("@/assets/images/iconAppWhite.png")}
              style={styles.summaryIcon}
            />
          </View>

          <View style={styles.kmContainer}>
            <Text style={styles.cardTitle}>
              {distance}
              <Text style={{ color: theme.colors.textSecondary, fontSize: typography.titleSM }}>
                / {goal}
              </Text>
            </Text>
            <Text style={styles.cardSubtitle}>{unit}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.label}>
        {completedSessions} de {totalSessions} sesiones completadas
      </Text>

      <View style={styles.progressRow}>
        <View style={styles.progressWrapper}>
          <ProgressBar current={progressCurrent} total={progressTotal} />
        </View>

        <View style={styles.trophyWrapper}>
          <AntDesign name="trophy" size={20} color={theme.colors.primary} />
        </View>
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
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    ...theme.shadows.card,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  summaryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  summaryIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryIcon: {
    width: 24,
    height: 24,
  },

  kmContainer: {
    alignItems: "center",
  },

  cardTitle: {
    fontSize: theme.typography.titleMD,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 0,
    lineHeight: 34,
  },

  cardSubtitle: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    marginTop: 0,
    lineHeight: 14,
  },

  label: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: spacing.sm,
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  progressWrapper: {
    flex: 1,
  },

  trophyWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
});