import { TRecording } from './meetingMinutes.interface';

export type TMeetingScheduleStatus = 'incomplete' | 'completed';

export interface IMeetingScheduleManagement {
  id: string;
  customerName: string;
  status: TMeetingScheduleStatus;
  salesPerson: string;
  scheduleDate: string;
  time: string;
  address: string;
  title: string;
  memo: string;
  customerPhone: string;
  creator: ICreator;
  startTime: string;
  content?: string;
  meetingLog: {
    content?: string;
    recordings?: TRecording[];
  };
}

export interface ICreateMeetingSchedulePayload {
  title: string;
  description: string;
  address: string;
  scheduleDate: string;
  startTime: string;
  customerName: string;
  customerPhone: string;
  memo: string;
}

export interface ICreator {
  fullName: string;
}

export interface IMeetingScheduleListParams {
  page?: number;
  limit?: number;
  startDate: string;
  endDate: string;
  scope: string;
}

export interface IMeetingScheduleListResponse {
  data: IMeetingScheduleManagement[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
