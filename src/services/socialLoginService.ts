import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { login as kakaoLogin } from '@react-native-seoul/kakao-login';
import NaverLogin from '@react-native-seoul/naver-login';
import {
  GOOGLE_WEB_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID,
  NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET,
  NAVER_APP_NAME,
} from '@env';

export type TSocialProvider = 'google' | 'kakao' | 'naver';

//---------------------------------------
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
  });
};

//---------------------------------------
export const configureNaverLogin = () => {
  NaverLogin.initialize({
    appName: NAVER_APP_NAME,
    consumerKey: NAVER_CLIENT_ID,
    consumerSecret: NAVER_CLIENT_SECRET,
    serviceUrlSchemeIOS: 'matching',
    disableNaverAppAuthIOS: true,
  });
};

//---------------------------------------
const signInWithGoogle = async (): Promise<string> => {
  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();
  const idToken = response.data?.idToken;
  if (!idToken) {
    throw new Error('Google sign-in failed: no ID token');
  }
  return idToken;
};

//---------------------------------------
const signInWithKakao = async (): Promise<string> => {
  console.log('[SocialLogin] Calling kakaoLogin()...');
  const result = await kakaoLogin();
  console.log('[SocialLogin] Kakao result:', JSON.stringify(result));
  return result.accessToken;
};

//---------------------------------------
const signInWithNaver = async (): Promise<string> => {
  const result = await NaverLogin.login();
  if (!result.isSuccess || !result.successResponse) {
    throw new Error('Naver sign-in failed');
  }
  return result.successResponse.accessToken;
};

//---------------------------------------
export const signInWithProvider = async (
  provider: TSocialProvider,
): Promise<string> => {
  switch (provider) {
    case 'google':
      return signInWithGoogle();
    case 'kakao':
      return signInWithKakao();
    case 'naver':
      return signInWithNaver();
  }
};
