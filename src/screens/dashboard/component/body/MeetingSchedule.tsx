import React, { useCallback } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { AppImages } from '@/src/constants/images';
import { RootTabNavigationProp } from '@/src/interface/tab.interface';
import { useGetSchedulesQuery } from '@/src/store/api';
import { convertSchedulesToEvents } from '@/src/utils/schedule.helper';
import { showGlobalToast } from '@/src/utils/toastDispatcher';
import { MemoTemplateMeetingCard } from '../meetingSchedule/TemplateMeetingCard';

const MeetingSchedule: React.FC = () => {
  const navigation = useNavigation<RootTabNavigationProp>();

  //---------------------------------------
  const today = dayjs().format('YYYY-MM-DD');
  const { data: schedules = [] } = useGetSchedulesQuery({
    startDate: today,
    endDate: today,
  });

  //---------------------------------------
  const todayEvents = React.useMemo(() => {
    const events = convertSchedulesToEvents(schedules);
    return events[today] ?? [];
  }, [schedules, today]);

  //---------------------------------------
  const handlePressMeeting = useCallback(() => {
    navigation.navigate('Schedule', {
      screen: 'ScheduleMain',
      params: { filterTypes: ['고객 미팅'] },
    });

    if (todayEvents.length === 0) {
      requestAnimationFrame(() => {
        showGlobalToast({ type: 'info', message: '현재 등록된 일정이 없습니다.' });
      });
    }
  }, [navigation, todayEvents]);

  //---------------------------------------
  const handlePressGeneral = useCallback(() => {
    navigation.navigate('Schedule', {
      screen: 'ScheduleMain',
      params: { filterTypes: ['일반일정'] },
    });

    if (todayEvents.length === 0) {
      requestAnimationFrame(() => {
        showGlobalToast({ type: 'info', message: '현재 등록된 일정이 없습니다.' });
      });
    }
  }, [navigation, todayEvents]);

  return (
    <View style={styles.container}>
      <AppText variant="body1" color={AppColors.gray90}>
        오늘의 일정은?
      </AppText>

      <View style={styles.row}>
        <MemoTemplateMeetingCard
          text="OO고객과의 미팅"
          onPress={handlePressMeeting}
          image={
            <Image source={AppImages.chatBubble} style={styles.cardImage} />
          }
        />

        <MemoTemplateMeetingCard
          text="OO 분양 1차 회의"
          onPress={handlePressGeneral}
          image={<Image source={AppImages.list} style={styles.cardImage} />}
        />
      </View>
    </View>
  );
};

export const MemoMeetingSchedule = React.memo(MeetingSchedule);

const styles = StyleSheet.create({
  container: {
    gap: ms(12),
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  cardImage: {
    width: ms(60),
    height: ms(60),
  },
});
