import { colors, spacing, theme } from "@/src/constants/theme";
import { Image, StyleSheet, Text, View } from "react-native";
import { ProgressBar } from "@/src/components/ProgresBar";
import AntDesign from "@expo/vector-icons/AntDesign";
import WeeklyCalendar from "@/src/components/weeklyCalendar";
import { getWeekDaysWithLabels } from "@/src/components/utils/date";

type Props = {
  name?: string;
  date?: string;
  imageUrl?: string;
  onSearchPress?: () => void;
};

export default function Header({
  name = "Isaias",
  date = "02/04/2026",
  imageUrl,
}: Props) {
  const completedDays = [0, 1, 3];
  const weekDays = getWeekDaysWithLabels(completedDays);

  return (
    <View style={styles.screen}>
      {/* SECCION ROJA UNIFICADA */}
      <View style={styles.redSection}>
        {/* TOP ROW */}
        <View style={styles.topRow}>
          <Image
            source={
              imageUrl
                ? { uri: imageUrl }
                : require("../../assets/images/avatar.jpg")
            }
            style={styles.avatar}
          />

          <View style={styles.textContainer}>
            <Text style={styles.greeting}>Buenos días</Text>
            <Text style={styles.userName}>{name} 👋</Text>
          </View>

          <Image
            source={require("@/assets/images/iconAppNaranja.png")}
            style={styles.appIcon}
          />
        </View>

        {/* RESUMEN */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryLeft}>
              <Image
                source={require("@/assets/images/iconAppWhite.png")}
                style={styles.appIcon}
              />

              <View style={styles.kmContainer}>
                <Text style={styles.cardTitle}>41</Text>
                <Text style={styles.cardSubtitleWhite}>km</Text>
              </View>
            </View>
          </View>

          <Text style={styles.label}>1 de 7 sesiones completadas</Text>

          <View style={styles.progressRow}>
            <View style={styles.progressWrapper}>
              <ProgressBar current={2} total={41} />
            </View>
            <AntDesign name="trophy" size={24} color="white" />
          </View>
        </View>

        {/* RACHA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleWhite}>Tu racha</Text>
          <View style={styles.containerCalendar}>
            <WeeklyCalendar days={weekDays} />
          </View>
        </View>
      </View>

      {/* CONTENIDO */}
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Entrenamiento de hoy</Text>

          <View style={styles.workoutCard}>
            <Text style={styles.workoutType}>Intervalos</Text>

            <View style={styles.workoutBlock}>
              <Text style={styles.workoutTitle}>Rodaje de Velocidad</Text>
              <Text style={styles.workoutMeta}>
                Martes · 55 min · Dificultad media
              </Text>
            </View>

            <View style={styles.workoutBlock}>
              <Text style={styles.workoutMetric}>6x400</Text>
              <Text style={styles.workoutMeta}>FC 160 - 175</Text>
              <Text style={styles.workoutDone}>Finalizado</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  redSection: {
    backgroundColor: colors.primary,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xxl,
    gap: spacing.lg,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },

  section: {
    gap: spacing.sm,
  },

  sectionTitle: {
    fontSize: theme.typography.titleSM,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  sectionTitleWhite: {
    fontSize: theme.typography.titleSM,
    fontWeight: theme.fontWeight.bold,
    color: "rgba(255,255,255,0.85)",
    marginLeft: spacing.xs,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },

  appIcon: {
    width: 48,
    height: 48,
  },

  textContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },

  greeting: {
    fontSize: theme.typography.bodyMD,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 4,
  },

  userName: {
    fontSize: theme.typography.titleLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },

  summaryCard: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xxl,
    backgroundColor: "transparent",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  summaryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  kmContainer: {
    alignItems: "center",
  },

  cardTitle: {
    fontSize: theme.typography.titleMD,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: 0,
    lineHeight: 34,
  },

  cardSubtitleWhite: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.white,
    marginTop: 0,
    lineHeight: 14,
  },

  label: {
    fontSize: theme.typography.bodyMD,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.white,
    marginBottom: spacing.sm,
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  progressWrapper: {
    flex: 1,
  },

  containerCalendar: {
    paddingTop: theme.spacing.sm,
    backgroundColor: "transparent",
  },

  workoutCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },

  workoutType: {
    fontSize: theme.typography.titleSM,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: spacing.md,
  },

  workoutBlock: {
    marginBottom: spacing.md,
  },

  workoutTitle: {
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 4,
  },

  workoutMeta: {
    fontSize: theme.typography.bodySM,
    color: theme.colors.textSecondary,
  },

  workoutMetric: {
    fontSize: theme.typography.bodyLG,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },

  workoutDone: {
    fontSize: theme.typography.bodySM,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    marginTop: 4,
  },
});