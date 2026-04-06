import {
  _removeData,
  _retrieveData,
  _storeData,
} from '@/src/api/async.storage';
import { API_BASE_URL } from '@env';

const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_info';
const COMPANY_KEY = 'company_info';

//---------------------------------------
const decodeBase64 = (str: string): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  let buf = 0;
  let bits = 0;
  for (let i = 0; i < str.length; i++) {
    const val = chars.indexOf(str[i]);
    if (val === -1 || val === 64) continue;
    buf = (buf << 6) | val;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output += String.fromCharCode((buf >> bits) & 0xff);
    }
  }
  return output;
};

//---------------------------------------
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(decodeBase64(payload));
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch {
    return true;
  }
};

//---------------------------------------
/**
 * Refresh the access token using the stored refresh token.
 */
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = await _retrieveData(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.status}`);
  }

  const json: any = await response.json();
  const data = json?.data ?? json;
  const newAccessToken = data?.accessToken;
  const newRefreshToken = data?.refreshToken;

  if (!newAccessToken) {
    throw new Error('No access token returned from /auth/refresh');
  }

  await _storeData(ACCESS_TOKEN_KEY, newAccessToken);
  if (newRefreshToken) {
    await _storeData(REFRESH_TOKEN_KEY, newRefreshToken);
  }

  return newAccessToken;
};

//---------------------------------------
/**
 * Singleton refresh promise — prevents concurrent token refreshes.
 * Multiple callers awaiting this will all receive the same refreshed token.
 */
let _refreshPromise: Promise<string> | null = null;

export const refreshAccessTokenOnce = (): Promise<string> => {
  if (!_refreshPromise) {
    _refreshPromise = refreshAccessToken().finally(() => {
      _refreshPromise = null;
    });
  }
  return _refreshPromise;
};

//---------------------------------------
/**
 * Save tokens after login or registration.
 */
export const saveTokens = async (
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  await _storeData(ACCESS_TOKEN_KEY, accessToken);
  await _storeData(REFRESH_TOKEN_KEY, refreshToken);
};

//---------------------------------------
/**
 * Get a valid access token. Returns cached token if still valid,
 * otherwise refreshes using the refresh token.
 */
export const getToken = async (): Promise<string | null> => {
  const cached = await _retrieveData(ACCESS_TOKEN_KEY);

  if (cached && !isTokenExpired(cached)) {
    return cached;
  }

  try {
    const newToken = await refreshAccessToken();
    return newToken;
  } catch {
    return null;
  }
};

//---------------------------------------
/**
 * Remove stored tokens from AsyncStorage.
 */
export const removeToken = async (): Promise<void> => {
  await _removeData(ACCESS_TOKEN_KEY);
  await _removeData(REFRESH_TOKEN_KEY);
  await _removeData(COMPANY_KEY);
};

//---------------------------------------
/**
 * Get stored user info from AsyncStorage.
 */
export const getUserInfo = async () => {
  const raw = await _retrieveData(USER_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return null;
};

//---------------------------------------
/**
 * Save user info to AsyncStorage.
 */
export const saveUserInfo = async (user: any): Promise<void> => {
  await _storeData(USER_KEY, JSON.stringify(user));
};

//---------------------------------------
/**
 * Save company info to AsyncStorage.
 */
export const saveCompanyInfo = async (company: any): Promise<void> => {
  console.log('======================company', company);
  if (company) {
    await _storeData(COMPANY_KEY, JSON.stringify(company));
  } else {
    await _removeData(COMPANY_KEY);
  }
};

//---------------------------------------
/**
 * Get stored company info from AsyncStorage.
 */
export const getCompanyInfo = async () => {
  const raw = await _retrieveData(COMPANY_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return null;
};

//---------------------------------------
const KEEP_LOGGED_IN_KEY = 'keep_logged_in';
const SAVED_PHONE_KEY = 'saved_phone';

//---------------------------------------
export const setKeepLoggedIn = async (value: boolean): Promise<void> => {
  if (value) {
    await _storeData(KEEP_LOGGED_IN_KEY, 'true');
  } else {
    await _removeData(KEEP_LOGGED_IN_KEY);
  }
};

//---------------------------------------
export const getKeepLoggedIn = async (): Promise<boolean> => {
  const value = await _retrieveData(KEEP_LOGGED_IN_KEY);
  return value === 'true';
};

//---------------------------------------
export const setSavedPhone = async (phone: string | null): Promise<void> => {
  if (phone) {
    await _storeData(SAVED_PHONE_KEY, phone);
  } else {
    await _removeData(SAVED_PHONE_KEY);
  }
};

//---------------------------------------
export const getSavedPhone = async (): Promise<string | null> => {
  const value = await _retrieveData(SAVED_PHONE_KEY);
  return value || null;
};
