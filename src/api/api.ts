import { Alert } from 'react-native';

import _ from 'lodash';

import { API_BASE_URL } from '@env';
import { _retrieveData } from './async.storage';

const API_URL = API_BASE_URL;

const TIME_OUT_API = 100000;

export const buildQuies = (params = {}) => {
  const queries = _(params)
    .entries()
    .reduce((acc, [key, value]) => {
      let type = typeof value;
      if (type !== 'undefined') {
        let val = type === 'object' ? JSON.stringify(value) : (value as string);
        acc.push(`${key}=${encodeURI(val)}`);
      }
      return acc;
    }, [] as string[]);

  const query = _.isEmpty(queries) ? '' : `?${queries.join('&')}`;
  return query;
};

export const apiGet = async (
  path: string,
  params?: Record<string, any>,
  headers: Record<string, string> = {},
  timeout = TIME_OUT_API,
): Promise<any> => {
  const auth = await _retrieveData('auth');
  let token = _.get(JSON.parse(auth || '{}'), 'accessToken');
  headers.Authorization = `Bearer ${token}`;

  const queries = _(params)
    .entries()
    .reduce((acc, [key, value]) => {
      let type = typeof value;
      if (type !== 'undefined') {
        let val = type === 'object' ? JSON.stringify(value) : (value as string);
        acc.push(`${key}=${encodeURI(val)}`);
      }
      return acc;
    }, [] as string[]);

  const query = _.isEmpty(queries) ? '' : `?${queries.join('&')}`;
  // console.log(
  //   `API LIBS: \n url: ${API_URL}/${path}${query} \n method: GET \n headers: ${JSON.stringify(
  //     headers,
  //   )}`,
  // )

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const result = await fetch(`${API_URL}/${path}${query}`, {
      method: 'get',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = result.headers.get('content-type');
    const json =
      contentType && contentType.match('json')
        ? await result.json()
        : await result.text();
    // console.log(path, json)
    const responseStatus = result.status;

    if (responseStatus >= 400) {
      let message = _.get(json, 'error.message', result.status);
      if (responseStatus === 401) {
        Alert.alert('Phiên đăng nhập hết hạn', 'Vui lòng đăng nhập lại!');
      }

      const error = new Error(message);
      _.set(error, 'code', responseStatus);
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
): Promise<any> => {
  const auth = await _retrieveData('auth');
  let token = _.get(JSON.parse(auth || '{}'), 'accessToken');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const body = JSON.stringify(params);
  // console.log(
  //   `API LIBS: \n url: ${API_URL}/${path} \n method: ${method} \n body: ${body} \n headers: ${JSON.stringify(
  //     headers,
  //   )}`,
  // )

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const result = await fetch(`${API_URL}/${path}`, {
      method,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = result.headers.get('content-type');
    const json =
      contentType && contentType.match('json')
        ? await result.json()
        : await result.text();
    // console.log(path, json)
    const responseStatus = result.status;

    if (responseStatus >= 400) {
      let message = _.get(
        json,
        'error.message',
        `${responseStatus}: ${JSON.stringify(json)}`,
      );
      if (responseStatus === 401) {
        Alert.alert('Phiên đăng nhập hết hạn', 'Vui lòng đăng nhập lại!');
      }

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
