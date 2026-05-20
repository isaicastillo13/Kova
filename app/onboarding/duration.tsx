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


const durations = [
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "60 min", value: 60 },
  { label: "90 min", value: 90 },
];

export default function OnboardingDurationScreen() {
  const router = useRouter();

  const duration = useOnboardingStore((state) => state.duration);
  const setDuration = useOnboardingStore((state) => state.setDuration);

  const handleContinue = () => {
    if (!duration) return;
    router.push("/onboarding/type");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* TOP */}
        <View>
          <Text style={styles.step}>Paso 4 de 5</Text>
          <Text style={styles.title}>¿Cuánto tiempo tienes por sesión?</Text>
          <Text style={styles.subtitle}>
            Esto define la duración de cada entrenamiento.
          </Text>
        </View>

        {/* OPCIONES */}
        <View style={styles.options}>
          {durations.map((item) => {
            const isSelected = duration === item.value;

            return (
              <Pressable
                key={item.value}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => setDuration(item.value)}
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
              !duration && styles.primaryButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!duration}
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    justifyContent: "space-between",
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
  },

  options: {
    gap: spacing.md,
    marginTop: spacing.xxxl,
    flex: 1,
    justifyContent: "center",
  },

  optionCard: {
    backgroundColor: theme.colors.surfaceGlass,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.card,
    paddingVertical: spacing.lg,
    alignItems: "center",
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
    fontWeight: theme.fontWeight.bold,
  },

  footer: {
    flexDirection: "row",
    gap: spacing.md,
  },

  secondaryButton: {
    flex: 1,
    height: 54,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
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
