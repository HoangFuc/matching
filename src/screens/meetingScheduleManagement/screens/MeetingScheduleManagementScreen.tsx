import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import {
  Add,
  ArrowDown2,
  Calendar,
  SearchNormal1,
  Sort,
} from '@/src/constants/icons';
import {
  MEETING_SCHEDULE_SCOPE_LABEL,
  MEETING_SCHEDULE_TABS,
  MeetingScheduleScopeEnum,
} from '@/src/constants/meetingSchedule';
import { IMeetingScheduleManagement } from '@/src/interface/meetingScheduleManagement.interface';
import { RootStackParamList } from '@/src/interface/tab.interface';
import { useGetMeetingSchedulesQuery } from '@/src/store/api/meetingScheduleManagement.api';
import { MemoDateRangePickerModal } from '../components/DateRangePickerModal';
import { MemoMeetingScheduleCard } from '../components/MeetingScheduleCard';

type TNav = NativeStackNavigationProp<RootStackParamList>;

const LIMIT = 20;

const MeetingScheduleManagementScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();
  const insets = useSafeAreaInsets();
  const [page, setPage] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState<MeetingScheduleScopeEnum>(
    MeetingScheduleScopeEnum.COMPANY,
  );
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [startDate, setStartDate] = React.useState(
    dayjs().format('YYYY-MM-DD'),
  );
  const [endDate, setEndDate] = React.useState(
    dayjs().add(6, 'day').format('YYYY-MM-DD'),
  );

  const { data, isLoading, isFetching, refetch } = useGetMeetingSchedulesQuery({
    page,
    limit: LIMIT,
    startDate,
    endDate,
    scope: activeTab,
  });

  //---------------------------------------
  const meetingSchedules = data?.data ?? [];
  const hasMore = page < (data?.meta?.totalPages ?? 0);

  //---------------------------------------
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  //---------------------------------------
  const formatDisplayDate = React.useCallback((dateStr: string) => {
    return dateStr.replace(/-/g, '.');
  }, []);

  //---------------------------------------
  const handleDateConfirm = React.useCallback((start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setPage(1);
  }, []);

  //---------------------------------------
  const handleRefresh = React.useCallback(() => {
    setPage(1);
    refetch();
  }, [refetch]);

  //---------------------------------------
  const handleLoadMore = React.useCallback(() => {
    if (hasMore && !isFetching && !isLoading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isFetching, isLoading]);

  //---------------------------------------
  const renderFooter = React.useCallback(() => {
    if (!isFetching || isLoading) return null;
    return (
      <ActivityIndicator style={styles.footerLoader} color={AppColors.purple} />
    );
  }, [isFetching, isLoading]);

  //---------------------------------------
  const handlePressItem = React.useCallback(
    (item: IMeetingScheduleManagement) => {
      navigation.navigate('MeetingScheduleDetail', { item });
    },
    [navigation],
  );

  //---------------------------------------
  const handlePressCalendar = React.useCallback(() => {
    navigation.navigate('ScheduleCalendarView', {
      filterTypes: ['고객 미팅'],
    });
  }, [navigation]);

  //---------------------------------------
  const handlePressCreate = React.useCallback(() => {
    navigation.navigate('CreateMeetingSchedule');
  }, [navigation]);

  //---------------------------------------
  const renderItem = React.useCallback(
    ({ item }: { item: IMeetingScheduleManagement }) => (
      <MemoMeetingScheduleCard
        item={item}
        onPress={() => handlePressItem(item)}
      />
    ),
    [handlePressItem],
  );

  //---------------------------------------
  const keyExtractor = React.useCallback(
    (item: IMeetingScheduleManagement) => item.id.toString(),
    [],
  );

  //---------------------------------------
  const headerRight = React.useMemo(
    () => (
      <View style={styles.headerRight}>
        <Pressable hitSlop={8}>
          <Sort size={`${ms(24)}`} color={AppColors.white} variant="Linear" />
        </Pressable>

        <Pressable hitSlop={8}>
          <SearchNormal1
            size={`${ms(24)}`}
            color={AppColors.white}
            variant="Linear"
          />
        </Pressable>
      </View>
    ),
    [],
  );

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <MemoScreenHeader title="방문 예약" rightElement={headerRight} />

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <Pressable style={styles.filterChip}>
          <AppText variant="body8" color={AppColors.gray90}>
            오늘
          </AppText>

          <ArrowDown2
            size={`${ms(14)}`}
            color={AppColors.gray90}
            variant="Linear"
          />
        </Pressable>

        <Pressable
          style={styles.dateRangeChip}
          onPress={() => setShowDatePicker(true)}
        >
          <AppText variant="body8" color={AppColors.gray90}>
            {formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
          </AppText>

          <Calendar
            size={`${ms(14)}`}
            color={AppColors.gray90}
            variant="Linear"
          />
        </Pressable>
      </View>

      <MemoScreenBody>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          {MEETING_SCHEDULE_TABS.map(tab => (
            <Pressable
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => {
                setActiveTab(tab);
                setPage(1);
              }}
            >
              <AppText
                variant={activeTab === tab ? 'body5' : 'body7'}
                color={activeTab === tab ? AppColors.purple : AppColors.gray60}
              >
                {MEETING_SCHEDULE_SCOPE_LABEL[tab]}
              </AppText>
            </Pressable>
          ))}
        </View>

        {/* Calendar Link */}
        <View style={styles.calendarLinkRow}>
          <Pressable style={styles.calendarLink} onPress={handlePressCalendar}>
            <AppText variant="body6" color={AppColors.gray90}>
              캘린더로 확인 {'>'}
            </AppText>
          </Pressable>

          <Pressable
            hitSlop={8}
            onPress={handlePressCreate}
            style={{
              backgroundColor: AppColors.gray20,
              padding: ms(4),
              borderRadius: ms(8),
            }}
          >
            <Add size={`${ms(20)}`} color={AppColors.gray90} variant="Linear" />
          </Pressable>
        </View>

        {/* List */}
        <FlatList
          data={meetingSchedules}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + ms(16) },
          ]}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          onRefresh={handleRefresh}
          refreshing={isFetching && page === 1}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      </MemoScreenBody>

      <MemoDateRangePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onConfirm={handleDateConfirm}
        initialStartDate={startDate}
        initialEndDate={endDate}
      />
    </AppSafeAreaView>
  );
};

export const MemoMeetingScheduleManagementScreen = React.memo(
  MeetingScheduleManagementScreen,
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(12),
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    paddingHorizontal: ms(16),
    paddingBottom: ms(16),
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    borderRadius: ms(8),
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
    backgroundColor: AppColors.white,
  },
  dateRangeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: ms(8),
    borderRadius: ms(8),
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
    backgroundColor: AppColors.white,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: ms(16),
    marginTop: ms(16),
    marginBottom: ms(12),
    gap: ms(10),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(6),
    paddingHorizontal: ms(12),
    gap: ms(4),
    borderRadius: ms(100),
    backgroundColor: AppColors.gray10,
  },
  tabActive: {
    backgroundColor: AppColors.lavendar,
  },
  calendarLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingTop: ms(12),
    paddingBottom: ms(4),
  },
  calendarLink: {},
  list: {
    padding: ms(16),
    gap: ms(12),
  },
  footerLoader: {
    paddingVertical: ms(16),
  },
});
