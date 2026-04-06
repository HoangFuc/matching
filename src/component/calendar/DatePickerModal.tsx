import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ms, s } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { MemoBottomSheetModal } from '@/src/component/BottomSheetModal';
import { AppColors } from '@/src/constants/colors';
import { ArrowLeft2, ArrowRight2 } from '@/src/constants/icons';
import { DAY_LABELS } from '@/src/constants/schedule';
import { TDayCell } from '@/src/interface/schedule.interface';
import {
  getCalendarDays,
  isToday,
  padZero,
  toKey,
} from '@/src/utils/calendar.helper';
import { MemoMonthYearPickerModal } from './MonthYearPickerModal';

interface IProps {
  visible: boolean;
  value?: string; // 'YYYY.MM.DD' or 'YYYY-MM-DD'
  onConfirm: (dateStr: string) => void; // returns 'YYYY.MM.DD'
  onCancel: () => void;
}

const parseValue = (value?: string) => {
  if (!value) return null;
  const normalized = value.replace(/\./g, '-');
  const [y, m, d] = normalized.split('-').map(Number);
  if (!y || !m || !d) return null;
  return { year: y, month: m - 1, date: d };
};

const DatePickerModal: React.FC<IProps> = ({
  visible,
  value,
  onConfirm,
  onCancel,
}) => {
  const parsed = parseValue(value);
  const now = new Date();

  const [year, setYear] = React.useState(parsed?.year ?? now.getFullYear());
  const [month, setMonth] = React.useState(parsed?.month ?? now.getMonth());
  const [selectedKey, setSelectedKey] = React.useState<string | null>(
    parsed ? toKey(parsed.year, parsed.month, parsed.date) : null,
  );

  //---------------------------------------
  const [pickerVisible, setPickerVisible] = React.useState(false);

  //---------------------------------------
  React.useEffect(() => {
    if (visible) {
      const p = parseValue(value);
      if (p) {
        setYear(p.year);
        setMonth(p.month);
        setSelectedKey(toKey(p.year, p.month, p.date));
      } else {
        const today = new Date();
        setYear(today.getFullYear());
        setMonth(today.getMonth());
        setSelectedKey(null);
      }
      setPickerVisible(false);
    }
  }, [visible, value]);

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
  const goToPrev = React.useCallback(() => {
    if (month === 0) {
      setYear(y => y - 1);
      setMonth(11);
    } else {
      setMonth(m => m - 1);
    }
  }, [month]);

  //---------------------------------------
  const goToNext = React.useCallback(() => {
    if (month === 11) {
      setYear(y => y + 1);
      setMonth(0);
    } else {
      setMonth(m => m + 1);
    }
  }, [month]);

  //---------------------------------------
  const handleSelectYearMonth = React.useCallback(
    (selectedYear: number, selectedMonth: number) => {
      setYear(selectedYear);
      setMonth(selectedMonth);
    },
    [],
  );

  //---------------------------------------
  const handleDayPress = React.useCallback((cell: TDayCell) => {
    setSelectedKey(toKey(cell.year, cell.month, cell.date));
  }, []);

  //---------------------------------------
  const handleConfirm = React.useCallback(() => {
    if (!selectedKey) return;
    const formatted = selectedKey.replace(
      /(\d{4})-(\d{2})-(\d{2})/,
      '$1.$2.$3',
    );
    onConfirm(formatted);
  }, [selectedKey, onConfirm]);

  return (
    <MemoBottomSheetModal visible={visible} onClose={onCancel}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={goToPrev} hitSlop={8}>
            <ArrowLeft2
              size={`${ms(20)}`}
              color={AppColors.gray90}
              variant="Linear"
            />
          </Pressable>

          <Pressable onPress={() => setPickerVisible(true)}>
            <AppText variant="heading3" color={AppColors.gray100}>
              {year}년 {month + 1}월
            </AppText>
          </Pressable>

          <Pressable onPress={goToNext} hitSlop={8}>
            <ArrowRight2
              size={`${ms(20)}`}
              color={AppColors.gray90}
              variant="Linear"
            />
          </Pressable>
        </View>

        {/* Day of Week */}
        <View style={styles.dayOfWeekRow}>
          {DAY_LABELS.map((label, i) => (
            <View key={label} style={styles.dayOfWeekCell}>
              <AppText
                variant="body2"
                color={i === 0 || i === 6 ? AppColors.purple : AppColors.gray80}
              >
                {label}
              </AppText>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.grid}>
          {weeks.map((week, wi) => (
            <View key={wi} style={styles.weekRow}>
              {week.map((cell, di) => {
                const key = toKey(cell.year, cell.month, cell.date);
                const today = isToday(cell);
                const isSelected = key === selectedKey;

                return (
                  <Pressable
                    key={`${wi}-${di}`}
                    style={styles.dayCell}
                    onPress={() => handleDayPress(cell)}
                  >
                    <View
                      style={[
                        styles.dayCircle,
                        isSelected && styles.dayCircleSelected,
                        today && !isSelected && styles.dayCircleToday,
                      ]}
                    >
                      <AppText
                        variant={isSelected || today ? 'body6' : 'body8'}
                        color={
                          isSelected
                            ? AppColors.white
                            : !cell.isCurrentMonth
                            ? AppColors.gray30
                            : today
                            ? AppColors.purple
                            : AppColors.gray90
                        }
                      >
                        {padZero(cell.date)}
                      </AppText>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <MemoAppButton
            label="취소"
            variant="secondary"
            style={styles.actionButton}
            onPress={onCancel}
          />
          <MemoAppButton
            label="확인"
            variant="primary"
            style={styles.actionButton}
            onPress={handleConfirm}
          />
        </View>
      </View>

      <MemoMonthYearPickerModal
        visible={pickerVisible}
        year={year}
        month={month}
        onClose={() => setPickerVisible(false)}
        onConfirm={handleSelectYearMonth}
      />
    </MemoBottomSheetModal>
  );
};

export const MemoDatePickerModal = React.memo(DatePickerModal);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
    paddingBottom: ms(24),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(16),
    marginBottom: ms(16),
  },
  dayOfWeekRow: {
    flexDirection: 'row',
    paddingVertical: ms(12),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray30,
  },
  dayOfWeekCell: {
    flex: 1,
    alignItems: 'center',
  },
  grid: {
    paddingTop: ms(4),
  },
  weekRow: {
    flexDirection: 'row',
    paddingVertical: ms(6),
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: s(32),
    height: s(32),
    borderRadius: s(16),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayCircleSelected: {
    borderColor: AppColors.purple,
    backgroundColor: AppColors.purple,
  },
  dayCircleToday: {
    borderColor: AppColors.purple,
    borderStyle: 'dotted',
  },
  actions: {
    flexDirection: 'row',
    gap: ms(8),
    marginTop: ms(16),
  },
  actionButton: {
    flex: 1,
  },
});
