import HomeHeader from "@/src/components/home/Header";
import HomeInsight from "@/src/components/home/HomeInsight";
import MiniSummary from "@/src/components/home/MiniSummary";
import QuickHistory from "@/src/components/home/QuickHistory";
import TodayWorkout from "@/src/components/home/TodayWorkout";
import WeeklyGoalCard from "@/src/components/home/WeeklyGoalCard";
import WeeklyPlan from "@/src/components/home/WeeklyPlan";
import PlanContextCard from "@/src/components/PlanContextCard";
import {
  calculateStreak,
  getWeekDaysWithLabels,
} from "@/src/components/utils/date";
import WeeklyCalendar from "@/src/components/weeklyCalendar";
import { spacing, theme } from "@/src/constants/theme";
import { useHomeStore } from "@/src/store/home-store";
import { useOnboardingStore } from "@/src/store/onboarding-store";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

function formatRaceDistance(value?: string) {
  switch (value) {
    case "5k":
      return "5K";
    case "10k":
      return "10K";
    case "21k":
      return "21K";
    case "42k":
      return "Maratón";
    case "general":
      return "Base aeróbica";
    default:
      return "No definido";
  }
}

function formatInjuryStatus(value?: string) {
  switch (value) {
    case "none":
      return "Sin molestias";
    case "minor":
      return "Molestia leve";
    case "recent":
      return "Lesión reciente";
    default:
      return "No definido";
  }
}

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
  const {
    goal,
    level,
    days,
    duration,
    raceDistance,
    currentWeeklyKm,
    longRunKm,
    easyPace,
    injuryHistory,
  } = useOnboardingStore();
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
          <View style={styles.topSection}>
            <HomeHeader name="Isaias" greeting="Buenos días" />

            <View style={styles.weekHero}>
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

            <HomeInsight
              streakDays={streakDays}
              todayWorkout={todayWorkout}
              weeklyGoal={weeklyGoal}
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
              <Text style={styles.sectionTitle}>Tu racha</Text>
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
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Última actividad</Text>
              <Text style={styles.sectionMeta}>{activities.length} registros</Text>
            </View>

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
          <PlanContextCard
            goal={formattedGoal}
            raceDistance={formatRaceDistance(raceDistance)}
            daysPerWeek={trainingDaysPerWeek}
            duration={formattedDuration}
            currentWeeklyKm={
              currentWeeklyKm !== undefined
                ? `${currentWeeklyKm} km/sem`
                : "No definido"
            }
            longRunKm={
              longRunKm !== undefined ? `${longRunKm} km` : "No definido"
            }
            easyPace={easyPace?.trim() || "No definido"}
            injuryStatus={formatInjuryStatus(injuryHistory)}
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
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  topSection: {
    backgroundColor: theme.colors.background,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xxl,
    gap: spacing.lg,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    gap: spacing.lg,
  },

  section: {
    gap: spacing.sm,
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
    backgroundColor: theme.colors.charcoal,
    borderRadius: theme.radius.xxl,
    padding: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.black,
    ...theme.shadows.card,
  },

  weekHeroLabel: {
    fontSize: theme.typography.bodySM,
    color: "rgba(255, 255, 255, 0.64)",
    fontWeight: theme.fontWeight.semibold,
    marginBottom: spacing.xs,
  },

  weekHeroTitle: {
    fontSize: theme.typography.hero,
    lineHeight: 46,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },

  weekHeroMuted: {
    color: "rgba(255, 255, 255, 0.42)",
    fontSize: theme.typography.titleLG,
  },

  weekHeroCopy: {
    marginTop: spacing.sm,
    fontSize: theme.typography.bodySM,
    color: "rgba(255, 255, 255, 0.68)",
    fontWeight: theme.fontWeight.semibold,
  },
});
