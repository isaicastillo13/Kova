import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { spacing, theme } from "@/src/constants/theme";

type Props = {
  name?: string;
  greeting?: string;
  avatarUrl?: string;
};

export default function HomeHeader({
  name = "Isaias",
  greeting = "Buenos días",
  avatarUrl,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Image
          source={
            avatarUrl
              ? { uri: avatarUrl }
              : require("../../../assets/images/avatar.jpg")
          }
          style={styles.avatar}
        />

        <View style={styles.textContainer}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>

      <View style={styles.brandPill}>
        <Image
          source={require("../../../assets/images/iconAppNaranja.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <MaterialCommunityIcons
          name="chevron-right"
          size={18}
          color={theme.colors.textSecondary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },

  textContainer: {
    flex: 1,
    marginLeft: spacing.md,
    minWidth: 0,
  },

  greeting: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },

  name: {
    fontSize: theme.typography.titleLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  brandPill: {
    height: 44,
    minWidth: 76,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    gap: 2,
  },

  logo: {
    width: 26,
    height: 26,
  },
});
