import {configureStore} from '@reduxjs/toolkit';
import {meetingLogApi} from '@/src/store/api/meetingLog.api';

jest.mock('@env', () => ({API_BASE_URL: 'https://api.test.com'}));
jest.mock('@/src/services/tokenService', () => ({
  getToken: jest.fn().mockResolvedValue('test-token'),
}));

const createTestStore = () =>
  configureStore({
    reducer: {[meetingLogApi.reducerPath]: meetingLogApi.reducer},
    middleware: gDM => gDM().concat(meetingLogApi.middleware),
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

describe('meetingLogApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  //---------------------------------------
  it('createMeetingLog sends POST to base path', async () => {
    const mockResponse = {data: {id: 'log-1', uploadId: 'upload-1'}};
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const store = createTestStore();
    const result = await store.dispatch(
      meetingLogApi.endpoints.createMeetingLog.initiate({
        meetingType: 'offline',
        meetingDate: '2025-03-15',
        customerName: '홍길동',
        customerPhone: '010-1234-5678',
        address: '서울',
        consultationContent: 'Test content',
      }),
    );

    expect(getRequestUrl()).toContain('/meeting-logs');
    expect(getRequestMethod()).toBe('POST');
    expect(result.data).toEqual(mockResponse.data);
  });

  //---------------------------------------
  it('updateMeetingLog sends PUT /meeting-logs/:id', async () => {
    const mockData = {id: 'log-1', meetingType: 'offline'};
    fetchMock.mockResponseOnce(JSON.stringify({data: mockData}));

    const store = createTestStore();
    await store.dispatch(
      meetingLogApi.endpoints.updateMeetingLog.initiate({
        id: 'log-1',
        meetingType: 'offline',
        meetingDate: '2025-03-15',
        customerName: '홍길동',
        customerPhone: '010-1234-5678',
        address: '서울',
        consultationContent: 'Updated',
      }),
    );

    expect(getRequestUrl()).toContain('/meeting-logs/log-1');
    expect(getRequestMethod()).toBe('PUT');
  });

  //---------------------------------------
  it('deleteRecording sends PUT /meeting-logs/:id/recordings', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({data: {uploadId: 'upload-1'}}),
    );

    const store = createTestStore();
    await store.dispatch(
      meetingLogApi.endpoints.deleteRecording.initiate('log-1'),
    );

    expect(getRequestUrl()).toContain('/meeting-logs/log-1/recordings');
    expect(getRequestMethod()).toBe('PUT');
  });

  //---------------------------------------
  it('getMeetingLogDetail sends GET /meeting-logs/:id', async () => {
    const mockDetail = {id: 'log-1', meetingType: 'offline'};
    fetchMock.mockResponseOnce(JSON.stringify({data: mockDetail}));

    const store = createTestStore();
    const result = await store.dispatch(
      meetingLogApi.endpoints.getMeetingLogDetail.initiate('log-1'),
    );

    expect(getRequestUrl()).toContain('/meeting-logs/log-1');
    expect(getRequestMethod()).toBe('GET');
    expect(result.data).toEqual(mockDetail);
  });

  //---------------------------------------
  it('getMeetingLogs builds correct query string', async () => {
    const mockResponse = {
      data: {data: [], meta: {page: 1, limit: 20, total: 0, totalPages: 0}},
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const store = createTestStore();
    await store.dispatch(
      meetingLogApi.endpoints.getMeetingLogs.initiate({
        page: 1,
        limit: 20,
        search: '홍길동',
        meetingType: 'offline',
      }),
    );

    const url = getRequestUrl();
    expect(url).toContain('page=1');
    expect(url).toContain('limit=20');
    expect(url).toContain('meetingType=offline');
  });

  //---------------------------------------
  it('getMeetingLogs transformResponse extracts nested data', async () => {
    const innerData = [
      {id: 'log-1', meetingType: 'offline'},
      {id: 'log-2', meetingType: 'recording'},
    ];
    const mockResponse = {
      data: {
        data: innerData,
        meta: {page: 1, limit: 20, total: 2, totalPages: 1},
      },
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const store = createTestStore();
    const result = await store.dispatch(
      meetingLogApi.endpoints.getMeetingLogs.initiate({page: 1, limit: 20}),
    );

    expect(result.data?.data).toEqual(innerData);
    expect(result.data?.meta.total).toBe(2);
  });
});
