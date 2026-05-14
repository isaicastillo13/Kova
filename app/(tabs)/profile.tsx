import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BaseCard, MetricCard } from "@/src/components/ui/kova";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, spacing } from "@/src/constants/theme";
import { useHomeStore } from "@/src/store/home-store";
import { useOnboardingStore } from "@/src/store/onboarding-store";

const dayLabels = ["L", "M", "X", "J", "V", "S", "D"];

function formatGoal(goal?: string) {
  switch (goal) {
    case "resistencia":
      return "Resistencia";
    case "rendimiento":
      return "Rendimiento";
    case "mantenerme":
      return "Mantenerme activo";
    case "competencia":
      return "Competencia";
    default:
      return "No definido";
  }
}

function formatLevel(level?: string) {
  switch (level) {
    case "principiante":
      return "Principiante";
    case "intermedio":
      return "Intermedio";
    case "avanzado":
      return "Avanzado";
    default:
      return "No definido";
  }
}

function formatTrainingType(type?: string) {
  return type === "running" ? "Running" : "Running";
}

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

function formatExperience(value?: string) {
  switch (value) {
    case "new":
      return "Inicio";
    case "returning":
      return "Retomando";
    case "consistent":
      return "Constante";
    case "competitive":
      return "Competitivo";
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

export default function ProfileScreen() {
  const router = useRouter();

  const {
    goal,
    level,
    days,
    duration,
    trainingType,
    raceDistance,
    currentWeeklyKm,
    longRunKm,
    easyPace,
    targetDate,
    runningExperience,
    injuryHistory,
    resetOnboarding,
  } = useOnboardingStore();

  const resetHome = useHomeStore((state) => state.resetHomeProgress);

  const handleReset = () => {
    resetOnboarding();
    resetHome();
    router.replace("/onboarding");
  };

  const handleEditPlan = () => {
    router.push("/edit-plan");
  };

  const selectedDays = days.length
    ? [...days]
        .sort((a, b) => a - b)
        .map((day) => dayLabels[day])
        .join(" · ")
    : "No definido";

  const profileMetrics = [
    {
      label: "Objetivo",
      value: formatGoal(goal),
      icon: "target",
    },
    {
      label: "Nivel",
      value: formatLevel(level),
      icon: "chart-timeline-variant",
    },
    {
      label: "Distancia",
      value: formatRaceDistance(raceDistance),
      icon: "flag-checkered",
    },
    {
      label: "Días",
      value: selectedDays,
      icon: "calendar-week",
    },
  ] as const;

  const details = [
    ["Duración por sesión", duration ? `${duration} min` : "No definido"],
    ["Tipo de entrenamiento", formatTrainingType(trainingType)],
    [
      "Km semanales actuales",
      currentWeeklyKm !== undefined ? `${currentWeeklyKm} km` : "No definido",
    ],
    [
      "Tirada larga actual",
      longRunKm !== undefined ? `${longRunKm} km` : "No definido",
    ],
    ["Ritmo cómodo", easyPace || "No definido"],
    ["Experiencia", formatExperience(runningExperience)],
    ["Estado físico", formatInjuryStatus(injuryHistory)],
    ["Fecha objetivo", targetDate || "No definido"],
  ];

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <BaseCard variant="hero" style={styles.hero}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons
            name="run-fast"
            size={34}
            color={theme.colors.onPrimary}
          />
        </View>
        <Text style={styles.kicker}>Perfil de atleta</Text>
        <Text style={styles.title}>Tu configuración de entrenamiento</Text>
        <Text style={styles.subtitle}>
          Ajusta el plan cuando cambien tus objetivos, disponibilidad o carga.
        </Text>
      </BaseCard>

      <View style={styles.metricsGrid}>
        {profileMetrics.map((item) => (
          <MetricCard
            key={item.label}
            label={item.label}
            value={item.value}
            icon={
              <MaterialCommunityIcons
                name={item.icon}
                size={20}
                color={theme.colors.primary}
              />
            }
            style={styles.metricCard}
          />
        ))}
      </View>

      <BaseCard variant="elevated" style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Datos del plan</Text>
          <Text style={styles.cardMeta}>Actual</Text>
        </View>

        {details.map(([label, value]) => (
          <View key={label} style={styles.item}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </BaseCard>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={handleEditPlan}>
          <MaterialCommunityIcons
            name="pencil"
            size={19}
            color={theme.colors.onPrimary}
          />
          <Text style={styles.primaryButtonText}>Editar plan</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={handleReset}>
          <MaterialCommunityIcons
            name="refresh"
            size={19}
            color={theme.colors.error}
          />
          <Text style={styles.secondaryButtonText}>Rehacer onboarding</Text>
        </Pressable>
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

  container: {
    padding: theme.spacing.xxl,
    paddingBottom: 112,
    gap: theme.spacing.xl,
  },

  hero: {
    padding: theme.spacing.xxl,
  },

  avatar: {
    width: 62,
    height: 62,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },

  kicker: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.primaryMuted,
    fontWeight: theme.fontWeight.bold,
    marginBottom: spacing.xs,
  },

  title: {
    fontSize: theme.typography.titleLG,
    color: theme.colors.white,
    fontWeight: theme.fontWeight.bold,
    lineHeight: 32,
  },

  subtitle: {
    marginTop: spacing.sm,
    fontSize: theme.typography.bodyMD,
    color: "rgba(255, 255, 255, 0.68)",
    lineHeight: 22,
  },

  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },

  metricCard: {
    width: "47%",
  },

  card: {
    padding: theme.spacing.xxl,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
    gap: spacing.md,
  },

  cardTitle: {
    fontSize: theme.typography.titleSM,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  cardMeta: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },

  label: {
    flex: 1,
    fontSize: theme.typography.bodyMD,
    color: theme.colors.textSecondary,
  },

  value: {
    flex: 1,
    textAlign: "right",
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  actions: {
    gap: theme.spacing.md,
  },

  primaryButton: {
    minHeight: 54,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },

  primaryButtonText: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.bold,
  },

  secondaryButton: {
    minHeight: 54,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.errorLight,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },

  secondaryButtonText: {
    color: theme.colors.error,
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.bold,
  },
});
