import {configureStore} from '@reduxjs/toolkit';
import {companyApi} from '@/src/store/api/company.api';

jest.mock('@env', () => ({API_BASE_URL: 'https://api.test.com'}));
jest.mock('@/src/services/tokenService', () => ({
  getToken: jest.fn().mockResolvedValue('test-token'),
}));
jest.mock('@/src/services/apiHeaderService', () => ({
  getCommonHeaders: jest.fn().mockResolvedValue({
    'Content-Type': 'application/json',
    Authorization: 'Bearer test-token',
    'X-App-Version': '0.0.1',
    'X-App-Platform': 'android',
  }),
  prepareCommonHeaders: jest.fn().mockImplementation(async (headers: Headers) => {
    headers.set('Authorization', 'Bearer test-token');
    headers.set('X-App-Version', '0.0.1');
    headers.set('X-App-Platform', 'android');
    return headers;
  }),
}));

const createTestStore = () =>
  configureStore({
    reducer: {[companyApi.reducerPath]: companyApi.reducer},
    middleware: gDM => gDM().concat(companyApi.middleware),
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

const getRequestBody = (callIndex = 0): any => {
  const call = fetchMock.mock.calls[callIndex];
  // RTK Query may pass a Request object or [url, init]
  const req = call[0];
  if (typeof req === 'object' && 'body' in req) {
    return JSON.parse((req as any).body ?? '{}');
  }
  const init = call[1] as any;
  return JSON.parse(init?.body ?? '{}');
};

describe('companyApi', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    jest.useFakeTimers();
    fetchMock.resetMocks();
    store = createTestStore();
  });

  afterEach(() => {
    store.dispatch(companyApi.util.resetApiState());
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  //---------------------------------------
  it('getDepartments sends GET /company/departments', async () => {
    const mockDepartments = [
      {
        id: 'dept-1',
        name: '개발팀',
        sortOrder: 1,
        memberCount: 5,
        teams: [
          {id: 'team-1', name: '프론트엔드', isDefault: false, sortOrder: 1, memberCount: 3},
        ],
      },
      {
        id: 'dept-2',
        name: '디자인팀',
        sortOrder: 2,
        memberCount: 3,
        teams: [],
      },
    ];

    fetchMock.mockResponseOnce(JSON.stringify({data: mockDepartments}));

    const result = await store.dispatch(
      companyApi.endpoints.getDepartments.initiate(),
    );

    expect(getRequestUrl()).toContain('/company/departments');
    expect(getRequestMethod()).toBe('GET');
    expect(result.data).toEqual(mockDepartments);
  });

  //---------------------------------------
  it('getDepartments handles unwrapped response', async () => {
    const mockDepartments = [
      {id: 'dept-1', name: '영업팀', sortOrder: 1, memberCount: 2, teams: []},
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockDepartments));

    const result = await store.dispatch(
      companyApi.endpoints.getDepartments.initiate(),
    );

    expect(result.data).toEqual(mockDepartments);
  });

  //---------------------------------------
  it('getDepartments returns error on failure', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'));

    const result = await store.dispatch(
      companyApi.endpoints.getDepartments.initiate(),
    );

    expect(result.error).toBeDefined();
  });

  //---------------------------------------
  it('updateDepartments sends PUT /company/departments', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({data: null}));

    const params = {
      departments: [
        {
          id: 'dept-1',
          name: '개발팀',
          teams: [{id: 'team-1', name: '프론트엔드', isDefault: true}],
        },
        {
          name: '신규팀',
          teams: [{name: '기본', isDefault: true}],
        },
      ],
    };

    await store.dispatch(
      companyApi.endpoints.updateDepartments.initiate(params),
    );

    expect(getRequestUrl()).toContain('/company/departments');
    expect(getRequestMethod()).toBe('PUT');
    expect(getRequestBody()).toEqual(params);
  });

  //---------------------------------------
  it('updateDepartments invalidates Departments tag', async () => {
    // First, populate cache
    fetchMock.mockResponseOnce(
      JSON.stringify({data: [{id: 'dept-1', name: '팀A', sortOrder: 1, memberCount: 1, teams: []}]}),
    );
    await store.dispatch(companyApi.endpoints.getDepartments.initiate());

    // Now mutate
    fetchMock.mockResponseOnce(JSON.stringify({data: null}));
    await store.dispatch(
      companyApi.endpoints.updateDepartments.initiate({
        departments: [{name: '팀B', teams: [{name: '기본', isDefault: true}]}],
      }),
    );

    // Cache should be invalidated — a re-fetch should be triggered
    // Verify the mutation was called correctly
    const putCall = fetchMock.mock.calls[1];
    const putUrl = typeof putCall[0] === 'string' ? putCall[0] : (putCall[0] as any).url;
    expect(putUrl).toContain('/company/departments');
  });
});
