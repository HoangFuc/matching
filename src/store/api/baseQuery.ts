import { API_BASE_URL } from '@env';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { prepareCommonHeaders } from '@/src/services/apiHeaderService';
import { showUpdateRequired } from '@/src/utils/updateRequiredDispatcher';

/**
 * Shared baseQuery for all RTK Query APIs.
 * Centralizes Authorization, X-App-Version, X-App-Platform headers.
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
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 403) {
      const data = result.error.data as any;
      if (data?.data) {
        showUpdateRequired(data.data);
      }
    }

    return result;
  };
};
