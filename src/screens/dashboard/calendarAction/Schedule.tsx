import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { CardShadow } from '@/src/constants/shadows';
import { RootTabNavigationProp } from '@/src/interface/tab.interface';

const Schedule: React.FC = () => {
  const navigation = useNavigation<RootTabNavigationProp>();

  return (
    <Pressable
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
    </Pressable>
  );
};

export const MemoSchedule = React.memo(Schedule);

const styles = StyleSheet.create({
  card: {
    padding: ms(16),
    paddingBottom: ms(64),
    flex: 1,
    aspectRatio: 167.5 / 120,
    borderWidth: 1,
    borderColor: AppColors.gray30,
    backgroundColor: AppColors.white,
    borderRadius: ms(16),
    ...CardShadow,
  },
  image: {
    position: 'absolute',
    bottom: ms(3),
    right: ms(6.5),
    width: ms(70),
    height: ms(70),
  },
});
