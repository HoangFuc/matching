import { AppColors } from '@/src/constants/colors';
import { ScheduleTypeEnum } from '@/src/constants/schedule';
import { TScheduleEvent } from '@/src/interface/schedule.interface';
import dayjs from 'dayjs';
import { ISchedule } from '../screens/schedule/type';

const SCHEDULE_TYPE_MAP: Record<
  string,
  { title: string; color: string; backgroundColor: string }
> = {
  [ScheduleTypeEnum.GENERAL]: {
    title: '일반일정',
    color: AppColors.purple,
    backgroundColor: AppColors.lavendar,
  },
  [ScheduleTypeEnum.CUSTOMER_MEETING]: {
    title: '고객 미팅',
    color: AppColors.strongBlue,
    backgroundColor: AppColors.lightBlue,
  },
  [ScheduleTypeEnum.PERSONAL]: {
    title: '계약 일정',
    color: AppColors.negative,
    backgroundColor: AppColors.pastelPink,
  },
};

const DEFAULT_TYPE = {
  title: '',
  color: AppColors.strongBlue,
  backgroundColor: AppColors.lightBlue,
};

export function convertSchedulesToEvents(
  schedules: ISchedule[],
): Record<string, TScheduleEvent[]> {
  const result: Record<string, TScheduleEvent[]> = {};

  for (const schedule of schedules) {
    const dateKey = schedule.scheduleDate.slice(0, 10); // 'YYYY-MM-DD'
    const typeInfo = SCHEDULE_TYPE_MAP[schedule.scheduleType] || DEFAULT_TYPE;

    const event: TScheduleEvent = {
      id: schedule.createdBy,
      title: schedule.title || typeInfo.title,
      type: typeInfo.title,
      scheduleName: schedule.title,
      description: schedule.description,
      memo: schedule.memo,
      color: typeInfo.color,
      backgroundColor: typeInfo.backgroundColor,
      startTime: dayjs(schedule.startTime).format('HH:mm'),
    };

    if (!result[dateKey]) {
      result[dateKey] = [];
    }
    result[dateKey].push(event);
  }

  return result;
}
