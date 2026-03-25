import React from 'react';

import { getCompanyInfo } from '@/src/services/tokenService';

export const useHasCompany = (): boolean => {
  const [hasCompany, setHasCompany] = React.useState(false);

  //---------------------------------------
  React.useEffect(() => {
    const check = async () => {
      const company = await getCompanyInfo();
      setHasCompany(company != null);
    };
    check();
  }, []);

  return hasCompany;
};
