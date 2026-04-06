import React, { useCallback, useEffect } from 'react';

import { CommonActions } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';

import { removeToken } from '@/src/services/tokenService';
import { resetAllApiCaches } from '@/src/store';
import { setGlobalLogout } from '@/src/utils/logoutDispatcher';
import { navigationRef } from '@/src/utils/navigationRef';

const SessionExpiredProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();

  //---------------------------------------
  const handleSessionExpired = useCallback(async () => {
    await removeToken();
    dispatch(resetAllApiCaches());
    Toast.show({
      type: 'error',
      text1: '세션이 만료되었습니다',
      text2: '다시 로그인해 주세요.',
    });
    if (navigationRef.isReady()) {
      navigationRef.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: 'Auth' }] }),
      );
    }
  }, [dispatch]);

  //---------------------------------------
  useEffect(() => {
    setGlobalLogout(handleSessionExpired);
  }, [handleSessionExpired]);

  return <>{children}</>;
};

export const MemoSessionExpiredProvider = React.memo(SessionExpiredProvider);
