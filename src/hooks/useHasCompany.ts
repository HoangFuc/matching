import { useEffect, useState } from 'react';

import { getCompanyInfo } from '@/src/services/tokenService';

export const useHasCompany = (): boolean => {
  const [hasCompany, setHasCompany] = useState(false);

  useEffect(() => {
    const check = async () => {
      const companies = await getCompanyInfo();
      setHasCompany(Array.isArray(companies) && companies.length > 0);
    };
    check();
  }, []);

  return hasCompany;
};
