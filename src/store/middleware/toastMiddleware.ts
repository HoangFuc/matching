import { showGlobalToast } from '@/src/utils/toastDispatcher';
import { isFulfilled, isRejected, Middleware } from '@reduxjs/toolkit';
import { setUploadProgress } from '../slices/dataRoomSlice';

// endpointName → 한국어 성공 메시지
const ToastSuccessMap: Record<string, string> = {
  // 게시판
  createBulletin: '게시글이 등록되었습니다.',
  // 회원가입
  registerWithInvite: '회원가입이 완료되었습니다.',
};

// 에러 toast를 표시하지 않을 action type 목록
const ToastErrorSilentSet = new Set<string>([
  'checkinApi/executeMutation/rejected',
]);

// endpointName → 에러 toast를 표시하지 않을 endpoint 목록
const ToastErrorSilentEndpoints = new Set<string>(['verifyOtp']);

// errorCode → 한국어 에러 메시지
const ToastErrorCodeMap: Record<string, string> = {
  AUTH_PHONE_EXISTS: '이미 사용 중인 아이디입니다.',
  AUTH_INVALID_CREDENTIALS: '전화번호 또는 비밀번호가 올바르지 않습니다.',
};

export const toastMiddleware: Middleware = () => next => action => {
  const result = next(action);

  // 파일 업로드 완료
  if (setUploadProgress.match(action) && action.payload.status === 'completed') {
    showGlobalToast({ type: 'success', message: '파일이 업로드되었습니다.' });
  }

  // 파일 업로드 취소
  if (setUploadProgress.match(action) && action.payload.status === 'cancelled') {
    showGlobalToast({ type: 'info', message: '파일 업로드가 취소되었습니다.' });
  }

  const silent =
    (action as any)?.meta?.arg?.silent === true ||
    (action as any)?.meta?.silent === true;

  // 성공
  if (isFulfilled(action)) {
    if (silent) {
      return result;
    }
    const endpointName = (action as any)?.meta?.arg?.endpointName;
    const key = endpointName ? ToastSuccessMap[endpointName] : undefined;
    if (key) {
      showGlobalToast({ type: 'success', message: key });
    }
  }

  // 에러
  if (isRejected(action)) {
    if ((action.error as any)?.name === 'ConditionError') {
      return result;
    }
    const endpointName = (action as any)?.meta?.arg?.endpointName;
    if (
      silent ||
      ToastErrorSilentSet.has(action.type) ||
      ToastErrorSilentEndpoints.has(endpointName)
    ) {
      return result;
    }

    const errorCode = (action.payload as any)?.data?.errorCode;
    const mappedMessage = errorCode ? ToastErrorCodeMap[errorCode] : undefined;

    const message =
      mappedMessage ||
      (typeof action.payload === 'string'
        ? action.payload
        : (action.payload as any)?.data?.message ||
          (action.error as any)?.message ||
          '오류가 발생했습니다.');

    showGlobalToast({ type: 'error', message });
  }

  return result;
};
