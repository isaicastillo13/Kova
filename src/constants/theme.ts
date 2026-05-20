export type ThemeMode = "dark" | "light";

const palette = {
  primary: "#ff6d29",
  primaryHot: "#ffb599",
  primaryDeep: "#a63b00",
  ember: "#453027",

  black: "#000000",
  obsidian: "#0c0f0f",
  surfaceLow: "#121414",
  surface: "#1a1c1c",
  surfaceHigh: "#1e2020",
  surfaceHighest: "#282a2b",
  surfaceBright: "#333535",

  white: "#ffffff",
  daylight: "#f8f9fa",
  daylightLow: "#edeeef",
  daylightSurface: "#ffffff",
  slate: "#191c1d",
  warmText: "#e1bfb3",
  graphite: "#bababa",

  success: "#35d07f",
  warning: "#f5b84b",
  error: "#ff6b61",
  info: "#78c7ff",
  purple: "#c6a6ff",
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
  xxl: 24,
  card: 16,
  pill: 999,
} as const;

const sharedTypography = {
  hero: 48,
  display: 36,
  titleXL: 32,
  titleLG: 24,
  titleMD: 20,
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

const sharedFontFamily = {
  body: "System",
  heading: "System",
  technical: "monospace",
  stitchBody: "Hanken Grotesk",
  stitchTechnical: "JetBrains Mono",
} as const;

function createColors(mode: ThemeMode) {
  const isDark = mode === "dark";

  return {
    mode,

    primary: palette.primary,
    primaryDark: isDark ? palette.primaryHot : palette.primaryDeep,
    primaryLight: isDark ? "rgba(255, 109, 41, 0.18)" : "#ffdbce",
    primarySoft: isDark ? "rgba(255, 109, 41, 0.10)" : "#fff0ea",
    primaryMuted: isDark ? palette.primaryHot : palette.primaryDeep,
    onPrimary: isDark ? palette.black : palette.white,

    accent: palette.primaryHot,
    accentSoft: isDark ? "rgba(255, 181, 153, 0.12)" : "#fff0ea",

    background: isDark ? palette.obsidian : palette.daylight,
    backgroundAlt: isDark ? palette.black : palette.daylightLow,
    surface: isDark ? palette.surface : palette.daylightSurface,
    surfaceAlt: isDark ? palette.surfaceHigh : palette.daylightLow,
    surfaceMuted: isDark ? palette.surfaceLow : "#edeeef",
    surfaceElevated: isDark ? palette.surfaceHighest : palette.daylightSurface,
    surfaceBright: isDark ? palette.surfaceBright : "#e1e3e4",
    surfaceGlass: isDark ? "rgba(250, 250, 250, 0.10)" : "rgba(255, 255, 255, 0.86)",
    surfaceGlassStrong: isDark ? "rgba(250, 250, 250, 0.16)" : "rgba(255, 255, 255, 0.92)",
    surfacePressed: isDark ? "rgba(255, 109, 41, 0.14)" : "#fff0ea",

    border: isDark ? "rgba(255, 255, 255, 0.08)" : "#e5dfda",
    borderStrong: isDark ? "rgba(255, 255, 255, 0.14)" : "#d7cec7",
    borderAccent: isDark ? "rgba(255, 109, 41, 0.46)" : "rgba(255, 109, 41, 0.42)",
    borderWarm: isDark ? "rgba(169, 138, 127, 0.36)" : "#e1bfb3",

    text: isDark ? "#e8e0e5" : palette.slate,
    textSecondary: isDark ? "rgba(232, 224, 229, 0.70)" : "#625c58",
    textMuted: isDark ? "rgba(232, 224, 229, 0.46)" : "#908883",
    textInverse: isDark ? palette.slate : palette.white,
    textWarm: isDark ? palette.warmText : "#594138",
    textTechnical: isDark ? palette.graphite : "#5d5e61",

    success: palette.success,
    successLight: isDark ? "rgba(53, 208, 127, 0.14)" : "#dcfce7",
    warning: palette.warning,
    warningLight: isDark ? "rgba(245, 184, 75, 0.15)" : "#fff7db",
    error: palette.error,
    errorLight: isDark ? "rgba(255, 107, 97, 0.15)" : "#fee2e2",
    info: palette.info,
    infoLight: isDark ? "rgba(120, 199, 255, 0.14)" : "#dbeafe",
    purple: palette.purple,
    purpleLight: isDark ? "rgba(198, 166, 255, 0.14)" : "#ede9fe",

    lowIntensity: palette.success,
    mediumIntensity: palette.warning,
    highIntensity: palette.error,
    recovery: palette.info,

    white: palette.white,
    black: isDark ? palette.black : "#171514",
    charcoal: isDark ? "#161316" : "#1f1d1b",
    blue: isDark ? "#152033" : "#dbeafe",
    glow: palette.ember,
    heatGlow: isDark ? "rgba(255, 109, 41, 0.08)" : "rgba(255, 109, 41, 0.12)",
    overlay: isDark ? "rgba(0, 0, 0, 0.78)" : "rgba(255, 255, 255, 0.78)",
  } as const;
}

function createShadows(mode: ThemeMode) {
  const isDark = mode === "dark";

  return {
    card: {
      shadowColor: isDark ? palette.primary : "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: isDark ? 0.12 : 0.06,
      shadowRadius: 24,
      elevation: 5,
    },
    soft: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDark ? 0.16 : 0.04,
      shadowRadius: 18,
      elevation: 2,
    },
    floating: {
      shadowColor: isDark ? palette.primary : "#000",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: isDark ? 0.18 : 0.08,
      shadowRadius: 32,
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
    fontFamily: sharedFontFamily,
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
