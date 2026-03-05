import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { CardShadow } from '@/src/constants/shadows';

const BodyDraft: React.FC = () => {
  return (
    <View style={styles.container}>
      <AppText variant="body6" color={AppColors.gray90}>
        비품 신청합니다
      </AppText>

      <AppText variant="detail" color={AppColors.gray90}>
        2025.10.15 11:13
      </AppText>
    </View>
  );
};

export const MemoBodyDraft = React.memo(BodyDraft);

const styles = StyleSheet.create({
  container: {
    borderRadius: ms(14),
    padding: ms(16),
    gap: ms(16),
    borderWidth: 1,
    borderColor: AppColors.gray30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: AppColors.white,
    ...CardShadow,
  },
});
