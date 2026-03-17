import React, { useCallback, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { AppImages } from '@/src/constants/images';
import {
  RootStackParamList,
  RootTabParamList,
} from '@/src/interface/tab.interface';

type TNav = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList>,
  BottomTabNavigationProp<RootTabParamList>
>;
import { useGetSchedulesQuery } from '@/src/store/api';
import { convertSchedulesToEvents } from '@/src/utils/schedule.helper';
import { showGlobalToast } from '@/src/utils/toastDispatcher';
import { MemoUnderDevelopmentModal } from '@/src/component/UnderDevelopmentModal';
import { MemoTemplateMeetingCard } from '../meetingSchedule/TemplateMeetingCard';

const MeetingSchedule: React.FC = () => {
  const navigation = useNavigation<TNav>();

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
    navigation.navigate('MeetingScheduleManagement');
  }, [navigation]);

  //---------------------------------------
  const [showDevModal, setShowDevModal] = useState(false);

  //---------------------------------------
  const handlePressGeneral = useCallback(() => {
    setShowDevModal(true);
  }, []);

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

      <MemoUnderDevelopmentModal
        visible={showDevModal}
        onClose={() => setShowDevModal(false)}
      />
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
