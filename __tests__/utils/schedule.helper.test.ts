import {convertSchedulesToEvents} from '@/src/utils/schedule.helper';
import {AppColors} from '@/src/constants/colors';
import {ScheduleTypeEnum} from '@/src/constants/schedule';
import {ISchedule} from '@/src/screens/schedule/type';

const createMockSchedule = (
  overrides: Partial<ISchedule> = {},
): ISchedule => ({
  companyId: 'company-1',
  createdBy: 'user-1',
  scheduleType: ScheduleTypeEnum.GENERAL,
  title: 'Test Schedule',
  description: 'Test description',
  scheduleDate: '2025-03-15T09:00:00Z',
  startTime: '09:00',
  endTime: '10:00',
  customerName: '',
  customerPhone: '',
  memo: '',
  status: 'active',
  createdAt: '2025-03-01T00:00:00Z',
  updatedAt: '2025-03-01T00:00:00Z',
  creator: {id: 'user-1', fullName: 'Test User', avatarUrl: ''},
  meetingLog: {id: '', content: '', createdAt: ''},
  ...overrides,
});

describe('convertSchedulesToEvents', () => {
  it('returns empty object for empty array', () => {
    expect(convertSchedulesToEvents([])).toEqual({});
  });

  it('groups schedules by date key (YYYY-MM-DD)', () => {
    const schedules = [
      createMockSchedule({scheduleDate: '2025-03-15T09:00:00Z'}),
      createMockSchedule({scheduleDate: '2025-03-15T14:00:00Z', createdBy: 'user-2'}),
      createMockSchedule({scheduleDate: '2025-03-16T09:00:00Z'}),
    ];

    const result = convertSchedulesToEvents(schedules);
    expect(Object.keys(result)).toEqual(['2025-03-15', '2025-03-16']);
    expect(result['2025-03-15']).toHaveLength(2);
    expect(result['2025-03-16']).toHaveLength(1);
  });

  it('maps GENERAL type correctly', () => {
    const schedules = [
      createMockSchedule({scheduleType: ScheduleTypeEnum.GENERAL}),
    ];

    const result = convertSchedulesToEvents(schedules);
    const event = result['2025-03-15'][0];
    expect(event.title).toBe('Test Schedule');
    expect(event.type).toBe('지방출장');
    expect(event.color).toBe(AppColors.purple);
    expect(event.backgroundColor).toBe(AppColors.lavendar);
  });

  it('maps CUSTOMER_MEETING type correctly', () => {
    const schedules = [
      createMockSchedule({scheduleType: ScheduleTypeEnum.CUSTOMER_MEETING}),
    ];

    const result = convertSchedulesToEvents(schedules);
    const event = result['2025-03-15'][0];
    expect(event.title).toBe('Test Schedule');
    expect(event.type).toBe('고객 미팅');
    expect(event.color).toBe(AppColors.strongBlue);
    expect(event.backgroundColor).toBe(AppColors.lightBlue);
  });

  it('maps PERSONAL type correctly', () => {
    const schedules = [
      createMockSchedule({scheduleType: ScheduleTypeEnum.PERSONAL}),
    ];

    const result = convertSchedulesToEvents(schedules);
    const event = result['2025-03-15'][0];
    expect(event.title).toBe('Test Schedule');
    expect(event.type).toBe('계약 일정');
    expect(event.color).toBe(AppColors.negative);
    expect(event.backgroundColor).toBe(AppColors.pastelPink);
  });

  it('uses default type for unknown schedule types', () => {
    const schedules = [
      createMockSchedule({scheduleType: 'unknown_type'}),
    ];

    const result = convertSchedulesToEvents(schedules);
    const event = result['2025-03-15'][0];
    expect(event.title).toBe('Test Schedule');
    expect(event.type).toBe('');
    expect(event.color).toBe(AppColors.strongBlue);
    expect(event.backgroundColor).toBe(AppColors.lightBlue);
  });

  it('includes description in event', () => {
    const schedules = [
      createMockSchedule({description: 'Important meeting'}),
    ];

    const result = convertSchedulesToEvents(schedules);
    expect(result['2025-03-15'][0].description).toBe('Important meeting');
  });
});
