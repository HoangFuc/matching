import {buildQuies, apiGet, apiRest, apiPost, apiPut, apiDelete} from '@/src/api/api';

jest.mock('@env', () => ({API_BASE_URL: 'https://api.test.com'}));
jest.mock('@/src/services/apiHeaderService', () => ({
  getCommonHeaders: jest.fn().mockResolvedValue({
    'Content-Type': 'application/json',
    Authorization: 'Bearer test-token',
  }),
}));
jest.mock('@/src/utils/updateRequiredDispatcher', () => ({
  showUpdateRequired: jest.fn(),
}));
jest.mock('react-native', () => ({
  Alert: {alert: jest.fn()},
}));

import {showUpdateRequired} from '@/src/utils/updateRequiredDispatcher';
import {Alert} from 'react-native';

const mockShowUpdateRequired = showUpdateRequired as jest.MockedFunction<typeof showUpdateRequired>;
const mockAlert = Alert.alert as jest.MockedFunction<typeof Alert.alert>;

describe('legacy api utilities', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    mockShowUpdateRequired.mockClear();
    mockAlert.mockClear();
  });

  //---------------------------------------
  describe('buildQuies', () => {
    it('returns empty string for empty params', () => {
      expect(buildQuies({})).toBe('');
      expect(buildQuies()).toBe('');
    });

    it('builds query string from params', () => {
      const result = buildQuies({page: 1, limit: 10});
      expect(result).toContain('page=1');
      expect(result).toContain('limit=10');
      expect(result[0]).toBe('?');
    });

    it('encodes object values as JSON', () => {
      const result = buildQuies({filter: {status: 'active'}});
      expect(result).toContain('filter=');
    });

    it('skips undefined values', () => {
      const result = buildQuies({a: 'hello', b: undefined});
      expect(result).toContain('a=hello');
      expect(result).not.toContain('b=');
    });
  });

  //---------------------------------------
  describe('apiGet', () => {
    it('sends GET request with correct URL and headers', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({data: 'test'}), {
        headers: {'content-type': 'application/json'},
      });

      const result = await apiGet('users', {page: 1});

      const url = fetchMock.mock.calls[0][0] as string;
      expect(url).toContain('/users');
      expect(url).toContain('page=1');
      expect(result).toEqual({data: 'test'});
    });

    it('handles text response', async () => {
      fetchMock.mockResponseOnce('plain text', {
        headers: {'content-type': 'text/plain'},
      });

      const result = await apiGet('text-endpoint');
      expect(result).toBe('plain text');
    });

    it('throws error on 400+ status', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({error: {message: 'Not found'}}),
        {status: 404, headers: {'content-type': 'application/json'}},
      );

      await expect(apiGet('missing')).rejects.toThrow('Not found');
    });

    it('shows update required on 403 with data', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({data: 'https://store.com/update'}),
        {status: 403, headers: {'content-type': 'application/json'}},
      );

      await expect(apiGet('protected')).rejects.toThrow();
      expect(mockShowUpdateRequired).toHaveBeenCalledWith('https://store.com/update');
    });

    it('shows alert on 401', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({error: {message: 'Unauthorized'}}),
        {status: 401, headers: {'content-type': 'application/json'}},
      );

      await expect(apiGet('auth-required')).rejects.toThrow();
      expect(mockAlert).toHaveBeenCalledWith(
        'Phiên đăng nhập hết hạn',
        'Vui lòng đăng nhập lại!',
      );
    });

    it('throws timeout error on abort', async () => {
      fetchMock.mockAbortOnce();

      await expect(apiGet('slow-endpoint', {}, {}, 1)).rejects.toThrow();
    });
  });

  //---------------------------------------
  describe('apiRest', () => {
    it('sends request with correct method and body', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({id: 1}), {
        headers: {'content-type': 'application/json'},
      });

      const result = await apiRest('post', 'items', {name: 'Test'});

      const [, options] = fetchMock.mock.calls[0];
      expect((options as any).method).toBe('post');
      expect(JSON.parse((options as any).body)).toEqual({name: 'Test'});
      expect(result).toEqual({id: 1});
    });

    it('throws error on 400+ status', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({error: {message: 'Bad request'}}),
        {status: 400, headers: {'content-type': 'application/json'}},
      );

      await expect(apiRest('post', 'items', {})).rejects.toThrow();
    });

    it('shows update required on 403 with data', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({data: 'https://store.com/update'}),
        {status: 403, headers: {'content-type': 'application/json'}},
      );

      await expect(apiRest('post', 'items', {})).rejects.toThrow();
      expect(mockShowUpdateRequired).toHaveBeenCalled();
    });

    it('shows alert on 401', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({error: {message: 'Expired'}}),
        {status: 401, headers: {'content-type': 'application/json'}},
      );

      await expect(apiRest('post', 'items', {})).rejects.toThrow();
      expect(mockAlert).toHaveBeenCalled();
    });
  });

  //---------------------------------------
  describe('apiPost', () => {
    it('delegates to apiRest with POST method', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({success: true}), {
        headers: {'content-type': 'application/json'},
      });

      await apiPost('create', {data: 'test'});

      const [, options] = fetchMock.mock.calls[0];
      expect((options as any).method).toBe('post');
    });
  });

  //---------------------------------------
  describe('apiPut', () => {
    it('delegates to apiRest with PUT method', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({success: true}), {
        headers: {'content-type': 'application/json'},
      });

      await apiPut('update/1', {data: 'test'});

      const [, options] = fetchMock.mock.calls[0];
      expect((options as any).method).toBe('put');
    });
  });

  //---------------------------------------
  describe('apiDelete', () => {
    it('delegates to apiRest with DELETE method', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({success: true}), {
        headers: {'content-type': 'application/json'},
      });

      await apiDelete('items/1', {});

      const [, options] = fetchMock.mock.calls[0];
      expect((options as any).method).toBe('delete');
    });
  });
});
