import React from 'react';
import { StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';
import Toast from 'react-native-toast-message';

import { MemoCheckin } from '../calendarAction/Checkin';
import { MemoSchedule } from '../calendarAction/Schedule';

const CalendarAction: React.FC = () => {
  const [checkinTime, setCheckinTime] = React.useState<string | null>(null);

  const handleCheckin = React.useCallback(() => {
    // TODO: call checkin API, for now always success
    const success = true;

    if (success) {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setCheckinTime(time);
      Toast.show({ type: 'success', text1: '출근 체크에 성공했습니다' });
    } else {
      Toast.show({ type: 'error', text1: '출근 체크에 실패했습니다' });
    }
  }, []);

  return (
    <View style={styles.container}>
      <MemoSchedule />

      <MemoCheckin checkinTime={checkinTime} onCheckin={handleCheckin} />
    </View>
  );
};

export const MemoCalendarAction = React.memo(CalendarAction);

const styles = StyleSheet.create({
  container: {
    gap: ms(8),
    flexDirection: 'row',
    paddingBottom: ms(24),
  },
});
