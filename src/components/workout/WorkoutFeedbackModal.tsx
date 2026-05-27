import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { spacing, theme } from "@/src/constants/theme";
import type { WorkoutFeedback } from "@/src/types/training";

type Energy = WorkoutFeedback["energy"];

type Props = {
  visible: boolean;
  workoutTitle: string;
  plannedKm: number;
  plannedDuration?: number;
  onClose: () => void;
  onSave: (feedback: WorkoutFeedback) => void;
};

type FormErrors = {
  rpe?: string;
  energy?: string;
  pain?: string;
  completedKm?: string;
  actualDuration?: string;
};

const rpeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

const energyOptions: { value: Energy; label: string }[] = [
  { value: "low", label: "Baja" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "Alta" },
];

function formatInitialNumber(value?: number): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "";
  return Number.isInteger(value) ? `${value}` : `${Number(value.toFixed(2))}`;
}

function parseOptionalNumber(input: string): number | undefined {
  const normalized = input.trim().replace(",", ".");

  if (!normalized) return undefined;

  const value = Number(normalized);
  return Number.isFinite(value) ? value : Number.NaN;
}

export default function WorkoutFeedbackModal({
  visible,
  workoutTitle,
  plannedKm,
  plannedDuration,
  onClose,
  onSave,
}: Props) {
  const [rpe, setRpe] = useState<number | null>(null);
  const [energy, setEnergy] = useState<Energy | null>(null);
  const [pain, setPain] = useState<boolean | null>(null);
  const [completedKmText, setCompletedKmText] = useState("");
  const [actualDurationText, setActualDurationText] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!visible) return;

    setRpe(null);
    setEnergy(null);
    setPain(null);
    setCompletedKmText(formatInitialNumber(plannedKm));
    setActualDurationText(formatInitialNumber(plannedDuration));
    setNote("");
    setErrors({});
  }, [visible, plannedKm, plannedDuration]);

  function handleSave() {
    const completedKm = parseOptionalNumber(completedKmText);
    const actualDuration = parseOptionalNumber(actualDurationText);
    const nextErrors: FormErrors = {};

    if (rpe === null) {
      nextErrors.rpe = "Selecciona un RPE.";
    }

    if (energy === null) {
      nextErrors.energy = "Selecciona energía.";
    }

    if (pain === null) {
      nextErrors.pain = "Indica si hubo dolor.";
    }

    if (
      completedKm !== undefined &&
      (!Number.isFinite(completedKm) || completedKm < 0)
    ) {
      nextErrors.completedKm = "Los kilómetros deben ser 0 o más.";
    }

    if (
      actualDuration !== undefined &&
      (!Number.isFinite(actualDuration) || actualDuration <= 0)
    ) {
      nextErrors.actualDuration = "La duración debe ser mayor a 0.";
    }

    setErrors(nextErrors);

    if (
      rpe === null ||
      energy === null ||
      pain === null ||
      Object.keys(nextErrors).length > 0
    ) {
      return;
    }

    const trimmedNote = note.trim();

    onSave({
      rpe,
      energy,
      pain,
      ...(trimmedNote ? { note: trimmedNote } : {}),
      ...(completedKm !== undefined ? { completedKm } : {}),
      ...(actualDuration !== undefined ? { actualDuration } : {}),
    });
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.kicker}>Feedback post-entreno</Text>
                <Text style={styles.title} numberOfLines={2}>
                  {workoutTitle}
                </Text>
              </View>

              <Pressable style={styles.closeButton} onPress={onClose}>
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color={theme.colors.text}
                />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.form}
            >
              <View style={styles.field}>
                <Text style={styles.label}>RPE</Text>
                <View style={styles.rpeGrid}>
                  {rpeOptions.map((value) => {
                    const selected = rpe === value;

                    return (
                      <Pressable
                        key={value}
                        style={[styles.rpeChip, selected && styles.chipSelected]}
                        onPress={() => setRpe(value)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            selected && styles.chipTextSelected,
                          ]}
                        >
                          {value}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                {!!errors.rpe && <Text style={styles.error}>{errors.rpe}</Text>}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Energía</Text>
                <View style={styles.segmentedRow}>
                  {energyOptions.map((option) => {
                    const selected = energy === option.value;

                    return (
                      <Pressable
                        key={option.value}
                        style={[
                          styles.segmentButton,
                          selected && styles.chipSelected,
                        ]}
                        onPress={() => setEnergy(option.value)}
                      >
                        <Text
                          style={[
                            styles.segmentText,
                            selected && styles.chipTextSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                {!!errors.energy && (
                  <Text style={styles.error}>{errors.energy}</Text>
                )}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Dolor</Text>
                <View style={styles.segmentedRow}>
                  <Pressable
                    style={[
                      styles.segmentButton,
                      pain === false && styles.chipSelected,
                    ]}
                    onPress={() => setPain(false)}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        pain === false && styles.chipTextSelected,
                      ]}
                    >
                      No
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.segmentButton,
                      pain === true && styles.warningChip,
                    ]}
                    onPress={() => setPain(true)}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        pain === true && styles.warningChipText,
                      ]}
                    >
                      Sí
                    </Text>
                  </Pressable>
                </View>
                {!!errors.pain && <Text style={styles.error}>{errors.pain}</Text>}
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputField}>
                  <Text style={styles.label}>Kilómetros realizados</Text>
                  <TextInput
                    value={completedKmText}
                    onChangeText={setCompletedKmText}
                    keyboardType="decimal-pad"
                    placeholder="0"
                    placeholderTextColor={theme.colors.textMuted}
                    style={styles.input}
                  />
                  {!!errors.completedKm && (
                    <Text style={styles.error}>{errors.completedKm}</Text>
                  )}
                </View>

                <View style={styles.inputField}>
                  <Text style={styles.label}>Duración real</Text>
                  <TextInput
                    value={actualDurationText}
                    onChangeText={setActualDurationText}
                    keyboardType="decimal-pad"
                    placeholder="min"
                    placeholderTextColor={theme.colors.textMuted}
                    style={styles.input}
                  />
                  {!!errors.actualDuration && (
                    <Text style={styles.error}>{errors.actualDuration}</Text>
                  )}
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Nota opcional</Text>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="Cómo se sintió la sesión"
                  placeholderTextColor={theme.colors.textMuted}
                  style={[styles.input, styles.noteInput]}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Pressable style={styles.secondaryButton} onPress={onClose}>
                <Text style={styles.secondaryButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable style={styles.primaryButton} onPress={handleSave}>
                <MaterialCommunityIcons
                  name="check"
                  size={18}
                  color={theme.colors.onPrimary}
                />
                <Text style={styles.primaryButtonText}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    justifyContent: "flex-end",
  },

  modalCard: {
    maxHeight: "92%",
    borderTopLeftRadius: theme.radius.xxl,
    borderTopRightRadius: theme.radius.xxl,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    padding: theme.spacing.xl,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },

  headerText: {
    flex: 1,
    minWidth: 0,
  },

  kicker: {
    fontSize: theme.typography.label,
    color: theme.colors.primaryMuted,
    fontWeight: theme.fontWeight.bold,
    textTransform: "uppercase",
    marginBottom: 4,
  },

  title: {
    fontSize: theme.typography.titleMD,
    lineHeight: 26,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.bold,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },

  form: {
    gap: spacing.lg,
    paddingBottom: spacing.md,
  },

  field: {
    gap: spacing.sm,
  },

  label: {
    fontSize: theme.typography.label,
    color: theme.colors.textTechnical,
    fontWeight: theme.fontWeight.bold,
    textTransform: "uppercase",
  },

  rpeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  rpeChip: {
    width: 42,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },

  segmentedRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },

  segmentButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },

  chipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.borderAccent,
  },

  chipText: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.bold,
  },

  chipTextSelected: {
    color: theme.colors.onPrimary,
  },

  segmentText: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.bold,
  },

  warningChip: {
    backgroundColor: theme.colors.warningLight,
    borderColor: "rgba(245, 184, 75, 0.42)",
  },

  warningChipText: {
    color: theme.colors.warning,
  },

  inputRow: {
    flexDirection: "row",
    gap: spacing.md,
  },

  inputField: {
    flex: 1,
    minWidth: 0,
    gap: spacing.sm,
  },

  input: {
    minHeight: 46,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    backgroundColor: theme.colors.surfaceAlt,
    color: theme.colors.text,
    paddingHorizontal: spacing.md,
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.semibold,
  },

  noteInput: {
    minHeight: 92,
    paddingTop: spacing.md,
  },

  error: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.error,
    lineHeight: 18,
  },

  footer: {
    flexDirection: "row",
    gap: spacing.md,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },

  secondaryButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.bold,
  },

  primaryButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },

  primaryButtonText: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.bold,
  },
});
