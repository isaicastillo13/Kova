import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
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
        <Text style={styles.name}>{name} 👋</Text>
      </View>

      <View style={styles.logoWrapper}>
        <Image
          source={require("../../../assets/images/iconAppNaranja.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.lg,
    backgroundColor: theme.colors.white,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },

  textContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },

  greeting: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },

  name: {
    fontSize: theme.typography.titleLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  logoWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 24,
    height: 24,
  },
});