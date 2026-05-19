import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { IntensityChip, SectionHeader } from "@/src/components/ui/kova";
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
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

function getSessionDifficulty(
  item: DayWorkout,
): "baja" | "media" | "alta" | "rest" {
  if (item.type === "rest") return "rest";

  const title = item.title.toLowerCase();

  if (title.includes("intervalos") || title.includes("tempo")) {
    return "alta";
  }

  if (title.includes("fondo") || item.type === "strength" || item.type === "mixed") {
    return "media";
  }

  return "baja";
}

function getTypeMeta(item: DayWorkout) {
  switch (item.type) {
    case "strength":
      return {
        label: "Fuerza",
        icon: "dumbbell",
        color: theme.colors.purple,
        bg: theme.colors.purpleLight,
      };
    case "swimming":
      return {
        label: "Natación",
        icon: "swim",
        color: theme.colors.info,
        bg: theme.colors.infoLight,
      };
    case "mixed":
      return {
        label: "Mixto",
        icon: "lightning-bolt",
        color: theme.colors.warning,
        bg: theme.colors.warningLight,
      };
    case "rest":
      return {
        label: "Descanso",
        icon: "sleep",
        color: theme.colors.textSecondary,
        bg: theme.colors.surfaceAlt,
      };
    default:
      return {
        label: "Running",
        icon: "run-fast",
        color: theme.colors.primary,
        bg: theme.colors.primaryLight,
      };
  }
}

export default function WeeklyPlan({ weekPlan, onPressDay }: Props) {
  const todayIndex = getTodayIndex();

  return (
    <View style={styles.container}>
      <SectionHeader title="Plan semanal" meta={`${weekPlan.length} días`} />

      <View style={styles.list}>
        {weekPlan.map((item) => {
          const isRest = item.type === "rest";
          const isToday = item.day === todayIndex;
          const difficulty = getSessionDifficulty(item);
          const typeMeta = getTypeMeta(item);
          const metric = isRest
            ? "Sin carga"
            : item.type === "running" || item.type === "mixed"
              ? `${item.km ?? 0} km`
              : `${item.duration ?? 0} min`;

          return (
            <Pressable
              key={item.day}
              style={[styles.card, isToday && styles.todayCard]}
              onPress={() => onPressDay?.(item)}
            >
              <View style={[styles.rail, { backgroundColor: typeMeta.color }]} />

              <View style={[styles.iconWrap, { backgroundColor: typeMeta.bg }]}>
                <MaterialCommunityIcons
                  name={typeMeta.icon as never}
                  size={21}
                  color={typeMeta.color}
                />
              </View>

              <View style={styles.main}>
                <View style={styles.dayRow}>
                  <Text style={styles.day}>{dayLabels[item.day]}</Text>
                  {isToday && (
                    <View style={styles.todayBadge}>
                      <Text style={styles.todayBadgeText}>Hoy</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.title} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.type}>{typeMeta.label}</Text>
              </View>

              <View style={styles.right}>
                <Text style={styles.metric}>{metric}</Text>
                <IntensityChip
                  intensity={difficulty}
                  label={isRest ? "Recuperación" : undefined}
                />
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
    gap: spacing.md,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: theme.typography.titleSM,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  sectionMeta: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.semibold,
  },

  list: {
    gap: spacing.sm,
  },

  card: {
    minHeight: 90,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    paddingVertical: theme.spacing.lg,
    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    ...theme.shadows.soft,
  },

  todayCard: {
    borderColor: theme.colors.borderAccent,
    backgroundColor: theme.colors.primarySoft,
  },

  rail: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },

  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  main: {
    flex: 1,
    paddingRight: spacing.md,
    minWidth: 0,
  },

  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: 3,
  },

  day: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },

  todayBadge: {
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },

  todayBadgeText: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.onPrimary,
    fontWeight: theme.fontWeight.bold,
  },

  title: {
    fontSize: theme.typography.bodyMD,
    lineHeight: 20,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  type: {
    marginTop: 3,
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
  },

  right: {
    alignItems: "flex-end",
    gap: spacing.sm,
  },

  metric: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.bold,
  },

});
