import {
  saveTokens,
  getToken,
  removeToken,
  getUserInfo,
  saveUserInfo,
  saveCompanyInfo,
  getCompanyInfo,
  setKeepLoggedIn,
  getKeepLoggedIn,
  setSavedPhone,
  getSavedPhone,
} from '@/src/services/tokenService';

jest.mock('@env', () => ({API_BASE_URL: 'https://api.test.com'}));

// Mock AsyncStorage
const mockStorage: Record<string, string> = {};
jest.mock('@/src/api/async.storage', () => ({
  _storeData: jest.fn(async (key: string, value: string) => {
    mockStorage[key] = value;
    return true;
  }),
  _retrieveData: jest.fn(async (key: string) => mockStorage[key] || null),
  _removeData: jest.fn(async (key: string) => {
    delete mockStorage[key];
    return true;
  }),
}));

// Helper: create a valid JWT with given exp
const createJwt = (exp: number): string => {
  const header = btoa(JSON.stringify({alg: 'HS256', typ: 'JWT'}));
  const payload = btoa(JSON.stringify({sub: 'user-1', exp}));
  return `${header}.${payload}.signature`;
};

describe('tokenService', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
    fetchMock.resetMocks();
  });

  //---------------------------------------
  describe('saveTokens', () => {
    it('stores both access and refresh tokens', async () => {
      await saveTokens('access-123', 'refresh-456');
      expect(mockStorage.auth_token).toBe('access-123');
      expect(mockStorage.refresh_token).toBe('refresh-456');
    });
  });

  //---------------------------------------
  describe('getToken', () => {
    it('returns cached token when not expired', async () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      const token = createJwt(futureExp);
      mockStorage.auth_token = token;

      const result = await getToken();
      expect(result).toBe(token);
    });

    it('refreshes token when expired', async () => {
      const pastExp = Math.floor(Date.now() / 1000) - 100;
      mockStorage.auth_token = createJwt(pastExp);
      mockStorage.refresh_token = 'refresh-valid';

      const newAccessToken = 'new-access-token';
      fetchMock.mockResponseOnce(
        JSON.stringify({data: {accessToken: newAccessToken, refreshToken: 'new-refresh'}}),
      );

      const result = await getToken();
      expect(result).toBe(newAccessToken);
      expect(mockStorage.auth_token).toBe(newAccessToken);
    });

    it('returns null when no token exists', async () => {
      const result = await getToken();
      expect(result).toBeNull();
    });

    it('returns null when refresh fails', async () => {
      const pastExp = Math.floor(Date.now() / 1000) - 100;
      mockStorage.auth_token = createJwt(pastExp);
      mockStorage.refresh_token = 'refresh-expired';

      fetchMock.mockResponseOnce('', {status: 401});

      const result = await getToken();
      expect(result).toBeNull();
    });

    it('returns null when token payload is invalid', async () => {
      mockStorage.auth_token = 'invalid.token.here';

      const result = await getToken();
      expect(result).toBeNull();
    });
  });

  //---------------------------------------
  describe('removeToken', () => {
    it('removes access token, refresh token, and company info', async () => {
      mockStorage.auth_token = 'access';
      mockStorage.refresh_token = 'refresh';
      mockStorage.company_info = '{}';

      await removeToken();

      expect(mockStorage.auth_token).toBeUndefined();
      expect(mockStorage.refresh_token).toBeUndefined();
      expect(mockStorage.company_info).toBeUndefined();
    });
  });

  //---------------------------------------
  describe('getUserInfo / saveUserInfo', () => {
    it('saves and retrieves user info', async () => {
      const user = {id: 'u1', fullName: 'Test', phone: '010-1234-5678'};
      await saveUserInfo(user);

      const result = await getUserInfo();
      expect(result).toEqual(user);
    });

    it('returns null when no user info stored', async () => {
      const result = await getUserInfo();
      expect(result).toBeNull();
    });

    it('returns null when stored data is invalid JSON', async () => {
      mockStorage.user_info = 'invalid-json';

      const result = await getUserInfo();
      expect(result).toBeNull();
    });
  });

  //---------------------------------------
  describe('saveCompanyInfo / getCompanyInfo', () => {
    it('saves and retrieves company info', async () => {
      const company = [{id: 'c1', name: 'Test Corp'}];
      await saveCompanyInfo(company);

      const result = await getCompanyInfo();
      expect(result).toEqual(company);
    });

    it('removes company info when null is passed', async () => {
      mockStorage.company_info = '{"id":"c1"}';
      await saveCompanyInfo(null);

      expect(mockStorage.company_info).toBeUndefined();
    });

    it('returns null when no company info stored', async () => {
      const result = await getCompanyInfo();
      expect(result).toBeNull();
    });

    it('returns null when stored data is invalid JSON', async () => {
      mockStorage.company_info = 'not-json';

      const result = await getCompanyInfo();
      expect(result).toBeNull();
    });
  });

  //---------------------------------------
  describe('setKeepLoggedIn / getKeepLoggedIn', () => {
    it('stores true and retrieves it', async () => {
      await setKeepLoggedIn(true);
      const result = await getKeepLoggedIn();
      expect(result).toBe(true);
    });

    it('removes key when set to false', async () => {
      await setKeepLoggedIn(true);
      await setKeepLoggedIn(false);
      const result = await getKeepLoggedIn();
      expect(result).toBe(false);
    });

    it('returns false when not set', async () => {
      const result = await getKeepLoggedIn();
      expect(result).toBe(false);
    });
  });

  //---------------------------------------
  describe('setSavedPhone / getSavedPhone', () => {
    it('stores and retrieves phone number', async () => {
      await setSavedPhone('010-1234-5678');
      const result = await getSavedPhone();
      expect(result).toBe('010-1234-5678');
    });

    it('removes phone when null is passed', async () => {
      await setSavedPhone('010-1234-5678');
      await setSavedPhone(null);
      const result = await getSavedPhone();
      expect(result).toBeNull();
    });

    it('returns null when not set', async () => {
      const result = await getSavedPhone();
      expect(result).toBeNull();
    });
  });
});
