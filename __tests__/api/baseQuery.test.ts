import {configureStore} from '@reduxjs/toolkit';
import {createApi} from '@reduxjs/toolkit/query/react';
import {createBaseQuery} from '@/src/store/api/baseQuery';

jest.mock('@env', () => ({API_BASE_URL: 'https://api.test.com'}));
jest.mock('@/src/services/tokenService', () => ({
  getToken: jest.fn().mockResolvedValue('test-token'),
}));
jest.mock('@/src/utils/updateRequiredDispatcher', () => ({
  showUpdateRequired: jest.fn(),
}));

import {showUpdateRequired} from '@/src/utils/updateRequiredDispatcher';

const mockShowUpdateRequired = showUpdateRequired as jest.MockedFunction<
  typeof showUpdateRequired
>;

// Create a test API using createBaseQuery
const testApi = createApi({
  reducerPath: 'testApi',
  baseQuery: createBaseQuery('/test'),
  endpoints: builder => ({
    getData: builder.query<any, void>({
      query: () => '/data',
    }),
    postData: builder.mutation<any, {name: string}>({
      query: body => ({
        url: '/create',
        method: 'POST',
        body,
      }),
    }),
  }),
});

const createTestStore = () =>
  configureStore({
    reducer: {[testApi.reducerPath]: testApi.reducer},
    middleware: gDM => gDM().concat(testApi.middleware),
  });

describe('baseQuery', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    mockShowUpdateRequired.mockClear();
  });

  //---------------------------------------
  it('prepends basePath to API_BASE_URL', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({data: 'ok'}));

    const store = createTestStore();
    await store.dispatch(testApi.endpoints.getData.initiate());

    const url = fetchMock.mock.calls[0][0];
    expect(typeof url === 'string' ? url : (url as any).url).toContain(
      '/test/data',
    );
  });

  //---------------------------------------
  it('calls showUpdateRequired on 403 with data.data', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({data: 'https://store.com/update'}),
      {status: 403},
    );

    const store = createTestStore();
    await store.dispatch(testApi.endpoints.getData.initiate());

    expect(mockShowUpdateRequired).toHaveBeenCalledWith('https://store.com/update');
  });

  //---------------------------------------
  it('does not call showUpdateRequired on 403 without data.data', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({message: 'Forbidden'}),
      {status: 403},
    );

    const store = createTestStore();
    await store.dispatch(testApi.endpoints.getData.initiate());

    expect(mockShowUpdateRequired).not.toHaveBeenCalled();
  });

  //---------------------------------------
  it('does not call showUpdateRequired on non-403 errors', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({message: 'Not found'}),
      {status: 404},
    );

    const store = createTestStore();
    await store.dispatch(testApi.endpoints.getData.initiate());

    expect(mockShowUpdateRequired).not.toHaveBeenCalled();
  });

  //---------------------------------------
  it('returns successful response data', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({data: 'success'}));

    const store = createTestStore();
    const result = await store.dispatch(testApi.endpoints.getData.initiate());

    expect(result.data).toEqual({data: 'success'});
  });
});
