import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Badge, BaseCard } from "@/src/components/ui/kova";
import { theme, spacing } from "@/src/constants/theme";
import { useHomeStore } from "@/src/store/home-store";
import type { Activity } from "@/src/types/training";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function formatType(type: string) {
  if (type.toLowerCase() === "running") return "Running";
  if (type.toLowerCase() === "strength") return "Fuerza";
  if (type.toLowerCase() === "swimming") return "Natación";
  if (type.toLowerCase() === "mixed") return "Mixto";
  return type;
}

function getActivityIcon(type: string) {
  if (type.toLowerCase() === "strength") return "dumbbell";
  if (type.toLowerCase() === "swimming") return "swim";
  if (type.toLowerCase() === "mixed") return "lightning-bolt";
  return "run-fast";
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? `${value}` : `${Number(value.toFixed(2))}`;
}

function getDurationLabel(activity: Activity) {
  return typeof activity.actualDuration === "number"
    ? `${formatNumber(activity.actualDuration)} min`
    : activity.duration;
}

export default function HistoryScreen() {
  const { activities, weeklyGoal } = useHomeStore();

  const completedActivities = activities.filter(
    (item) => item.status === "completed",
  );
  const totalKm = completedActivities.reduce(
    (acc, item) => acc + item.completedKm,
    0,
  );
  const totalSessions = completedActivities.length;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.kicker}>Historial</Text>
        <Text style={styles.title}>Entrenamientos registrados</Text>
        <Text style={styles.subtitle}>
          Revisa las sesiones que ya sumaste a tu plan.
        </Text>
      </View>

      <BaseCard variant="hero" style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{totalSessions}</Text>
          <Text style={styles.summaryLabel}>Sesiones</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{formatNumber(totalKm)}</Text>
          <Text style={styles.summaryLabel}>Km completados</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {weeklyGoal.completedSessions}/{weeklyGoal.totalSessions}
          </Text>
          <Text style={styles.summaryLabel}>Semana</Text>
        </View>
      </BaseCard>

      {activities.length === 0 ? (
        <BaseCard variant="elevated" style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <MaterialCommunityIcons
              name="clipboard-text-clock"
              size={28}
              color={theme.colors.primary}
            />
          </View>
          <Text style={styles.emptyTitle}>Todavía no hay historial</Text>
          <Text style={styles.emptyCopy}>
            Cuando marques un entrenamiento como completado, aparecerá aquí con
            sus métricas principales.
          </Text>
        </BaseCard>
      ) : (
        <View style={styles.list}>
          {activities.map((item) => (
            <BaseCard key={item.id} compact style={styles.activityCard}>
              <View style={styles.timelineDot} />
              <View style={styles.iconWrap}>
                <MaterialCommunityIcons
                  name={getActivityIcon(item.type) as never}
                  size={22}
                  color={theme.colors.primary}
                />
              </View>

              <View style={styles.activityBody}>
                <View style={styles.activityTop}>
                  <Text style={styles.date}>{item.dateLabel}</Text>
                  <Badge
                    label={
                      item.status === "skipped"
                        ? "Omitida"
                        : formatType(item.type)
                    }
                    tone={item.status === "skipped" ? "error" : "primary"}
                  />
                </View>

                <Text style={styles.activityTitle} numberOfLines={2}>
                  {item.title}
                </Text>

                <View style={styles.metricsRow}>
                  <Text style={styles.metric}>
                    {item.completedKm > 0
                      ? `${formatNumber(item.completedKm)} km`
                      : "Sin carga"}
                  </Text>
                  <View style={styles.dot} />
                  <Text style={styles.metric}>{getDurationLabel(item)}</Text>
                </View>

                {!!item.feedback && (
                  <View style={styles.feedbackRow}>
                    <Text style={styles.feedbackPill}>
                      RPE {item.feedback.rpe}
                    </Text>
                    {item.feedback.pain && (
                      <Text style={styles.painPill}>Dolor</Text>
                    )}
                  </View>
                )}

                <Text style={styles.subtitleSmall} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              </View>
            </BaseCard>
          ))}
        </View>
      )}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    padding: theme.spacing.xl,
    paddingBottom: 126,
    gap: theme.spacing.xl,
  },

  header: {
    gap: spacing.xs,
  },

  kicker: {
    fontSize: theme.typography.label,
    color: theme.colors.primaryMuted,
    fontWeight: theme.fontWeight.bold,
    textTransform: "uppercase",
  },

  title: {
    fontSize: theme.typography.titleXL,
    lineHeight: 36,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.extrabold,
  },

  subtitle: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },

  summary: {
    padding: theme.spacing.xxl,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 126,
  },

  summaryItem: {
    flex: 1,
  },

  summaryValue: {
    fontSize: theme.typography.titleMD,
    color: theme.colors.white,
    fontWeight: theme.fontWeight.bold,
  },

  summaryLabel: {
    marginTop: 2,
    fontSize: theme.typography.label,
    color: theme.colors.textTechnical,
    fontWeight: theme.fontWeight.bold,
    textTransform: "uppercase",
  },

  summaryDivider: {
    width: 1,
    height: 38,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    marginHorizontal: spacing.md,
  },

  emptyCard: {
    padding: theme.spacing.xxl,
    alignItems: "center",
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },

  emptyTitle: {
    fontSize: theme.typography.titleSM,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.bold,
    marginBottom: spacing.sm,
  },

  emptyCopy: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    textAlign: "center",
  },

  list: {
    gap: spacing.md,
  },

  activityCard: {
    flexDirection: "row",
    padding: spacing.lg,
    position: "relative",
    borderColor: theme.colors.borderStrong,
  },

  timelineDot: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: theme.colors.primary,
  },

  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  activityBody: {
    flex: 1,
    minWidth: 0,
  },

  activityTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },

  date: {
    fontSize: theme.typography.label,
    color: theme.colors.textTechnical,
    fontWeight: theme.fontWeight.bold,
    textTransform: "uppercase",
  },

  type: {
    fontSize: theme.typography.label,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold,
    textTransform: "uppercase",
  },

  activityTitle: {
    fontSize: theme.typography.bodyLG,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.bold,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },

  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },

  metric: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.semibold,
  },

  feedbackRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },

  feedbackPill: {
    fontSize: theme.typography.label,
    color: theme.colors.primaryMuted,
    fontWeight: theme.fontWeight.bold,
    textTransform: "uppercase",
  },

  painPill: {
    fontSize: theme.typography.label,
    color: theme.colors.warning,
    fontWeight: theme.fontWeight.bold,
    textTransform: "uppercase",
  },

  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
  },

  subtitleSmall: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
  },
});
