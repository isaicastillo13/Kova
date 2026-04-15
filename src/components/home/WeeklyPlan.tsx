import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { spacing, theme } from "@/src/constants/theme";

type DayWorkoutType = "running" | "swimming" | "strength" | "mixed" | "rest";

type DayWorkout = {
  day: number;
  type: DayWorkoutType;
  title: string;
  km?: number;
  duration?: number;
};

type Props = {
  weekPlan: DayWorkout[];
};

const dayLabels = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export default function WeeklyPlan({ weekPlan }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Plan semanal</Text>

      <View style={styles.list}>
        {weekPlan.map((item) => {
          const isRest = item.type === "rest";

          return (
            <View key={item.day} style={styles.card}>
              <View style={styles.left}>
                <Text style={styles.day}>{dayLabels[item.day]}</Text>
                <Text style={styles.title}>{item.title}</Text>
              </View>

              <View style={styles.right}>
                <Text
                  style={[
                    styles.type,
                    isRest && styles.restType,
                  ]}
                >
                  {isRest ? "Descanso" : item.type}
                </Text>

                <Text style={styles.meta}>
                  {isRest
                    ? "—"
                    : item.type === "running" || item.type === "mixed"
                    ? `${item.km ?? 0} km`
                    : `${item.duration ?? 0} min`}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },

  sectionTitle: {
    fontSize: theme.typography.titleSM,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: spacing.sm,
  },

  list: {
    gap: spacing.sm,
  },

  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...theme.shadows.card,
  },

  left: {
    flex: 1,
    paddingRight: spacing.md,
  },

  day: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },

  title: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },

  right: {
    alignItems: "flex-end",
  },

  type: {
    fontSize: theme.typography.bodySM,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    textTransform: "capitalize",
    marginBottom: 4,
  },

  restType: {
    color: theme.colors.textSecondary,
  },

  meta: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
  },
});