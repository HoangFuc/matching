import React from 'react';
import { StyleSheet, View } from 'react-native';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';

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
  const hideTabBar = route.params?.hideTabBar;

  const filterTypes = route.params?.filterTypes;

  //---------------------------------------
  useFocusEffect(
    React.useCallback(() => {
      if (hideTabBar) {
        navigation.getParent()?.setOptions({
          tabBarStyle: {
            ...styles.tabBar,
            opacity: 0,
          },
        });
      }

      return () => {
        navigation.getParent()?.setOptions({
          tabBarStyle: { ...styles.tabBar, opacity: 1 },
        });
        navigation.setParams({
          mode: undefined,
          filterTypes: undefined,
          hideTabBar: undefined,
        });
      };
    }, [navigation, hideTabBar]),
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
    if (filterTypes) {
      setSelectedFilterTypes(filterTypes);
    }
  }, [filterTypes]);

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <MemoScheduleHeader
        onPressFilter={handleOpenFilter}
        mode={mode}
        detailData={detailData}
        isFilterActive={selectedFilterTypes.length > 0}
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
    </AppSafeAreaView>
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
  tabBar: {
    height: ms(92),
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
  },
});
