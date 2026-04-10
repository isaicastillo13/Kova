import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { spacing, theme } from "@/src/constants/theme";

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
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Última actividad</Text>

      {activities.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.date}>{item.dateLabel}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      ))}
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

  card: {
    backgroundColor: theme.colors.white,
    padding: spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
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
});