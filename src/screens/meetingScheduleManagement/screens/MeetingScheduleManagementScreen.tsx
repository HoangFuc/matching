import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { IMeetingScheduleManagement } from '@/src/interface/meetingScheduleManagement.interface';
import { RootStackParamList } from '@/src/interface/tab.interface';
import { padZero } from '@/src/utils/calendar.helper';
import { MemoDateRangePickerModal } from '../components/DateRangePickerModal';
import { MemoMeetingScheduleCard } from '../components/MeetingScheduleCard';

type TNav = NativeStackNavigationProp<RootStackParamList>;

type TTab = '전체' | '나의 일정';

const MOCK_DATA: IMeetingScheduleManagement[] = [
  {
    id: '1',
    customerName: '김민수',
    phone: '010-9876-5432',
    status: '미완료',
    salesPerson: '한지민',
    date: '2025.12.19',
    time: '11:00',
    visitLocation: '인천광역시 연수구 해돋이로 456',
    scheduleName: '고객 미팅',
    memo: '분양 1차 설명 및 계약 조건 안내\n고객 요청 사항 정리',
  },
  {
    id: '2',
    customerName: '김민수',
    phone: '010-9876-5432',
    status: '작성완료',
    salesPerson: '신예린',
    date: '2025.12.20',
    time: '14:00',
    visitLocation: '서울시 강남구 테헤란로 123',
    scheduleName: '분양 상담',
    memo: '2차 상담 진행',
  },
  {
    id: '3',
    customerName: '김민수',
    phone: '010-9876-5432',
    status: '미완료',
    salesPerson: '한지민',
    date: '2025.12.21',
    time: '10:00',
    visitLocation: '경기도 성남시 분당구 판교로 456',
    scheduleName: '현장 방문',
    memo: '현장 확인 및 고객 동행',
  },
  {
    id: '4',
    customerName: '김민수',
    phone: '010-9876-5432',
    status: '작성완료',
    salesPerson: '박지훈',
    date: '2025.12.22',
    time: '16:00',
    visitLocation: '인천광역시 서구 청라대로 789',
    scheduleName: '계약 미팅',
    memo: '최종 계약 조건 협의',
  },
];

const MeetingScheduleManagementScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();
  const now = new Date();
  const [activeTab, setActiveTab] = React.useState<TTab>('나의 일정');
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [startDate, setStartDate] = React.useState(
    `${now.getFullYear()}-${padZero(now.getMonth() + 1)}-${padZero(
      now.getDate(),
    )}`,
  );
  const [endDate, setEndDate] = React.useState(
    `${now.getFullYear()}-${padZero(now.getMonth() + 1)}-${padZero(
      now.getDate() + 6,
    )}`,
  );

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
  const handlePressItem = React.useCallback(
    (item: IMeetingScheduleManagement) => {
      navigation.navigate('MeetingScheduleDetail', { item });
    },
    [navigation],
  );

  //---------------------------------------
  const handlePressCalendar = React.useCallback(() => {
    navigation.navigate('MainTabs', {
      screen: 'Schedule',
      params: {
        screen: 'ScheduleMain',
        params: { filterTypes: ['고객 미팅'] },
      },
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
    (item: IMeetingScheduleManagement) => item.id,
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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
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
          <Pressable
            style={[styles.tab, activeTab === '전체' && styles.tabActive]}
            onPress={() => setActiveTab('전체')}
          >
            <AppText
              variant={activeTab === '전체' ? 'body5' : 'body7'}
              color={activeTab === '전체' ? AppColors.purple : AppColors.gray60}
            >
              전체
            </AppText>
          </Pressable>

          <Pressable
            style={[styles.tab, activeTab === '나의 일정' && styles.tabActive]}
            onPress={() => setActiveTab('나의 일정')}
          >
            <AppText
              variant={activeTab === '나의 일정' ? 'body5' : 'body7'}
              color={
                activeTab === '나의 일정' ? AppColors.purple : AppColors.gray60
              }
            >
              나의 일정
            </AppText>
          </Pressable>
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
          data={MOCK_DATA}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </MemoScreenBody>

      <MemoDateRangePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onConfirm={handleDateConfirm}
        initialStartDate={startDate}
        initialEndDate={endDate}
      />
    </SafeAreaView>
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
});
