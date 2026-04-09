import { colors, spacing, theme } from "@/src/constants/theme";
import { Image, StyleSheet, Text, View } from "react-native";
import { ProgressBar } from "@/src/components/ProgresBar";
import AntDesign from "@expo/vector-icons/AntDesign";
import AnimatedRunner from "@/src/components/AnimatedRunner";
import WeeklyCalendar from "@/src/components/weeklyCalendar";

type Props = {
  name: "Isaias";
  date: string;
  imageUrl?: string;
  onSearchPress?: () => void;
};

export default function Header({ name, date, imageUrl, onSearchPress }: Props) {
  const weekDays = [
    { dayNumber: 18, isToday: false, isCompleted: true },
    { dayNumber: 19, isToday: false, isCompleted: true },
    { dayNumber: 20, isToday: false, isCompleted: false },
    { dayNumber: 21, isToday: true, isCompleted: true },
    { dayNumber: 22, isToday: false, isCompleted: false },
    { dayNumber: 23, isToday: false, isCompleted: false },
    { dayNumber: 24, isToday: false, isCompleted: false },
  ];
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
          <Text style={styles.title}>Hello, {name || "Isaias"}</Text>
          <Text style={styles.subtitle}>{date || "02/04/2026"}</Text>
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
      <View style={styles.card}>
        <View>
          <View style={styles.row}>
            <Image
              source={
                imageUrl
                  ? { uri: imageUrl }
                  : require("@/assets/images/iconAppWhite.png")
              }
              style={styles.avatar}
            />
            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <Text style={styles.cardTitle}>41</Text>
              <Text style={[styles.subtitle, { color: "white" }]}>km</Text>
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.label}>1 de 7 sesiones completadas</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
              borderRadius: theme.radius.sm,
            }}
          >
            <View style={{ flex: 1 }}>
              <ProgressBar current={2} total={41} />
            </View>
            <AntDesign name="trophy" size={24} color="white" />
          </View>
        </View>
      </View>

      <View style={{flexDirection:'column', padding:spacing.sm }} >
        <Text style={styles.subtitle}>Tu Racha!</Text>
        <View style={styles.containerCalendar}>
          <WeeklyCalendar days={weekDays} />
        </View>
      </View>
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
  containerCalendar: {
    paddingTop: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },

  screenTitle: {
    fontSize: theme.typography.titleLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
  },

  card: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },

  cardTitle: {
    fontSize: theme.typography.titleMD,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: 0,
    lineHeight: 34, // 🔥 clave
  },

  cardGoals: {
    fontSize: theme.typography.titleLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },

  label: {
    fontSize: theme.typography.titleSM,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
  },

  value: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },

  avatar: {
    width: 48,
    height: 48,
  },

  textContainer: {
    flex: 1,
    alignItems: "center",
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
