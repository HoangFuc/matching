//---------------------------------------
export type TScheduleEvent = {
  id: string;
  title: string;
  color: string;
  backgroundColor: string;
  type?: string;
  scheduleName?: string;
  description?: string;
  memo?: string;
  startTime?: string;
};

//---------------------------------------
export type TDayCell = {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
};
