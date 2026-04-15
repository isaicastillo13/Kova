import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { spacing, theme } from "@/src/constants/theme";
import { useOnboardingStore } from "@/src/store/onboarding-store";
import { generatePlan } from "@/src/services/generatePlan";
import { useHomeStore } from "@/src/store/home-store";
import { SafeAreaProvider } from 'react-native-safe-area-context';



const types = [
  { label: "Running", value: "running" },
  { label: "Swimming", value: "swimming" },
  { label: "Fuerza", value: "strength" },
  { label: "Mixto", value: "mixed" },
] as const;

export default function OnboardingTypeScreen() {
  const router = useRouter();

  const trainingType = useOnboardingStore((state) => state.trainingType);
  const setHomeState = useHomeStore.setState;
  const onboarding = useOnboardingStore();
  const setTrainingType = useOnboardingStore((state) => state.setTrainingType);
  const completeOnboarding = useOnboardingStore(
    (state) => state.completeOnboarding,
  );

  const handleFinish = () => {
  if (!trainingType) return;

  const onboarding = useOnboardingStore.getState();
  const setPlanFromOnboarding = useHomeStore.getState().setPlanFromOnboarding;

  const plan = generatePlan({
    goal: onboarding.goal!,
    level: onboarding.level!,
    days: onboarding.days,
    duration: onboarding.duration!,
    trainingType: onboarding.trainingType!,
  });

  setPlanFromOnboarding(plan);
  completeOnboarding();

  router.replace("/(tabs)");
};
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <View style={styles.container}>
        {/* TOP */}
        <View>
          <Text style={styles.step}>Paso 5 de 5</Text>
          <Text style={styles.title}>
            ¿Qué tipo de entrenamiento prefieres?
          </Text>
          <Text style={styles.subtitle}>
            Esto nos ayuda a definir tu plan principal.
          </Text>
        </View>

        {/* OPCIONES */}
        <View style={styles.options}>
          {types.map((item) => {
            const isSelected = trainingType === item.value;

            return (
              <Pressable
                key={item.value}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => setTrainingType(item.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Pressable style={styles.secondaryButton} onPress={handleBack}>
            <Text style={styles.secondaryButtonText}>Volver</Text>
          </Pressable>

          <Pressable
            style={[
              styles.primaryButton,
              !trainingType && styles.primaryButtonDisabled,
            ]}
            onPress={handleFinish}
            disabled={!trainingType}
          >
            <Text style={styles.primaryButtonText}>Finalizar</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    justifyContent: "space-between",
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
  },

  options: {
    gap: spacing.md,
    marginTop: spacing.xxxl,
    flex: 1,
    justifyContent: "center",
  },

  optionCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    paddingVertical: spacing.lg,
    alignItems: "center",
    ...theme.shadows.card,
  },

  optionCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },

  optionText: {
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },

  optionTextSelected: {
    color: theme.colors.primaryDark,
    fontWeight: theme.fontWeight.bold,
  },

  footer: {
    flexDirection: "row",
    gap: spacing.md,
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
