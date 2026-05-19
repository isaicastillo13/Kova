import { Link } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BaseCard } from '@/src/components/ui/kova';
import { theme } from '@/src/constants/theme';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <BaseCard variant="elevated" style={styles.card}>
        <View style={styles.icon}>
          <MaterialCommunityIcons
            name="run-fast"
            size={28}
            color={theme.colors.onPrimary}
          />
        </View>
        <Text style={styles.title}>Kova</Text>
        <Text style={styles.copy}>
          Tu plan sigue activo. Vuelve al inicio para continuar con la semana.
        </Text>

        <Link href="/" dismissTo asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Volver al inicio</Text>
          </Pressable>
        </Link>
      </BaseCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xxl,
    backgroundColor: theme.colors.background,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    padding: theme.spacing.xxl,
  },
  icon: {
    width: 62,
    height: 62,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.titleXL,
    lineHeight: 36,
    fontWeight: theme.fontWeight.extrabold,
  },
  copy: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodyMD,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    marginTop: theme.spacing.xl,
    minHeight: 54,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xxl,
  },
  buttonText: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.bold,
  },
});
