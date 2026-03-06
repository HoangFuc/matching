import React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppColors } from '@/src/constants/colors';
import {
  ScheduleNavigationProp,
  ScheduleStackParamList,
} from '@/src/interface/tab.interface';
import { MemoScheduleCalendar } from '../component/ScheduleCalendar';
import { MemoScheduleFilterModal } from '../component/ScheduleFilterModal';
import { MemoScheduleHeader } from '../component/ScheduleHeader';
import { TScheduleType } from '../component/ScheduleTypePicker';

type TScheduleRoute = RouteProp<ScheduleStackParamList, 'ScheduleMain'>;

const Schedule: React.FC = () => {
  const route = useRoute<TScheduleRoute>();
  const navigation = useNavigation<ScheduleNavigationProp>();
  const mode = route.params?.mode ?? 'schedule';

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        navigation.setParams({ mode: undefined });
      };
    }, [navigation]),
  );

  const [filterVisible, setFilterVisible] = React.useState(false);
  const [selectedFilterTypes, setSelectedFilterTypes] = React.useState<
    TScheduleType[]
  >(['계약 일정']);

  const handleOpenFilter = React.useCallback(() => {
    setFilterVisible(true);
  }, []);

  const handleCloseFilter = React.useCallback(() => {
    setFilterVisible(false);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MemoScheduleHeader onPressFilter={handleOpenFilter} mode={mode} />

      <View style={styles.content}>
        <MemoScheduleCalendar mode={mode} />
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
