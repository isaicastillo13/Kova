import { spacing, theme } from "@/src/constants/theme";
import { Image, StyleSheet, Text, View } from "react-native";

type Props = {
  name: "Isaias";
  date: string;
  imageUrl?: string;
  onSearchPress?: () => void;
};

export default function Header({ name, date, imageUrl, onSearchPress }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image
          source={
            imageUrl
              ? { uri: imageUrl }
              : require("../../assets/images/avatar.jpg")
          }
          style={styles.avatar}
        />

        {/* Texto */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Hello, {name || 'Isaias'}</Text>
          <Text style={styles.subtitle}>{date || '02/04/2026'}</Text>
        </View>

         <Image
          source={
            imageUrl
              ? { uri: imageUrl }
              : require("@/assets/images/iconAppNaranja.png")
          }
          style={styles.avatar}
        />
      </View>
      {/* Avatar */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: spacing.xxxl,
    paddingHorizontal: spacing.xxl,
  },

  screenTitle: {
    fontSize: theme.typography.titleLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
  },

  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },

  cardTitle: {
    fontSize: theme.typography.titleMD,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },

  label: {
    fontSize: theme.typography.bodyMD,
    color: theme.colors.textSecondary,
  },

  value: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.pill,
  },

  textContainer: {
    flex: 1,
    justifyContent: "center",
    marginLeft: theme.spacing.md,
  },

  title: {
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },

  subtitle: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
});
