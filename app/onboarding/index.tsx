import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { spacing, theme } from "@/src/constants/theme";
import { useOnboardingStore } from "@/src/store/onboarding-store";
import { SafeAreaView } from "react-native-safe-area-context";


const goals = [
  { label: "Mejorar resistencia", value: "resistencia" },
  { label: "Mejorar rendimiento", value: "rendimiento" },
  { label: "Mantenerme activo", value: "mantenerme" },
  { label: "Preparar competencia", value: "competencia" },
] as const;

export default function OnboardingGoalScreen() {
  const router = useRouter();
  const goal = useOnboardingStore((state) => state.goal);
  const setGoal = useOnboardingStore((state) => state.setGoal);

  const handleContinue = () => {
    if (!goal) return;
    router.push("/onboarding/level");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.step}>Paso 1 de 5</Text>
          <Text style={styles.title}>¿Qué quieres lograr?</Text>
          <Text style={styles.subtitle}>
            Esto nos ayudará a construir un plan que tenga sentido para ti.
          </Text>
        </View>

        <View style={styles.options}>
          {goals.map((item) => {
            const isSelected = goal === item.value;

            return (
              <Pressable
                key={item.value}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => setGoal(item.value)}
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

        <Pressable
          style={[
            styles.button,
            !goal && styles.buttonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!goal}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    justifyContent: "space-between",
    backgroundColor: theme.colors.background,
  },

  top: {
    marginTop: spacing.lg,
  },

  step: {
    fontSize: theme.typography.label,
    color: theme.colors.primaryMuted,
    fontWeight: theme.fontWeight.bold,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },

  title: {
    fontSize: theme.typography.titleXL,
    lineHeight: 36,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    marginBottom: spacing.sm,
  },

  subtitle: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },

  options: {
    gap: spacing.md,
    marginTop: spacing.xxl,
    flex: 1,
    justifyContent: "center",
  },

  optionCard: {
    backgroundColor: theme.colors.surfaceGlass,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.card,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    ...theme.shadows.card,
  },

  optionCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },

  optionText: {
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },

  optionTextSelected: {
    color: theme.colors.onPrimary,
    fontWeight: theme.fontWeight.semibold,
  },

  button: {
    height: 54,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xl,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.bold,
  },
});
