import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { theme } from '@/src/constants/theme';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isButtonDisabled = useMemo(() => {
    return !email.trim() || !password.trim() || isLoading;
  }, [email, password, isLoading]);

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleLogin = async () => {
    let hasError = false;

    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('El correo es obligatorio');
      hasError = true;

    } else if (!validateEmail(email.trim())) {
      setEmailError('Ingresa un correo válido');
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError('La contraseña es obligatoria');
      hasError = true;
      
    } else if (password.trim().length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      hasError = true;
    }

    if (hasError) return;

    try {
      setIsLoading(true);

      // Simulación de login
      await new Promise(resolve => setTimeout(resolve, 1200));

      router.replace('/(tabs)');
    } catch (error) {
      setPasswordError('No se pudo iniciar sesión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
            <View style={styles.header}>
            <View style={styles.logoCircle}>

              <Image
              source={require('@/assets/images/iconAppWhite.png')}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
              />
            </View>
            <Text style={styles.brand}>Kova</Text>
          
            </View>

          <View>
            <Text style={styles.title}>Iniciar sesión</Text>
            <Text style={styles.description}>
              Accede para continuar con tu entrenamiento
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  if (emailError) setEmailError('');
                }}
                placeholder="tucorreo@email.com"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={[
                  styles.input,
                  !!emailError && styles.inputError,
                ]}
              />
              {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={[styles.passwordWrapper, !!passwordError && styles.inputError]}>
                <TextInput
                  value={password}
                  onChangeText={text => {
                    setPassword(text);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="••••••••"
                  placeholderTextColor={theme.colors.textMuted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.passwordInput}
                />
                <Pressable onPress={() => setShowPassword(prev => !prev)}>
                  <Text style={styles.showPasswordText}>
                    {showPassword ? 'Ocultar' : 'Ver'}
                  </Text>
                </Pressable>
              </View>
              {!!passwordError && (
                <Text style={styles.errorText}>{passwordError}</Text>
              )}
            </View>

            <Pressable style={styles.forgotWrapper}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </Pressable>

            <Pressable
              style={[
                styles.loginButton,
                isButtonDisabled && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isButtonDisabled}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <Text style={styles.loginButtonText}>Iniciar sesión</Text>
              )}
            </Pressable>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>¿No tienes cuenta? </Text>
              <Link href="/register" asChild>
                <Pressable>
                  <Text style={styles.footerLink}>Crear cuenta</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xxl,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxxl,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  logoText: {
    color: theme.colors.white,
    fontSize: theme.typography.titleLG,
    fontWeight: theme.fontWeight.bold,
  },
  brand: {
    fontSize: theme.typography.titleLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  title: {
    fontSize: theme.typography.titleMD,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  formGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.lg,
    fontSize: theme.typography.bodyLG,
    color: theme.colors.text,
    backgroundColor: theme.colors.white,
  },
  passwordWrapper: {
    height: 52,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
  },
  passwordInput: {
    flex: 1,
    fontSize: theme.typography.bodyLG,
    color: theme.colors.text,
    paddingRight: theme.spacing.md,
  },
  showPasswordText: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
    fontSize: theme.typography.bodyMD,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.error,
    fontSize: theme.typography.bodySM,
  },
  forgotWrapper: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.xl,
  },
  forgotText: {
    color: theme.colors.primary,
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.medium,
  },
  loginButton: {
    height: 54,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.bold,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodyMD,
  },
  footerLink: {
    color: theme.colors.primary,
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.bold,
  },
});