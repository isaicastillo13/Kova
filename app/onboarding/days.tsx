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
import { SafeAreaProvider } from 'react-native-safe-area-context';


const days = [
  { label: "L", value: 0 },
  { label: "M", value: 1 },
  { label: "X", value: 2 },
  { label: "J", value: 3 },
  { label: "V", value: 4 },
  { label: "S", value: 5 },
  { label: "D", value: 6 },
];

export default function OnboardingDaysScreen() {
  const router = useRouter();

  const selectedDays = useOnboardingStore((state) => state.days);
  const toggleDay = useOnboardingStore((state) => state.toggleDay);

  const handleContinue = () => {
    if (selectedDays.length === 0) return;
    router.push("/onboarding/duration");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <View style={styles.container}>
        {/* TOP */}
        <View>
          <Text style={styles.step}>Paso 3 de 5</Text>
          <Text style={styles.title}>¿Qué días puedes entrenar?</Text>
          <Text style={styles.subtitle}>
            Puedes seleccionar varios días.
          </Text>
        </View>

        {/* DÍAS */}
        <View style={styles.daysContainer}>
          {days.map((day) => {
            const isSelected = selectedDays.includes(day.value);

            return (
              <Pressable
                key={day.value}
                style={[
                  styles.dayCircle,
                  isSelected && styles.dayCircleSelected,
                ]}
                onPress={() => toggleDay(day.value)}
              >
                <Text
                  style={[
                    styles.dayText,
                    isSelected && styles.dayTextSelected,
                  ]}
                >
                  {day.label}
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
              selectedDays.length === 0 && styles.primaryButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={selectedDays.length === 0}
          >
            <Text style={styles.primaryButtonText}>Continuar</Text>
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

  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xxxl,
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