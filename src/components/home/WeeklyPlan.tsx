import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Badge, IntensityChip, SectionHeader } from "@/src/components/ui/kova";
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

function getStatusMeta(item: DayWorkout) {
  if (item.type === "rest") {
    return { label: "Descanso", tone: "info" as const };
  }

  if (item.status === "completed") {
    return { label: "Completada", tone: "success" as const };
  }

  if (item.status === "skipped") {
    return { label: "Omitida", tone: "error" as const };
  }

  if (item.status === "rescheduled") {
    return { label: "Reprogramada", tone: "warning" as const };
  }

  return { label: "Pendiente", tone: "neutral" as const };
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
          const statusMeta = getStatusMeta(item);
          const metric = isRest
            ? "Sin carga"
            : item.type === "running" || item.type === "mixed"
              ? `${item.km ?? 0} km`
              : `${item.duration ?? 0} min`;

          return (
            <Pressable
              key={item.id}
              style={[
                styles.card,
                isToday && styles.todayCard,
                item.status === "completed" && styles.completedCard,
                item.status === "skipped" && styles.skippedCard,
              ]}
              onPress={() => onPressDay?.(item)}
            >
              <View
                style={[
                  styles.rail,
                  {
                    backgroundColor:
                      item.status === "completed"
                        ? theme.colors.success
                        : item.status === "skipped"
                          ? theme.colors.error
                          : typeMeta.color,
                  },
                ]}
              />

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
                <View style={styles.badgeStack}>
                  <Badge label={statusMeta.label} tone={statusMeta.tone} />
                  {!isRest && item.status === "pending" && (
                    <IntensityChip intensity={difficulty} />
                  )}
                </View>
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
    backgroundColor: theme.colors.surfaceGlass,
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
    backgroundColor: theme.colors.surfaceGlassStrong,
  },

  completedCard: {
    borderColor: "rgba(53, 208, 127, 0.34)",
  },

  skippedCard: {
    borderColor: "rgba(255, 107, 97, 0.28)",
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
    borderRadius: theme.radius.md,
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
    fontSize: theme.typography.label,
    color: theme.colors.textTechnical,
    fontWeight: theme.fontWeight.bold,
    textTransform: "uppercase",
  },

  todayBadge: {
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },

  todayBadgeText: {
    fontSize: theme.typography.label,
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
    fontSize: theme.typography.label,
    color: theme.colors.textTechnical,
    textTransform: "uppercase",
  },

  right: {
    alignItems: "flex-end",
    gap: spacing.sm,
  },

  badgeStack: {
    alignItems: "flex-end",
    gap: spacing.xs,
  },

  metric: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.bold,
  },

});
