import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { AppColors } from '@/src/constants/colors';
import type { RootStackParamList } from '@/src/interface/tab.interface';
import { MemoEventCardContent } from '../component/EventCardContent';
import { MemoScheduleCalendar } from '../component/ScheduleCalendar';
import { MemoScheduleFilterModal } from '../component/ScheduleFilterModal';
import { MemoScheduleHeader } from '../component/ScheduleHeader';
import { TScheduleType } from '../component/ScheduleTypePicker';

type ScheduleCalendarViewRoute = RouteProp<RootStackParamList, 'ScheduleCalendarView'>;

const ScheduleCalendarView: React.FC = () => {
  const route = useRoute<ScheduleCalendarViewRoute>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const filterTypes = route.params?.filterTypes;

  //---------------------------------------
  const [filterVisible, setFilterVisible] = React.useState(false);
  const [selectedFilterTypes, setSelectedFilterTypes] = React.useState<
    TScheduleType[]
  >([]);

  //---------------------------------------
  const [detailDateKey, setDetailDateKey] = React.useState<string>();

  //---------------------------------------
  const handlePressBack = React.useCallback(() => {
    if (detailDateKey) {
      setDetailDateKey(undefined);
    } else {
      navigation.goBack();
    }
  }, [navigation, detailDateKey]);

  //---------------------------------------
  const handleOpenFilter = React.useCallback(() => {
    setFilterVisible(true);
  }, []);

  //---------------------------------------
  const handleCloseFilter = React.useCallback(() => {
    setFilterVisible(false);
  }, []);

  //---------------------------------------
  const handleDayPress = React.useCallback((dateKey: string) => {
    setDetailDateKey(dateKey);
  }, []);

  //---------------------------------------
  const handleDetailBack = React.useCallback(() => {
    setDetailDateKey(undefined);
  }, []);

  //---------------------------------------
  React.useEffect(() => {
    if (filterTypes) {
      setSelectedFilterTypes(filterTypes);
    }
  }, [filterTypes]);

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <MemoScheduleHeader
        onPressFilter={handleOpenFilter}
        onPressBack={handlePressBack}
        detailDateKey={detailDateKey}
        isFilterActive={selectedFilterTypes.length > 0}
      />

      {detailDateKey ? (
        <MemoEventCardContent
          handlePressBack={handleDetailBack}
          dateKey={detailDateKey}
        />
      ) : (
        <View style={styles.content}>
          <MemoScheduleCalendar
            mode="schedule"
            selectedFilterTypes={selectedFilterTypes}
            onDayPress={handleDayPress}
            showTitle
          />
        </View>
      )}

      <MemoScheduleFilterModal
        visible={filterVisible}
        selectedTypes={selectedFilterTypes}
        onApply={setSelectedFilterTypes}
        onClose={handleCloseFilter}
      />
    </AppSafeAreaView>
  );
};

export const MemoScheduleCalendarView = React.memo(ScheduleCalendarView);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
  content: {
    flex: 1,
  },
});
