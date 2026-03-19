import {
  _removeData,
  _retrieveData,
  _storeData,
} from '@/src/api/async.storage';
import { API_BASE_URL } from '@env';

const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_info';

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
