import React from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { saveTokens, saveUserInfo, saveCompanyInfo } from '@/src/services/tokenService';
import { useSocialLoginMutation } from '@/src/store/api/auth.api';
import {
  signInWithProvider,
  type TSocialProvider,
} from '@/src/services/socialLoginService';

export const useSocialLogin = () => {
  const navigation = useNavigation();
  const [socialLogin, { isLoading }] = useSocialLoginMutation();

  //---------------------------------------
  const handleSocialLogin = React.useCallback(
    async (provider: TSocialProvider) => {
      try {
        console.log(`[SocialLogin] Starting ${provider} sign-in...`);
        const accessToken = await signInWithProvider(provider);
        console.log(`[SocialLogin] Got ${provider} token:`, accessToken ? `${accessToken.substring(0, 20)}...` : 'EMPTY');

        console.log(`[SocialLogin] Calling API with:`, { provider, accessToken });
        const result = await socialLogin({ provider, accessToken }).unwrap();
        console.log(`[SocialLogin] API response:`, JSON.stringify(result));

        await saveTokens(result.accessToken, result.refreshToken);
        await saveUserInfo(result.user);
        await saveCompanyInfo(result.companies);

        if (result.isNewUser) {
          (navigation as any).navigate('JoinOrganization', { fromSocialLogin: true });
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'MainTabs' }],
            }),
          );
        }
      } catch (error: any) {
        console.error(`[SocialLogin] Error for ${provider}:`, error);
        console.error(`[SocialLogin] Error details:`, JSON.stringify(error, null, 2));
      }
    },
    [navigation, socialLogin],
  );

  return { handleSocialLogin, isSocialLoading: isLoading };
};
