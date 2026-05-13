import { spacing, theme } from "@/src/constants/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
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
      <View style={styles.emptyCard}>
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {activities.map((item) => (
        <View key={item.id} style={styles.card}>
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
              <Text style={styles.badge}>{formatType(item.type)}</Text>
            </View>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.metricsRow}>
            <Text style={styles.metric}>
              {item.km > 0 ? `${item.km} km` : "Sesión"}
            </Text>
            <View style={styles.dot} />
            <Text style={styles.metric}>{item.duration}</Text>
          </View>

          <Text style={styles.subtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        </View>
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
    width: 220,
    backgroundColor: theme.colors.white,
    padding: spacing.lg,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.soft,
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
    borderRadius: 14,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  dateBlock: {
    flex: 1,
    minWidth: 0,
  },

  date: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
  },

  badge: {
    marginTop: 1,
    fontSize: theme.typography.bodySM,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.bold,
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
    color: theme.colors.textSecondary,
  },

  emptyCard: {
    width: 300,
    backgroundColor: theme.colors.white,
    padding: spacing.lg,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
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
