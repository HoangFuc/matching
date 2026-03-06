import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { MemoScreenBody } from '@/src/component/ScreenBody';
import { AppColors } from '@/src/constants/colors';
import { CardShadow } from '@/src/constants/shadows';
import { MemoCalendarGrid } from './calendar/CalendarGrid';
import { MemoDayOfWeekHeader } from './calendar/DayOfWeekHeader';
import { MemoHeaderCalendar } from './calendar/HeaderCalendar';

const ScheduleCalendar: React.FC = () => {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(11); // December (0-indexed)

  return (
    <MemoScreenBody style={styles.body}>
      {/* Month navigation + Register button */}
      <MemoHeaderCalendar
        year={year}
        setYear={setYear}
        month={month}
        setMonth={setMonth}
      />

      <View style={styles.calendarCard}>
        <MemoDayOfWeekHeader />

        <MemoCalendarGrid year={year} month={month} />
      </View>
    </MemoScreenBody>
  );
};

export const MemoScheduleCalendar = React.memo(ScheduleCalendar);

const styles = StyleSheet.create({
  body: {
    paddingVertical: ms(16),
    gap: ms(16),
  },
  calendarCard: {
    width: ms(343),
    flex: 1,
    borderRadius: ms(16),
    borderWidth: 1,
    borderColor: AppColors.gray30,
    alignSelf: 'center',
    backgroundColor: AppColors.white,
    ...CardShadow,
  },
});
