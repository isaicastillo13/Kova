import { spacing, theme } from "@/src/constants/theme";
import { Badge, BaseCard } from "@/src/components/ui/kova";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Activity } from "@/src/types/training";

type Props = {
  activities: Activity[];
};

function formatType(type: string) {
  if (type.toLowerCase() === "running") return "Running";
  if (type.toLowerCase() === "swimming") return "Natación";
  if (type.toLowerCase() === "strength") return "Fuerza";
  if (type.toLowerCase() === "mixed") return "Mixto";
  return type;
}

function getActivityIcon(type: string) {
  if (type.toLowerCase() === "strength") return "dumbbell";
  if (type.toLowerCase() === "swimming") return "swim";
  if (type.toLowerCase() === "mixed") return "lightning-bolt";
  return "run";
}

export default function QuickHistory({ activities }: Props) {
  if (!activities.length) {
    return (
      <BaseCard compact style={styles.emptyCard}>
        <View style={styles.emptyIcon}>
          <MaterialCommunityIcons
            name="run"
            size={24}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.emptyTextBlock}>
          <Text style={styles.emptyTitle}>Sin actividades registradas</Text>
          <Text style={styles.emptySubtitle}>
            Completa tu primer entrenamiento para empezar a construir historial.
          </Text>
        </View>
      </BaseCard>
    );
  }

  return (
    <View style={styles.container}>
      {activities.map((item) => (
        <BaseCard key={item.id} compact style={styles.card}>
          <View style={styles.topRow}>
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons
                name={getActivityIcon(item.type) as never}
                size={21}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.dateBlock}>
              <Text style={styles.date}>{item.dateLabel}</Text>
              <Badge
                label={item.status === "skipped" ? "Omitida" : formatType(item.type)}
                tone={item.status === "skipped" ? "error" : "primary"}
              />
            </View>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.metricsRow}>
            <Text style={styles.metric}>
              {item.completedKm > 0 ? `${item.completedKm} km` : "Sin carga"}
            </Text>
            <View style={styles.dot} />
            <Text style={styles.metric}>{item.duration}</Text>
          </View>

          <Text style={styles.subtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        </BaseCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing.md,
  },

  card: {
    width: 226,
    padding: spacing.lg,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },

  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  dateBlock: {
    flex: 1,
    minWidth: 0,
  },

  date: {
    fontSize: theme.typography.label,
    color: theme.colors.textTechnical,
    fontWeight: theme.fontWeight.bold,
    textTransform: "uppercase",
  },

  title: {
    minHeight: 40,
    fontSize: theme.typography.bodyLG,
    lineHeight: 20,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: spacing.sm,
  },

  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },

  metric: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.semibold,
  },

  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
  },

  subtitle: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textTechnical,
  },

  emptyCard: {
    width: 300,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTextBlock: {
    flex: 1,
  },

  emptyTitle: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },

  emptySubtitle: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    lineHeight: 19,
  },
});
