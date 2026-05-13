export const colors = {
  primary: "#d71920",
  primaryDark: "#9f1118",
  primaryLight: "#fee7e8",
  primarySoft: "#fff1f1",
  primaryMuted: "#ff9ea3",

  background: "#f5f3ef",
  surface: "#ffffff",
  surfaceAlt: "#fbfaf7",
  border: "#e7e0d7",
  borderStrong: "#d7cbbd",

  text: "#23211f",
  textSecondary: "#6f6860",
  textMuted: "#a79d93",

  success: "#16a34a",
  successLight: "#dcfce7",
  warning: "#f59e0b",
  warningLight: "#fff7db",
  error: "#dc2626",
  errorLight: "#fee2e2",
  info: "#2563eb",
  infoLight: "#dbeafe",
  purple: "#7c3aed",
  purpleLight: "#ede9fe",

  white: "#ffffff",
  black: "#171514",
  charcoal: "#1f1d1b",
  blue: "#162133",
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
  xxl: 28,
  pill: 999,
};

export const typography = {
  hero: 40,
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  soft: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
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
    primary: '#d71920',
    background: '#f5f3ef',
    text: '#23211f',
    textSecondary: '#6f6860',
    textMuted: '#a79d93',
    border: '#e7e0d7',
    white: '#ffffff',
    tint: '#d71920',
  },
  dark: {
    primary: '#d71920',
    background: '#171514',
    text: '#f3f4f6',
    textSecondary: '#d1d5db',
    textMuted: '#9ca3af',
    border: '#27272a',
    white: '#ffffff',
    tint: '#d71920',
  },
};

export type AppTheme = typeof theme;
