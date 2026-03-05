import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { CardShadow } from '@/src/constants/shadows';

const Checkin: React.FC = () => {
  return (
    <Pressable style={styles.card}>
      <AppText variant="body5" color={AppColors.gray90}>
        {'출석체크 (체크 완료시 출석체크 시간 표시)'}
      </AppText>

      <Image
        style={styles.image}
        source={require('@/src/assets/images/task.png')}
      />
    </Pressable>
  );
};

export const MemoCheckin = React.memo(Checkin);

const styles = StyleSheet.create({
  card: {
    borderRadius: ms(16),
    padding: ms(16),
    flex: 1,
    aspectRatio: 167.5 / 120,
    borderWidth: 1,
    borderColor: AppColors.gray30,
    backgroundColor: AppColors.white,
    ...CardShadow,
  },
  image: {
    position: 'absolute',
    bottom: ms(6),
    right: ms(7),
    width: ms(74),
    height: ms(54),
  },
});
