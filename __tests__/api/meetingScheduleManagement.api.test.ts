import { configureStore } from '@reduxjs/toolkit';
import { meetingScheduleManagementApi } from '@/src/store/api/meetingScheduleManagement.api';
import { MeetingScheduleScopeEnum } from '@/src/constants/meetingSchedule';

jest.mock('@env', () => ({ API_BASE_URL: 'https://api.test.com' }));
jest.mock('@/src/services/tokenService', () => ({
  getToken: jest.fn().mockResolvedValue('test-token'),
}));

const createTestStore = () =>
  configureStore({
    reducer: {
      [meetingScheduleManagementApi.reducerPath]:
        meetingScheduleManagementApi.reducer,
    },
    middleware: gDM => gDM().concat(meetingScheduleManagementApi.middleware),
  });

const getRequestUrl = (): string => {
  const call = fetchMock.mock.calls[0][0];
  return typeof call === 'string'
    ? call
    : (call as any).parsedURL?.href ?? call.url;
};

const getRequestMethod = (): string => {
  const call = fetchMock.mock.calls[0][0];
  if (typeof call === 'string')
    return (fetchMock.mock.calls[0][1] as any)?.method ?? 'GET';
  return (call as any).method ?? 'GET';
};

describe('meetingScheduleManagementApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  //---------------------------------------
  it('getMeetingSchedules sends correct query with scope', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    const store = createTestStore();
    await store.dispatch(
      meetingScheduleManagementApi.endpoints.getMeetingSchedules.initiate({
        startDate: '2025-03-01',
        endDate: '2025-03-31',
        scope: MeetingScheduleScopeEnum.MINE,
      }),
    );

    const url = getRequestUrl();
    expect(url).toContain('scheduleType=customer_meeting');
    expect(url).toContain('scope=mine');
  });

  //---------------------------------------
  it('getMeetingScheduleDetail sends GET /schedules/:id', async () => {
    const mockDetail = { data: { id: 'schedule-1', title: 'Test' } };
    fetchMock.mockResponseOnce(JSON.stringify(mockDetail));

    const store = createTestStore();
    const result = await store.dispatch(
      meetingScheduleManagementApi.endpoints.getMeetingScheduleDetail.initiate(
        'schedule-1',
      ),
    );

    expect(getRequestUrl()).toContain('/schedules/schedule-1');
    expect(result.data).toEqual(mockDetail.data);
  });

  //---------------------------------------
  it('createMeetingSchedule sends POST /schedules', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ id: 'new-1' }));

    const store = createTestStore();
    await store.dispatch(
      meetingScheduleManagementApi.endpoints.createMeetingSchedule.initiate({
        title: 'Meeting',
        description: 'Test',
        address: '서울',
        scheduleDate: '2025-03-15',
        startTime: '14:00',
        customerName: '홍길동',
        customerPhone: '010-1234-5678',
        memo: '',
      }),
    );

    expect(getRequestUrl()).toContain('/schedules');
    expect(getRequestMethod()).toBe('POST');
  });

  //---------------------------------------
  it('createMeetingLog sends POST /schedules/:id/meeting-log', async () => {
    const mockResponse = { data: { uploadId: 'upload-1' } };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const store = createTestStore();
    const result = await store.dispatch(
      meetingScheduleManagementApi.endpoints.createMeetingLog.initiate({
        scheduleId: 'schedule-1',
        content: 'Meeting notes',
      }),
    );

    expect(getRequestUrl()).toContain('/schedules/schedule-1/meeting-log');
    expect(getRequestMethod()).toBe('POST');
    expect(result.data).toEqual(mockResponse.data);
  });

  //---------------------------------------
  it('cancelRecordingUpload sends DELETE /meeting-logs/uploads/:id', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const store = createTestStore();
    await store.dispatch(
      meetingScheduleManagementApi.endpoints.cancelRecordingUpload.initiate(
        'upload-1',
      ),
    );

    expect(getRequestUrl()).toContain('/meeting-logs/uploads/upload-1');
    expect(getRequestMethod()).toBe('DELETE');
  });
});
