import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme } from '@/src/constants/theme';
import { useRouter } from 'expo-router';
import { useOnboardingStore } from '@/src/store/onboarding-store';
import { useHomeStore } from '@/src/store/home-store';

const dayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function formatGoal(goal?: string) {
  switch (goal) {
    case 'resistencia':
      return 'Resistencia';
    case 'rendimiento':
      return 'Rendimiento';
    case 'mantenerme':
      return 'Mantenerme activo';
    case 'competencia':
      return 'Competencia';
    default:
      return 'No definido';
  }
}

function formatLevel(level?: string) {
  switch (level) {
    case 'principiante':
      return 'Principiante';
    case 'intermedio':
      return 'Intermedio';
    case 'avanzado':
      return 'Avanzado';
    default:
      return 'No definido';
  }
}

function formatTrainingType(type?: string) {
  switch (type) {
    case 'running':
      return 'Running';
    case 'swimming':
      return 'Swimming';
    case 'strength':
      return 'Fuerza';
    case 'mixed':
      return 'Mixto';
    default:
      return 'No definido';
  }
}

export default function ProfileScreen() {
  const router = useRouter();

  const {
    goal,
    level,
    days,
    duration,
    trainingType,
    resetOnboarding,
  } = useOnboardingStore();

  const resetHome = useHomeStore((state) => state.resetHomeProgress);

  const handleReset = () => {
    resetOnboarding();
    resetHome();
    router.replace('/onboarding');
  };

  const handleEditPlan = () => {
    router.push('/edit-plan');
  };

  const selectedDays = days.length
    ? days
        .sort((a, b) => a - b)
        .map((day) => dayLabels[day])
        .join(' · ')
    : 'No definido';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu perfil 👤</Text>
      <Text style={styles.subtitle}>
        Gestiona tu configuración y ajusta tu plan cuando lo necesites.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tu plan actual</Text>

        <View style={styles.item}>
          <Text style={styles.label}>Objetivo</Text>
          <Text style={styles.value}>{formatGoal(goal)}</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Nivel</Text>
          <Text style={styles.value}>{formatLevel(level)}</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Días disponibles</Text>
          <Text style={styles.value}>{selectedDays}</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Duración</Text>
          <Text style={styles.value}>
            {duration ? `${duration} min` : 'No definido'}
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Tipo de entrenamiento</Text>
          <Text style={styles.value}>{formatTrainingType(trainingType)}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={handleEditPlan}>
          <Text style={styles.primaryButtonText}>Editar plan</Text>
        </Pressable>

        <Pressable style={styles.dangerButton} onPress={handleReset}>
          <Text style={styles.dangerButtonText}>Rehacer onboarding</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xxl,
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
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },

  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
    marginBottom: theme.spacing.xl,
  },

  cardTitle: {
    fontSize: theme.typography.titleSM,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },

  item: {
    marginBottom: theme.spacing.lg,
  },

  label: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },

  value: {
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },

  actions: {
    gap: theme.spacing.md,
  },

  primaryButton: {
    height: 54,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.bold,
  },

  dangerButton: {
    height: 54,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dangerButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.bold,
  },
});