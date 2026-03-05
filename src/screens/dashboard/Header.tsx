import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { HamburgerMenu, Notification } from 'iconsax-react-nativejs';
import {
  scale as s,
  moderateScale as ms,
} from 'react-native-size-matters/extend';
import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';

const HeaderDashboard: React.FC = () => {
  return (
    <>
      <View style={styles.logo}>
        <Image
          style={{
            width: s(47),
            aspectRatio: 47 / 24,
          }}
          resizeMode="contain"
          source={require('../../assets/images/matchingLogo.png')}
        />

        <View style={styles.action}>
          <Notification size={`${ms(24)}`} color={`${AppColors.white}`} />

          <HamburgerMenu size={`${ms(24)}`} color={`${AppColors.white}`} />
        </View>

        <Image
          source={require('../../assets/images/converted.png')}
          style={styles.background}
          resizeMode="contain"
        />
      </View>

      <View style={styles.info}>
        <Image
          source={require('../../assets/images/avatar.jpg')}
          style={{
            width: s(40),
            height: s(40),
            borderRadius: s(20),
          }}
        />

        <View>
          <AppText variant="detail" color={AppColors.white}>
            2025년 10월 15일 수요일
          </AppText>

          <AppText variant="heading3" color={AppColors.white}>
            OOO님 안녕하세요
          </AppText>
        </View>
      </View>
    </>
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
    top: s(10),
    right: 0,
    width: s(179),
    height: s(177),
    opacity: 0.5,
    paddingVertical: ms(16),
  },
  info: {
    flexDirection: 'row',
    paddingHorizontal: ms(16),
    gap: ms(8),
    paddingBottom: ms(24),
  },
});
