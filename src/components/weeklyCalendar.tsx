import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { theme } from '@/src/constants/theme';

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
          
          <Text style={styles.dayLabel}>{day.dayLabel}</Text>

          {day.isCompleted && (
            <View style={styles.checkBadge}>
              <AntDesign name="check" size={10} color={theme.colors.white} />
            </View>
          )}

          <View
            style={[
              styles.dayCircle,
              day.isToday ? styles.todayCircle : styles.defaultCircle,
            ]}
          >
            <Text
              style={[
                styles.dayText,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },

  dayWrapper: {
    alignItems: 'center',
    position: 'relative',
  },

  dayLabel: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },

  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    borderWidth: 2,
  },

  defaultCircle: {
    borderColor: '#D1D5DB',
  },

  todayCircle: {
    borderColor: theme.colors.primary,
  },

  dayText: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },

  todayText: {
    color: theme.colors.primary,
  },

  checkBadge: {
    position: 'absolute',
    top: 18,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
});
