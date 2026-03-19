import React from 'react';

import type { IRegisterCompanyParams } from '@/src/interface/auth.interface';

type RegisterCompanyData = Partial<IRegisterCompanyParams>;

interface IRegisterCompanyContext {
  setStepData: (data: Partial<IRegisterCompanyParams>) => void;
  getFormData: () => RegisterCompanyData;
  resetFormData: () => void;
}

const RegisterCompanyContext = React.createContext<IRegisterCompanyContext | null>(null);

export const RegisterCompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dataRef = React.useRef<RegisterCompanyData>({});

  //---------------------------------------
  const setStepData = React.useCallback((data: Partial<IRegisterCompanyParams>) => {
    dataRef.current = { ...dataRef.current, ...data };
  }, []);

  //---------------------------------------
  const getFormData = React.useCallback((): RegisterCompanyData => {
    return dataRef.current;
  }, []);

  //---------------------------------------
  const resetFormData = React.useCallback(() => {
    dataRef.current = {};
  }, []);

  //---------------------------------------
  const value = React.useMemo(
    () => ({ setStepData, getFormData, resetFormData }),
    [setStepData, getFormData, resetFormData],
  );

  return (
    <RegisterCompanyContext.Provider value={value}>
      {children}
    </RegisterCompanyContext.Provider>
  );
};

export const useRegisterCompany = (): IRegisterCompanyContext => {
  const context = React.useContext(RegisterCompanyContext);
  if (!context) {
    throw new Error('useRegisterCompany must be used within RegisterCompanyProvider');
  }
  return context;
};
