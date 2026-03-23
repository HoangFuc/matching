import React from 'react';

import { getCompanyInfo } from '@/src/services/tokenService';
import type { TRoleSlug } from '@/src/interface/auth.interface';

export const useUserRole = (): TRoleSlug | null => {
  const [role, setRole] = React.useState<TRoleSlug | null>(null);

  React.useEffect(() => {
    const load = async () => {
      const company = await getCompanyInfo();
      if (company?.role) {
        setRole(company.role);
      }
    };
    load();
  }, []);

  return role;
};
