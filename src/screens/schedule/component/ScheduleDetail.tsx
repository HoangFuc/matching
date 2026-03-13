import React from 'react';
import { StyleSheet } from 'react-native';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';

import { AppColors } from '@/src/constants/colors';
import { MemoEventCardContent } from './EventCardContent';
import { MemoScheduleHeader } from './ScheduleHeader';

type ScheduleDetailParams = {
  ScheduleDetail: {
    dateKey: string;
  };
};

const ScheduleDetail: React.FC = () => {
  //---------------------------------------
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ScheduleDetailParams, 'ScheduleDetail'>>();
  const { dateKey } = route.params;

  //---------------------------------------
  const handlePressBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <MemoScheduleHeader onPressFilter={() => {}} mode="detail" />

      <MemoEventCardContent handlePressBack={handlePressBack} dateKey={dateKey} />
    </AppSafeAreaView>
  );
};

export const MemoScheduleDetail = React.memo(ScheduleDetail);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
});
