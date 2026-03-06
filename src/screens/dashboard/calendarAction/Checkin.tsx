import React from 'react';
import { Image, StyleSheet } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { AppColors } from '@/src/constants/colors';

const Checkin: React.FC = () => {
  return (
    <MemoBaseCard style={styles.card}>
      <AppText variant="body5" color={AppColors.gray90}>
        {'출석체크 (체크 완료시 출석체크 시간 표시)'}
      </AppText>

      <Image
        style={styles.image}
        source={require('@/src/assets/images/task.png')}
      />
    </MemoBaseCard>
  );
};

export const MemoCheckin = React.memo(Checkin);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 167.5 / 120,
  },
  image: {
    position: 'absolute',
    bottom: ms(6),
    right: ms(7),
    width: ms(74),
    height: ms(54),
  },
});
