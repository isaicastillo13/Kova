import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BaseCard, SectionHeader } from "@/src/components/ui/kova";
import { theme, spacing } from "@/src/constants/theme";
import { useHomeStore } from "@/src/store/home-store";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function getWorkoutIcon(type: string, km: number) {
  const normalizedType = type.toLowerCase();
  if (normalizedType === "descanso" || km === 0) return "sleep";
  if (normalizedType === "strength") return "dumbbell";
  if (normalizedType === "swimming") return "swim";
  if (normalizedType === "mixed") return "lightning-bolt";
  return "run-fast";
}

function getBlockIcon(type: string) {
  switch (type) {
    case "warmup":
      return "weather-sunny";
    case "main":
      return "fire";
    case "recovery":
      return "heart-pulse";
    case "cooldown":
      return "leaf";
    default:
      return "clipboard-text-outline";
  }
}

export default function WorkoutDetailScreen() {
  const router = useRouter();
  const todayWorkout = useHomeStore((state) => state.todayWorkout);
  const selectedWorkout = useHomeStore((state) => state.selectedWorkout);
  const completeWorkout = useHomeStore((state) => state.completeWorkout);
  const skipWorkout = useHomeStore((state) => state.skipWorkout);
  const resetWorkoutStatus = useHomeStore((state) => state.resetWorkoutStatus);
  const clearSelectedWorkout = useHomeStore(
    (state) => state.clearSelectedWorkout,
  );

  useEffect(() => {
    return () => {
      clearSelectedWorkout();
    };
  }, [clearSelectedWorkout]);

  const workout = selectedWorkout
    ? {
        type:
          selectedWorkout.type === "rest" ? "Descanso" : selectedWorkout.type,
        title: selectedWorkout.title,
        day: "Plan semanal",
        duration:
          selectedWorkout.type === "rest"
            ? "—"
            : `${selectedWorkout.duration ?? 0} min`,
        difficulty: selectedWorkout.type === "rest" ? "Recuperación" : selectedWorkout.intensity,
        metric:
          selectedWorkout.type === "running" || selectedWorkout.type === "mixed"
            ? `${selectedWorkout.km ?? 0} km`
            : selectedWorkout.type === "rest"
              ? "Sin carga"
              : "Sesión",
        heartRate:
          selectedWorkout.type === "rest"
            ? "Recuperación"
            : (selectedWorkout.targetHeartRate ?? "FC 140-160"),
        targetPace: selectedWorkout.targetPace,
        km: selectedWorkout.km ?? 0,
        id: selectedWorkout.id,
        status: selectedWorkout.status,
        completedAt: selectedWorkout.completedAt,
        skippedAt: selectedWorkout.skippedAt,
        details: selectedWorkout.details ?? [],
      }
    : todayWorkout;

  const isRestDay =
    workout.type.toLowerCase() === "descanso" || workout.km === 0;
  const iconName = getWorkoutIcon(workout.type, workout.km);
  const workoutId = workout.id;
  const canExecute = !!workoutId && !isRestDay;
  const isCompleted = workout.status === "completed";
  const isSkipped = workout.status === "skipped";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BaseCard variant="hero" style={styles.hero}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color={theme.colors.white}
            />
          </Pressable>

          <View style={styles.heroIcon}>
            <MaterialCommunityIcons
              name={iconName as never}
              size={30}
              color={theme.colors.onPrimary}
            />
          </View>

          <Text style={styles.type}>{workout.type}</Text>
          <Text style={styles.title}>{workout.title}</Text>
          <Text style={styles.meta}>
            {workout.day} · {workout.duration} · {workout.difficulty}
          </Text>
        </BaseCard>

        <BaseCard variant="elevated" style={styles.summaryCard}>
          <Metric
            label={isRestDay ? "Enfoque" : "Objetivo"}
            value={workout.metric}
            icon={isRestDay ? "leaf" : "map-marker-distance"}
          />
          <View style={styles.summaryDivider} />
          <Metric label="Zona" value={workout.heartRate} icon="heart-pulse" />
          {!!workout.targetPace && (
            <>
              <View style={styles.summaryDivider} />
              <Metric
                label="Ritmo objetivo"
                value={workout.targetPace}
                icon="speedometer"
              />
            </>
          )}
        </BaseCard>

        {canExecute && (
          <BaseCard variant="glass" style={styles.actionsCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Estado</Text>
              <Text
                style={[
                  styles.statusValue,
                  isCompleted && styles.statusCompleted,
                  isSkipped && styles.statusSkipped,
                ]}
              >
                {isCompleted
                  ? "Completado"
                  : isSkipped
                    ? "Omitido"
                    : workout.status === "rescheduled"
                      ? "Reprogramado"
                      : "Pendiente"}
              </Text>
            </View>

            {workout.status === "pending" ? (
              <View style={styles.actionRow}>
                <Pressable
                  style={styles.completeButton}
                  onPress={() => workoutId && completeWorkout(workoutId)}
                >
                  <MaterialCommunityIcons
                    name="check"
                    size={19}
                    color={theme.colors.onPrimary}
                  />
                  <Text style={styles.completeButtonText}>Completar</Text>
                </Pressable>

                <Pressable
                  style={styles.skipButton}
                  onPress={() => workoutId && skipWorkout(workoutId)}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={19}
                    color={theme.colors.error}
                  />
                  <Text style={styles.skipButtonText}>Omitir</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={styles.resetButton}
                onPress={() => workoutId && resetWorkoutStatus(workoutId)}
              >
                <MaterialCommunityIcons
                  name="restore"
                  size={19}
                  color={theme.colors.text}
                />
                <Text style={styles.resetButtonText}>Revertir estado</Text>
              </Pressable>
            )}
          </BaseCard>
        )}

        <View style={styles.section}>
          <SectionHeader
            title={isRestDay ? "Detalle del día" : "Bloques del entrenamiento"}
          />

          {workout.details && workout.details.length > 0 ? (
            workout.details.map((block, index) => (
              <BaseCard
                key={`${block.type}-${index}`}
                compact
                style={styles.blockCard}
              >
                <View style={styles.blockIcon}>
                  <MaterialCommunityIcons
                    name={getBlockIcon(block.type) as never}
                    size={19}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.blockText}>
                  <Text style={styles.blockLabel}>{block.label}</Text>
                  <Text style={styles.blockDescription}>
                    {block.description}
                  </Text>
                </View>
              </BaseCard>
            ))
          ) : (
            <BaseCard compact style={styles.emptyCard}>
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.emptyText}>
                Este entrenamiento todavía no tiene detalle disponible.
              </Text>
            </BaseCard>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
}) {
  return (
    <View style={styles.metricRow}>
      <View style={styles.metricIcon}>
        <MaterialCommunityIcons
          name={icon}
          size={19}
          color={theme.colors.primary}
        />
      </View>
      <View style={styles.metricText}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={styles.summaryValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  scroll: {
    flex: 1,
  },

  content: {
    padding: theme.spacing.xl,
    paddingBottom: 56,
    gap: theme.spacing.xl,
  },

  hero: {
    padding: theme.spacing.xxl,
    minHeight: 232,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceGlass,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },

  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },

  type: {
    fontSize: theme.typography.label,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primaryMuted,
    marginBottom: 6,
    textTransform: "uppercase",
  },

  title: {
    fontSize: theme.typography.titleLG,
    lineHeight: 32,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
  },

  meta: {
    fontSize: theme.typography.bodyMD,
    color: "rgba(255, 255, 255, 0.68)",
  },

  summaryCard: {
    padding: theme.spacing.xxl,
  },

  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  metricIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  metricText: {
    flex: 1,
    minWidth: 0,
  },

  summaryLabel: {
    fontSize: theme.typography.label,
    color: theme.colors.textTechnical,
    fontWeight: theme.fontWeight.bold,
    textTransform: "uppercase",
    marginBottom: 3,
  },

  summaryValue: {
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.lg,
  },

  actionsCard: {
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  statusLabel: {
    fontSize: theme.typography.label,
    color: theme.colors.textTechnical,
    fontWeight: theme.fontWeight.bold,
    textTransform: "uppercase",
  },

  statusValue: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.bold,
  },

  statusCompleted: {
    color: theme.colors.success,
  },

  statusSkipped: {
    color: theme.colors.error,
  },

  actionRow: {
    flexDirection: "row",
    gap: spacing.md,
  },

  completeButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },

  completeButtonText: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.bold,
  },

  skipButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.errorLight,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 97, 0.28)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },

  skipButtonText: {
    color: theme.colors.error,
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.bold,
  },

  resetButton: {
    minHeight: 52,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceGlass,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },

  resetButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.bold,
  },

  section: {
    gap: theme.spacing.md,
  },

  sectionTitle: {
    fontSize: theme.typography.titleSM,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  blockCard: {
    padding: theme.spacing.xl,
    flexDirection: "row",
    gap: spacing.md,
    borderColor: theme.colors.borderStrong,
  },

  blockIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  blockText: {
    flex: 1,
    minWidth: 0,
  },

  blockLabel: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 6,
  },

  blockDescription: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },

  emptyCard: {
    padding: theme.spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  emptyText: {
    flex: 1,
    fontSize: theme.typography.bodyMD,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
});
