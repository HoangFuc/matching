import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { ArrowLeft2, ArrowRight2 } from '@/src/constants/icons';
import { MemoMonthYearPickerModal } from './MonthYearPickerModal';

interface IProps {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectYearMonth?: (year: number, month: number) => void;
  rightAction?: React.ReactNode;
}

const CalendarHeader: React.FC<IProps> = ({
  year,
  month,
  onPrev,
  onNext,
  onSelectYearMonth,
  rightAction,
}) => {
  const [pickerVisible, setPickerVisible] = React.useState(false);

  //---------------------------------------
  const handleOpenPicker = React.useCallback(() => {
    setPickerVisible(true);
  }, []);

  //---------------------------------------
  const handleClosePicker = React.useCallback(() => {
    setPickerVisible(false);
  }, []);

  //---------------------------------------
  const handleConfirm = React.useCallback(
    (selectedYear: number, selectedMonth: number) => {
      onSelectYearMonth?.(selectedYear, selectedMonth);
    },
    [onSelectYearMonth],
  );

  return (
    <View style={styles.container}>
      <View style={styles.monthSelector}>
        <Pressable onPress={onPrev} hitSlop={8}>
          <ArrowLeft2
            size={`${ms(20)}`}
            color={AppColors.gray90}
            variant="Linear"
          />
        </Pressable>

        <Pressable onPress={handleOpenPicker}>
          <AppText variant="heading3" color={AppColors.gray100}>
            {year}년 {month + 1}월
          </AppText>
        </Pressable>

        <Pressable onPress={onNext} hitSlop={8}>
          <ArrowRight2
            size={`${ms(20)}`}
            color={AppColors.gray90}
            variant="Linear"
          />
        </Pressable>
      </View>

      {rightAction}

      <MemoMonthYearPickerModal
        visible={pickerVisible}
        year={year}
        month={month}
        onClose={handleClosePicker}
        onConfirm={handleConfirm}
      />
    </View>
  );
};

export const MemoCalendarHeader = React.memo(CalendarHeader);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(16),
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(10),
    flex: 1,
  },
});
