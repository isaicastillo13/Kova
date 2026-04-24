import HomeHeader from "@/src/components/home/Header";
import MiniSummary from "@/src/components/home/MiniSummary";
import QuickHistory from "@/src/components/home/QuickHistory";
import TodayWorkout from "@/src/components/home/TodayWorkout";
import WeeklyGoalCard from "@/src/components/home/WeeklyGoalCard";
import WeeklyPlan from "@/src/components/home/WeeklyPlan";
import PlanContextCard from "@/src/components/PlanContextCard";
import { getWeekDaysWithLabels, calculateStreak } from "@/src/components/utils/date";
import WeeklyCalendar from "@/src/components/weeklyCalendar";
import { spacing, theme } from "@/src/constants/theme";
import { useHomeStore } from "@/src/store/home-store";
import { useOnboardingStore } from "@/src/store/onboarding-store";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HomeScreen() {
  const {
    weeklyGoal,
    todayWorkout,
    completedDays,
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

  const weekDays = getWeekDaysWithLabels(completedDays);
  const router = useRouter();
  const { goal, level, days, duration, trainingType } = useOnboardingStore();
  const formattedGoal =
    goal === "resistencia"
      ? "Resistencia"
      : goal === "rendimiento"
        ? "Rendimiento"
        : goal === "mantenerme"
          ? "Mantenerme activo"
          : goal === "competencia"
            ? "Competencia"
            : "No definido";

  const formattedTrainingType =
    trainingType === "running"
      ? "Running"
      : trainingType === "swimming"
        ? "Swimming"
        : trainingType === "strength"
          ? "Fuerza"
          : trainingType === "mixed"
            ? "Mixto"
            : "No definido";

  const trainingDaysPerWeek = days.length;
  const formattedDuration = duration ? `${duration} min` : "No definido";

  return (
    <SafeAreaProvider style={styles.screen}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.screen}>
          {/* TOP */}
          <View style={styles.topSection}>
            <HomeHeader name="Isaias" greeting="Buenos días" />

            {/* CALENDARIO */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tu racha</Text>
              <WeeklyCalendar days={weekDays} />
            </View>

            {/* META SEMANAL */}
            <WeeklyGoalCard
              unit={weeklyGoal.unit}
              completedSessions={weeklyGoal.completedSessions}
              totalSessions={weeklyGoal.totalSessions}
              progressCurrent={weeklyGoal.progressCurrent}
              progressTotal={weeklyGoal.progressTotal}
            />

            {/* MINI RESUMEN */}
            <MiniSummary
              streakDays={streakDays}
              completedSessions={weeklyGoal.completedSessions}
              totalSessions={weeklyGoal.totalSessions}
              totalTime={formattedTotalTime}
            />

            <PlanContextCard
              goal={formattedGoal}
              trainingType={formattedTrainingType}
              daysPerWeek={trainingDaysPerWeek}
              duration={formattedDuration}
              level={
                level === "principiante"
                  ? "Principiante"
                  : level === "intermedio"
                    ? "Intermedio"
                    : level === "avanzado"
                      ? "Avanzado"
                      : "No definido"
              }
            />
          </View>

          {/* ENTRENAMIENTO */}
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Entrenamiento de hoy</Text>

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

          {/* HISTORIAL */}
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Última actividad</Text>

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
    </SafeAreaProvider>
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
    paddingVertical: spacing.lg,
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

