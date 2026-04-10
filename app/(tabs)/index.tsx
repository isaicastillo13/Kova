import HomeHeader from "@/src/components/home/Header";
import MiniSummary from "@/src/components/home/MiniSummary";
import QuickHistory from "@/src/components/home/QuickHistory";
import TodayWorkout from "@/src/components/home/TodayWorkout";
import WeeklyGoalCard from "@/src/components/home/WeeklyGoalCard";
import { getWeekDaysWithLabels } from "@/src/components/utils/date";
import WeeklyCalendar from "@/src/components/weeklyCalendar";
import { spacing, theme } from "@/src/constants/theme";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type Props = {
  name?: string;
  date?: string;
  imageUrl?: string;
  onSearchPress?: () => void;
};

const activities = [
  {
    id: "1",
    dateLabel: "Ayer",
    title: "Rodaje suave",
    subtitle: "5 km · 30 min",
  },
  {
    id: "2",
    dateLabel: "Hace 2 días",
    title: "Intervalos",
    subtitle: "6x400 · FC 160-175",
  },
];

export default function Header({
  name = "Isaias",
  date = "02/04/2026",
  imageUrl,
}: Props) {
  const completedDays = [0, 1, 3];
  const weekDays = getWeekDaysWithLabels(completedDays);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.screen}>
        {/* TOP SECTION */}
        <View style={styles.topSection}>
          <HomeHeader name="Isaias" greeting="Buenos días" />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tu racha</Text>
            <View style={styles.containerCalendar}>
              <WeeklyCalendar days={weekDays} />
            </View>
          </View>

          {/* RESUMEN */}
          <WeeklyGoalCard
            distance={41}
            unit="km"
            completedSessions={1}
            totalSessions={7}
            progressCurrent={2}
            progressTotal={41}
          />

          <MiniSummary
            streakDays={4}
            completedSessions={3}
            totalSessions={7}
            totalTime="2h"
          />

          {/* RACHA */}
        </View>
        {/* CONTENT */}
        <View style={styles.content}>
          <TodayWorkout
            type="Intervalos"
            title="Rodaje de velocidad"
            day="Martes"
            duration="55 min"
            difficulty="Media"
            metric="6x400"
            heartRate="FC 160 - 175"
          />
        </View>
        <View style={styles.content}>
          <QuickHistory activities={activities} />;
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F7F8",
  },

  topSection: {
    backgroundColor: theme.colors.white,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xxl,
    gap: spacing.lg,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    gap: spacing.lg,
    
  },

  section: {
    gap: spacing.sm,
  },

  sectionTitle: {
    fontSize: theme.typography.titleSM,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  sectionTitleDark: {
    fontSize: theme.typography.titleSM,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },

  appIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  appIcon: {
    width: 26,
    height: 26,
  },

  textContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },

  greeting: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },

  userName: {
    fontSize: theme.typography.titleLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  summaryCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    ...theme.shadows.card,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  summaryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  summaryIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryIcon: {
    width: 24,
    height: 24,
  },

  kmContainer: {
    alignItems: "center",
  },

  cardTitle: {
    fontSize: theme.typography.titleMD,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 0,
    lineHeight: 34,
  },

  cardSubtitle: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    marginTop: 0,
    lineHeight: 14,
  },

  label: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: spacing.sm,
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  progressWrapper: {
    flex: 1,
  },

  trophyWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  containerCalendar: {
    paddingTop: theme.spacing.sm,
    backgroundColor: "transparent",
  },

  workoutCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },

  workoutType: {
    fontSize: theme.typography.titleSM,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: spacing.md,
  },

  workoutBlock: {
    marginBottom: spacing.md,
  },

  workoutTitle: {
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 4,
  },

  workoutMeta: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
  },

  workoutMetric: {
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },

  workoutDone: {
    fontSize: theme.typography.bodySM,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    marginTop: 4,
  },
});
