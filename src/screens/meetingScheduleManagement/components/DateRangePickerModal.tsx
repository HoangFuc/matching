import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { MemoAppBottomSheet } from '@/src/component/AppBottomSheet';
import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { ArrowLeft2, ArrowRight2 } from '@/src/constants/icons';
import { TDayCell } from '@/src/interface/schedule.interface';
import { getCalendarDays, isToday, padZero } from '@/src/utils/calendar.helper';

interface IProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (startDate: string, endDate: string) => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

const DateRangePickerModal: React.FC<IProps> = ({
  visible,
  onClose,
  onConfirm,
  initialStartDate,
  initialEndDate,
}) => {
  const now = new Date();
  const [year, setYear] = React.useState(now.getFullYear());
  const [month, setMonth] = React.useState(now.getMonth());
  const [startDate, setStartDate] = React.useState<string | null>(
    initialStartDate ?? null,
  );
  const [endDate, setEndDate] = React.useState<string | null>(
    initialEndDate ?? null,
  );

  //---------------------------------------
  const days = React.useMemo(() => getCalendarDays(year, month), [year, month]);

  const weeks = React.useMemo(() => {
    const result: TDayCell[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  //---------------------------------------
  const toDateKey = React.useCallback(
    (cell: TDayCell) =>
      `${cell.year}-${padZero(cell.month + 1)}-${padZero(cell.date)}`,
    [],
  );

  //---------------------------------------
  const handlePrev = React.useCallback(() => {
    setMonth(prev => {
      if (prev === 0) {
        setYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }, []);

  //---------------------------------------
  const handleNext = React.useCallback(() => {
    setMonth(prev => {
      if (prev === 11) {
        setYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
  }, []);

  //---------------------------------------
  const handleDayPress = React.useCallback(
    (cell: TDayCell) => {
      const key = toDateKey(cell);
      if (!startDate || (startDate && endDate)) {
        setStartDate(key);
        setEndDate(null);
      } else if (key < startDate) {
        setStartDate(key);
        setEndDate(null);
      } else {
        setEndDate(key);
      }
    },
    [startDate, endDate, toDateKey],
  );

  //---------------------------------------
  const isInRange = React.useCallback(
    (cell: TDayCell) => {
      if (!startDate || !endDate) return false;
      const key = toDateKey(cell);
      return key >= startDate && key <= endDate;
    },
    [startDate, endDate, toDateKey],
  );

  //---------------------------------------
  const isSelected = React.useCallback(
    (cell: TDayCell) => {
      const key = toDateKey(cell);
      return key === startDate || key === endDate;
    },
    [startDate, endDate, toDateKey],
  );

  //---------------------------------------
  const handleConfirm = React.useCallback(() => {
    if (startDate) {
      onConfirm(startDate, endDate ?? startDate);
      onClose();
    }
  }, [startDate, endDate, onConfirm, onClose]);

  //---------------------------------------
  const handleCancel = React.useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <MemoAppBottomSheet
      visible={visible}
      onClose={onClose}
      showHandle={false}
      footer={
        <View style={styles.footerRow}>
          <MemoAppButton
            label="취소"
            variant="secondary"
            onPress={handleCancel}
            style={styles.footerBtn}
          />
          <MemoAppButton
            label="확인"
            variant="primary"
            onPress={handleConfirm}
            style={styles.footerBtn}
          />
        </View>
      }
    >
      <View style={styles.header}>
        <Pressable onPress={handlePrev} hitSlop={8}>
          <ArrowLeft2
            size={`${ms(20)}`}
            color={AppColors.gray90}
            variant="Linear"
          />
        </Pressable>

        <AppText variant="body1" color={AppColors.gray90}>
          {year}년 {month + 1}월
        </AppText>

        <Pressable onPress={handleNext} hitSlop={8}>
          <ArrowRight2
            size={`${ms(20)}`}
            color={AppColors.gray90}
            variant="Linear"
          />
        </Pressable>
      </View>

      <View style={styles.dayOfWeekRow}>
        {DAY_LABELS.map((label, idx) => (
          <View key={idx} style={styles.dayOfWeekCell}>
            <AppText
              variant="body6"
              color={
                idx === 0 || idx === 6 ? AppColors.negative : AppColors.gray90
              }
            >
              {label}
            </AppText>
          </View>
        ))}
      </View>

      {weeks.map((week, wi) => (
        <View key={wi} style={styles.weekRow}>
          {week.map((cell, di) => {
            const today = isToday(cell);
            const selected = isSelected(cell);
            const inRange = isInRange(cell);

            return (
              <Pressable
                key={`${wi}-${di}`}
                style={[
                  styles.dayCell,
                  inRange && styles.dayCellInRange,
                  today && !selected && styles.dayCellToday,
                  selected && styles.dayCellSelected,
                ]}
                onPress={() => handleDayPress(cell)}
              >
                <AppText
                  variant="body7"
                  color={
                    selected
                      ? AppColors.white
                      : !cell.isCurrentMonth
                      ? AppColors.gray40
                      : today
                      ? AppColors.purple
                      : AppColors.gray90
                  }
                >
                  {cell.date}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      ))}
    </MemoAppBottomSheet>
  );
};

export const MemoDateRangePickerModal = React.memo(DateRangePickerModal);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: ms(16),
    paddingTop: ms(16),
  },
  dayOfWeekRow: {
    flexDirection: 'row',
  },
  dayOfWeekCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    borderRadius: ms(100),
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(10),
  },
  dayCellInRange: {
    backgroundColor: AppColors.lavendar,
    borderRadius: ms(100),
  },
  dayCellToday: {
    borderWidth: ms(1),
    borderColor: AppColors.purple,
    borderRadius: ms(100),
    backgroundColor: AppColors.white,
    paddingVertical: ms(4),
    paddingHorizontal: ms(6),
  },
  dayCellSelected: {
    backgroundColor: AppColors.lightLavendar,
    borderRadius: ms(100),
  },
  footerRow: {
    flexDirection: 'row',
    gap: ms(12),
    flex: 1,
  },
  footerBtn: {
    flex: 1,
    paddingVertical: ms(8),
  },
});
