import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import dayjs from 'dayjs';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import { Add, ArrowDown2, Calendar } from '@/src/constants/icons';
import { TMeetingMinutes } from '@/src/interface/meetingMinutes.interface';
import { MeetingMinutesStackParamList } from '@/src/interface/tab.interface';
import { MemoDateRangePickerModal } from '@/src/screens/meetingScheduleManagement/components/DateRangePickerModal';
import { useGetMeetingLogsQuery } from '@/src/store/api/meetingLog.api';
import { MemoMeetingCard } from '../components/MeetingCard';

type TNav = NativeStackNavigationProp<MeetingMinutesStackParamList>;

const LIMIT = 20;

const MeetingMinutesScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();
  const [page, setPage] = React.useState(1);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [startDate, setStartDate] = React.useState(
    dayjs().format('YYYY-MM-DD'),
  );
  const [endDate, setEndDate] = React.useState(
    dayjs().add(6, 'day').format('YYYY-MM-DD'),
  );

  //---------------------------------------
  const { data, isLoading, isFetching, refetch } = useGetMeetingLogsQuery({
    page,
    limit: LIMIT,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    startDate,
    endDate,
  });

  //---------------------------------------
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const meetingLogs = data?.data ?? [];
  const hasMore = page < (data?.meta?.totalPages ?? 0);
  console.log('[MeetingLogs meta]', data?.meta);
  console.log('[MeetingLogs first item]', JSON.stringify(data?.data?.[0], null, 2));

  //---------------------------------------
  const formatDisplayDate = React.useCallback((dateStr: string) => {
    return dateStr.replace(/-/g, '.');
  }, []);

  //---------------------------------------
  const handleDateConfirm = React.useCallback((start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  //---------------------------------------
  const handleLoadMore = React.useCallback(() => {
    console.log('[LoadMore]', { hasMore, isFetching, isLoading, page });
    if (hasMore && !isFetching && !isLoading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isFetching, isLoading, page]);

  //---------------------------------------
  const renderItem = React.useCallback(
    ({ item }: { item: TMeetingMinutes }) => (
      <MemoMeetingCard
        item={item}
        hasRecording={item.hasRecording}
        onPress={() => navigation.navigate('MeetingMinutesDetail', { id: item.id })}
      />
    ),
    [navigation],
  );

  //---------------------------------------
  const keyExtractor = React.useCallback(
    (item: TMeetingMinutes) => item.id,
    [],
  );

  //---------------------------------------
  const renderFooter = React.useCallback(() => {
    if (!isFetching || isLoading) return null;
    return (
      <ActivityIndicator style={styles.footerLoader} color={AppColors.purple} />
    );
  }, [isFetching, isLoading]);

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <MemoScreenHeader
        title="미팅록"
        rightElement={
          <Pressable
            hitSlop={8}
            onPress={() => navigation.navigate('CreateMeetingMinutes')}
          >
            <Add size={`${ms(24)}`} color={AppColors.white} variant="Linear" />
          </Pressable>
        }
      />

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
        {isLoading ? (
          <ActivityIndicator
            style={styles.centerLoader}
            color={AppColors.purple}
          />
        ) : (
          <FlatList
            data={meetingLogs}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            onRefresh={refetch}
            refreshing={isLoading}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
          />
        )}
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

export const MemoMeetingMinutesScreen = React.memo(MeetingMinutesScreen);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
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
  list: {
    padding: ms(16),
    gap: ms(12),
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLoader: {
    paddingVertical: ms(16),
  },
});
