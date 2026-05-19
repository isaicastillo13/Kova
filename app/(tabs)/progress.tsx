import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps } from "react";
import { ProgressBar } from "@/src/components/ProgresBar";
import { BaseCard, SectionHeader } from "@/src/components/ui/kova";
import { calculateStreak } from "@/src/components/utils/date";
import { theme, spacing } from "@/src/constants/theme";
import { useHomeStore } from "@/src/store/home-store";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const dayLabels = ["L", "M", "X", "J", "V", "S", "D"];

export default function ProgressScreen() {
  const { weeklyGoal, weekPlan, completedDates, completedDays } = useHomeStore();

  const progressPercent =
    weeklyGoal.progressTotal > 0
      ? Math.round(
          Math.min(weeklyGoal.progressCurrent / weeklyGoal.progressTotal, 1) *
            100,
        )
      : 0;

  const plannedMinutes = weekPlan.reduce((acc, item) => {
    if (item.type === "rest") return acc;
    return acc + (item.duration ?? 0);
  }, 0);

  const plannedKm = weekPlan.reduce((acc, item) => acc + (item.km ?? 0), 0);
  const longestRun = weekPlan.reduce(
    (max, item) => Math.max(max, item.km ?? 0),
    0,
  );
  const streakDays = calculateStreak(completedDates);
  const maxBarValue = Math.max(...weekPlan.map((item) => item.km ?? 0), 1);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <BaseCard variant="hero" style={styles.hero}>
        <Text style={styles.kicker}>Progreso</Text>
        <Text style={styles.title}>Tu carga semanal</Text>
        <Text style={styles.heroValue}>{progressPercent}%</Text>
        <ProgressBar
          current={weeklyGoal.progressCurrent}
          total={weeklyGoal.progressTotal}
          color={theme.colors.primary}
          trackColor="rgba(255, 255, 255, 0.16)"
        />
        <View style={styles.heroFooter}>
          <Text style={styles.heroMeta}>
            {weeklyGoal.progressCurrent}/{weeklyGoal.progressTotal}{" "}
            {weeklyGoal.unit}
          </Text>
          <Text style={styles.heroMeta}>
            {weeklyGoal.completedSessions}/{weeklyGoal.totalSessions} sesiones
          </Text>
        </View>
      </BaseCard>

      <View style={styles.metricsGrid}>
        <MetricCard
          icon="fire"
          label="Racha"
          value={`${streakDays} días`}
          tone="primary"
        />
        <MetricCard
          icon="timer-outline"
          label="Tiempo planificado"
          value={`${Math.floor(plannedMinutes / 60)}h ${plannedMinutes % 60}m`}
          tone="info"
        />
        <MetricCard
          icon="map-marker-distance"
          label="Volumen planificado"
          value={`${plannedKm} km`}
          tone="success"
        />
        <MetricCard
          icon="flag-checkered"
          label="Fondo más largo"
          value={`${longestRun} km`}
          tone="warning"
        />
      </View>

      <BaseCard variant="elevated" style={styles.card}>
        <SectionHeader title="Distribución de carga" meta="Semana actual" />

        <View style={styles.chart}>
          {weekPlan.map((item) => {
            const value = item.km ?? 0;
            const isCompleted = completedDays.includes(item.day);
            const barHeight = item.type === "rest" ? 10 : 26 + (value / maxBarValue) * 82;

            return (
              <View key={item.day} style={styles.chartItem}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor: isCompleted
                          ? theme.colors.success
                          : item.type === "rest"
                            ? theme.colors.borderStrong
                            : theme.colors.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.chartValue}>
                  {item.type === "rest" ? "0" : String(value)}
                </Text>
                <Text style={styles.chartLabel}>{dayLabels[item.day]}</Text>
              </View>
            );
          })}
        </View>
      </BaseCard>

      <BaseCard variant="elevated" style={styles.card}>
        <SectionHeader title="Lectura rápida" />

        <InsightRow
          icon="chart-line"
          title="Consistencia"
          copy={`${weeklyGoal.completedSessions} de ${weeklyGoal.totalSessions} sesiones completadas esta semana.`}
        />
        <InsightRow
          icon="run-fast"
          title="Carga útil"
          copy={`Has acumulado ${weeklyGoal.progressCurrent} ${weeklyGoal.unit} de ${weeklyGoal.progressTotal} ${weeklyGoal.unit} planificados.`}
        />
        <InsightRow
          icon="heart-pulse"
          title="Recuperación"
          copy="Alterna los días intensos con baja carga para sostener el progreso."
        />
      </BaseCard>
    </ScrollView>
    </SafeAreaView>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  value: string;
  tone: "primary" | "info" | "success" | "warning";
}) {
  const palette = {
    primary: [theme.colors.primary, theme.colors.primaryLight],
    info: [theme.colors.info, theme.colors.infoLight],
    success: [theme.colors.success, theme.colors.successLight],
    warning: [theme.colors.warning, theme.colors.warningLight],
  }[tone];

  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: palette[1] }]}>
        <MaterialCommunityIcons name={icon} size={21} color={palette[0]} />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function InsightRow({
  icon,
  title,
  copy,
}: {
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  copy: string;
}) {
  return (
    <View style={styles.insightRow}>
      <View style={styles.insightIcon}>
        <MaterialCommunityIcons
          name={icon}
          size={19}
          color={theme.colors.primary}
        />
      </View>
      <View style={styles.insightText}>
        <Text style={styles.insightTitle}>{title}</Text>
        <Text style={styles.insightCopy}>{copy}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    padding: theme.spacing.xxl,
    paddingBottom: 126,
    gap: theme.spacing.xl,
  },

  hero: {
    padding: theme.spacing.xxl,
    minHeight: 220,
  },

  kicker: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.primaryMuted,
    fontWeight: theme.fontWeight.bold,
    marginBottom: spacing.xs,
  },

  title: {
    fontSize: theme.typography.titleXL,
    lineHeight: 36,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.white,
  },

  heroValue: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    fontSize: theme.typography.hero,
    lineHeight: 46,
    color: theme.colors.white,
    fontWeight: theme.fontWeight.bold,
  },

  heroFooter: {
    marginTop: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  heroMeta: {
    fontSize: theme.typography.bodySM,
    color: "rgba(255, 255, 255, 0.68)",
    fontWeight: theme.fontWeight.semibold,
  },

  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },

  metricCard: {
    width: "47%",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    padding: spacing.lg,
    ...theme.shadows.soft,
  },

  metricIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },

  metricValue: {
    fontSize: theme.typography.titleSM,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.bold,
  },

  metricLabel: {
    marginTop: 2,
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
  },

  card: {
    padding: theme.spacing.xxl,
    gap: theme.spacing.xl,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },

  sectionTitle: {
    fontSize: theme.typography.titleSM,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.bold,
  },

  sectionMeta: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.semibold,
  },

  chart: {
    height: 166,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.sm,
  },

  chartItem: {
    flex: 1,
    alignItems: "center",
  },

  barTrack: {
    height: 118,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  bar: {
    width: 20,
    minHeight: 8,
    borderRadius: theme.radius.pill,
  },

  chartValue: {
    marginTop: spacing.sm,
    fontSize: theme.typography.bodySM,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.bold,
  },

  chartLabel: {
    marginTop: 2,
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
  },

  insightRow: {
    flexDirection: "row",
    gap: spacing.md,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },

  insightIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  insightText: {
    flex: 1,
  },

  insightTitle: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.bold,
    marginBottom: 3,
  },

  insightCopy: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});
