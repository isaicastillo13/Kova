import { spacing, theme } from "@/src/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Activity = {
  id: string;
  title: string;
  subtitle: string;
  dateLabel: string;
};

type Props = {
  activities: Activity[];
};

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
            <Text style={styles.date}>{item.dateLabel}</Text>
            <Text style={styles.title}>{item.title}</Text>
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
    minWidth: 180,
    backgroundColor: theme.colors.white,
    padding: spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  date: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },

  title: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },

  subtitle: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    marginTop: 2,
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