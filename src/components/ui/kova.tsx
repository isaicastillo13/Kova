import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { theme } from "@/src/constants/theme";

type BaseCardVariant = "surface" | "elevated" | "glass" | "accent" | "hero";

type BaseCardProps = {
  children: React.ReactNode;
  variant?: BaseCardVariant;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function BaseCard({
  children,
  variant = "surface",
  compact = false,
  style,
}: BaseCardProps) {
  return (
    <View
      style={[
        styles.card,
        compact && styles.cardCompact,
        cardVariants[variant],
        style,
      ]}
    >
      {children}
    </View>
  );
}

type BadgeTone =
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function Badge({
  label,
  tone = "primary",
  style,
  textStyle,
}: BadgeProps) {
  const palette = tonePalette[tone];

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }, style]}>
      <Text style={[styles.badgeText, { color: palette.fg }, textStyle]}>
        {label}
      </Text>
    </View>
  );
}

type PillProps = {
  children: React.ReactNode;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Pill({ children, selected = false, style }: PillProps) {
  return (
    <View style={[styles.pill, selected && styles.pillSelected, style]}>
      {typeof children === "string" ? (
        <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  helper?: string;
  icon?: React.ReactNode;
  tone?: BadgeTone;
  style?: StyleProp<ViewStyle>;
};

export function MetricCard({
  label,
  value,
  helper,
  icon,
  tone = "primary",
  style,
}: MetricCardProps) {
  const palette = tonePalette[tone];

  return (
    <BaseCard compact style={[styles.metricCard, style]}>
      <View style={styles.metricTop}>
        {!!icon && (
          <View style={[styles.metricIcon, { backgroundColor: palette.bg }]}>
            {icon}
          </View>
        )}
        <Text style={styles.metricLabel}>{label}</Text>
      </View>
      <Text style={styles.metricValue} numberOfLines={1}>
        {value}
      </Text>
      {!!helper && (
        <Text style={styles.metricHelper} numberOfLines={2}>
          {helper}
        </Text>
      )}
    </BaseCard>
  );
}

type ProgressCardProps = {
  label: string;
  value: string;
  progress: number;
  helper?: string;
  right?: React.ReactNode;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function ProgressCard({
  label,
  value,
  progress,
  helper,
  right,
  color = theme.colors.primary,
  style,
}: ProgressCardProps) {
  const normalizedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <BaseCard variant="elevated" style={[styles.progressCard, style]}>
      <View style={styles.progressHeader}>
        <View style={styles.progressText}>
          <Text style={styles.progressLabel}>{label}</Text>
          <Text style={styles.progressValue}>{value}</Text>
        </View>
        {right}
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${normalizedProgress * 100}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>

      {!!helper && <Text style={styles.progressHelper}>{helper}</Text>}
    </BaseCard>
  );
}

type SectionHeaderProps = {
  title: string;
  meta?: string;
  action?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function SectionHeader({
  title,
  meta,
  action,
  style,
}: SectionHeaderProps) {
  return (
    <View style={[styles.sectionHeader, style]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ?? (meta ? <Text style={styles.sectionMeta}>{meta}</Text> : null)}
    </View>
  );
}

type FloatingTabBarItemProps = {
  focused: boolean;
  icon: React.ReactNode;
};

export function FloatingTabBarItem({ focused, icon }: FloatingTabBarItemProps) {
  return (
    <View style={[styles.floatingTabItem, focused && styles.floatingTabItemActive]}>
      {icon}
    </View>
  );
}

type ProgressRingProps = {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
};

export function ProgressRing({
  progress,
  size = 84,
  strokeWidth = 8,
  color = theme.colors.primary,
  trackColor = theme.colors.border,
  children,
}: ProgressRingProps) {
  const normalizedProgress = Math.min(Math.max(progress, 0), 1);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - normalizedProgress);

  return (
    <View style={[styles.ring, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {!!children && <View style={styles.ringContent}>{children}</View>}
    </View>
  );
}

type Intensity = "baja" | "media" | "alta" | "recovery" | "rest";

type IntensityChipProps = {
  intensity: Intensity;
  label?: string;
};

export function IntensityChip({ intensity, label }: IntensityChipProps) {
  const chip = intensityPalette[intensity];
  return (
    <Badge
      label={label ?? chip.label}
      style={{ backgroundColor: chip.bg }}
      textStyle={{ color: chip.fg }}
      tone="neutral"
    />
  );
}

const tonePalette = {
  primary: { fg: theme.colors.primaryMuted, bg: theme.colors.primaryLight },
  success: { fg: theme.colors.success, bg: theme.colors.successLight },
  warning: { fg: theme.colors.warning, bg: theme.colors.warningLight },
  error: { fg: theme.colors.error, bg: theme.colors.errorLight },
  info: { fg: theme.colors.info, bg: theme.colors.infoLight },
  neutral: { fg: theme.colors.textSecondary, bg: theme.colors.surfaceAlt },
} as const;

const intensityPalette = {
  baja: { fg: theme.colors.success, bg: theme.colors.successLight, label: "Baja" },
  media: { fg: theme.colors.warning, bg: theme.colors.warningLight, label: "Media" },
  alta: { fg: theme.colors.error, bg: theme.colors.errorLight, label: "Alta" },
  recovery: {
    fg: theme.colors.info,
    bg: theme.colors.infoLight,
    label: "Recuperación",
  },
  rest: {
    fg: theme.colors.textSecondary,
    bg: theme.colors.surfaceAlt,
    label: "Descanso",
  },
} as const;

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.card,
    borderWidth: 1,
    padding: theme.spacing.xxl,
    overflow: "hidden",
  },
  cardCompact: {
    padding: theme.spacing.lg,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  badgeText: {
    fontSize: theme.typography.label,
    fontWeight: theme.fontWeight.bold,
    textTransform: "uppercase",
  },
  pill: {
    minHeight: 36,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceAlt,
    paddingHorizontal: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  pillSelected: {
    borderColor: theme.colors.borderAccent,
    backgroundColor: theme.colors.primary,
  },
  pillText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySM,
    fontWeight: theme.fontWeight.semibold,
  },
  pillTextSelected: {
    color: theme.colors.onPrimary,
  },
  metricCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: theme.colors.surfaceGlass,
  },
  metricTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  metricIcon: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  metricLabel: {
    flex: 1,
    color: theme.colors.textTechnical,
    fontSize: theme.typography.label,
    fontWeight: theme.fontWeight.bold,
    textTransform: "uppercase",
  },
  metricValue: {
    color: theme.colors.text,
    fontSize: theme.typography.titleSM,
    fontWeight: theme.fontWeight.bold,
  },
  metricHelper: {
    marginTop: 3,
    color: theme.colors.textMuted,
    fontSize: theme.typography.bodySM,
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.titleSM,
    fontWeight: theme.fontWeight.extrabold,
  },
  sectionMeta: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySM,
    fontWeight: theme.fontWeight.semibold,
  },
  floatingTabItem: {
    width: 52,
    height: 42,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  floatingTabItemActive: {
    backgroundColor: theme.colors.primary,
    borderColor: "rgba(255, 255, 255, 0.16)",
    ...theme.shadows.soft,
  },
  progressCard: {
    gap: theme.spacing.md,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  progressText: {
    flex: 1,
    minWidth: 0,
  },
  progressLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySM,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: 4,
  },
  progressValue: {
    color: theme.colors.text,
    fontSize: theme.typography.titleMD,
    fontWeight: theme.fontWeight.extrabold,
  },
  progressTrack: {
    height: 11,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceMuted,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: theme.radius.pill,
  },
  progressHelper: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySM,
    lineHeight: 19,
  },
  ring: {
    alignItems: "center",
    justifyContent: "center",
  },
  ringContent: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});

const cardVariants = StyleSheet.create({
  surface: {
    backgroundColor: theme.colors.surfaceGlass,
    borderColor: theme.colors.border,
    ...theme.shadows.soft,
  },
  elevated: {
    backgroundColor: theme.colors.surfaceGlassStrong,
    borderColor: theme.colors.borderStrong,
    ...theme.shadows.card,
  },
  glass: {
    backgroundColor: theme.colors.surfaceGlass,
    borderColor: theme.colors.borderStrong,
    ...theme.shadows.soft,
  },
  accent: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.borderAccent,
    ...theme.shadows.soft,
  },
  hero: {
    backgroundColor: theme.colors.charcoal,
    borderColor: theme.colors.borderAccent,
    ...theme.shadows.card,
  },
});
