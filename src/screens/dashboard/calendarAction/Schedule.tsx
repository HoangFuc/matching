import React from 'react';
import { Image, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { AppColors } from '@/src/constants/colors';
import { RootTabNavigationProp } from '@/src/interface/tab.interface';

const Schedule: React.FC = () => {
  const navigation = useNavigation<RootTabNavigationProp>();

  return (
    <MemoBaseCard
      onPress={() => navigation.navigate('Schedule')}
      style={styles.card}
    >
      <AppText variant="body5" color={AppColors.gray90}>
        {'오늘의 루틴을 확인해볼까요?'}
      </AppText>

      <Image
        style={styles.image}
        source={require('@/src/assets/images/schedule.png')}
      />
    </MemoBaseCard>
  );
};

export const MemoSchedule = React.memo(Schedule);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 167.5 / 120,
    paddingBottom: ms(64),
  },
  image: {
    position: 'absolute',
    bottom: ms(3),
    right: ms(6.5),
    width: ms(70),
    height: ms(70),
  },
});
