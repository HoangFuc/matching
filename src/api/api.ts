import { Alert } from 'react-native';

import { API_BASE_URL } from '@env';
import { getCommonHeaders } from '@/src/services/apiHeaderService';
import { refreshAccessTokenOnce } from '@/src/services/tokenService';
import { showUpdateRequired } from '@/src/utils/updateRequiredDispatcher';
import { triggerLogout } from '@/src/utils/logoutDispatcher';

const API_URL = API_BASE_URL;

const TIME_OUT_API = 100000;

export const buildQuies = (params = {}) => {
  const queries = Object.entries(params).reduce((acc, [key, value]) => {
    let type = typeof value;
    if (type !== 'undefined') {
      let val = type === 'object' ? JSON.stringify(value) : (value as string);
      acc.push(`${key}=${encodeURI(val)}`);
    }
    return acc;
  }, [] as string[]);

  const query = queries.length === 0 ? '' : `?${queries.join('&')}`;
  return query;
};

export const apiGet = async (
  path: string,
  params?: Record<string, any>,
  headers: Record<string, string> = {},
  timeout = TIME_OUT_API,
  _retried = false,
): Promise<any> => {
  const commonHeaders = await getCommonHeaders();

  const query = buildQuies(params || {});

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const result = await fetch(`${API_URL}/${path}${query}`, {
      method: 'get',
      mode: 'cors',
      headers: {
        ...commonHeaders,
        ...headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = result.headers.get('content-type');
    const json: any =
      contentType && contentType.match('json')
        ? await result.json()
        : await result.text();
    const responseStatus = result.status;

    if (responseStatus >= 400) {
      if (responseStatus === 403 && json?.data) {
        showUpdateRequired(json.data);
      }
      if (responseStatus === 401) {
        if (!_retried) {
          try {
            await refreshAccessTokenOnce();
            return apiGet(path, params, headers, timeout, true);
          } catch {
            triggerLogout();
          }
        } else {
          triggerLogout();
        }
        const error = new Error('인증이 만료되었습니다');
        (error as any).code = 401;
        throw error;
      }

      let message = json?.error?.message ?? result.status;
      const error = new Error(message);
      (error as any).code = responseStatus;
      throw error;
    }
    return json;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      Alert.alert(
        'Thông báo',
        'Kết nối mạng không ổn định' + `${API_URL}/${path}${query}`,
      );
      throw new Error('Request timed out');
    } else {
      throw error;
    }
  }
};

export const apiRest = async (
  method: string,
  path: string,
  params: Record<string, any>,
  headers: Record<string, string> = {},
  timeout = TIME_OUT_API,
  _retried = false,
): Promise<any> => {
  const commonHeaders = await getCommonHeaders();

  const body = JSON.stringify(params);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const result = await fetch(`${API_URL}/${path}`, {
      method,
      mode: 'cors',
      headers: {
        ...commonHeaders,
        ...headers,
      },
      body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = result.headers.get('content-type');
    const json: any =
      contentType && contentType.match('json')
        ? await result.json()
        : await result.text();
    const responseStatus = result.status;

    if (responseStatus >= 400) {
      if (responseStatus === 403 && json?.data) {
        showUpdateRequired(json.data);
      }
      if (responseStatus === 401) {
        if (!_retried) {
          try {
            await refreshAccessTokenOnce();
            return apiRest(method, path, params, headers, timeout, true);
          } catch {
            triggerLogout();
          }
        } else {
          triggerLogout();
        }
        throw new Error('인증이 만료되었습니다');
      }

      const message =
        json?.error?.message ?? `${responseStatus}: ${JSON.stringify(json)}`;
      throw new Error(message);
    }

    return json;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      Alert.alert('Thông báo', 'Kết nối mạng không ổn định !');
      throw new Error('Request timed out');
    } else {
      throw error;
    }
  }
};

export const apiDelete = async (
  path: string,
  params: Record<string, any>,
  headers: Record<string, string> = {},
) => {
  return await apiRest('delete', path, params, headers);
};

export const apiPost = async (
  path: string,
  params: Record<string, any>,
  headers: Record<string, string> = {},
) => {
  return await apiRest('post', path, params, headers);
};

export const apiPut = async (
  path: string,
  params: Record<string, any>,
  headers: Record<string, string> = {},
) => {
  return await apiRest('put', path, params, headers);
};
