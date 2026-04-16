import { theme } from "@/src/constants/theme";
import { useHomeStore } from "@/src/store/home-store";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function WorkoutDetailScreen() {
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
        difficulty: selectedWorkout.type === "rest" ? "Recuperación" : "Media",
        metric:
          selectedWorkout.type === "running" || selectedWorkout.type === "mixed"
            ? `${selectedWorkout.km ?? 0} km`
            : selectedWorkout.type === "rest"
              ? "Sin carga"
              : "Sesión",
        heartRate:
          selectedWorkout.type === "rest" ? "Recuperación" : "FC 140-160",
        km: selectedWorkout.km ?? 0,
        details: selectedWorkout.details ?? [],
      }
    : todayWorkout;

  const isRestDay =
    workout.type.toLowerCase() === "descanso" || workout.km === 0;

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.type}>{workout.type}</Text>
          <Text style={styles.title}>{workout.title}</Text>
          <Text style={styles.meta}>
            {workout.day} · {workout.duration} · {workout.difficulty}
          </Text>
        </View>

        {/* RESUMEN */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            {isRestDay ? "Enfoque del día" : "Métrica"}
          </Text>
          <Text style={styles.summaryValue}>{workout.metric}</Text>

          <View style={styles.summaryDivider} />

          <Text style={styles.summaryLabel}>Rango objetivo</Text>
          <Text style={styles.summaryValue}>{workout.heartRate}</Text>
        </View>

        {/* BLOQUES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isRestDay ? "Detalle del día" : "Detalle del entrenamiento"}
          </Text>

          {workout.details && workout.details.length > 0 ? (
            workout.details.map((block, index) => (
              <View key={`${block.type}-${index}`} style={styles.blockCard}>
                <Text style={styles.blockLabel}>{block.label}</Text>
                <Text style={styles.blockDescription}>{block.description}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                Este entrenamiento todavía no tiene detalle disponible.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaProvider>
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
    paddingBottom: 40,
  },

  header: {
    marginBottom: theme.spacing.xl,
  },

  type: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    marginBottom: 6,
    textTransform: "capitalize",
  },

  title: {
    fontSize: theme.typography.titleLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  meta: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.textSecondary,
  },

  summaryCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
    marginBottom: theme.spacing.xl,
  },

  summaryLabel: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },

  summaryValue: {
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.semibold,
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
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
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
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  emptyText: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
});
