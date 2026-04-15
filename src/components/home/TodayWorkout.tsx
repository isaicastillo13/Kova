import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { spacing, theme } from "@/src/constants/theme";

type Status = "pending" | "completed";

type Props = {
  type: string;
  title: string;
  day: string;
  duration: string;
  difficulty: string;
  metric: string;
  heartRate: string;
  status: Status;
  onToggleComplete: () => void;
  onPress: () => void;
   km: number;
};

export default function TodayWorkout({
  type,
  title,
  day,
  duration,
  difficulty,
  metric,
  heartRate,
  status,
  onToggleComplete,
  onPress,
  km,
}: Props) {
  const isCompleted = status === "completed";
  const isRestDay = type.toLowerCase() === "descanso" || km === 0;

  return (
  <Pressable style={styles.container} onPress={onPress}>
    <View style={styles.header}>
      <Text style={styles.type}>{type}</Text>
    </View>

    <View style={styles.block}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.meta}>
        {day} · {duration} · {difficulty}
      </Text>
    </View>

    <View style={styles.block}>
      <Text style={styles.metric}>{metric}</Text>
      <Text style={styles.meta}>{heartRate}</Text>
    </View>

    {isRestDay ? (
      <View style={styles.restBadgeContainer}>
        <Text style={styles.restBadgeText}>Día de recuperación</Text>
      </View>
    ) : (
      <Pressable style={styles.checkboxContainer} onPress={onToggleComplete}>
        <View
          style={[
            styles.checkbox,
            isCompleted && styles.checkboxChecked,
          ]}
        >
          {isCompleted && (
            <AntDesign name="check" size={14} color="white" />
          )}
        </View>

        <Text
          style={[
            styles.checkboxText,
            isCompleted && styles.checkboxTextCompleted,
          ]}
        >
          {isCompleted ? "Completado" : "Marcar como completado"}
        </Text>
      </Pressable>
    )}
  </Pressable>
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  type: {
    fontSize: theme.typography.titleSM,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  block: {
    marginBottom: spacing.md,
  },

  title: {
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 4,
  },

  meta: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
  },

  metric: {
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },

  checkboxChecked: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },

  checkboxText: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
  },

  checkboxTextCompleted: {
    color: theme.colors.success,
    fontWeight: theme.fontWeight.semibold,
  },
  restBadgeContainer: {
  marginTop: spacing.md,
  paddingTop: spacing.sm,
  borderTopWidth: 1,
  borderTopColor: theme.colors.border,
},

restBadgeText: {
  fontSize: theme.typography.bodySM,
  color: theme.colors.textSecondary,
  fontWeight: theme.fontWeight.semibold,
},
});