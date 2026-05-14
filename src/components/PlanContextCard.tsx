import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { spacing, theme } from "@/src/constants/theme";

type Props = {
  goal: string;
  raceDistance: string;
  daysPerWeek: number;
  duration: string;
  level: string;
  currentWeeklyKm: string;
  longRunKm: string;
  easyPace: string;
  injuryStatus: string;
};

export default function PlanContextCard({
  goal,
  raceDistance,
  daysPerWeek,
  duration,
  level,
  currentWeeklyKm,
  longRunKm,
  easyPace,
  injuryStatus,
}: Props) {
  const metrics = [
    { label: "Objetivo", value: goal, icon: "target" },
    { label: "Distancia", value: raceDistance, icon: "flag-checkered" },
    { label: "Frecuencia", value: `${daysPerWeek} días/sem`, icon: "calendar-week" },
    { label: "Sesión", value: duration, icon: "timer-outline" },
    { label: "Nivel", value: level, icon: "chart-timeline-variant" },
    { label: "Volumen", value: currentWeeklyKm, icon: "map-marker-distance" },
    { label: "Fondo", value: longRunKm, icon: "routes" },
    { label: "Ritmo", value: easyPace, icon: "speedometer" },
  ] as const;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Perfil de entrenamiento</Text>
          <Text style={styles.title}>Tu plan actual</Text>
        </View>
        <View style={styles.healthPill}>
          <MaterialCommunityIcons
            name="heart-pulse"
            size={16}
            color={theme.colors.primary}
          />
          <Text style={styles.healthText}>{injuryStatus}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {metrics.map((item) => (
          <View key={item.label} style={styles.item}>
            <MaterialCommunityIcons
              name={item.icon}
              size={18}
              color={theme.colors.primary}
            />
            <View style={styles.itemText}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value} numberOfLines={1}>
                {item.value}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.xxl,
    marginTop: spacing.md,
    marginBottom: 40,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xxl,
    padding: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },

  kicker: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold,
    marginBottom: 3,
  },

  title: {
    fontSize: theme.typography.titleSM,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  healthPill: {
    maxWidth: 150,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },

  healthText: {
    flexShrink: 1,
    fontSize: theme.typography.bodySM,
    color: theme.colors.primaryDark,
    fontWeight: theme.fontWeight.bold,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },

  item: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: spacing.md,
  },

  itemText: {
    flex: 1,
    minWidth: 0,
  },

  label: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },

  value: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
});
