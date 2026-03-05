import { AppColors } from "../constants/colors";
import { TDayCell } from "../interface/schedule.interface";

export const getCalendarDays = (year: number, month: number): TDayCell[] => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: TDayCell[] = [];

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({
      date: daysInPrevMonth - i,
      month: month - 1,
      year: month === 0 ? year - 1 : year,
      isCurrentMonth: false,
    });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: d, month, year, isCurrentMonth: true });
  }

  // Next month leading days (fill to 42 = 6 rows)
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({
      date: d,
      month: month + 1,
      year: month === 11 ? year + 1 : year,
      isCurrentMonth: false,
    });
  }

  return cells;
};

export const toKey = (year: number, month: number, date: number) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;

export const isToday = (cell: TDayCell) => {
  const now = new Date();
  return (
    cell.date === now.getDate() &&
    cell.month === now.getMonth() &&
    cell.year === now.getFullYear()
  );
};

export const padZero = (n: number) => String(n).padStart(2, "0");

export const getDayColor = (cell: TDayCell): string => {
  if (!cell.isCurrentMonth) return AppColors.gray50;
  if (isToday(cell)) return AppColors.purple;
  return AppColors.gray90;
};
