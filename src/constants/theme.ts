export const colors = {
  primary: "#d00a0c",
  primaryDark: "#a10809",
  primaryLight: "#fbe7e7",

  background: "#ffffff",
  surface: "#f8f8f8",
  border: "#e5e7eb",

  text: "#404040",
  textSecondary: "#6b7280",
  textMuted: "#9ca3af",

  success: "#16a34a",
  warning: "#f59e0b",
  error: "#dc2626",

  white: "#ffffff",
  black: "#404040",
};

export const spacing = {
  none:0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const typography = {
  titleXL: 32,
  titleLG: 26,
  titleMD: 22,
  titleSM: 18,
  bodyLG: 16,
  bodyMD: 14,
  bodySM: 12,
};

export const fontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

export const shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
};

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  fontWeight,
  shadows,
};

export const Colors = {
  light: {
    primary: '#d00a0c',
    background: '#ffffff',
    text: '#404040',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    border: '#e5e7eb',
    white: '#ffffff',
    tint: '#d00a0c',
  },
  dark: {
    primary: '#d00a0c',
    background: '#404040',
    text: '#f3f4f6',
    textSecondary: '#d1d5db',
    textMuted: '#9ca3af',
    border: '#27272a',
    white: '#ffffff',
    tint: '#d00a0c',
  },
};

export type AppTheme = typeof theme;
