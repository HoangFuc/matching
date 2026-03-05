import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';

import {
  moderateScale as ms,
  scale as s,
} from 'react-native-size-matters/extend';

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
    width: s(167.5),
    paddingBottom: ms(64),
    height: s(120),
    borderWidth: 1,
    borderColor: AppColors.gray30,
    backgroundColor: AppColors.white,
    ...CardShadow,
  },
  image: {
    position: 'absolute',
    bottom: s(6),
    right: s(7),
    width: s(74),
    height: s(54),
  },
});
