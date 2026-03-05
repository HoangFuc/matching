import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { AppColors } from '@/src/constants/colors';
import { MemoScheduleCalendar } from './ScheduleCalendar';
import { MemoScheduleHeader } from './ScheduleHeader';

const Schedule: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MemoScheduleHeader />

      <View style={styles.content}>
        <MemoScheduleCalendar />
      </View>
    </SafeAreaView>
  );
};

export const MemoScheduleMain = React.memo(Schedule);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
  content: {
    flex: 1,
  },
});
