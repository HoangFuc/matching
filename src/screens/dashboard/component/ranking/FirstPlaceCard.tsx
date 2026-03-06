import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Cup } from '@/src/constants/icons';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { AppImages } from '@/src/constants/images';
import { moderateScale as ms } from 'react-native-size-matters/extend';

const FirstPlaceCard: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={AppImages.firstPlace}
          resizeMode="contain"
          style={styles.badge}
        />

        <View style={styles.rankRow}>
          <AppText variant="body1" color={AppColors.white}>
            1등
          </AppText>

          <Cup size={`${ms(16)}`} color={AppColors.white} />
        </View>
      </View>

      <View style={styles.info}>
        <AppText variant="heading1" color={AppColors.white}>
          하얀신사
        </AppText>

        <AppText variant="heading3" color={AppColors.white}>
          150,233,000
        </AppText>
      </View>
    </View>
  );
};

export const MemoFirstPlaceCard = React.memo(FirstPlaceCard);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: ms(14),
    justifyContent: 'space-between',
    backgroundColor: AppColors.purple,
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: ms(16),
  },
  badge: {
    width: ms(34),
    aspectRatio: 34 / 50,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(2),
  },
  info: {
    gap: 4,
  },
});
