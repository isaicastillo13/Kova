import { colors, theme } from "@/src/constants/theme";
import { StyleSheet, Text, View } from "react-native";

type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = total > 0 ? current / total : 0;

  return (
    <View>
      <Text style={{ color: colors.white }}>{Math.round(progress * 100)}%</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    height: 12,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: theme.colors.primaryDark,
    borderRadius: 999,
  },
});
