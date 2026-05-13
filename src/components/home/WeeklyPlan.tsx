import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { spacing, theme } from "@/src/constants/theme";
import type { DayWorkout } from "@/src/types/training";

type Props = {
  weekPlan: DayWorkout[];
  onPressDay?: (workout: DayWorkout) => void;
};

const dayLabels = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

function getTodayIndex(): number {
  const jsDay = new Date().getDay(); // domingo = 0
  return jsDay === 0 ? 6 : jsDay - 1; // lunes = 0
}

function getSessionDifficulty(item: DayWorkout): "baja" | "media" | "alta" | "rest" {
  if (item.type === "rest") return "rest";

  const title = item.title.toLowerCase();

  if (
    title.includes("intervalos") ||
    title.includes("tempo")
  ) {
    return "alta";
  }

  if (
    title.includes("fondo") ||
    item.type === "strength" ||
    item.type === "mixed"
  ) {
    return "media";
  }

  return "baja";
}

export default function WeeklyPlan({ weekPlan, onPressDay }: Props) {
  const todayIndex = getTodayIndex();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Plan semanal</Text>

      <View style={styles.list}>
        {weekPlan.map((item) => {
          const isRest = item.type === "rest";
          const isToday = item.day === todayIndex;
          const difficulty = getSessionDifficulty(item);

          return (
            <Pressable
              key={item.day}
              style={[
                styles.card,
                isToday && styles.todayCard,
                isRest && styles.restCard,
              ]}
              onPress={() => onPressDay?.(item)}
            >
              <View style={styles.left}>
                <View style={styles.dayRow}>
                  <Text style={styles.day}>{dayLabels[item.day]}</Text>
                  {isToday && <Text style={styles.todayBadge}>Hoy</Text>}
                </View>

                <Text style={styles.title}>{item.title}</Text>
              </View>

              <View style={styles.right}>
                <Text
                  style={[
                    styles.type,
                    isRest && styles.restType,
                    item.type === "running" && styles.runningType,
                    item.type === "strength" && styles.strengthType,
                    item.type === "swimming" && styles.swimmingType,
                    item.type === "mixed" && styles.mixedType,
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

                {!isRest && (
                  <View
                    style={[
                      styles.difficultyBadge,
                      difficulty === "baja" && styles.badgeLow,
                      difficulty === "media" && styles.badgeMedium,
                      difficulty === "alta" && styles.badgeHigh,
                    ]}
                  >
                    <Text
                      style={[
                        styles.difficultyText,
                        difficulty === "baja" && styles.badgeLowText,
                        difficulty === "media" && styles.badgeMediumText,
                        difficulty === "alta" && styles.badgeHighText,
                      ]}
                    >
                      {difficulty}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
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

  todayCard: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },

  restCard: {
    backgroundColor: "#FAFAFA",
  },

  left: {
    flex: 1,
    paddingRight: spacing.md,
  },

  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: 4,
  },

  day: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
  },

  todayBadge: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold,
  },

  title: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },

  right: {
    alignItems: "flex-end",
    gap: 4,
  },

  type: {
    fontSize: theme.typography.bodySM,
    fontWeight: theme.fontWeight.semibold,
    textTransform: "capitalize",
  },

  runningType: {
    color: theme.colors.primary,
  },

  strengthType: {
    color: "#7C3AED",
  },

  swimmingType: {
    color: "#2563EB",
  },

  mixedType: {
    color: "#D97706",
  },

  restType: {
    color: theme.colors.textSecondary,
  },

  meta: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
  },

  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 2,
  },

  difficultyText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  badgeLow: {
    backgroundColor: "#ECFDF5",
  },

  badgeLowText: {
    color: "#059669",
  },

  badgeMedium: {
    backgroundColor: "#FFFBEB",
  },

  badgeMediumText: {
    color: "#D97706",
  },

  badgeHigh: {
    backgroundColor: "#FEF2F2",
  },

  badgeHighText: {
    color: "#DC2626",
  },
});
