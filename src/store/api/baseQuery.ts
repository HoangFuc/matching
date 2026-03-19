import { API_BASE_URL } from '@env';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { prepareCommonHeaders } from '@/src/services/apiHeaderService';

/**
 * Shared baseQuery for all RTK Query APIs.
 * Centralizes Authorization, X-App-Version, X-App-Platform headers.
 *
 * @param basePath - Optional path appended to API_BASE_URL (e.g. '/bulletins')
 */
export const createBaseQuery = (basePath = '') =>
  fetchBaseQuery({
    baseUrl: `${API_BASE_URL}${basePath}`,
    prepareHeaders: prepareCommonHeaders,
  });
