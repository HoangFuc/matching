import {toastMiddleware} from '@/src/store/middleware/toastMiddleware';
import {setUploadProgress} from '@/src/store/slices/dataRoomSlice';
import {showGlobalToast} from '@/src/utils/toastDispatcher';

jest.mock('@/src/utils/toastDispatcher', () => ({
  showGlobalToast: jest.fn(),
}));

const mockShowGlobalToast = showGlobalToast as jest.MockedFunction<
  typeof showGlobalToast
>;

const createMockMiddleware = () => {
  const store = {getState: jest.fn(), dispatch: jest.fn()};
  const next = jest.fn(action => action);
  const invoke = toastMiddleware(store)(next);
  return {store, next, invoke};
};

// RTK's isFulfilled/isRejected check meta.requestId + meta.requestStatus
const fulfilledMeta = (overrides = {}) => ({
  requestId: 'test-req-id',
  requestStatus: 'fulfilled' as const,
  ...overrides,
});

const rejectedMeta = (overrides = {}) => ({
  requestId: 'test-req-id',
  requestStatus: 'rejected' as const,
  ...overrides,
});

describe('toastMiddleware', () => {
  beforeEach(() => {
    mockShowGlobalToast.mockClear();
  });

  //---------------------------------------
  it('passes action through to next', () => {
    const {next, invoke} = createMockMiddleware();
    const action = {type: 'test/action'};
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  //---------------------------------------
  it('shows success toast on upload completed', () => {
    const {invoke} = createMockMiddleware();
    const action = setUploadProgress({
      uploadId: 'upload-1',
      status: 'completed',
      percent: 100,
      fileName: 'test.pdf',
    });
    invoke(action);
    expect(mockShowGlobalToast).toHaveBeenCalledWith({
      type: 'success',
      message: '파일이 업로드되었습니다.',
    });
  });

  //---------------------------------------
  it('shows info toast on upload cancelled', () => {
    const {invoke} = createMockMiddleware();
    const action = setUploadProgress({
      uploadId: 'upload-1',
      status: 'cancelled',
      percent: 0,
      fileName: 'test.pdf',
    });
    invoke(action);
    expect(mockShowGlobalToast).toHaveBeenCalledWith({
      type: 'info',
      message: '파일 업로드가 취소되었습니다.',
    });
  });

  //---------------------------------------
  it('does not show toast on upload progress (uploading)', () => {
    const {invoke} = createMockMiddleware();
    const action = setUploadProgress({
      uploadId: 'upload-1',
      status: 'uploading',
      percent: 50,
      fileName: 'test.pdf',
    });
    invoke(action);
    expect(mockShowGlobalToast).not.toHaveBeenCalled();
  });

  //---------------------------------------
  it('shows success toast for bulletin creation', () => {
    const {invoke} = createMockMiddleware();
    const action = {
      type: 'bulletinApi/executeMutation/fulfilled',
      meta: fulfilledMeta(),
      payload: {},
    };
    invoke(action);
    expect(mockShowGlobalToast).toHaveBeenCalledWith({
      type: 'success',
      message: '게시글이 등록되었습니다.',
    });
  });

  //---------------------------------------
  it('does not show toast for silent fulfilled actions', () => {
    const {invoke} = createMockMiddleware();
    const action = {
      type: 'bulletinApi/executeMutation/fulfilled',
      meta: fulfilledMeta({arg: {silent: true}}),
      payload: {},
    };
    invoke(action);
    expect(mockShowGlobalToast).not.toHaveBeenCalled();
  });

  //---------------------------------------
  it('shows error toast on rejected action', () => {
    const {invoke} = createMockMiddleware();
    const action = {
      type: 'someApi/executeMutation/rejected',
      error: {message: '서버 오류'},
      meta: rejectedMeta(),
    };
    invoke(action);
    expect(mockShowGlobalToast).toHaveBeenCalledWith({
      type: 'error',
      message: '서버 오류',
    });
  });

  //---------------------------------------
  it('uses default error message when no message provided', () => {
    const {invoke} = createMockMiddleware();
    const action = {
      type: 'someApi/executeMutation/rejected',
      error: {},
      meta: rejectedMeta(),
    };
    invoke(action);
    expect(mockShowGlobalToast).toHaveBeenCalledWith({
      type: 'error',
      message: '오류가 발생했습니다.',
    });
  });

  //---------------------------------------
  it('does not show error toast for ConditionError', () => {
    const {invoke} = createMockMiddleware();
    const action = {
      type: 'someApi/executeMutation/rejected',
      error: {name: 'ConditionError'},
      meta: rejectedMeta(),
    };
    invoke(action);
    expect(mockShowGlobalToast).not.toHaveBeenCalled();
  });

  //---------------------------------------
  it('does not show error toast for silent rejected actions', () => {
    const {invoke} = createMockMiddleware();
    const action = {
      type: 'someApi/executeMutation/rejected',
      error: {message: 'Error'},
      meta: rejectedMeta({arg: {silent: true}}),
    };
    invoke(action);
    expect(mockShowGlobalToast).not.toHaveBeenCalled();
  });

  //---------------------------------------
  it('extracts error message from payload.data.message', () => {
    const {invoke} = createMockMiddleware();
    const action = {
      type: 'someApi/executeMutation/rejected',
      error: {},
      payload: {data: {message: '권한이 없습니다.'}},
      meta: rejectedMeta(),
    };
    invoke(action);
    expect(mockShowGlobalToast).toHaveBeenCalledWith({
      type: 'error',
      message: '권한이 없습니다.',
    });
  });
});
