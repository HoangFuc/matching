import { useEffect, useState } from 'react';

import { getUserInfo } from '@/src/services/tokenService';
import { TRoleSlug } from '@/src/interface/auth.interface';

export const useUserRole = (): TRoleSlug | null => {
  const [role, setRole] = useState<TRoleSlug | null>(null);

  useEffect(() => {
    const load = async () => {
      const user = await getUserInfo();
      if (user?.roleSlug) {
        setRole(user.roleSlug);
      }
    };
    load();
  }, []);

  return role;
};
