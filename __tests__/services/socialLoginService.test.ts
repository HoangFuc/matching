import {
  configureGoogleSignIn,
  configureNaverLogin,
  signInWithProvider,
} from '@/src/services/socialLoginService';

jest.mock('@env', () => ({
  API_BASE_URL: 'https://api.test.com',
  GOOGLE_WEB_CLIENT_ID: 'google-web-id',
  GOOGLE_IOS_CLIENT_ID: 'google-ios-id',
  NAVER_CLIENT_ID: 'naver-client-id',
  NAVER_CLIENT_SECRET: 'naver-secret',
  NAVER_APP_NAME: 'MatchingApp',
}));

const mockGoogleConfigure = jest.fn();
const mockHasPlayServices = jest.fn();
const mockGoogleSignIn = jest.fn();

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: (...args: any[]) => mockGoogleConfigure(...args),
    hasPlayServices: (...args: any[]) => mockHasPlayServices(...args),
    signIn: (...args: any[]) => mockGoogleSignIn(...args),
  },
}));

const mockKakaoLogin = jest.fn();
jest.mock('@react-native-seoul/kakao-login', () => ({
  login: (...args: any[]) => mockKakaoLogin(...args),
}));

const mockNaverInitialize = jest.fn();
const mockNaverLogin = jest.fn();
jest.mock('@react-native-seoul/naver-login', () => ({
  __esModule: true,
  default: {
    initialize: (...args: any[]) => mockNaverInitialize(...args),
    login: (...args: any[]) => mockNaverLogin(...args),
  },
}));

describe('socialLoginService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //---------------------------------------
  describe('configureGoogleSignIn', () => {
    it('configures Google Sign-In with env credentials', () => {
      configureGoogleSignIn();

      expect(mockGoogleConfigure).toHaveBeenCalledWith(
        expect.objectContaining({
          webClientId: expect.any(String),
          iosClientId: expect.any(String),
        }),
      );
    });
  });

  //---------------------------------------
  describe('configureNaverLogin', () => {
    it('configures Naver login with env credentials', () => {
      configureNaverLogin();

      expect(mockNaverInitialize).toHaveBeenCalledWith(
        expect.objectContaining({
          appName: expect.any(String),
          consumerKey: expect.any(String),
          consumerSecret: expect.any(String),
          serviceUrlSchemeIOS: 'matching',
          disableNaverAppAuthIOS: true,
        }),
      );
    });
  });

  //---------------------------------------
  describe('signInWithProvider', () => {
    //---------------------------------------
    it('returns Google ID token on google login', async () => {
      mockHasPlayServices.mockResolvedValue(true);
      mockGoogleSignIn.mockResolvedValue({data: {idToken: 'google-id-token'}});

      const token = await signInWithProvider('google');

      expect(mockHasPlayServices).toHaveBeenCalled();
      expect(mockGoogleSignIn).toHaveBeenCalled();
      expect(token).toBe('google-id-token');
    });

    //---------------------------------------
    it('throws when Google sign-in returns no ID token', async () => {
      mockHasPlayServices.mockResolvedValue(true);
      mockGoogleSignIn.mockResolvedValue({data: {idToken: null}});

      await expect(signInWithProvider('google')).rejects.toThrow(
        'Google sign-in failed: no ID token',
      );
    });

    //---------------------------------------
    it('returns Kakao access token on kakao login', async () => {
      mockKakaoLogin.mockResolvedValue({accessToken: 'kakao-access-token'});

      const token = await signInWithProvider('kakao');

      expect(mockKakaoLogin).toHaveBeenCalled();
      expect(token).toBe('kakao-access-token');
    });

    //---------------------------------------
    it('returns Naver access token on naver login', async () => {
      mockNaverLogin.mockResolvedValue({
        isSuccess: true,
        successResponse: {accessToken: 'naver-access-token'},
      });

      const token = await signInWithProvider('naver');

      expect(mockNaverLogin).toHaveBeenCalled();
      expect(token).toBe('naver-access-token');
    });

    //---------------------------------------
    it('throws when Naver sign-in fails', async () => {
      mockNaverLogin.mockResolvedValue({isSuccess: false, successResponse: null});

      await expect(signInWithProvider('naver')).rejects.toThrow(
        'Naver sign-in failed',
      );
    });

    //---------------------------------------
    it('throws when Naver returns no successResponse', async () => {
      mockNaverLogin.mockResolvedValue({isSuccess: true, successResponse: null});

      await expect(signInWithProvider('naver')).rejects.toThrow(
        'Naver sign-in failed',
      );
    });
  });
});
