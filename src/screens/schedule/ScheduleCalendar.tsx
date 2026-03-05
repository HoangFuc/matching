import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { moderateScale as ms, s } from 'react-native-size-matters/extend';

import { AppColors } from '@/src/constants/colors';
import { MemoCalendarGrid } from './calendar/CalendarGrid';
import { MemoDayOfWeekHeader } from './calendar/DayOfWeekHeader';
import { MemoHeaderCalendar } from './calendar/HeaderCalendar';

const ScheduleCalendar: React.FC = () => {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(11); // December (0-indexed)

  return (
    <View style={styles.container}>
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
    </View>
  );
};

export const MemoScheduleCalendar = React.memo(ScheduleCalendar);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    paddingVertical: ms(16),
    gap: ms(16),
  },
  calendarCard: {
    width: s(343),
    flex: 1,
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: AppColors.gray30,
    alignSelf: 'center',
  },
});
