import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
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
  return type === 'running' ? 'Running' : 'Running';
}

function formatRaceDistance(value?: string) {
  switch (value) {
    case '5k':
      return '5K';
    case '10k':
      return '10K';
    case '21k':
      return '21K';
    case '42k':
      return 'Maratón';
    case 'general':
      return 'Base aeróbica';
    default:
      return 'No definido';
  }
}

function formatExperience(value?: string) {
  switch (value) {
    case 'new':
      return 'Inicio';
    case 'returning':
      return 'Retomando';
    case 'consistent':
      return 'Constante';
    case 'competitive':
      return 'Competitivo';
    default:
      return 'No definido';
  }
}

function formatInjuryStatus(value?: string) {
  switch (value) {
    case 'none':
      return 'Sin molestias';
    case 'minor':
      return 'Molestia leve';
    case 'recent':
      return 'Lesión reciente';
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
    raceDistance,
    currentWeeklyKm,
    longRunKm,
    easyPace,
    targetDate,
    runningExperience,
    injuryHistory,
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
    ? [...days]
        .sort((a, b) => a - b)
        .map((day) => dayLabels[day])
        .join(' · ')
    : 'No definido';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
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

        <View style={styles.item}>
          <Text style={styles.label}>Distancia objetivo</Text>
          <Text style={styles.value}>{formatRaceDistance(raceDistance)}</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Km semanales actuales</Text>
          <Text style={styles.value}>
            {currentWeeklyKm !== undefined ? `${currentWeeklyKm} km` : 'No definido'}
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Tirada larga actual</Text>
          <Text style={styles.value}>
            {longRunKm !== undefined ? `${longRunKm} km` : 'No definido'}
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Ritmo cómodo</Text>
          <Text style={styles.value}>{easyPace || 'No definido'}</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Experiencia</Text>
          <Text style={styles.value}>{formatExperience(runningExperience)}</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Estado físico</Text>
          <Text style={styles.value}>{formatInjuryStatus(injuryHistory)}</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Fecha objetivo</Text>
          <Text style={styles.value}>{targetDate || 'No definido'}</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  container: {
    padding: theme.spacing.xxl,
    paddingBottom: 40,
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
