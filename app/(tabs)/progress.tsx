import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/src/constants/theme';

export default function ProgressScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu progreso 📈</Text>
      <Text style={styles.subtitle}>
        Aquí verás qué tan cerca estás de tu objetivo
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