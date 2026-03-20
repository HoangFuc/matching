import {
  getCommonHeaders,
  prepareCommonHeaders,
} from '@/src/services/apiHeaderService';
import {getToken} from '@/src/services/tokenService';

jest.mock('@/src/services/tokenService', () => ({
  getToken: jest.fn(),
}));

const mockGetToken = getToken as jest.MockedFunction<typeof getToken>;

describe('apiHeaderService', () => {
  beforeEach(() => {
    mockGetToken.mockReset();
  });

  //---------------------------------------
  describe('getCommonHeaders', () => {
    it('returns headers with auth token when available', async () => {
      mockGetToken.mockResolvedValue('test-token-123');

      const headers = await getCommonHeaders();

      expect(headers['Content-Type']).toBe('application/json');
      expect(headers.Authorization).toBe('Bearer test-token-123');
      expect(headers['X-App-Version']).toBe('0.0.1');
      expect(headers['X-App-Platform']).toBeDefined();
    });

    it('returns headers without Authorization when no token', async () => {
      mockGetToken.mockResolvedValue(null);

      const headers = await getCommonHeaders();

      expect(headers['Content-Type']).toBe('application/json');
      expect(headers.Authorization).toBeUndefined();
      expect(headers['X-App-Version']).toBe('0.0.1');
    });
  });

  //---------------------------------------
  describe('prepareCommonHeaders', () => {
    it('sets auth headers on Headers object when token available', async () => {
      mockGetToken.mockResolvedValue('token-xyz');
      const headers = new Headers();

      const result = await prepareCommonHeaders(headers);

      expect(result.get('Authorization')).toBe('Bearer token-xyz');
      expect(result.get('X-App-Version')).toBe('0.0.1');
      expect(result.get('X-App-Platform')).toBeDefined();
    });

    it('does not set Authorization when no token', async () => {
      mockGetToken.mockResolvedValue(null);
      const headers = new Headers();

      const result = await prepareCommonHeaders(headers);

      expect(result.get('Authorization')).toBeNull();
      expect(result.get('X-App-Version')).toBe('0.0.1');
    });
  });
});
