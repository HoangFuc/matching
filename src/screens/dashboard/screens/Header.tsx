import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { HamburgerMenu, Notification } from '@/src/constants/icons';
import { moderateScale as ms } from 'react-native-size-matters/extend';
import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { AppImages } from '@/src/constants/images';

const HeaderDashboard: React.FC = () => {
  return (
    <View>
      <Image
        source={AppImages.headerBg}
        style={styles.background}
        resizeMode="cover"
      />

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
            2025년 10월 15일 수요일
          </AppText>

          <AppText variant="heading3" color={AppColors.white}>
            OOO님 안녕하세요
          </AppText>
        </View>
      </View>
    </View>
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
    top: ms(-45),
    right: 0,
    bottom: 0,
    left: ms(20),
  },
  info: {
    flexDirection: 'row',
    paddingHorizontal: ms(16),
    gap: ms(8),
    paddingBottom: ms(24),
  },
});
