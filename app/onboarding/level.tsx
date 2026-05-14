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


const levels = [
  {
    label: "Principiante",
    value: "principiante",
    description: "Estás comenzando o entrenas muy poco.",
  },
  {
    label: "Intermedio",
    value: "intermedio",
    description: "Ya entrenas con cierta frecuencia.",
  },
  {
    label: "Avanzado",
    value: "avanzado",
    description: "Tienes buena base y toleras más carga.",
  },
] as const;

export default function OnboardingLevelScreen() {
  const router = useRouter();

  const level = useOnboardingStore((state) => state.level);
  const setLevel = useOnboardingStore((state) => state.setLevel);

  const handleContinue = () => {
    if (!level) return;
    router.push("/onboarding/days");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.step}>Paso 2 de 5</Text>
          <Text style={styles.title}>¿Cuál es tu nivel actual?</Text>
          <Text style={styles.subtitle}>
            Esto nos ayuda a ajustar la intensidad del plan.
          </Text>
        </View>

        <View style={styles.options}>
          {levels.map((item) => {
            const isSelected = level === item.value;

            return (
              <Pressable
                key={item.value}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => setLevel(item.value)}
              >
                <Text
                  style={[
                    styles.optionTitle,
                    isSelected && styles.optionTitleSelected,
                  ]}
                >
                  {item.label}
                </Text>

                <Text
                  style={[
                    styles.optionDescription,
                    isSelected && styles.optionDescriptionSelected,
                  ]}
                >
                  {item.description}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.secondaryButton} onPress={handleBack}>
            <Text style={styles.secondaryButtonText}>Volver</Text>
          </Pressable>

          <Pressable
            style={[
              styles.primaryButton,
              !level && styles.primaryButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!level}
          >
            <Text style={styles.primaryButtonText}>Continuar</Text>
          </Pressable>
        </View>
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
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    justifyContent: "space-between",
    backgroundColor: theme.colors.background,
  },

  top: {
    marginTop: spacing.lg,
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

  options: {
    gap: spacing.md,
    marginTop: spacing.xxl,
    flex: 1,
    justifyContent: "center",
  },

  optionCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    ...theme.shadows.card,
  },

  optionCardSelected: {
    borderColor: theme.colors.borderAccent,
    backgroundColor: theme.colors.primaryLight,
  },

  optionTitle: {
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 4,
  },

  optionTitleSelected: {
    color: theme.colors.primaryDark,
  },

  optionDescription: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },

  optionDescriptionSelected: {
    color: theme.colors.primaryDark,
  },

  footer: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl,
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
