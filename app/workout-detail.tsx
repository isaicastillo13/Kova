import React from "react";
import {StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from "@/src/constants/theme";
import { useHomeStore } from "@/src/store/home-store";

export default function WorkoutDetailScreen() {
  const todayWorkout = useHomeStore((state) => state.todayWorkout);

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.type}>{todayWorkout.type}</Text>
          <Text style={styles.title}>{todayWorkout.title}</Text>
          <Text style={styles.meta}>
            {todayWorkout.day} · {todayWorkout.duration} · {todayWorkout.difficulty}
          </Text>
        </View>

        {/* RESUMEN */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Métrica</Text>
          <Text style={styles.summaryValue}>{todayWorkout.metric}</Text>

          <View style={styles.summaryDivider} />

          <Text style={styles.summaryLabel}>Rango objetivo</Text>
          <Text style={styles.summaryValue}>{todayWorkout.heartRate}</Text>
        </View>

        {/* BLOQUES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalle del entrenamiento</Text>

          {todayWorkout.details && todayWorkout.details.length > 0 ? (
            todayWorkout.details.map((block, index) => (
              <View key={`${block.type}-${index}`} style={styles.blockCard}>
                <Text style={styles.blockLabel}>{block.label}</Text>
                <Text style={styles.blockDescription}>{block.description}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                Este entrenamiento todavía no tiene detalle disponible.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaProvider>
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
  },

  header: {
    marginBottom: theme.spacing.xl,
  },

  type: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    marginBottom: 6,
    textTransform: "capitalize",
  },

  title: {
    fontSize: theme.typography.titleLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  meta: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.textSecondary,
  },

  summaryCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
    marginBottom: theme.spacing.xl,
  },

  summaryLabel: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },

  summaryValue: {
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.lg,
  },

  section: {
    gap: theme.spacing.md,
  },

  sectionTitle: {
    fontSize: theme.typography.titleSM,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  blockCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },

  blockLabel: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 6,
  },

  blockDescription: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },

  emptyCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  emptyText: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
});