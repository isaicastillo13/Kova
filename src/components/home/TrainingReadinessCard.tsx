import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BaseCard, ProgressRing } from "@/src/components/ui/kova";
import { spacing, theme } from "@/src/constants/theme";
import type {
  TrainingReadiness,
  TrainingReadinessStatus,
} from "@/src/services/trainingReadiness";

type Props = {
  readiness: TrainingReadiness;
};

type StatusMeta = {
  label: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
};

const statusMeta: Record<TrainingReadinessStatus, StatusMeta> = {
  ready: {
    label: "Ready",
    color: theme.colors.success,
    backgroundColor: theme.colors.successLight,
    borderColor: "rgba(53, 208, 127, 0.34)",
    icon: "check-decagram",
  },
  normal: {
    label: "Normal",
    color: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.borderStrong,
    icon: "run-fast",
  },
  recovery: {
    label: "Recovery",
    color: theme.colors.info,
    backgroundColor: theme.colors.infoLight,
    borderColor: "rgba(120, 199, 255, 0.34)",
    icon: "heart-pulse",
  },
  caution: {
    label: "Caution",
    color: theme.colors.error,
    backgroundColor: theme.colors.errorLight,
    borderColor: "rgba(255, 107, 97, 0.36)",
    icon: "alert-circle-outline",
  },
};

export default function TrainingReadinessCard({ readiness }: Props) {
  const meta = statusMeta[readiness.status];
  const visibleFactors = readiness.factors.slice(0, 3);

  return (
    <BaseCard
      variant="glass"
      compact
      style={[styles.card, { borderColor: meta.borderColor }]}
    >
      <View style={styles.topRow}>
        <ProgressRing
          progress={readiness.score / 100}
          size={86}
          strokeWidth={8}
          color={meta.color}
          trackColor={theme.colors.surfaceBright}
        >
          <Text style={[styles.scoreValue, { color: meta.color }]}>
            {readiness.score}
          </Text>
          <Text style={styles.scoreLabel}>/100</Text>
        </ProgressRing>

        <View style={styles.copyBlock}>
          <View style={[styles.statusPill, { backgroundColor: meta.backgroundColor }]}>
            <MaterialCommunityIcons
              name={meta.icon}
              size={15}
              color={meta.color}
            />
            <Text style={[styles.statusText, { color: meta.color }]}>
              {meta.label}
            </Text>
          </View>

          <Text style={styles.title}>{readiness.title}</Text>
          <Text style={styles.message}>{readiness.message}</Text>
        </View>
      </View>

      {visibleFactors.length > 0 && (
        <View style={styles.factors}>
          {visibleFactors.map((factor) => (
            <View key={factor} style={styles.factorItem}>
              <View style={[styles.factorDot, { backgroundColor: meta.color }]} />
              <Text style={styles.factorText}>{factor}</Text>
            </View>
          ))}
        </View>
      )}
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.xl,
    gap: spacing.lg,
    backgroundColor: theme.colors.surface,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },

  scoreValue: {
    fontSize: theme.typography.titleMD,
    fontWeight: theme.fontWeight.extrabold,
    lineHeight: 26,
  },

  scoreLabel: {
    fontSize: theme.typography.label,
    color: theme.colors.textMuted,
    fontWeight: theme.fontWeight.bold,
    marginTop: -2,
  },

  copyBlock: {
    flex: 1,
    minWidth: 0,
  },

  statusPill: {
    alignSelf: "flex-start",
    minHeight: 28,
    borderRadius: theme.radius.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },

  statusText: {
    fontSize: theme.typography.label,
    fontWeight: theme.fontWeight.bold,
    textTransform: "uppercase",
  },

  title: {
    fontSize: theme.typography.titleSM,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.bold,
    marginBottom: spacing.xs,
  },

  message: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    fontWeight: theme.fontWeight.medium,
  },

  factors: {
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },

  factorItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },

  factorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },

  factorText: {
    flex: 1,
    minWidth: 0,
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    lineHeight: 19,
    fontWeight: theme.fontWeight.medium,
  },
});
