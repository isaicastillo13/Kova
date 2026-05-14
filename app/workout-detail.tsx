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
        details: selectedWorkout.details ?? [],
      }
    : todayWorkout;

  const isRestDay =
    workout.type.toLowerCase() === "descanso" || workout.km === 0;
  const iconName = getWorkoutIcon(workout.type, workout.km);

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
    padding: theme.spacing.xxl,
    paddingBottom: 48,
    gap: theme.spacing.xl,
  },

  hero: {
    padding: theme.spacing.xxl,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },

  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },

  type: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primaryMuted,
    marginBottom: 6,
    textTransform: "capitalize",
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
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
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
  },

  blockIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
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
