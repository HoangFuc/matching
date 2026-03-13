import {configureStore} from '@reduxjs/toolkit';
import {checkinApi} from '@/src/store/api/checkin.api';

jest.mock('@env', () => ({API_BASE_URL: 'https://api.test.com'}));
jest.mock('@/src/services/tokenService', () => ({
  getToken: jest.fn().mockResolvedValue('test-token'),
}));

const createTestStore = () =>
  configureStore({
    reducer: {[checkinApi.reducerPath]: checkinApi.reducer},
    middleware: gDM => gDM().concat(checkinApi.middleware),
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

describe('checkinApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  //---------------------------------------
  it('getAttendanceToday sends GET /attendance/today', async () => {
    const mockResponse = {data: {checkedIn: true, checkInTime: '09:00:00'}};
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const store = createTestStore();
    const result = await store.dispatch(
      checkinApi.endpoints.getAttendanceToday.initiate(),
    );

    expect(getRequestUrl()).toContain('/attendance/today');
    expect(getRequestMethod()).toBe('GET');
    expect(result.data).toEqual(mockResponse);
  });

  //---------------------------------------
  it('getMyAttendance sends GET /attendance/my with query params', async () => {
    const mockResponse = {data: []};
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const store = createTestStore();
    await store.dispatch(
      checkinApi.endpoints.getMyAttendance.initiate({
        startDate: '2025-03-01',
        endDate: '2025-03-31',
      }),
    );

    const url = getRequestUrl();
    expect(url).toContain('/attendance/my');
    expect(url).toContain('startDate=2025-03-01');
    expect(url).toContain('endDate=2025-03-31');
  });

  //---------------------------------------
  it('checkin sends POST /attendance/check-in with body', async () => {
    const mockResponse = {data: {checkedIn: true, checkInTime: '09:00:00'}};
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const store = createTestStore();
    await store.dispatch(
      checkinApi.endpoints.checkin.initiate({
        latitude: 37.5665,
        longitude: 126.978,
      }),
    );

    expect(getRequestUrl()).toContain('/attendance/check-in');
    expect(getRequestMethod()).toBe('POST');
  });
});
