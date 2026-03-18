import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { HamburgerMenu, Notification } from '@/src/constants/icons';
import { AppImages } from '@/src/constants/images';
import { getUserInfo } from '@/src/services/tokenService';
import { moderateScale as ms } from 'react-native-size-matters/extend';

//---------------------------------------
const DAYS_KR = [
  '일요일',
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
];

//---------------------------------------
const formatDateKR = (timestamp?: string | number): string => {
  const date = timestamp ? new Date(timestamp) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = DAYS_KR[date.getDay()];
  return `${year}년 ${month}월 ${day}일 ${dayOfWeek}`;
};

//---------------------------------------
const HeaderDashboard: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [timestamp, setTimestamp] = useState<string | number | undefined>();

  //---------------------------------------
  useEffect(() => {
    const loadUserInfo = async () => {
      const user = await getUserInfo();
      if (user) {
        setFullName(user.fullName ?? '');
        setTimestamp(user.timestamp ?? user.createdAt);
      }
    };
    loadUserInfo();
  }, []);

  return (
    <ImageBackground source={AppImages.headerBg} resizeMode="cover">
      <View style={styles.logo}>
        <Image
          style={{
            width: ms(47),
            aspectRatio: 47 / 24,
          }}
          resizeMode="contain"
          source={AppImages.matchingLogo}
        />

        <View style={styles.action}>
          <Notification size={`${ms(24)}`} color={`${AppColors.white}`} />

          <HamburgerMenu size={`${ms(24)}`} color={`${AppColors.white}`} />
        </View>
      </View>

      <View style={styles.info}>
        <Image
          source={AppImages.avatar}
          style={{
            width: ms(40),
            height: ms(40),
            borderRadius: ms(20),
          }}
        />

        <View>
          <AppText variant="detail" color={AppColors.white}>
            {formatDateKR(timestamp)}
          </AppText>

          <AppText variant="heading3" color={AppColors.white}>
            {fullName}님 안녕하세요
          </AppText>
        </View>
      </View>
    </ImageBackground>
  );
};

export const MemoHeaderDashboard = React.memo(HeaderDashboard);

const styles = StyleSheet.create({
  logo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingBottom: ms(16),
  },
  action: {
    flexDirection: 'row',
    gap: ms(16),
  },
  background: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '120%',
    height: '170%',
  },
  info: {
    flexDirection: 'row',
    paddingHorizontal: ms(16),
    gap: ms(8),
    paddingBottom: ms(24),
  },
});
