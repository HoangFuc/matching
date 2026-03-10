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
import { Add, ArrowDown2, Calendar } from '@/src/constants/icons';
import { TMeetingMinutes } from '@/src/interface/meetingMinutes.interface';
import { MeetingMinutesStackParamList } from '@/src/interface/tab.interface';
import { MemoMeetingCard } from '../components/MeetingCard';

const MOCK_DATA: TMeetingMinutes[] = [
  {
    id: '1',
    type: '오프라인',
    isRecorded: true,
    title: '청라 3차 하이배크디움',
    customerName: '박세준 고객',
    date: '2026.02.02',
    visitLocation: '인천광역시 연수구 해돌이로 456',
    phone: '010-9876-5432',
    content: '검단 4차 힐스테이트',
    recordingFile: {
      name: 'Meeting record.wav',
      size: '1.2MB',
      duration: '10:23',
    },
  },
  {
    id: '2',
    type: '유선',
    isRecorded: true,
    title: '영종 스카이시티 자이',
    customerName: '최수정 고객',
    date: '2026.02.03',
    visitLocation: '',
    phone: '010-1234-5678',
    content: '영종 스카이시티 자이 상담',
    recordingFile: {
      name: 'Meeting record2.wav',
      size: '2.1MB',
      duration: '15:30',
    },
  },
  {
    id: '3',
    type: '오프라인',
    isRecorded: false,
    title: '가정 푸르지티 SK리더스뷰',
    customerName: '정민혁 고객',
    date: '2026.02.04',
    visitLocation: '서울시 강남구 테헤란로 123',
    phone: '010-5555-6666',
    content: '가정 푸르지티 SK리더스뷰 상담',
  },
  {
    id: '4',
    type: '유선',
    isRecorded: false,
    title: '송도 센트럴파크 푸르치오',
    customerName: '김민지 고객',
    date: '2026.02.05',
    visitLocation: '',
    phone: '010-7777-8888',
    content: '송도 센트럴파크 푸르치오 상담',
  },
  {
    id: '5',
    type: '유선',
    isRecorded: false,
    title: '주안 더샵 아르테',
    customerName: '강애린 고객',
    date: '2026.02.06',
    visitLocation: '',
    phone: '010-3333-4444',
    content: '주안 더샵 아르테 상담',
  },
];

type TNav = NativeStackNavigationProp<MeetingMinutesStackParamList>;

const MeetingMinutesScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();

  //---------------------------------------
  const renderItem = React.useCallback(
    ({ item }: { item: TMeetingMinutes }) => (
      <MemoMeetingCard
        item={item}
        onPress={() => navigation.navigate('MeetingMinutesDetail', { item })}
      />
    ),
    [navigation],
  );

  //---------------------------------------
  const keyExtractor = React.useCallback(
    (item: TMeetingMinutes) => item.id,
    [],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
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

        <Pressable style={styles.dateRangeChip}>
          <AppText variant="body8" color={AppColors.gray90}>
            2026.02.02 - 2026.02.08
          </AppText>

          <Calendar
            size={`${ms(14)}`}
            color={AppColors.gray90}
            variant="Linear"
          />
        </Pressable>
      </View>

      <MemoScreenBody>
        <FlatList
          data={MOCK_DATA}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </MemoScreenBody>
    </SafeAreaView>
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
});
