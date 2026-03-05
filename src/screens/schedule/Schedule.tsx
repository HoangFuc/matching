import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { AppColors } from '@/src/constants/colors';
import { MemoScheduleCalendar } from './ScheduleCalendar';
import { MemoScheduleHeader } from './ScheduleHeader';
import { MemoScheduleFilterModal } from './calendar/ScheduleFilterModal';
import { TScheduleType } from './calendar/ScheduleTypePicker';

const Schedule: React.FC = () => {
  const [filterVisible, setFilterVisible] = React.useState(false);
  const [selectedFilterTypes, setSelectedFilterTypes] = React.useState<
    TScheduleType[]
  >([]);

  const handleOpenFilter = React.useCallback(() => {
    setFilterVisible(true);
  }, []);

  const handleCloseFilter = React.useCallback(() => {
    setFilterVisible(false);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MemoScheduleHeader onPressFilter={handleOpenFilter} />

      <View style={styles.content}>
        <MemoScheduleCalendar />
      </View>

      <MemoScheduleFilterModal
        visible={filterVisible}
        selectedTypes={selectedFilterTypes}
        onApply={setSelectedFilterTypes}
        onClose={handleCloseFilter}
      />
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
