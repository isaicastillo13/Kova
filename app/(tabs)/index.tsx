import HomeHeader from "@/src/components/home/Header";
import HomeInsight from "@/src/components/home/HomeInsight";
import MiniSummary from "@/src/components/home/MiniSummary";
import QuickHistory from "@/src/components/home/QuickHistory";
import TodayWorkout from "@/src/components/home/TodayWorkout";
import WeeklyGoalCard from "@/src/components/home/WeeklyGoalCard";
import WeeklyPlan from "@/src/components/home/WeeklyPlan";
import { BaseCard, ProgressRing, SectionHeader } from "@/src/components/ui/kova";
import {
  calculateStreak,
  getWeekDaysWithLabels,
} from "@/src/components/utils/date";
import WeeklyCalendar from "@/src/components/weeklyCalendar";
import { spacing, theme } from "@/src/constants/theme";
import { useHomeStore } from "@/src/store/home-store";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const {
    weeklyGoal,
    todayWorkout,
    completedDates,
    activities,
    toggleTodayWorkout,
    weekPlan,
    setSelectedWorkout,
  } = useHomeStore();

  const totalMinutes = weekPlan.reduce((acc, item) => {
    if (item.type === "rest") return acc;
    return acc + (item.duration ?? 0);
  }, 0);

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  const formattedTotalTime =
    totalHours > 0
      ? `${totalHours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ""}`
      : `${remainingMinutes}m`;

  const streakDays = calculateStreak(completedDates);
  const completionPercent =
    weeklyGoal.progressTotal > 0
      ? Math.round(
          Math.min(weeklyGoal.progressCurrent / weeklyGoal.progressTotal, 1) *
            100,
        )
      : 0;

  const weekDays = getWeekDaysWithLabels(completedDates);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.screen}>
          <View style={styles.topSection}>
            <HomeHeader name="Isaias" greeting="Buenos días" />

            <BaseCard variant="hero" style={styles.weekHero}>
              <View style={styles.weekHeroContent}>
                <View style={styles.weekHeroText}>
                  <Text style={styles.weekHeroLabel}>Semana activa</Text>
                  <Text style={styles.weekHeroTitle}>
                    {weeklyGoal.progressCurrent}
                    <Text style={styles.weekHeroMuted}>
                      /{weeklyGoal.progressTotal}
                    </Text>{" "}
                    {weeklyGoal.unit}
                  </Text>
                  <Text style={styles.weekHeroCopy}>
                    {weeklyGoal.completedSessions} sesiones completas ·{" "}
                    {completionPercent}% de la carga
                  </Text>
                </View>

                <ProgressRing
                  progress={completionPercent / 100}
                  size={82}
                  strokeWidth={7}
                  trackColor="rgba(255, 255, 255, 0.12)"
                >
                  <Text style={styles.ringValue}>{completionPercent}%</Text>
                </ProgressRing>
              </View>
            </BaseCard>

            <HomeInsight
              todayWorkout={todayWorkout}
              weeklyGoal={weeklyGoal}
              weekPlan={weekPlan}
              activities={activities}
            />

            <View style={styles.section}>
              <TodayWorkout
                type={todayWorkout.type}
                title={todayWorkout.title}
                day={todayWorkout.day}
                duration={todayWorkout.duration}
                difficulty={todayWorkout.difficulty}
                metric={todayWorkout.metric}
                heartRate={todayWorkout.heartRate}
                status={todayWorkout.status}
                onToggleComplete={toggleTodayWorkout}
                onPress={() => router.push("/workout-detail")}
                km={todayWorkout.km}
              />
            </View>

            <MiniSummary
              streakDays={streakDays}
              completedSessions={weeklyGoal.completedSessions}
              totalSessions={weeklyGoal.totalSessions}
              totalTime={formattedTotalTime}
            />

            <View style={styles.section}>
              <SectionHeader title="Tu racha" />
              <WeeklyCalendar days={weekDays} />
            </View>

            <WeeklyGoalCard
              unit={weeklyGoal.unit}
              completedSessions={weeklyGoal.completedSessions}
              totalSessions={weeklyGoal.totalSessions}
              progressCurrent={weeklyGoal.progressCurrent}
              progressTotal={weeklyGoal.progressTotal}
            />
          </View>

          <View style={styles.content}>
            <SectionHeader
              title="Última actividad"
              meta={`${activities.length} registros`}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              <QuickHistory activities={activities} />
            </ScrollView>
          </View>
          <View style={styles.content}>
            <WeeklyPlan
              weekPlan={weekPlan}
              onPressDay={(workout) => {
                setSelectedWorkout(workout);
                router.push("/workout-detail");
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  scrollContent: {
    paddingBottom: 126,
  },

  topSection: {
    backgroundColor: theme.colors.background,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    gap: spacing.lg,
  },

  section: {
    gap: spacing.md,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  sectionTitle: {
    fontSize: theme.typography.titleSM,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  sectionMeta: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.semibold,
  },

  weekHero: {
    padding: theme.spacing.xxl,
    minHeight: 168,
  },

  weekHeroContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.lg,
  },

  weekHeroText: {
    flex: 1,
    minWidth: 0,
  },

  weekHeroLabel: {
    fontSize: theme.typography.label,
    color: theme.colors.primaryMuted,
    fontWeight: theme.fontWeight.bold,
    textTransform: "uppercase",
    marginBottom: spacing.xs,
  },

  weekHeroTitle: {
    fontSize: theme.typography.display,
    lineHeight: 42,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.white,
  },

  weekHeroMuted: {
    color: "rgba(255, 255, 255, 0.46)",
    fontSize: theme.typography.titleLG,
  },

  weekHeroCopy: {
    marginTop: spacing.sm,
    fontSize: theme.typography.bodySM,
    color: theme.colors.textTechnical,
    fontWeight: theme.fontWeight.semibold,
  },

  ringValue: {
    color: theme.colors.white,
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.bold,
  },
});
