import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { theme, spacing } from "@/src/constants/theme";

type Props = {
  streakDays: number;
  completedSessions: number;
  totalSessions: number;
  totalTime: string;
};

export default function MiniSummary({
  streakDays,
  completedSessions,
  totalSessions,
  totalTime,
}: Props) {
  return (
    <View style={styles.container}>
      <SummaryItem icon="fire" value={String(streakDays)} label="Racha" />
      <View style={styles.divider} />
      <SummaryItem
        icon="calendar-check"
        value={`${completedSessions}/${totalSessions}`}
        label="Sesiones"
      />
      <View style={styles.divider} />
      <SummaryItem icon="timer-outline" value={totalTime} label="Tiempo" />
    </View>
  );
}

function SummaryItem({
  icon,
  value,
  label,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  value: string;
  label: string;
}) {
  return (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <MaterialCommunityIcons
          name={icon}
          size={17}
          color={theme.colors.primary}
        />
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.soft,
  },

  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0,
  },

  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    minWidth: 0,
  },

  value: {
    flexShrink: 1,
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  label: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },

  divider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.border,
    marginHorizontal: spacing.sm,
  },
});
