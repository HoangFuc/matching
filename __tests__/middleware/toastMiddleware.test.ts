import { toastMiddleware } from '@/src/store/middleware/toastMiddleware';
import { setUploadProgress } from '@/src/store/slices/dataRoomSlice';
import { showGlobalToast } from '@/src/utils/toastDispatcher';
import { showUpdateRequired } from '@/src/utils/updateRequiredDispatcher';

jest.mock('@/src/utils/toastDispatcher', () => ({
  showGlobalToast: jest.fn(),
}));

jest.mock('@/src/utils/updateRequiredDispatcher', () => ({
  showUpdateRequired: jest.fn(),
}));

const mockShowGlobalToast = showGlobalToast as jest.MockedFunction<
  typeof showGlobalToast
>;
const mockShowUpdateRequired = showUpdateRequired as jest.MockedFunction<
  typeof showUpdateRequired
>;

const createMockMiddleware = () => {
  const store = { getState: jest.fn(), dispatch: jest.fn() };
  const next = jest.fn(action => action);
  const invoke = toastMiddleware(store)(next);
  return { store, next, invoke };
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
    mockShowUpdateRequired.mockClear();
  });

  //---------------------------------------
  it('passes action through to next', () => {
    const { next, invoke } = createMockMiddleware();
    const action = { type: 'test/action' };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  //---------------------------------------
  it('shows success toast on upload completed', () => {
    const { invoke } = createMockMiddleware();
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
    const { invoke } = createMockMiddleware();
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
    const { invoke } = createMockMiddleware();
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
    const { invoke } = createMockMiddleware();
    const action = {
      type: 'bulletinApi/executeMutation/fulfilled',
      meta: fulfilledMeta({ arg: { endpointName: 'createBulletin' } }),
      payload: {},
    };
    invoke(action);
    expect(mockShowGlobalToast).toHaveBeenCalledWith({
      type: 'success',
      message: '게시글이 등록되었습니다.',
    });
  });

  //---------------------------------------
  it('shows success toast for registerWithInvite', () => {
    const { invoke } = createMockMiddleware();
    const action = {
      type: 'authApi/executeMutation/fulfilled',
      meta: fulfilledMeta({ arg: { endpointName: 'registerWithInvite' } }),
      payload: {},
    };
    invoke(action);
    expect(mockShowGlobalToast).toHaveBeenCalledWith({
      type: 'success',
      message: '회원가입이 완료되었습니다.',
    });
  });

  //---------------------------------------
  it('does not show toast for fulfilled action without mapped endpoint', () => {
    const { invoke } = createMockMiddleware();
    const action = {
      type: 'someApi/executeMutation/fulfilled',
      meta: fulfilledMeta({ arg: { endpointName: 'unmapped' } }),
      payload: {},
    };
    invoke(action);
    expect(mockShowGlobalToast).not.toHaveBeenCalled();
  });

  //---------------------------------------
  it('does not show toast for silent fulfilled actions', () => {
    const { invoke } = createMockMiddleware();
    const action = {
      type: 'bulletinApi/executeMutation/fulfilled',
      meta: fulfilledMeta({
        arg: { silent: true, endpointName: 'createBulletin' },
      }),
      payload: {},
    };
    invoke(action);
    expect(mockShowGlobalToast).not.toHaveBeenCalled();
  });

  //---------------------------------------
  it('does not show toast for silent via meta.silent', () => {
    const { invoke } = createMockMiddleware();
    const action = {
      type: 'someApi/executeMutation/fulfilled',
      meta: {
        ...fulfilledMeta(),
        silent: true,
        arg: { endpointName: 'createBulletin' },
      },
      payload: {},
    };
    invoke(action);
    expect(mockShowGlobalToast).not.toHaveBeenCalled();
  });

  //---------------------------------------
  it('shows error toast on rejected action', () => {
    const { invoke } = createMockMiddleware();
    const action = {
      type: 'someApi/executeMutation/rejected',
      error: { message: '서버 오류' },
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
    const { invoke } = createMockMiddleware();
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
    const { invoke } = createMockMiddleware();
    const action = {
      type: 'someApi/executeMutation/rejected',
      error: { name: 'ConditionError' },
      meta: rejectedMeta(),
    };
    invoke(action);
    expect(mockShowGlobalToast).not.toHaveBeenCalled();
  });

  //---------------------------------------
  it('does not show error toast for silent rejected actions', () => {
    const { invoke } = createMockMiddleware();
    const action = {
      type: 'someApi/executeMutation/rejected',
      error: { message: 'Error' },
      meta: rejectedMeta({ arg: { silent: true } }),
    };
    invoke(action);
    expect(mockShowGlobalToast).not.toHaveBeenCalled();
  });

  //---------------------------------------
  it('extracts error message from payload.data.message', () => {
    const { invoke } = createMockMiddleware();
    const action = {
      type: 'someApi/executeMutation/rejected',
      error: {},
      payload: { data: { message: '권한이 없습니다.' } },
      meta: rejectedMeta(),
    };
    invoke(action);
    expect(mockShowGlobalToast).toHaveBeenCalledWith({
      type: 'error',
      message: '권한이 없습니다.',
    });
  });

  //---------------------------------------
  it('does not show error toast for checkinApi rejected actions', () => {
    const { invoke } = createMockMiddleware();
    const action = {
      type: 'checkinApi/executeMutation/rejected',
      error: { message: 'Checkin failed' },
      meta: rejectedMeta(),
    };
    invoke(action);
    expect(mockShowGlobalToast).not.toHaveBeenCalled();
  });

  //---------------------------------------
  it('does not show error toast for verifyOtp endpoint', () => {
    const { invoke } = createMockMiddleware();
    const action = {
      type: 'authApi/executeMutation/rejected',
      error: { message: 'Invalid OTP' },
      meta: rejectedMeta({ arg: { endpointName: 'verifyOtp' } }),
    };
    invoke(action);
    expect(mockShowGlobalToast).not.toHaveBeenCalled();
  });

  //---------------------------------------
  it('shows mapped error for AUTH_PHONE_EXISTS error code', () => {
    const { invoke } = createMockMiddleware();
    const action = {
      type: 'authApi/executeMutation/rejected',
      error: {},
      payload: { data: { errorCode: 'AUTH_PHONE_EXISTS' } },
      meta: rejectedMeta(),
    };
    invoke(action);
    expect(mockShowGlobalToast).toHaveBeenCalledWith({
      type: 'error',
      message: '이미 사용 중인 아이디입니다.',
    });
  });

  //---------------------------------------
  it('shows mapped error for AUTH_INVALID_CREDENTIALS error code', () => {
    const { invoke } = createMockMiddleware();
    const action = {
      type: 'authApi/executeMutation/rejected',
      error: {},
      payload: { data: { errorCode: 'AUTH_INVALID_CREDENTIALS' } },
      meta: rejectedMeta(),
    };
    invoke(action);
    expect(mockShowGlobalToast).toHaveBeenCalledWith({
      type: 'error',
      message: '전화번호 또는 비밀번호가 올바르지 않습니다.',
    });
  });

  //---------------------------------------
  it('calls showUpdateRequired on 403 error and does not show toast', () => {
    const { invoke } = createMockMiddleware();
    const action = {
      type: 'someApi/executeMutation/rejected',
      error: {},
      payload: { status: 403, data: { data: 'https://store.com/update' } },
      meta: rejectedMeta(),
    };
    invoke(action);
    expect(mockShowUpdateRequired).toHaveBeenCalledWith(
      'https://store.com/update',
    );
    expect(mockShowGlobalToast).not.toHaveBeenCalled();
  });

  //---------------------------------------
  it('does not call showUpdateRequired on 403 without data.data', () => {
    const { invoke } = createMockMiddleware();
    const action = {
      type: 'someApi/executeMutation/rejected',
      error: {},
      payload: { status: 403, data: {} },
      meta: rejectedMeta(),
    };
    invoke(action);
    expect(mockShowUpdateRequired).not.toHaveBeenCalled();
  });

  //---------------------------------------
  it('uses string payload as error message', () => {
    const { invoke } = createMockMiddleware();
    const action = {
      type: 'someApi/executeMutation/rejected',
      error: {},
      payload: 'String error message',
      meta: rejectedMeta(),
    };
    invoke(action);
    expect(mockShowGlobalToast).toHaveBeenCalledWith({
      type: 'error',
      message: 'String error message',
    });
  });

  //---------------------------------------
  it('returns result from next(action)', () => {
    const { invoke } = createMockMiddleware();
    const action = { type: 'test/action' };
    const result = invoke(action);
    expect(result).toEqual(action);
  });
});
