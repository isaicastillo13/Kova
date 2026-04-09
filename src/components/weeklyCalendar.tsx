import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { theme } from '@/src/constants/theme';

type CalendarDay = {
  dayNumber: number;
  isToday: boolean;
  isCompleted?: boolean;
};

type WeeklyCalendarProps = {
  days: CalendarDay[];
};

export default function WeeklyCalendar({ days }: WeeklyCalendarProps) {
  return (
    <View style={styles.container}>
      {days.map((day, index) => (
        <View key={`${day.dayNumber}-${index}`} style={styles.dayWrapper}>
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

const CIRCLE_SIZE = 36;
const BADGE_SIZE = 18;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  dayWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
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
    top: -6,
    right: -2,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
});