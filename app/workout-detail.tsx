import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { theme } from "@/src/constants/theme";

export default function WorkoutDetailScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Detalle del entrenamiento</Text>
        <Text style={styles.subtitle}>
          Aquí vamos a mostrar los bloques del workout.
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
    padding: theme.spacing.xxl,
    justifyContent: "center",
    alignItems: "center",
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
    textAlign: "center",
  },
});