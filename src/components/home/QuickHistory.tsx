import { spacing, theme } from "@/src/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Activity = {
  id: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  type: string;
  km: number;
  duration: string;
};

type Props = {
  activities: Activity[];
};

function formatType(type: string) {
  if (type.toLowerCase() === "running") return "Running";
  if (type.toLowerCase() === "swimming") return "Swimming";
  if (type.toLowerCase() === "strength") return "Fuerza";
  if (type.toLowerCase() === "mixed") return "Mixto";
  return type;
}

export default function QuickHistory({ activities }: Props) {
  if (!activities.length) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyTitle}>Aún no tienes actividades</Text>
        <Text style={styles.emptySubtitle}>
          Completa tu primer entrenamiento para verlo aquí.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentHistory}>
        {activities.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.topRow}>
              <Text style={styles.date}>{item.dateLabel}</Text>
              <Text style={styles.badge}>{formatType(item.type)}</Text>
            </View>

            <Text style={styles.title}>{item.title}</Text>

            <View style={styles.metricsRow}>
              <Text style={styles.metric}>
                {item.km > 0 ? `${item.km} km` : "Sesión"}
              </Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.metric}>{item.duration}</Text>
            </View>

            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },

  contentHistory: {
    flexDirection: "row",
    gap: spacing.sm,
  },

  card: {
    minWidth: 200,
    backgroundColor: theme.colors.white,
    padding: spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },

  date: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
  },

  badge: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },

  title: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },

  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },

  metric: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
  },

  dot: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
  },

  subtitle: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
  },

  emptyCard: {
    backgroundColor: theme.colors.white,
    padding: spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  emptyTitle: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 4,
  },

  emptySubtitle: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});
