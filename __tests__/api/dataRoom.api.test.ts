import {configureStore} from '@reduxjs/toolkit';
import {dataRoomApi} from '@/src/store/api/dataRoom.api';

jest.mock('@env', () => ({API_BASE_URL: 'https://api.test.com'}));
jest.mock('@/src/services/tokenService', () => ({
  getToken: jest.fn().mockResolvedValue('test-token'),
}));
jest.mock('@/src/services/uploadService', () => ({
  prepareUploadData: jest.fn(),
  fetchUpload: jest.fn(),
}));

const createTestStore = () =>
  configureStore({
    reducer: {[dataRoomApi.reducerPath]: dataRoomApi.reducer},
    middleware: gDM => gDM().concat(dataRoomApi.middleware),
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

describe('dataRoomApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  //---------------------------------------
  it('getFolders sends GET /data-room/folders with type param', async () => {
    const mockResponse = {data: {folders: [], files: []}};
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const store = createTestStore();
    const result = await store.dispatch(
      dataRoomApi.endpoints.getFolders.initiate('MARKET_PRICE'),
    );

    expect(getRequestUrl()).toContain('/data-room/folders');
    expect(result.data).toEqual({folders: [], files: []});
  });

  //---------------------------------------
  it('createFolder sends POST /data-room/folders', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({id: 'folder-1', name: 'New Folder'}),
    );

    const store = createTestStore();
    await store.dispatch(
      dataRoomApi.endpoints.createFolder.initiate({
        name: 'New Folder',
        type: 'MARKET_PRICE',
      }),
    );

    expect(getRequestUrl()).toContain('/data-room/folders');
    expect(getRequestMethod()).toBe('POST');
  });

  //---------------------------------------
  it('getFilesByFolder sends GET /data-room/folders/:id/files', async () => {
    const mockFiles = [{id: 'file-1', fileName: 'test.pdf'}];
    fetchMock.mockResponseOnce(JSON.stringify(mockFiles));

    const store = createTestStore();
    const result = await store.dispatch(
      dataRoomApi.endpoints.getFilesByFolder.initiate('folder-1'),
    );

    expect(getRequestUrl()).toContain('/data-room/folders/folder-1/files');
    expect(result.data).toEqual(mockFiles);
  });

  //---------------------------------------
  it('search sends GET /data-room/search with keyword', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({data: {folders: [], files: []}}),
    );

    const store = createTestStore();
    await store.dispatch(
      dataRoomApi.endpoints.search.initiate('테스트 파일'),
    );

    expect(getRequestUrl()).toContain('/data-room/search');
    expect(getRequestUrl()).toContain('keyword=');
  });

  //---------------------------------------
  it('moveFile sends PATCH /data-room/files/:id/move', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const store = createTestStore();
    await store.dispatch(
      dataRoomApi.endpoints.moveFile.initiate({
        fileId: 'file-1',
        newFolderId: 'folder-2',
      }),
    );

    expect(getRequestUrl()).toContain('/data-room/files/file-1/move');
    expect(getRequestMethod()).toBe('PATCH');
  });

  //---------------------------------------
  it('renameItem sends PATCH /data-room/:kinds/:id/rename', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const store = createTestStore();
    await store.dispatch(
      dataRoomApi.endpoints.renameItem.initiate({
        id: 'file-1',
        name: 'New Name',
        kind: 'file',
      }),
    );

    expect(getRequestUrl()).toContain('/data-room/files/file-1/rename');
    expect(getRequestMethod()).toBe('PATCH');
  });

  //---------------------------------------
  it('deleteFile sends DELETE /data-room/files/:id', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const store = createTestStore();
    await store.dispatch(
      dataRoomApi.endpoints.deleteFile.initiate('file-1'),
    );

    expect(getRequestUrl()).toContain('/data-room/files/file-1');
    expect(getRequestMethod()).toBe('DELETE');
  });

  //---------------------------------------
  it('initUpload sends POST /data-room/uploads/init', async () => {
    const mockResponse = {data: {uploadId: 'upload-1'}};
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const store = createTestStore();
    const result = await store.dispatch(
      dataRoomApi.endpoints.initUpload.initiate({
        folderId: 'folder-1',
        type: 'MARKET_PRICE',
      }),
    );

    expect(getRequestUrl()).toContain('/data-room/uploads/init');
    expect(getRequestMethod()).toBe('POST');
    expect(result.data).toEqual(mockResponse.data);
  });

  //---------------------------------------
  it('cancelUpload sends DELETE /data-room/uploads/:id', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const store = createTestStore();
    await store.dispatch(
      dataRoomApi.endpoints.cancelUpload.initiate('upload-1'),
    );

    expect(getRequestUrl()).toContain('/data-room/uploads/upload-1');
    expect(getRequestMethod()).toBe('DELETE');
  });

  //---------------------------------------
  it('deleteFolder sends DELETE /data-room/folders/:id', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const store = createTestStore();
    await store.dispatch(
      dataRoomApi.endpoints.deleteFolder.initiate('folder-1'),
    );

    expect(getRequestUrl()).toContain('/data-room/folders/folder-1');
    expect(getRequestMethod()).toBe('DELETE');
  });
});
