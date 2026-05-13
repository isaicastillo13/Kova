import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { theme } from "@/src/constants/theme";

type CalendarDay = {
  dayNumber: number;
  isToday: boolean;
  isCompleted?: boolean;
  dayLabel: string;
};

type WeeklyCalendarProps = {
  days: CalendarDay[];
};

export default function WeeklyCalendar({ days }: WeeklyCalendarProps) {
  return (
    <View style={styles.container}>
      {days.map((day, index) => (
        <View key={index} style={styles.dayWrapper}>
          <Text style={[styles.dayLabel, day.isToday && styles.todayLabel]}>
            {day.dayLabel}
          </Text>

          {day.isCompleted && (
            <View style={styles.checkBadge}>
              <AntDesign name="check" size={10} color={theme.colors.white} />
            </View>
          )}

          <View
            style={[
              styles.dayCircle,
              styles.defaultCircle,
              day.isCompleted && styles.completedCircle,
              day.isToday && styles.todayCircle,
            ]}
          >
            <Text
              style={[
                styles.dayText,
                day.isCompleted && styles.completedText,
                day.isToday && styles.todayText,
              ]}
            >
              {day.dayNumber}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },

  dayWrapper: {
    alignItems: "center",
    position: "relative",
    flex: 1,
  },

  dayLabel: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },

  todayLabel: {
    color: theme.colors.primaryDark,
    fontWeight: theme.fontWeight.bold,
  },

  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.white,
    borderWidth: 1,
  },

  defaultCircle: {
    borderColor: theme.colors.border,
  },

  completedCircle: {
    backgroundColor: theme.colors.charcoal,
    borderColor: theme.colors.charcoal,
  },

  todayCircle: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.primaryLight,
  },

  dayText: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },

  completedText: {
    color: theme.colors.white,
  },

  todayText: {
    color: theme.colors.primaryDark,
  },

  checkBadge: {
    position: "absolute",
    top: 19,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
});
