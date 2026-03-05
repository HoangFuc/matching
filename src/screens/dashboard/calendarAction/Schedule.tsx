import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import {
  moderateScale as ms,
  scale as s,
} from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
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
    borderRadius: ms(14),
    padding: ms(16),
    paddingBottom: ms(64),
    width: s(167.5),
    height: s(120),
    borderWidth: 1,
    borderColor: AppColors.gray30,
  },
  image: {
    position: 'absolute',
    bottom: s(3),
    right: s(6.5),
    width: s(70),
    height: s(70),
  },
});
