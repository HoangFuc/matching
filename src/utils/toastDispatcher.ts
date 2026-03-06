import type {TAlertType} from '@/src/component/AppAlert';

type GlobalToastFn = (
  type: TAlertType,
  title?: string,
  message?: string,
) => void;

let globalToast: GlobalToastFn | null = null;

export const setGlobalToast = (fn: GlobalToastFn) => {
  globalToast = fn;
};

type ShowToastParams = {
  type: TAlertType;
  title?: string;
  message?: string;
};

export const showGlobalToast = ({type, title, message}: ShowToastParams) => {
  if (globalToast) {
    globalToast(type, title, message);
  } else {
    console.warn('Global toast is not initialized');
  }
};
