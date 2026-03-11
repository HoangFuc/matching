import React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppColors } from '@/src/constants/colors';
import { TScheduleEvent } from '@/src/interface/schedule.interface';
import { ScheduleNavigationProp } from '@/src/interface/tab.interface';
import { MemoEventCardContent } from '../component/EventCardContent';
import { MemoScheduleCalendar } from '../component/ScheduleCalendar';
import { MemoScheduleFilterModal } from '../component/ScheduleFilterModal';
import { MemoScheduleHeader } from '../component/ScheduleHeader';
import { TScheduleType } from '../component/ScheduleTypePicker';
import { TDetailData, TScheduleRoute } from '../type';

const Schedule: React.FC = () => {
  const route = useRoute<TScheduleRoute>();
  const navigation = useNavigation<ScheduleNavigationProp>();
  const mode = route.params?.mode ?? 'schedule';

  const filterTypes = route.params?.filterTypes;

  //---------------------------------------
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        navigation.setParams({ mode: undefined, filterTypes: undefined });
      };
    }, [navigation]),
  );

  //---------------------------------------
  const [filterVisible, setFilterVisible] = React.useState(false);
  const [selectedFilterTypes, setSelectedFilterTypes] = React.useState<
    TScheduleType[]
  >([]);

  //---------------------------------------
  const [detailData, setDetailData] = React.useState<TDetailData>();

  //---------------------------------------
  const handleOpenFilter = React.useCallback(() => {
    setFilterVisible(true);
  }, []);

  //---------------------------------------
  const handleCloseFilter = React.useCallback(() => {
    setFilterVisible(false);
  }, []);

  //---------------------------------------
  const handleDayPress = React.useCallback(
    (dateKey: string, events: TScheduleEvent[]) => {
      setDetailData({ dateKey, events });
    },
    [],
  );

  //---------------------------------------
  const handlePressBack = React.useCallback(() => {
    setDetailData(undefined);
  }, []);

  //---------------------------------------
  React.useEffect(() => {
    if (filterTypes && filterTypes.length > 0) {
      setSelectedFilterTypes(filterTypes);
    }
  }, [filterTypes]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MemoScheduleHeader
        onPressFilter={handleOpenFilter}
        mode={mode}
        detailData={detailData}
      />

      {detailData ? (
        <MemoEventCardContent
          handlePressBack={handlePressBack}
          dateKey={detailData.dateKey}
          events={detailData.events}
        />
      ) : (
        <View style={styles.content}>
          <MemoScheduleCalendar
            mode={mode}
            selectedFilterTypes={selectedFilterTypes}
            onDayPress={handleDayPress}
          />
        </View>
      )}

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
