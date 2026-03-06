import React from 'react';
import { StyleSheet } from 'react-native';

import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { AppColors } from '@/src/constants/colors';
import { moderateScale as ms } from 'react-native-size-matters/extend';

const BodyDraft: React.FC = () => {
  return (
    <MemoBaseCard style={styles.container}>
      <AppText variant="body6" color={AppColors.gray90}>
        비품 신청합니다
      </AppText>

      <AppText variant="detail" color={AppColors.gray90}>
        2025.10.15 11:13
      </AppText>
    </MemoBaseCard>
  );
};

export const MemoBodyDraft = React.memo(BodyDraft);

const styles = StyleSheet.create({
  container: {
    borderRadius: ms(14),
    gap: ms(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
