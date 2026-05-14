import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { spacing, theme } from "@/src/constants/theme";
import { generatePlan } from "@/src/services/generatePlan";
import { useHomeStore } from "@/src/store/home-store";
import { isOnboardingReady, useOnboardingStore } from "@/src/store/onboarding-store";
import type {
  InjuryHistory,
  RaceDistance,
  RunningExperience,
} from "@/src/types/training";
import { SafeAreaView } from "react-native-safe-area-context";

type OptionItem<T extends string | number> = {
  label: string;
  value: T;
  description?: string;
};

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

export default function OnboardingTypeScreen() {
  const router = useRouter();
  const onboarding = useOnboardingStore();
  const setPlanFromOnboarding = useHomeStore(
    (state) => state.setPlanFromOnboarding,
  );
  const {
    raceDistance,
    currentWeeklyKm,
    longRunKm,
    easyPace,
    targetDate,
    runningExperience,
    injuryHistory,
    setRunningProfile,
    completeOnboarding,
    setTrainingType,
  } = onboarding;

  const isFormValid = isOnboardingReady(onboarding);

  const handleFinish = () => {
    const state = useOnboardingStore.getState();

    if (
      !state.goal ||
      !state.level ||
      !state.duration ||
      !state.raceDistance ||
      state.currentWeeklyKm === undefined ||
      state.longRunKm === undefined ||
      !state.runningExperience ||
      !state.injuryHistory ||
      state.days.length === 0
    ) {
      return;
    }

    setTrainingType("running");

    const plan = generatePlan({
      goal: state.goal,
      level: state.level,
      days: state.days,
      duration: state.duration,
      trainingType: "running",
      raceDistance: state.raceDistance,
      targetDate: state.targetDate,
      currentWeeklyKm: state.currentWeeklyKm,
      longRunKm: state.longRunKm,
      easyPace: state.easyPace,
      runningExperience: state.runningExperience,
      injuryHistory: state.injuryHistory,
    });

    setPlanFromOnboarding(plan);
    completeOnboarding();

    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.step}>Paso 5 de 5</Text>
          <Text style={styles.title}>Completa tu perfil de running</Text>
          <Text style={styles.subtitle}>
            Estos datos ayudan a crear una primera semana realista para tu carga actual.
          </Text>
        </View>

        <Section title="Distancia objetivo">
          <OptionGrid
            items={raceDistances}
            selectedValue={raceDistance}
            onSelect={(value) => setRunningProfile({ raceDistance: value })}
          />
        </Section>

        <Section title="Kilómetros semanales actuales">
          <OptionGrid
            items={weeklyKmOptions}
            selectedValue={currentWeeklyKm}
            onSelect={(value) => setRunningProfile({ currentWeeklyKm: value })}
          />
        </Section>

        <Section title="Tirada larga actual">
          <OptionGrid
            items={longRunOptions}
            selectedValue={longRunKm}
            onSelect={(value) => setRunningProfile({ longRunKm: value })}
          />
        </Section>

        <Section title="Experiencia corriendo">
          <OptionGrid
            items={experienceOptions}
            selectedValue={runningExperience}
            onSelect={(value) => setRunningProfile({ runningExperience: value })}
          />
        </Section>

        <Section title="Historial reciente de lesiones">
          <OptionGrid
            items={injuryOptions}
            selectedValue={injuryHistory}
            onSelect={(value) => setRunningProfile({ injuryHistory: value })}
          />
        </Section>

        <Section title="Ritmo cómodo">
          <TextInput
            value={easyPace}
            onChangeText={(text) => setRunningProfile({ easyPace: text })}
            placeholder="Ej. 6:10 min/km"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.input}
            autoCapitalize="none"
          />
        </Section>

        <Section title="Fecha objetivo">
          <TextInput
            value={targetDate}
            onChangeText={(text) => setRunningProfile({ targetDate: text })}
            placeholder="Opcional, ej. 2026-09-20"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.input}
            autoCapitalize="none"
          />
        </Section>

        <View style={styles.footer}>
          <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
            <Text style={styles.secondaryButtonText}>Volver</Text>
          </Pressable>

          <Pressable
            style={[
              styles.primaryButton,
              !isFormValid && styles.primaryButtonDisabled,
            ]}
            onPress={handleFinish}
            disabled={!isFormValid}
          >
            <Text style={styles.primaryButtonText}>Finalizar</Text>
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
        const isSelected = selectedValue === item.value;

        return (
          <Pressable
            key={String(item.value)}
            style={[styles.optionCard, isSelected && styles.optionCardSelected]}
            onPress={() => onSelect(item.value)}
          >
            <Text
              style={[styles.optionText, isSelected && styles.optionTextSelected]}
            >
              {item.label}
            </Text>
            {!!item.description && (
              <Text
                style={[
                  styles.optionDescription,
                  isSelected && styles.optionDescriptionSelected,
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

  container: {
    padding: spacing.xxl,
    paddingBottom: 40,
    gap: spacing.xl,
  },

  step: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    marginBottom: spacing.sm,
  },

  title: {
    fontSize: theme.typography.titleLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: spacing.sm,
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
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  options: {
    gap: spacing.sm,
  },

  optionCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    ...theme.shadows.card,
  },

  optionCardSelected: {
    borderColor: theme.colors.borderAccent,
    backgroundColor: theme.colors.primaryLight,
  },

  optionText: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.semibold,
  },

  optionTextSelected: {
    color: theme.colors.primaryDark,
  },

  optionDescription: {
    marginTop: 3,
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
  },

  optionDescriptionSelected: {
    color: theme.colors.primaryDark,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    paddingHorizontal: spacing.lg,
    fontSize: theme.typography.bodyLG,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  },

  footer: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
  },

  secondaryButton: {
    flex: 1,
    height: 54,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },

  secondaryButtonText: {
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },

  primaryButton: {
    flex: 1,
    height: 54,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
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
