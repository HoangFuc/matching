import React from 'react';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { MemoBaseCard } from '@/src/component/BaseCard';
import { AppColors } from '@/src/constants/colors';
import {
  Book,
  Bookmark,
  Lock,
  Notification,
  SecuritySafe,
} from '@/src/constants/icons';
import type { RootStackParamList } from '@/src/interface/tab.interface';

import { MemoMenuItem } from './MenuItem';

const APP_VERSION = '1.0.0';

//---------------------------------------
const SettingsMenuSection: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  //---------------------------------------
  const handlePressSecurity = React.useCallback(() => {
    navigation.navigate('SecuritySettings');
  }, [navigation]);

  return (
    <MemoBaseCard>
      <MemoMenuItem
        icon={
          <Lock
            size={`${ms(20)}`}
            color={AppColors.gray90}
            variant="Linear"
          />
        }
        label="보안 설정"
        gap={ms(6)}
        labelVariant="body6"
        isFirst
        onPress={handlePressSecurity}
      />

      <MemoMenuItem
        icon={
          <Notification
            size={`${ms(20)}`}
            color={AppColors.gray90}
            variant="Linear"
          />
        }
        label="알림 설정"
        gap={ms(6)}
        labelVariant="body6"
      />

      <MemoMenuItem
        icon={
          <SecuritySafe
            size={`${ms(20)}`}
            color={AppColors.gray90}
            variant="Linear"
          />
        }
        label="개인 정보 보호 정책"
        gap={ms(6)}
        labelVariant="body6"
      />

      <MemoMenuItem
        icon={
          <Book
            size={`${ms(20)}`}
            color={AppColors.gray90}
            variant="Linear"
          />
        }
        label="이용 약관"
        gap={ms(6)}
        labelVariant="body6"
      />

      <MemoMenuItem
        icon={
          <Bookmark
            size={`${ms(20)}`}
            color={AppColors.gray90}
            variant="Linear"
          />
        }
        label="앱 버전"
        rightText={APP_VERSION}
        showArrow={false}
        gap={ms(6)}
        labelVariant="body6"
        isLast
      />
    </MemoBaseCard>
  );
};

export const MemoSettingsMenuSection = React.memo(SettingsMenuSection);
