import { spacing, theme } from "@/src/constants/theme";
import { generatePlan } from "@/src/services/generatePlan";
import { useHomeStore } from "@/src/store/home-store";
import { useOnboardingStore } from "@/src/store/onboarding-store";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const goals = [
  { label: "Resistencia", value: "resistencia" },
  { label: "Rendimiento", value: "rendimiento" },
  { label: "Mantenerme", value: "mantenerme" },
  { label: "Competencia", value: "competencia" },
] as const;

const levels = [
  { label: "Principiante", value: "principiante" },
  { label: "Intermedio", value: "intermedio" },
  { label: "Avanzado", value: "avanzado" },
] as const;

const durations = [
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "60 min", value: 60 },
  { label: "90 min", value: 90 },
] as const;

const trainingTypes = [
  { label: "Running", value: "running" },
  { label: "Swimming", value: "swimming" },
  { label: "Fuerza", value: "strength" },
  { label: "Mixto", value: "mixed" },
] as const;

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
  const resetHomeProgress = useHomeStore((state) => state.resetHomeProgress);

  const [goal, setGoal] = useState(onboarding.goal);
  const [level, setLevel] = useState(onboarding.level);
  const [days, setDays] = useState<number[]>(onboarding.days);
  const [duration, setDuration] = useState(onboarding.duration);
  const [trainingType, setTrainingType] = useState(onboarding.trainingType);

  const toggleDay = (day: number) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const isFormValid =
    !!goal && !!level && !!duration && !!trainingType && days.length > 0;

  const handleSave = () => {
    if (!isFormValid) return;

    onboarding.setGoal(goal!);
    onboarding.setLevel(level!);

    const currentDays = onboarding.days;
    currentDays.forEach((day) => {
      if (!days.includes(day)) {
        onboarding.toggleDay(day);
      }
    });
    days.forEach((day) => {
      if (!currentDays.includes(day)) {
        onboarding.toggleDay(day);
      }
    });

    onboarding.setDuration(duration!);
    onboarding.setTrainingType(trainingType!);

    const plan = generatePlan({
      goal: goal!,
      level: level!,
      days,
      duration: duration!,
      trainingType: trainingType!,
    });

    resetHomeProgress();
    setPlanFromOnboarding(plan);

    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.step}>Ajustar plan</Text>
          <Text style={styles.title}>Edita tu planificación</Text>
          <Text style={styles.subtitle}>
            Cambia tu configuración actual y genera un nuevo plan.
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

        <Section title="Duración">
          <OptionGrid
            items={durations}
            selectedValue={duration}
            onSelect={setDuration}
          />
        </Section>

        <Section title="Tipo de entrenamiento">
          <OptionGrid
            items={trainingTypes}
            selectedValue={trainingType}
            onSelect={setTrainingType}
          />
        </Section>

        <View style={styles.footer}>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
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
            <Text style={styles.primaryButtonText}>Actualizar plan</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

type OptionItem<T extends string | number> = {
  label: string;
  value: T;
};

type OptionGridProps<T extends string | number> = {
  items: readonly OptionItem<T>[];
  selectedValue: T | undefined;
  onSelect: (value: T) => void;
};

function OptionGrid<T extends string | number>({
  items,
  selectedValue,
  onSelect,
}: OptionGridProps<T>) {
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
    padding: theme.spacing.xxl,
    paddingBottom: 40,
    gap: theme.spacing.xl,
  },

  header: {
    marginBottom: theme.spacing.md,
  },

  step: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: 6,
  },

  title: {
    fontSize: theme.typography.titleLG,
    fontWeight: theme.fontWeight.bold,
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
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  options: {
    gap: spacing.sm,
  },

  optionCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    ...theme.shadows.card,
  },

  optionCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },

  optionText: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
  },

  optionTextSelected: {
    color: theme.colors.primaryDark,
    fontWeight: theme.fontWeight.bold,
  },

  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  },

  dayCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.white,
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
    color: theme.colors.white,
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
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.white,
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
    color: theme.colors.white,
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.bold,
  },
});
