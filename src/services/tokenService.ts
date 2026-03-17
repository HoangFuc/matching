import {
  _removeData,
  _retrieveData,
  _storeData,
} from '@/src/api/async.storage';
import { API_BASE_URL } from '@env';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_info';

//---------------------------------------
/**
 * Decode JWT payload and check if expired.
 * Returns true if expired or invalid.
 */
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
 * Fetch a new token from /dev/seed endpoint.
 */
const fetchToken = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/dev/seed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch token: ${response.status}`);
    }

    const json: any = await response.json();
    const token = json?.data?.accessToken ?? json?.accessToken ?? json?.token;

    if (!token) {
      throw new Error('No token returned from /dev/seed');
    }

    const user = json?.data?.user ?? json?.user;
    if (user) {
      await _storeData(USER_KEY, JSON.stringify(user));
    }

    return token;
  } catch (error) {
    throw error;
  }
};

//---------------------------------------
/**
 * Get a valid token. Returns cached token if still valid,
 * otherwise fetches a new one from /dev/seed.
 */
export const getToken = async (): Promise<string> => {
  const cached = await _retrieveData(TOKEN_KEY);

  console.log('==============cached', cached);

  if (cached && !isTokenExpired(cached)) {
    return cached;
  }

  const newToken = await fetchToken();

  console.log('======================newToken', newToken);
  await _storeData(TOKEN_KEY, newToken);
  return newToken;
};

//---------------------------------------
/**
 * Remove stored token from AsyncStorage.
 */
export const removeToken = async (): Promise<void> => {
  await _removeData(TOKEN_KEY);
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
 * Initialize token on app startup.
 * Call this once when the app mounts.
 */
export const initToken = async (): Promise<void> => {
  try {
    await removeToken();
    await getToken();
    console.log('[TokenService] Token initialized successfully');
  } catch (error) {
    console.error('[TokenService] Failed to initialize token:', error);
  }
};
