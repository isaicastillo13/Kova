import { View, Text, StyleSheet, Pressable } from "react-native";
import { theme } from "@/src/constants/theme";
import { useRouter } from "expo-router";
import { useOnboardingStore } from "@/src/store/onboarding-store";
import { useHomeStore } from "@/src/store/home-store";

export default function ProfileScreen() {
  const router = useRouter();

  const resetOnboarding = useOnboardingStore((state) => state.resetOnboarding);
  const resetHome = useHomeStore((state) => state.resetHomeProgress);

  const handleReset = () => {
    resetOnboarding();
    resetHome();

    router.replace("/onboarding");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu perfil 👤</Text>
      <Text style={styles.subtitle}>
        Aquí podrás gestionar tu cuenta y configuración
      </Text>

      {/* 🔴 BOTÓN */}
      <Pressable style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Rehacer onboarding</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => router.push("../edit-plan")}
      >
        <Text style={styles.buttonText}>Editar plan</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
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
    textAlign: "center",
    marginBottom: theme.spacing.xl,
  },

  button: {
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.error, // 🔥 rojo tipo acción crítica
  },

  buttonText: {
    color: theme.colors.white,
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.bold,
  },
});
