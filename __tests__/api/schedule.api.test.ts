import {configureStore} from '@reduxjs/toolkit';
import {scheduleApi} from '@/src/store/api/schedule.api';

jest.mock('@env', () => ({API_BASE_URL: 'https://api.test.com'}));
jest.mock('@/src/services/tokenService', () => ({
  getToken: jest.fn().mockResolvedValue('test-token'),
}));

const createTestStore = () =>
  configureStore({
    reducer: {[scheduleApi.reducerPath]: scheduleApi.reducer},
    middleware: gDM => gDM().concat(scheduleApi.middleware),
  });

const getRequestUrl = (): string => {
  const call = fetchMock.mock.calls[0][0];
  return typeof call === 'string' ? call : (call as any).parsedURL?.href ?? call.url;
};

const getRequestMethod = (): string => {
  const call = fetchMock.mock.calls[0][0];
  if (typeof call === 'string') return (fetchMock.mock.calls[0][1] as any)?.method ?? 'GET';
  return (call as any).method ?? 'GET';
};

describe('scheduleApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  //---------------------------------------
  it('getSchedules sends GET /schedules with date range', async () => {
    const mockSchedules = [{id: '1', title: 'Test'}];
    fetchMock.mockResponseOnce(JSON.stringify(mockSchedules));

    const store = createTestStore();
    const result = await store.dispatch(
      scheduleApi.endpoints.getSchedules.initiate({
        startDate: '2025-03-01',
        endDate: '2025-03-31',
      }),
    );

    const url = getRequestUrl();
    expect(url).toContain('/schedules');
    expect(url).toContain('startDate=2025-03-01');
    expect(url).toContain('endDate=2025-03-31');
    expect(result.data).toEqual(mockSchedules);
  });

  //---------------------------------------
  it('getSchedules transformResponse handles array response', async () => {
    const mockSchedules = [{id: '1'}];
    fetchMock.mockResponseOnce(JSON.stringify(mockSchedules));

    const store = createTestStore();
    const result = await store.dispatch(
      scheduleApi.endpoints.getSchedules.initiate({
        startDate: '2025-03-01',
        endDate: '2025-03-31',
      }),
    );

    expect(result.data).toEqual(mockSchedules);
  });

  //---------------------------------------
  it('getSchedules transformResponse handles {data} response', async () => {
    const mockSchedules = [{id: '1'}];
    fetchMock.mockResponseOnce(JSON.stringify({data: mockSchedules}));

    const store = createTestStore();
    const result = await store.dispatch(
      scheduleApi.endpoints.getSchedules.initiate({
        startDate: '2025-04-01',
        endDate: '2025-04-30',
      }),
    );

    expect(result.data).toEqual(mockSchedules);
  });

  //---------------------------------------
  it('createSchedule sends POST /schedules', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({id: 'new-1'}));

    const store = createTestStore();
    await store.dispatch(
      scheduleApi.endpoints.createSchedule.initiate({
        scheduleType: 'general',
        title: 'New Schedule',
        description: 'Test',
        scheduleDate: '2025-03-15',
        startTime: '09:00',
        customerName: '',
        customerPhone: '',
        memo: '',
      }),
    );

    expect(getRequestUrl()).toContain('/schedules');
    expect(getRequestMethod()).toBe('POST');
  });
});
