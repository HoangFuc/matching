import React from 'react';
import { StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';
import { MemoCheckin } from '../calendarAction/Checkin';
import { MemoSchedule } from '../calendarAction/Schedule';

const CalendarAction: React.FC = () => {
  return (
    <View style={styles.container}>
      <MemoSchedule />

      <MemoCheckin />
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
