//---------------------------------------
export enum MeetingScheduleScopeEnum {
  MINE = 'mine',
  COMPANY = 'company',
}

//---------------------------------------
export const MEETING_SCHEDULE_SCOPE_LABEL: Record<
  MeetingScheduleScopeEnum,
  string
> = {
  [MeetingScheduleScopeEnum.MINE]: '나의 일정',
  [MeetingScheduleScopeEnum.COMPANY]: '전체',
};

//---------------------------------------
export const MEETING_SCHEDULE_LABEL_TO_SCOPE: Record<
  string,
  MeetingScheduleScopeEnum
> = {
  '나의 일정': MeetingScheduleScopeEnum.MINE,
  전체: MeetingScheduleScopeEnum.COMPANY,
};

//---------------------------------------
//---------------------------------------
export const MEETING_SCHEDULE_STATUS_LABEL: Record<string, string> = {
  incomplete: '미완료',
  completed: '작성완료',
};

//---------------------------------------
export const MEETING_SCHEDULE_TABS = [
  MeetingScheduleScopeEnum.COMPANY,
  MeetingScheduleScopeEnum.MINE,
] as const;
