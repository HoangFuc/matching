import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Cup } from 'iconsax-react-nativejs';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { moderateScale as ms } from 'react-native-size-matters/extend';

const RunnerUpCard: React.FC<{ rank: number; name: string; score: string }> = ({
  rank,
  name,
  score,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.nameRow}>
        <AppText variant="body1" color={AppColors.gray100}>
          {name}
        </AppText>

        <View style={styles.rankInfo}>
          <AppText variant="body6" color={AppColors.gray100}>
            {rank}등
          </AppText>

          <Cup size={`${ms(16)}`} color={AppColors.gray100} />
        </View>
      </View>

      <AppText variant="body6" color={AppColors.purple}>
        {score}
      </AppText>
    </View>
  );
};

export const MemoRunnerUpCard = React.memo(RunnerUpCard);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: ms(14),
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
    backgroundColor: AppColors.lavendar,
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(7),
    paddingVertical: ms(2),
  },
});
