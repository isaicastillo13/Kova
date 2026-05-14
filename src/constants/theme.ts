export type ThemeMode = "dark" | "light";

const palette = {
  orange: "#C50212",
  orangeSoft: "#ff5b68",
  orangeDeep: "#a63b00",
  ember: "#453027",

  black: "#0c0f0f",
  obsidian: "#121414",
  surfaceLow: "#1a1c1c",
  surface: "#1e2020",
  surfaceHigh: "#282a2b",
  surfaceHighest: "#333535",

  white: "#ffffff",
  daylight: "#f8f9fa",
  daylightLow: "#f3f4f5",
  daylightSurface: "#ffffff",
  slate: "#191c1d",

  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#38bdf8",
  purple: "#a78bfa",
} as const;

const sharedSpacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

const sharedRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  card: 24,
  pill: 999,
} as const;

const sharedTypography = {
  hero: 44,
  display: 36,
  titleXL: 32,
  titleLG: 26,
  titleMD: 22,
  titleSM: 18,
  bodyLG: 16,
  bodyMD: 14,
  bodySM: 12,
  label: 11,
} as const;

const sharedFontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  extrabold: "800" as const,
};

function createColors(mode: ThemeMode) {
  const isDark = mode === "dark";

  return {
    mode,

    primary: palette.orange,
    primaryDark: isDark ? palette.orangeSoft : palette.orangeDeep,
    primaryLight: isDark ? "rgba(255, 109, 41, 0.16)" : "#ffdbce",
    primarySoft: isDark ? "rgba(255, 109, 41, 0.10)" : "#fff2ec",
    primaryMuted: isDark ? palette.orangeSoft : "#c2410c",
    onPrimary: isDark ? "#180704" : palette.white,

    accent: palette.orangeSoft,
    accentSoft: isDark ? "rgba(255, 181, 153, 0.12)" : "#fff2ec",

    background: isDark ? palette.obsidian : palette.daylight,
    backgroundAlt: isDark ? palette.black : palette.daylightLow,
    surface: isDark ? palette.surface : palette.daylightSurface,
    surfaceAlt: isDark ? palette.surfaceHigh : palette.daylightLow,
    surfaceMuted: isDark ? palette.surfaceLow : "#edeeef",
    surfaceElevated: isDark ? palette.surfaceHighest : palette.daylightSurface,
    surfaceGlass: isDark ? "rgba(250, 250, 250, 0.10)" : "rgba(255, 255, 255, 0.82)",
    surfacePressed: isDark ? "rgba(255, 109, 41, 0.12)" : "#fff2ec",

    border: isDark ? "rgba(255, 255, 255, 0.10)" : "#e7e8e9",
    borderStrong: isDark ? "rgba(255, 255, 255, 0.18)" : "#d9dadb",
    borderAccent: isDark ? "rgba(255, 109, 41, 0.34)" : "rgba(255, 109, 41, 0.42)",

    text: isDark ? "#f5f2ef" : palette.slate,
    textSecondary: isDark ? "rgba(245, 242, 239, 0.68)" : "#5d5e61",
    textMuted: isDark ? "rgba(245, 242, 239, 0.44)" : "#8d8f92",
    textInverse: isDark ? palette.slate : palette.white,

    success: palette.success,
    successLight: isDark ? "rgba(34, 197, 94, 0.14)" : "#dcfce7",
    warning: palette.warning,
    warningLight: isDark ? "rgba(245, 158, 11, 0.16)" : "#fff7db",
    error: palette.error,
    errorLight: isDark ? "rgba(239, 68, 68, 0.15)" : "#fee2e2",
    info: palette.info,
    infoLight: isDark ? "rgba(56, 189, 248, 0.14)" : "#dbeafe",
    purple: palette.purple,
    purpleLight: isDark ? "rgba(167, 139, 250, 0.14)" : "#ede9fe",

    lowIntensity: palette.success,
    mediumIntensity: palette.warning,
    highIntensity: palette.error,
    recovery: palette.info,

    white: palette.white,
    black: isDark ? palette.black : "#171514",
    charcoal: isDark ? palette.surface : "#1f1d1b",
    blue: isDark ? "#162133" : "#dbeafe",
    glow: palette.ember,
    overlay: isDark ? "rgba(12, 15, 15, 0.78)" : "rgba(255, 255, 255, 0.78)",
  } as const;
}

function createShadows(mode: ThemeMode) {
  const isDark = mode === "dark";

  return {
    card: {
      shadowColor: isDark ? palette.orange : "#000",
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: isDark ? 0.12 : 0.06,
      shadowRadius: 24,
      elevation: 5,
    },
    soft: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDark ? 0.18 : 0.04,
      shadowRadius: 18,
      elevation: 2,
    },
    floating: {
      shadowColor: isDark ? palette.orange : "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: isDark ? 0.18 : 0.08,
      shadowRadius: 26,
      elevation: 12,
    },
    none: {
      shadowOpacity: 0,
      elevation: 0,
    },
  } as const;
}

function createTheme(mode: ThemeMode) {
  return {
    mode,
    colors: createColors(mode),
    spacing: sharedSpacing,
    radius: sharedRadius,
    typography: sharedTypography,
    fontWeight: sharedFontWeight,
    shadows: createShadows(mode),
  } as const;
}

export const themes = {
  dark: createTheme("dark"),
  light: createTheme("light"),
} as const;

export const defaultThemeMode: ThemeMode = "dark";
export const theme = themes[defaultThemeMode];

export const colors = theme.colors;
export const spacing = theme.spacing;
export const radius = theme.radius;
export const typography = theme.typography;
export const fontWeight = theme.fontWeight;
export const shadows = theme.shadows;

export const Colors = {
  light: {
    primary: themes.light.colors.primary,
    background: themes.light.colors.background,
    text: themes.light.colors.text,
    textSecondary: themes.light.colors.textSecondary,
    textMuted: themes.light.colors.textMuted,
    border: themes.light.colors.border,
    white: themes.light.colors.white,
    tint: themes.light.colors.primary,
  },
  dark: {
    primary: themes.dark.colors.primary,
    background: themes.dark.colors.background,
    text: themes.dark.colors.text,
    textSecondary: themes.dark.colors.textSecondary,
    textMuted: themes.dark.colors.textMuted,
    border: themes.dark.colors.border,
    white: themes.dark.colors.white,
    tint: themes.dark.colors.primary,
  },
};

export type AppTheme = typeof theme;
export type ThemeColors = typeof theme.colors;
