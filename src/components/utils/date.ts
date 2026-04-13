export function getWeekDaysWithLabels(completedDays: number[] = []) {
  const today = new Date();
  const day = today.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;

  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const labels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  const week = [];

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(monday);
    currentDay.setDate(monday.getDate() + i);

    week.push({
      dayNumber: currentDay.getDate(),
      isToday: currentDay.toDateString() === today.toDateString(),
      isCompleted: completedDays.includes(i), // 🔥 aquí está la magia
      dayLabel: labels[i],
    });
  }

  return week;
}

export function getTodayIndex(): number {
  const today = new Date().getDay(); // 0-6 (domingo a sábado)
  return today === 0 ? 6 : today - 1;
}