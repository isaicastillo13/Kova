import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { spacing, theme } from "@/src/constants/theme";

type Props = {
  goal: string;
  trainingType: string;
  daysPerWeek: number;
  duration: string;
  level: string;
};

export default function PlanContextCard({
  goal,
  trainingType,
  daysPerWeek,
  duration,
  level,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu plan</Text>

      <View style={styles.grid}>
        <View style={styles.item}>
          <Text style={styles.label}>Objetivo</Text>
          <Text style={styles.value}>{goal}</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Tipo</Text>
          <Text style={styles.value}>{trainingType}</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Frecuencia</Text>
          <Text style={styles.value}>{daysPerWeek} días/sem</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Duración</Text>
          <Text style={styles.value}>{duration}</Text>
        </View>

        <View style={[styles.item, styles.fullWidth]}>
          <Text style={styles.label}>Nivel</Text>
          <Text style={styles.value}>{level}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },

  title: {
    fontSize: theme.typography.titleSM,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: spacing.lg,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },

  item: {
    width: "47%",
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    padding: spacing.md,
  },

  fullWidth: {
    width: "100%",
  },

  label: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },

  value: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
});