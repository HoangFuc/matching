import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppColors } from '@/src/constants/colors';
import { CardShadow } from '@/src/constants/shadows';
import { TDayCell } from '@/src/interface/schedule.interface';
import { MemoCalendarDayOfWeek } from './CalendarDayOfWeek';
import { MemoCommonCalendarGrid } from './CalendarGrid';
import { MemoCalendarHeader } from './CalendarHeader';

interface IProps {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectYearMonth?: (year: number, month: number) => void;
  rightAction?: React.ReactNode;
  renderDayContent: (
    cell: TDayCell,
    dateKey: string,
    today: boolean,
  ) => React.ReactNode;
  onDayPress?: (dateKey: string, cell: TDayCell) => void;
  footer?: React.ReactNode;
}

const CommonCalendar: React.FC<IProps> = ({
  year,
  month,
  onPrev,
  onNext,
  onSelectYearMonth,
  rightAction,
  renderDayContent,
  onDayPress,
  footer,
}) => {
  return (
    <View style={styles.wrapper}>
      <MemoCalendarHeader
        year={year}
        month={month}
        onPrev={onPrev}
        onNext={onNext}
        onSelectYearMonth={onSelectYearMonth}
        rightAction={rightAction}
      />

      <View style={styles.calendarCard}>
        <MemoCalendarDayOfWeek />

        <MemoCommonCalendarGrid
          year={year}
          month={month}
          renderDayContent={renderDayContent}
          onDayPress={onDayPress}
        />

        {footer}
      </View>
    </View>
  );
};

export const MemoCommonCalendar = React.memo(CommonCalendar);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
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
