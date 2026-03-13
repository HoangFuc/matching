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
import { ScheduleNavigationProp } from '@/src/interface/tab.interface';
import { MemoEventCardContent } from '../component/EventCardContent';
import { MemoScheduleCalendar } from '../component/ScheduleCalendar';
import { MemoScheduleFilterModal } from '../component/ScheduleFilterModal';
import { MemoScheduleHeader } from '../component/ScheduleHeader';
import { TScheduleType } from '../component/ScheduleTypePicker';
import { TScheduleRoute } from '../type';

const Schedule: React.FC = () => {
  const route = useRoute<TScheduleRoute>();
  const navigation = useNavigation<ScheduleNavigationProp>();
  const mode = route.params?.mode ?? 'schedule';
  const hideTabBar = route.params?.hideTabBar;

  const filterTypes = route.params?.filterTypes;

  //---------------------------------------
  const [filterVisible, setFilterVisible] = React.useState(false);
  const [selectedFilterTypes, setSelectedFilterTypes] = React.useState<
    TScheduleType[]
  >([]);

  //---------------------------------------
  const [detailDateKey, setDetailDateKey] = React.useState<string>();

  //---------------------------------------
  useFocusEffect(
    React.useCallback(() => {
      // Reset local state on focus
      setFilterVisible(false);
      setSelectedFilterTypes([]);
      setDetailDateKey(undefined);

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
  const handleOpenFilter = React.useCallback(() => {
    setFilterVisible(true);
  }, []);

  //---------------------------------------
  const handleCloseFilter = React.useCallback(() => {
    setFilterVisible(false);
  }, []);

  //---------------------------------------
  const handleDayPress = React.useCallback(
    (dateKey: string) => {
      setDetailDateKey(dateKey);
    },
    [],
  );

  //---------------------------------------
  const handlePressBack = React.useCallback(() => {
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
        mode={mode}
        detailDateKey={detailDateKey}
        isFilterActive={selectedFilterTypes.length > 0}
      />

      {detailDateKey ? (
        <MemoEventCardContent
          handlePressBack={handlePressBack}
          dateKey={detailDateKey}
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
