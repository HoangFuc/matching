import { showGlobalToast } from '@/src/utils/toastDispatcher';
import { isFulfilled, isRejected, Middleware } from '@reduxjs/toolkit';

// Redux action type → 한국어 성공 메시지
const ToastSuccessMap: Record<string, string> = {
  // 자료실
  'dataRoomApi/executeMutation/fulfilled': '처리가 완료되었습니다.',
  // 게시판
  'bulletinApi/executeMutation/fulfilled': '게시글이 등록되었습니다.',
};

export const toastMiddleware: Middleware = () => next => action => {
  const result = next(action);

  const silent =
    (action as any)?.meta?.arg?.silent === true ||
    (action as any)?.meta?.silent === true;

  // 성공
  if (isFulfilled(action)) {
    if (silent) {
      return result;
    }
    const key = ToastSuccessMap[action.type];
    if (key) {
      showGlobalToast({ type: 'success', message: key });
    }
  }

  // 에러
  if (isRejected(action)) {
    if ((action.error as any)?.name === 'ConditionError') {
      return result;
    }
    if (silent) {
      return result;
    }

    const message =
      typeof action.payload === 'string'
        ? action.payload
        : (action.payload as any)?.data?.message ||
          (action.error as any)?.message ||
          '오류가 발생했습니다.';

    showGlobalToast({ type: 'error', message });
  }

  return result;
};
