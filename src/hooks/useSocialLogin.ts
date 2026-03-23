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
        const accessToken = await signInWithProvider(provider);

        const result = await socialLogin({ provider, accessToken }).unwrap();

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
        // Error handled by toastMiddleware
      }
    },
    [navigation, socialLogin],
  );

  return { handleSocialLogin, isSocialLoading: isLoading };
};
