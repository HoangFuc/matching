//---------------------------------------
export const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

//---------------------------------------
export const SATURDAY_BLUE = '#3B82F6';

//---------------------------------------
export enum ScheduleTypeEnum {
  GENERAL = 'general',
  PERSONAL = 'personal',
  CUSTOMER_MEETING = 'customer_meeting',
}

//---------------------------------------
export const SCHEDULE_TYPE_LABEL: Record<ScheduleTypeEnum, string> = {
  [ScheduleTypeEnum.GENERAL]: '일반일정',
  [ScheduleTypeEnum.PERSONAL]: '계약 일정',
  [ScheduleTypeEnum.CUSTOMER_MEETING]: '고객 미팅',
};

//---------------------------------------
export const SCHEDULE_LABEL_TO_ENUM: Record<string, ScheduleTypeEnum> = {
  '일반일정': ScheduleTypeEnum.GENERAL,
  '계약 일정': ScheduleTypeEnum.PERSONAL,
  '고객 미팅': ScheduleTypeEnum.CUSTOMER_MEETING,
};
