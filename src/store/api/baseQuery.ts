import { API_BASE_URL } from '@env';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { prepareCommonHeaders } from '@/src/services/apiHeaderService';
import { refreshAccessTokenOnce } from '@/src/services/tokenService';
import { showUpdateRequired } from '@/src/utils/updateRequiredDispatcher';
import { triggerLogout } from '@/src/utils/logoutDispatcher';

/**
 * Shared baseQuery for all RTK Query APIs.
 * Centralizes Authorization, X-App-Version, X-App-Platform headers.
 * Intercepts 401 "Unauthorized" — attempts token refresh then retries once.
 * Intercepts 403 "App update required" responses.
 *
 * @param basePath - Optional path appended to API_BASE_URL (e.g. '/bulletins')
 */
export const createBaseQuery = (basePath = ''): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${API_BASE_URL}${basePath}`,
    prepareHeaders: prepareCommonHeaders,
  });

  return async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      try {
        await refreshAccessTokenOnce();
        result = await rawBaseQuery(args, api, extraOptions);
      } catch {
        triggerLogout();
      }
    }

    if (result.error && result.error.status === 403) {
      const data = result.error.data as any;
      if (data?.data) {
        showUpdateRequired(data.data);
      }
    }

    return result;
  };
};
