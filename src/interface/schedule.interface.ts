export type TScheduleEvent = {
  id: string;
  title: string;
  color: string;
  backgroundColor: string;
  type?: string;
  description?: string;
};

export type TDayCell = {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
};
