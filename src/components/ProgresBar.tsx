import { theme } from "@/src/constants/theme";
import { StyleSheet, View } from "react-native";

type ProgressBarProps = {
  current: number;
  total: number;
  color?: string;
  trackColor?: string;
};

export function ProgressBar({
  current,
  total,
  color = theme.colors.primary,
  trackColor = theme.colors.primaryLight,
}: ProgressBarProps) {
  const progress = total > 0 ? Math.min(Math.max(current / total, 0), 1) : 0;

  return (
    <View style={[styles.track, { backgroundColor: trackColor }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${progress * 100}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
});
