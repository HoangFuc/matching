export type TMeetingScheduleStatus = '미완료' | '작성완료';

export interface IMeetingScheduleManagement {
  id: string;
  customerName: string;
  phone: string;
  status: TMeetingScheduleStatus;
  salesPerson: string;
  date: string;
  time: string;
  visitLocation: string;
  scheduleName: string;
  memo: string;
}

export interface ICreateMeetingSchedulePayload {
  date: string;
  time: string;
  visitLocation: string;
  customerName: string;
  phone: string;
  scheduleName: string;
  memo: string;
}
