import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { theme } from "@/src/constants/theme";

type Variant = "primary" | "surface";

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  style?: ViewStyle;
};

export default function AppCard({
  children,
  variant = "surface",
  style,
}: Props) {
  return (
    <View style={[styles.card, styles[variant], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.card,
    padding: theme.spacing.xxl,
    borderWidth: 1,
    ...theme.shadows.card,
  },
  primary: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  surface: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
  },
});
