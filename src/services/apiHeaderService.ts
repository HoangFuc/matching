import { Platform } from 'react-native';

import { getToken } from './tokenService';

const APP_VERSION = '0.0.1';
const APP_PLATFORM = Platform.OS; // 'ios' | 'android'

//---------------------------------------
/**
 * Returns common headers required by the API.
 * Includes: Content-Type, Authorization, X-Company-Id, X-App-Version, X-App-Platform
 */
export const getCommonHeaders = async (): Promise<Record<string, string>> => {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-App-Version': APP_VERSION,
    'X-App-Platform': APP_PLATFORM,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

//---------------------------------------
/**
 * Applies common headers to RTK Query's Headers object.
 * Use this in fetchBaseQuery's prepareHeaders.
 */
export const prepareCommonHeaders = async (
  headers: Headers,
): Promise<Headers> => {
  const token = await getToken();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('X-App-Version', APP_VERSION);
  headers.set('X-App-Platform', APP_PLATFORM);

  return headers;
};
