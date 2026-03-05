import React from 'react';
import { StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppColors } from '@/src/constants/colors';
import { MemoScheduleHeader } from './ScheduleHeader';
import { MemoEventCardContent } from './calendar/EventCardContent';

const ScheduleDetail: React.FC = () => {
  //---------------------------------------
  const navigation = useNavigation();

  //---------------------------------------
  const handlePressBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MemoScheduleHeader />

      <MemoEventCardContent handlePressBack={handlePressBack} />
    </SafeAreaView>
  );
};

export const MemoScheduleDetail = React.memo(ScheduleDetail);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
});
