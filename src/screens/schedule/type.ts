import { ScheduleStackParamList } from '@/src/interface/tab.interface';
import { RouteProp } from '@react-navigation/native';

export type TScheduleMode = 'schedule' | 'attendance';

//---------------------------------------
export interface ISchedule {
  companyId: string;
  createdBy: string;
  scheduleType: string;
  title: string;
  description: string;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  customerName: string;
  customerPhone: string;
  memo: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  creator: Creator;
  meetingLog: MeetingLog;
}

//---------------------------------------
export interface Creator {
  id: string;
  fullName: string;
  avatarUrl: string;
}

//---------------------------------------
export interface MeetingLog {
  id: string;
  content: string;
  createdAt: string;
}

//---------------------------------------
export interface ISchedulePayload {
  scheduleType: string;
  title: string;
  description: string;
  scheduleDate: string;
  startTime: string | Date;
  customerName: string;
  customerPhone: string;
  memo: string;
}

//---------------------------------------
export type TScheduleRoute = RouteProp<ScheduleStackParamList, 'ScheduleMain'>;
