type LogoutFn = () => void;

let globalLogout: LogoutFn | null = null;

export const setGlobalLogout = (fn: LogoutFn) => {
  globalLogout = fn;
};

export const triggerLogout = () => {
  if (globalLogout) {
    globalLogout();
  }
};
