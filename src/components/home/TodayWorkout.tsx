import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { spacing, theme } from "@/src/constants/theme";

type Props = {
  type: string;
  title: string;
  day: string;
  duration: string;
  difficulty: string;
  metric: string;
  heartRate: string;
};

export default function TodayWorkout({
  type,
  title,
  day,
  duration,
  difficulty,
  metric,
  heartRate,
}: Props) {
  const [isCompleted, setIsCompleted] = useState(false);

  const toggleCompleted = () => {
    setIsCompleted(!isCompleted);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.type}>{type}</Text>
      </View>

      {/* Main info */}
      <View style={styles.block}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>
          {day} · {duration} · {difficulty}
        </Text>
      </View>

      {/* Metrics */}
      <View style={styles.block}>
        <Text style={styles.metric}>{metric}</Text>
        <Text style={styles.meta}>{heartRate}</Text>
      </View>

      {/* ✅ CHECKBOX */}
      <Pressable
        style={[
          styles.checkboxContainer,
          isCompleted && styles.checkboxCompleted,
        ]}
        onPress={toggleCompleted}
      >
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

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  badgeText: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
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

checkboxCompleted: {
  opacity: 0.9,
},

checkbox: {
  width: 22,
  height: 22,
  borderRadius: 99,
  borderWidth: 2,
  borderColor: theme.colors.border,
  alignItems: "center",
  justifyContent: "center",
  marginRight: spacing.sm,
},

checkboxChecked: {
  backgroundColor: "#22C55E", // verde éxito 🔥
  borderColor: "#22C55E",
},

checkboxText: {
  fontSize: theme.typography.bodySM,
  color: theme.colors.textSecondary,
},

checkboxTextCompleted: {
  color: "#22C55E",
  fontWeight: theme.fontWeight.semibold,
},
});