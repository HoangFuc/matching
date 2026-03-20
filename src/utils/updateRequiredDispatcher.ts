type ShowUpdateRequiredFn = (updateUrl: string) => void;

let globalShowUpdateRequired: ShowUpdateRequiredFn | null = null;

export const setGlobalShowUpdateRequired = (fn: ShowUpdateRequiredFn) => {
  globalShowUpdateRequired = fn;
};

export const showUpdateRequired = (updateUrl: string) => {
  if (globalShowUpdateRequired) {
    globalShowUpdateRequired(updateUrl);
  }
};
