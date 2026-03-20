import {configureStore} from '@reduxjs/toolkit';
import {authApi} from '@/src/store/api/auth.api';

jest.mock('@env', () => ({API_BASE_URL: 'https://api.test.com'}));
jest.mock('@/src/services/tokenService', () => ({
  getToken: jest.fn().mockResolvedValue('test-token'),
}));
jest.mock('@/src/services/apiHeaderService', () => ({
  getCommonHeaders: jest.fn().mockResolvedValue({
    'Content-Type': 'application/json',
    Authorization: 'Bearer test-token',
    'X-App-Version': '0.0.1',
    'X-App-Platform': 'android',
  }),
  prepareCommonHeaders: jest.fn().mockImplementation(async (headers: Headers) => {
    headers.set('Authorization', 'Bearer test-token');
    headers.set('X-App-Version', '0.0.1');
    headers.set('X-App-Platform', 'android');
    return headers;
  }),
}));

const createTestStore = () =>
  configureStore({
    reducer: {[authApi.reducerPath]: authApi.reducer},
    middleware: gDM => gDM().concat(authApi.middleware),
  });

const getRequestUrl = (): string => {
  const call = fetchMock.mock.calls[0][0];
  return typeof call === 'string' ? call : (call as any).parsedURL?.href ?? call.url;
};

const getRequestMethod = (): string => {
  const call = fetchMock.mock.calls[0][0];
  if (typeof call === 'string') return (fetchMock.mock.calls[0][1] as any)?.method ?? 'GET';
  return (call as any).method ?? 'GET';
};

describe('authApi', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    jest.useFakeTimers();
    fetchMock.resetMocks();
    store = createTestStore();
  });

  afterEach(() => {
    store.dispatch(authApi.util.resetApiState());
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  //---------------------------------------
  it('sendOtp sends POST /auth/otp/send', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({data: {message: 'OTP sent'}}),
    );

    const result = await store.dispatch(
      authApi.endpoints.sendOtp.initiate({phone: '010-1234-5678', purpose: 'register'}),
    );

    expect(getRequestUrl()).toContain('/auth/otp/send');
    expect(getRequestMethod()).toBe('POST');
    expect(result.data).toEqual({message: 'OTP sent'});
  });

  //---------------------------------------
  it('sendOtp transformResponse handles raw response', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({message: 'OTP sent'}),
    );

    const result = await store.dispatch(
      authApi.endpoints.sendOtp.initiate({phone: '010-0000-0000', purpose: 'login'}),
    );

    expect(result.data).toEqual({message: 'OTP sent'});
  });

  //---------------------------------------
  it('verifyOtp sends POST /auth/otp/verify', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({data: {phoneVerificationToken: 'token-123'}}),
    );

    const result = await store.dispatch(
      authApi.endpoints.verifyOtp.initiate({phone: '010-1234-5678', code: '123456'}),
    );

    expect(getRequestUrl()).toContain('/auth/otp/verify');
    expect(getRequestMethod()).toBe('POST');
    expect(result.data).toEqual({phoneVerificationToken: 'token-123'});
  });

  //---------------------------------------
  it('login sends POST /auth/login with custom queryFn', async () => {
    const mockResponse = {
      data: {
        accessToken: 'access-123',
        refreshToken: 'refresh-123',
        expiresIn: '3600',
        user: {id: 'u1', fullName: 'Test', phone: '010-1234-5678'},
        companies: [],
      },
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await store.dispatch(
      authApi.endpoints.login.initiate({phone: '010-1234-5678', password: 'pass123'}),
    );

    expect(getRequestUrl()).toContain('/auth/login');
    expect(getRequestMethod()).toBe('POST');
    expect(result.data?.accessToken).toBe('access-123');
  });

  //---------------------------------------
  it('login returns error on non-ok response', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({message: 'Invalid credentials'}),
      {status: 401},
    );

    const result = await store.dispatch(
      authApi.endpoints.login.initiate({phone: '010-1234-5678', password: 'wrong'}),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any)?.status).toBe(401);
  });

  //---------------------------------------
  it('login returns FETCH_ERROR on network failure', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'));

    const result = await store.dispatch(
      authApi.endpoints.login.initiate({phone: '010-1234-5678', password: 'pass'}),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any)?.status).toBe('FETCH_ERROR');
  });

  //---------------------------------------
  it('socialLogin sends POST /auth/social-login', async () => {
    const mockResponse = {
      data: {
        accessToken: 'access-123',
        refreshToken: 'refresh-123',
        expiresIn: '3600',
        isNewUser: true,
        user: {id: 'u1', fullName: 'Test', phone: ''},
        companies: [],
      },
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await store.dispatch(
      authApi.endpoints.socialLogin.initiate({provider: 'kakao', accessToken: 'kakao-token'}),
    );

    expect(getRequestUrl()).toContain('/auth/social-login');
    expect(getRequestMethod()).toBe('POST');
    expect(result.data?.isNewUser).toBe(true);
  });

  //---------------------------------------
  it('registerCompany sends POST /auth/register-company with FormData', async () => {
    const mockResponse = {
      data: {
        accessToken: 'access-123',
        refreshToken: 'refresh-123',
        expiresIn: '3600',
        user: {id: 'u1', fullName: 'Test', phone: '010-1234-5678'},
        companies: [{id: 'c1', name: 'Company'}],
      },
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await store.dispatch(
      authApi.endpoints.registerCompany.initiate({
        fullName: 'Test User',
        phone: '010-1234-5678',
        password: 'pass123',
        passwordConfirm: 'pass123',
        phoneVerificationToken: 'token-abc',
        termsAgreed: true,
        privacyAgreed: true,
        marketingAgreed: false,
        companyName: 'Test Company',
        directorCount: 1,
        departments: '[]',
      }),
    );

    expect(getRequestUrl()).toContain('/auth/register-company');
    expect(getRequestMethod()).toBe('POST');
    expect(result.data?.accessToken).toBe('access-123');
  });

  //---------------------------------------
  it('registerCompany returns error on non-ok response', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({message: 'Phone exists'}),
      {status: 409},
    );

    const result = await store.dispatch(
      authApi.endpoints.registerCompany.initiate({
        fullName: 'Test',
        phone: '010-1234-5678',
        password: 'pass',
        passwordConfirm: 'pass',
        phoneVerificationToken: 'token',
        termsAgreed: true,
        privacyAgreed: true,
        marketingAgreed: false,
        companyName: 'Company',
        directorCount: 1,
        departments: '[]',
      }),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any)?.status).toBe(409);
  });

  //---------------------------------------
  it('registerCompany returns FETCH_ERROR on network failure', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'));

    const result = await store.dispatch(
      authApi.endpoints.registerCompany.initiate({
        fullName: 'Test',
        phone: '010-1234-5678',
        password: 'pass',
        passwordConfirm: 'pass',
        phoneVerificationToken: 'token',
        termsAgreed: true,
        privacyAgreed: true,
        marketingAgreed: false,
        companyName: 'Company',
        directorCount: 1,
        departments: '[]',
      }),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any)?.status).toBe('FETCH_ERROR');
  });

  //---------------------------------------
  it('registerCompany includes companyLogo in FormData when provided', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({data: {accessToken: 'a', refreshToken: 'r', expiresIn: '3600', user: {id: 'u1', fullName: 'T', phone: '0'}, companies: []}}),
    );

    await store.dispatch(
      authApi.endpoints.registerCompany.initiate({
        fullName: 'Test',
        phone: '010-1234-5678',
        password: 'pass',
        passwordConfirm: 'pass',
        phoneVerificationToken: 'token',
        termsAgreed: true,
        privacyAgreed: true,
        marketingAgreed: false,
        companyName: 'Company',
        directorCount: 1,
        companyLogo: {uri: 'file://logo.jpg', type: 'image/jpeg', name: 'logo.jpg'},
        departments: '[]',
      }),
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  //---------------------------------------
  it('createCompany sends POST /auth/create-company with FormData', async () => {
    const mockResponse = {
      data: {
        accessToken: 'access-new',
        refreshToken: 'refresh-new',
        expiresIn: '3600',
        user: {id: 'u1', fullName: 'Test', phone: '010-1234-5678'},
        companies: [{id: 'c1', name: 'New Company'}],
      },
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await store.dispatch(
      authApi.endpoints.createCompany.initiate({
        companyName: 'New Company',
        directorCount: 2,
        departments: '[{"name":"Dev"}]',
      }),
    );

    expect(getRequestUrl()).toContain('/auth/create-company');
    expect(getRequestMethod()).toBe('POST');
    expect(result.data?.accessToken).toBe('access-new');
  });

  //---------------------------------------
  it('createCompany returns error on non-ok response', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({message: 'Bad request'}),
      {status: 400},
    );

    const result = await store.dispatch(
      authApi.endpoints.createCompany.initiate({
        companyName: 'Company',
        directorCount: 1,
        departments: '[]',
      }),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any)?.status).toBe(400);
  });

  //---------------------------------------
  it('createCompany returns FETCH_ERROR on network failure', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'));

    const result = await store.dispatch(
      authApi.endpoints.createCompany.initiate({
        companyName: 'Company',
        directorCount: 1,
        departments: '[]',
      }),
    );

    expect(result.error).toBeDefined();
    expect((result.error as any)?.status).toBe('FETCH_ERROR');
  });

  //---------------------------------------
  it('createCompany includes companyLogo when provided', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({data: {accessToken: 'a', refreshToken: 'r', expiresIn: '3600', user: {id: 'u1', fullName: 'T', phone: '0'}, companies: []}}),
    );

    await store.dispatch(
      authApi.endpoints.createCompany.initiate({
        companyName: 'Company',
        directorCount: 1,
        companyLogo: {uri: 'file://logo.png', type: 'image/png', name: 'logo.png'},
        departments: '[]',
      }),
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  //---------------------------------------
  it('joinCompany sends POST /auth/join-company', async () => {
    const mockResponse = {
      data: {
        accessToken: 'access-123',
        refreshToken: 'refresh-123',
        expiresIn: '3600',
        user: {id: 'u1', fullName: 'Test', phone: '010-1234-5678'},
        companies: [],
      },
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await store.dispatch(
      authApi.endpoints.joinCompany.initiate({inviteCode: 'ABC123'}),
    );

    expect(getRequestUrl()).toContain('/auth/join-company');
    expect(getRequestMethod()).toBe('POST');
    expect(result.data?.accessToken).toBe('access-123');
  });

  //---------------------------------------
  it('registerWithInvite sends POST /auth/register-with-invite', async () => {
    const mockResponse = {
      data: {
        accessToken: 'access-inv',
        refreshToken: 'refresh-inv',
        expiresIn: '3600',
        user: {id: 'u2', fullName: 'Invited', phone: '010-9999-9999'},
        companies: [],
      },
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await store.dispatch(
      authApi.endpoints.registerWithInvite.initiate({
        inviteCode: 'INV-123',
        fullName: 'Invited User',
        phone: '010-9999-9999',
        password: 'pass123',
        passwordConfirm: 'pass123',
        phoneVerificationToken: 'token-xyz',
        termsAgreed: true,
        privacyAgreed: true,
        marketingAgreed: false,
      }),
    );

    expect(getRequestUrl()).toContain('/auth/register-with-invite');
    expect(getRequestMethod()).toBe('POST');
    expect(result.data?.accessToken).toBe('access-inv');
  });

  //---------------------------------------
  it('createInvitation sends POST /auth/invitations', async () => {
    const mockInvitation = {
      data: {
        id: 'inv-1',
        inviteCode: 'CODE123',
        inviteUrl: 'https://app.com/invite/CODE123',
        role: 'Member',
        roleSlug: 'member',
        department: null,
        team: null,
        expiresAt: '2025-04-15T00:00:00Z',
        maxUses: 10,
        linkType: 'general',
      },
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockInvitation));

    const result = await store.dispatch(
      authApi.endpoints.createInvitation.initiate({
        roleSlug: 'member',
        expiresInDays: 7,
      }),
    );

    expect(getRequestUrl()).toContain('/auth/invitations');
    expect(getRequestMethod()).toBe('POST');
    expect(result.data?.inviteCode).toBe('CODE123');
  });

  //---------------------------------------
  it('getInvitationByCode sends GET /auth/invitations/:code', async () => {
    const mockResponse = {
      data: {
        company: {id: 'c1', name: 'Test Company'},
        directors: [],
        inviter: {fullName: 'Admin', avatarUrl: null, roleName: 'Director'},
        role: {name: 'Member', slug: 'member', description: ''},
        department: null,
        team: null,
        nodePath: '',
        expiresAt: '2025-04-15T00:00:00Z',
        linkType: 'general',
      },
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await store.dispatch(
      authApi.endpoints.getInvitationByCode.initiate('ABC123'),
    );

    expect(getRequestUrl()).toContain('/auth/invitations/ABC123');
    expect(result.data?.company.name).toBe('Test Company');
  });

  //---------------------------------------
  it('refreshToken sends POST /auth/refresh', async () => {
    const mockResponse = {
      data: {accessToken: 'new-access', refreshToken: 'new-refresh'},
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await store.dispatch(
      authApi.endpoints.refreshToken.initiate({refreshToken: 'old-refresh'}),
    );

    expect(getRequestUrl()).toContain('/auth/refresh');
    expect(getRequestMethod()).toBe('POST');
    expect(result.data?.accessToken).toBe('new-access');
  });

  //---------------------------------------
  it('logout sends POST /auth/logout', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await store.dispatch(
      authApi.endpoints.logout.initiate({refreshToken: 'refresh-123'}),
    );

    expect(getRequestUrl()).toContain('/auth/logout');
    expect(getRequestMethod()).toBe('POST');
  });

  //---------------------------------------
  it('getStructure sends GET /auth/company/structure', async () => {
    const mockStructure = {
      data: {
        data: {
          departments: [{id: 'd1', name: 'Dev', teams: []}],
        },
      },
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockStructure));

    const result = await store.dispatch(
      authApi.endpoints.getStructure.initiate(),
    );

    expect(getRequestUrl()).toContain('/auth/company/structure');
    expect(result.data).toEqual({departments: [{id: 'd1', name: 'Dev', teams: []}]});
  });

  //---------------------------------------
  it('getStructure transformResponse handles flat data', async () => {
    const mockStructure = {
      data: {departments: [{id: 'd1', name: 'HR', teams: []}]},
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockStructure));

    const result = await store.dispatch(
      authApi.endpoints.getStructure.initiate(undefined, {forceRefetch: true}),
    );

    expect(result.data).toEqual({departments: [{id: 'd1', name: 'HR', teams: []}]});
  });
});
