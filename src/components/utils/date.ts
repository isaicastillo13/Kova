export function getWeekDaysWithLabels(completedDates: string[] = []) {
  const today = new Date();
  const day = today.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const completedDateSet = new Set(completedDates);

  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const labels = ["L", "M", "X", "J", "V", "S", "D"];

  const week = [];

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(monday);
    currentDay.setDate(monday.getDate() + i);

    week.push({
      dayNumber: currentDay.getDate(),
      isToday: currentDay.toDateString() === today.toDateString(),
      isCompleted: completedDateSet.has(formatDateToYYYYMMDD(currentDay)),
      dayLabel: labels[i],
    });
  }

  return week;
}

export function getTodayIndex(): number {
  const today = new Date().getDay(); // 0-6 (domingo-sábado)
  return today === 0 ? 6 : today - 1;
}

export function getTodayDateString(): string {
  const today = new Date();
  return formatDateToYYYYMMDD(today);
}

export function getDateStringForWeekday(dayIndex: number, baseDate = new Date()): string {
  const normalizedDay = Math.min(Math.max(dayIndex, 0), 6);
  const jsDay = baseDate.getDay();
  const mondayOffset = jsDay === 0 ? -6 : 1 - jsDay;
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() + mondayOffset);

  const plannedDate = new Date(monday);
  plannedDate.setDate(monday.getDate() + normalizedDay);

  return formatDateToYYYYMMDD(plannedDate);
}

export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getRelativeDateLabel(dateString: string): string {
  const today = getTodayDateString();
  const yesterday = getPreviousDateString(today);

  if (dateString === today) return "Hoy";
  if (dateString === yesterday) return "Ayer";

  const [year, month, day] = dateString.split("-");
  if (year && month && day) return `${day}/${month}`;

  return dateString;
}

export function getPreviousDateString(dateString: string): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() - 1);
  return formatDateToYYYYMMDD(date);
}

export function calculateStreak(completedDates: string[]): number {
  if (!completedDates.length) return 0;

  const uniqueDates = [...new Set(completedDates)].sort().reverse();
  const dateSet = new Set(uniqueDates);

  let streak = 0;
  let currentDate = getTodayDateString();

  while (dateSet.has(currentDate)) {
    streak += 1;
    currentDate = getPreviousDateString(currentDate);
  }

  return streak;
}
