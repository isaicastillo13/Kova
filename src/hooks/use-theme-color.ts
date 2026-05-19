/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from "../hooks/use-color-scheme";
import { Colors, defaultThemeMode } from "../constants/theme";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const selectedTheme = useColorScheme() ?? defaultThemeMode;
  const colorFromProps = props[selectedTheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[selectedTheme][colorName];
  }
}
