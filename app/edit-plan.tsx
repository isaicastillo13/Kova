import { spacing, theme } from "@/src/constants/theme";
import { generatePlan } from "@/src/services/generatePlan";
import { useHomeStore } from "@/src/store/home-store";
import { useOnboardingStore } from "@/src/store/onboarding-store";
import type {
  Goal,
  InjuryHistory,
  Level,
  RaceDistance,
  RunningExperience,
} from "@/src/types/training";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type OptionItem<T extends string | number> = {
  label: string;
  value: T;
  description?: string;
};

const goals: readonly OptionItem<Goal>[] = [
  { label: "Resistencia", value: "resistencia" },
  { label: "Rendimiento", value: "rendimiento" },
  { label: "Mantenerme", value: "mantenerme" },
  { label: "Competencia", value: "competencia" },
];

const levels: readonly OptionItem<Level>[] = [
  { label: "Principiante", value: "principiante" },
  { label: "Intermedio", value: "intermedio" },
  { label: "Avanzado", value: "avanzado" },
];

const durations: readonly OptionItem<number>[] = [
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "60 min", value: 60 },
  { label: "90 min", value: 90 },
];

const raceDistances: readonly OptionItem<RaceDistance>[] = [
  { label: "Base", value: "general", description: "Salud y constancia" },
  { label: "5K", value: "5k", description: "Velocidad corta" },
  { label: "10K", value: "10k", description: "Resistencia rápida" },
  { label: "21K", value: "21k", description: "Media maratón" },
  { label: "42K", value: "42k", description: "Maratón" },
];

const weeklyKmOptions: readonly OptionItem<number>[] = [
  { label: "0-5 km", value: 5 },
  { label: "10 km", value: 10 },
  { label: "20 km", value: 20 },
  { label: "35 km", value: 35 },
  { label: "50+ km", value: 50 },
];

const longRunOptions: readonly OptionItem<number>[] = [
  { label: "3 km", value: 3 },
  { label: "5 km", value: 5 },
  { label: "8 km", value: 8 },
  { label: "12 km", value: 12 },
  { label: "18 km", value: 18 },
  { label: "25 km", value: 25 },
];

const experienceOptions: readonly OptionItem<RunningExperience>[] = [
  { label: "Inicio", value: "new", description: "Estoy empezando" },
  { label: "Retomando", value: "returning", description: "Vuelvo a correr" },
  { label: "Constante", value: "consistent", description: "Entreno cada semana" },
  { label: "Competitivo", value: "competitive", description: "Busco marcas" },
];

const injuryOptions: readonly OptionItem<InjuryHistory>[] = [
  { label: "Sin molestias", value: "none" },
  { label: "Molestia leve", value: "minor" },
  { label: "Lesión reciente", value: "recent" },
];

const daysList = [
  { label: "L", value: 0 },
  { label: "M", value: 1 },
  { label: "X", value: 2 },
  { label: "J", value: 3 },
  { label: "V", value: 4 },
  { label: "S", value: 5 },
  { label: "D", value: 6 },
];

export default function EditPlanScreen() {
  const router = useRouter();

  const onboarding = useOnboardingStore();
  const setPlanFromOnboarding = useHomeStore(
    (state) => state.setPlanFromOnboarding,
  );

  const [goal, setGoal] = useState<Goal | undefined>(onboarding.goal);
  const [level, setLevel] = useState<Level | undefined>(onboarding.level);
  const [days, setDays] = useState<number[]>(onboarding.days);
  const [duration, setDuration] = useState<number | undefined>(
    onboarding.duration,
  );
  const [raceDistance, setRaceDistance] = useState<RaceDistance | undefined>(
    onboarding.raceDistance,
  );
  const [currentWeeklyKm, setCurrentWeeklyKm] = useState<number | undefined>(
    onboarding.currentWeeklyKm,
  );
  const [longRunKm, setLongRunKm] = useState<number | undefined>(
    onboarding.longRunKm,
  );
  const [runningExperience, setRunningExperience] = useState<
    RunningExperience | undefined
  >(onboarding.runningExperience);
  const [injuryHistory, setInjuryHistory] = useState<
    InjuryHistory | undefined
  >(onboarding.injuryHistory);
  const [easyPace, setEasyPace] = useState(onboarding.easyPace ?? "");
  const [targetDate, setTargetDate] = useState(onboarding.targetDate ?? "");

  const toggleDay = (day: number) => {
    setDays((prev) =>
      prev.includes(day)
        ? prev.filter((currentDay) => currentDay !== day)
        : [...prev, day].sort((a, b) => a - b),
    );
  };

  const isFormValid =
    !!goal &&
    !!level &&
    !!duration &&
    days.length > 0 &&
    !!raceDistance &&
    currentWeeklyKm !== undefined &&
    longRunKm !== undefined &&
    !!runningExperience &&
    !!injuryHistory;

  const handleSave = () => {
    if (
      !goal ||
      !level ||
      !duration ||
      !raceDistance ||
      currentWeeklyKm === undefined ||
      longRunKm === undefined ||
      !runningExperience ||
      !injuryHistory ||
      days.length === 0
    ) {
      return;
    }

    const cleanEasyPace = easyPace.trim() || undefined;
    const cleanTargetDate = targetDate.trim() || undefined;

    onboarding.setGoal(goal);
    onboarding.setLevel(level);
    onboarding.setDays(days);
    onboarding.setDuration(duration);
    onboarding.setTrainingType("running");
    onboarding.setRunningProfile({
      raceDistance,
      currentWeeklyKm,
      longRunKm,
      easyPace: cleanEasyPace,
      targetDate: cleanTargetDate,
      runningExperience,
      injuryHistory,
    });

    const plan = generatePlan({
      goal,
      level,
      days,
      duration,
      trainingType: "running",
      raceDistance,
      currentWeeklyKm,
      longRunKm,
      easyPace: cleanEasyPace,
      targetDate: cleanTargetDate,
      runningExperience,
      injuryHistory,
    });

    setPlanFromOnboarding(plan);
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.step}>Ajustar plan</Text>
          <Text style={styles.title}>Edita tu planificación</Text>
          <Text style={styles.subtitle}>
            Cambia tus datos de running y genera una nueva semana de entrenamiento.
          </Text>
        </View>

        <Section title="Objetivo">
          <OptionGrid items={goals} selectedValue={goal} onSelect={setGoal} />
        </Section>

        <Section title="Nivel">
          <OptionGrid
            items={levels}
            selectedValue={level}
            onSelect={setLevel}
          />
        </Section>

        <Section title="Días disponibles">
          <View style={styles.daysRow}>
            {daysList.map((item) => {
              const selected = days.includes(item.value);
              return (
                <Pressable
                  key={item.value}
                  style={[
                    styles.dayCircle,
                    selected && styles.dayCircleSelected,
                  ]}
                  onPress={() => toggleDay(item.value)}
                >
                  <Text
                    style={[styles.dayText, selected && styles.dayTextSelected]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title="Duración por sesión">
          <OptionGrid
            items={durations}
            selectedValue={duration}
            onSelect={setDuration}
          />
        </Section>

        <Section title="Distancia objetivo">
          <OptionGrid
            items={raceDistances}
            selectedValue={raceDistance}
            onSelect={setRaceDistance}
          />
        </Section>

        <Section title="Kilómetros semanales actuales">
          <OptionGrid
            items={weeklyKmOptions}
            selectedValue={currentWeeklyKm}
            onSelect={setCurrentWeeklyKm}
          />
        </Section>

        <Section title="Tirada larga actual">
          <OptionGrid
            items={longRunOptions}
            selectedValue={longRunKm}
            onSelect={setLongRunKm}
          />
        </Section>

        <Section title="Experiencia corriendo">
          <OptionGrid
            items={experienceOptions}
            selectedValue={runningExperience}
            onSelect={setRunningExperience}
          />
        </Section>

        <Section title="Historial reciente de lesiones">
          <OptionGrid
            items={injuryOptions}
            selectedValue={injuryHistory}
            onSelect={setInjuryHistory}
          />
        </Section>

        <Section title="Ritmo cómodo">
          <TextInput
            value={easyPace}
            onChangeText={setEasyPace}
            placeholder="Ej. 6:10 min/km"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.input}
            autoCapitalize="none"
          />
        </Section>

        <Section title="Fecha objetivo">
          <TextInput
            value={targetDate}
            onChangeText={setTargetDate}
            placeholder="Opcional, ej. 2026-09-20"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.input}
            autoCapitalize="none"
          />
        </Section>

        <View style={styles.footer}>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={19}
              color={theme.colors.text}
            />
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </Pressable>

          <Pressable
            style={[
              styles.primaryButton,
              !isFormValid && styles.primaryButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!isFormValid}
          >
            <MaterialCommunityIcons
              name="refresh"
              size={19}
              color={theme.colors.onPrimary}
            />
            <Text style={styles.primaryButtonText}>Actualizar plan</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function OptionGrid<T extends string | number>({
  items,
  selectedValue,
  onSelect,
}: {
  items: readonly OptionItem<T>[];
  selectedValue: T | undefined;
  onSelect: (value: T) => void;
}) {
  return (
    <View style={styles.options}>
      {items.map((item) => {
        const selected = selectedValue === item.value;

        return (
          <Pressable
            key={String(item.value)}
            style={[styles.optionCard, selected && styles.optionCardSelected]}
            onPress={() => onSelect(item.value)}
          >
            <Text
              style={[styles.optionText, selected && styles.optionTextSelected]}
            >
              {item.label}
            </Text>
            {!!item.description && (
              <Text
                style={[
                  styles.optionDescription,
                  selected && styles.optionDescriptionSelected,
                ]}
              >
                {item.description}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  scroll: {
    flex: 1,
  },

  content: {
    padding: theme.spacing.xl,
    paddingBottom: 40,
    gap: theme.spacing.xl,
  },

  header: {
    marginBottom: theme.spacing.md,
  },

  step: {
    fontSize: theme.typography.label,
    color: theme.colors.primaryMuted,
    fontWeight: theme.fontWeight.bold,
    textTransform: "uppercase",
    marginBottom: 6,
  },

  title: {
    fontSize: theme.typography.titleXL,
    lineHeight: 36,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  subtitle: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },

  section: {
    gap: spacing.sm,
  },

  sectionTitle: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  options: {
    gap: spacing.sm,
  },

  optionCard: {
    backgroundColor: theme.colors.surfaceGlass,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.card,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    ...theme.shadows.card,
  },

  optionCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },

  optionText: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
  },

  optionTextSelected: {
    color: theme.colors.onPrimary,
    fontWeight: theme.fontWeight.bold,
  },

  optionDescription: {
    marginTop: 3,
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
  },

  optionDescriptionSelected: {
    color: "rgba(0, 0, 0, 0.62)",
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.lg,
    paddingHorizontal: spacing.lg,
    fontSize: theme.typography.bodyLG,
    color: theme.colors.text,
    backgroundColor: theme.colors.surfaceGlass,
  },

  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  },

  dayCircle: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceGlass,
  },

  dayCircleSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  dayText: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },

  dayTextSelected: {
    color: theme.colors.onPrimary,
    fontWeight: theme.fontWeight.bold,
  },

  footer: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },

  secondaryButton: {
    flex: 1,
    height: 54,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: theme.colors.surfaceGlass,
  },

  secondaryButtonText: {
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },

  primaryButton: {
    flex: 1,
    height: 54,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },

  primaryButtonDisabled: {
    opacity: 0.5,
  },

  primaryButtonText: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.bold,
  },
});
