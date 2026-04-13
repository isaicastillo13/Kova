import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { spacing, theme } from "@/src/constants/theme";

export default function OnboardingLevelScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Pantalla 2: Nivel</Text>
        <Text style={styles.subtitle}>
          Aquí seguiremos con la siguiente pregunta.
        </Text>
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
    padding: spacing.xxl,
    justifyContent: "center",
    alignItems: "center",
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
    textAlign: "center",
  },
});