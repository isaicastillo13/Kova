import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { spacing, theme } from "@/src/constants/theme";

type Status = "pending" | "completed";

type Props = {
  type: string;
  title: string;
  day: string;
  duration: string;
  difficulty: string;
  metric: string;
  heartRate: string;
  status: Status;
  onToggleComplete: () => void;
  onPress: () => void;
  km: number;
};

function getTypeLabel(type: string, isRestDay: boolean) {
  if (isRestDay) return "Recuperación";
  if (type.toLowerCase() === "running") return "Running";
  if (type.toLowerCase() === "strength") return "Fuerza";
  if (type.toLowerCase() === "mixed") return "Mixto";
  if (type.toLowerCase() === "swimming") return "Natación";
  return type;
}

function getWorkoutIcon(type: string, isRestDay: boolean) {
  if (isRestDay) return "sleep";
  if (type.toLowerCase() === "strength") return "dumbbell";
  if (type.toLowerCase() === "swimming") return "swim";
  if (type.toLowerCase() === "mixed") return "lightning-bolt";
  return "run-fast";
}

export default function TodayWorkout({
  type,
  title,
  day,
  duration,
  difficulty,
  metric,
  heartRate,
  status,
  onToggleComplete,
  onPress,
  km,
}: Props) {
  const isCompleted = status === "completed";
  const isRestDay = type.toLowerCase() === "descanso" || km === 0;
  const typeLabel = getTypeLabel(type, isRestDay);
  const iconName = getWorkoutIcon(type, isRestDay);

  return (
    <Pressable
      style={[
        styles.container,
        isCompleted && styles.completedContainer,
        isRestDay && styles.restContainer,
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.typeBlock}>
          <View style={styles.iconBox}>
            <MaterialCommunityIcons
              name={iconName}
              size={24}
              color={theme.colors.onPrimary}
            />
          </View>
          <View>
            <Text style={styles.eyebrow}>Entrenamiento de hoy</Text>
            <Text style={styles.type}>{typeLabel}</Text>
          </View>
        </View>

        <View
          style={[
            styles.statusPill,
            isCompleted && styles.statusPillCompleted,
            isRestDay && styles.statusPillRest,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              isCompleted && styles.statusTextCompleted,
              isRestDay && styles.statusTextRest,
            ]}
          >
            {isCompleted ? "Listo" : isRestDay ? "Descanso" : difficulty}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.meta}>
        {day} · {duration}
      </Text>

      <View style={styles.metricsRow}>
        <MetricItem label={isRestDay ? "Foco" : "Objetivo"} value={metric} />
        <MetricItem label="Zona" value={heartRate} />
        <MetricItem label="Carga" value={isRestDay ? "0 km" : `${km} km`} />
      </View>

      {isRestDay ? (
        <View style={styles.recoveryRow}>
          <MaterialCommunityIcons
            name="heart-pulse"
            size={18}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.recoveryText}>
            Baja carga y prepara el cuerpo para la próxima sesión.
          </Text>
        </View>
      ) : (
        <Pressable
          style={[
            styles.actionButton,
            isCompleted && styles.actionButtonCompleted,
          ]}
          onPress={onToggleComplete}
        >
          <View
            style={[styles.checkbox, isCompleted && styles.checkboxChecked]}
          >
            {isCompleted && <AntDesign name="check" size={14} color="white" />}
          </View>

          <Text
            style={[
              styles.actionText,
              isCompleted && styles.actionTextCompleted,
            ]}
          >
            {isCompleted ? "Completado" : "Marcar como completado"}
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricItem}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.charcoal,
    borderRadius: theme.radius.xxl,
    padding: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.borderAccent,
    ...theme.shadows.card,
  },

  completedContainer: {
    borderColor: theme.colors.success,
  },

  restContainer: {
    backgroundColor: theme.colors.surfaceAlt,
    borderColor: theme.colors.info,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },

  typeBlock: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  eyebrow: {
    fontSize: theme.typography.bodySM,
    color: "rgba(255, 255, 255, 0.64)",
    fontWeight: theme.fontWeight.semibold,
  },

  type: {
    marginTop: 2,
    fontSize: theme.typography.titleSM,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },

  statusPill: {
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(252, 76, 2, 0.18)",
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },

  statusPillCompleted: {
    backgroundColor: "rgba(22, 163, 74, 0.18)",
  },

  statusPillRest: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },

  statusText: {
    color: theme.colors.primaryMuted,
    fontSize: theme.typography.bodySM,
    fontWeight: theme.fontWeight.bold,
    textTransform: "capitalize",
  },

  statusTextCompleted: {
    color: "#86efac",
  },

  statusTextRest: {
    color: theme.colors.white,
  },

  title: {
    fontSize: theme.typography.titleLG,
    lineHeight: 32,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },

  meta: {
    marginTop: spacing.xs,
    fontSize: theme.typography.bodyMD,
    color: "rgba(255, 255, 255, 0.68)",
  },

  metricsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xl,
  },

  metricItem: {
    flex: 1,
    minHeight: 70,
    borderRadius: theme.radius.lg,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    padding: spacing.md,
    justifyContent: "center",
  },

  metricLabel: {
    fontSize: theme.typography.bodySM,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 4,
  },

  metricValue: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.white,
    fontWeight: theme.fontWeight.bold,
  },

  actionButton: {
    marginTop: spacing.xl,
    minHeight: 52,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },

  actionButtonCompleted: {
    backgroundColor: theme.colors.success,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.72)",
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxChecked: {
    borderColor: theme.colors.white,
  },

  actionText: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.onPrimary,
    fontWeight: theme.fontWeight.bold,
  },

  actionTextCompleted: {
    color: theme.colors.white,
  },

  recoveryRow: {
    marginTop: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.12)",
    paddingTop: spacing.lg,
  },

  recoveryText: {
    flex: 1,
    color: "rgba(255, 255, 255, 0.72)",
    fontSize: theme.typography.bodySM,
    lineHeight: 20,
  },
});
