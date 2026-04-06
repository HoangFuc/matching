import React from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { saveTokens, saveUserInfo, saveCompanyInfo } from '@/src/services/tokenService';
import { useSocialLoginMutation } from '@/src/store/api/auth.api';
import {
  signInWithProvider,
  type TSocialProvider,
} from '@/src/services/socialLoginService';
import { useToast } from '@/src/providers/ToastProvider';

export const useSocialLogin = () => {
  const navigation = useNavigation();
  const [socialLogin, { isLoading }] = useSocialLoginMutation();
  const { showToast } = useToast();

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
        showToast({ type: 'error', message: error?.data?.message ?? '소셜 로그인에 실패했습니다.' });
      }
    },
    [navigation, socialLogin, showToast],
  );

  return { handleSocialLogin, isSocialLoading: isLoading };
};
