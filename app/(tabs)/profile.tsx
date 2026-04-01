import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/src/constants/theme';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu perfil 👤</Text>
      <Text style={styles.subtitle}>
        Aquí podrás gestionar tu cuenta y configuración
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.typography.titleLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});