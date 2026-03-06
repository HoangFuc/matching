import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppColors } from '@/src/constants/colors';
import { TDayCell } from '@/src/interface/schedule.interface';
import { getCalendarDays, isToday, toKey } from '@/src/utils/calendar.helper';

interface IProps {
  year: number;
  month: number;
  renderDayContent: (cell: TDayCell, dateKey: string, today: boolean) => React.ReactNode;
  onDayPress?: (dateKey: string, cell: TDayCell) => void;
}

const CalendarGrid: React.FC<IProps> = ({
  year,
  month,
  renderDayContent,
  onDayPress,
}) => {
  const days = React.useMemo(() => getCalendarDays(year, month), [year, month]);

  const weeks = React.useMemo(() => {
    const result: TDayCell[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  return (
    <View style={styles.container}>
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.weekRow}>
          {week.map((cell, di) => {
            const today = isToday(cell);
            const key = toKey(cell.year, cell.month, cell.date);

            return (
              <Pressable
                key={`${wi}-${di}`}
                style={styles.dayCell}
                onPress={() => onDayPress?.(key, cell)}
              >
                {renderDayContent(cell, key, today)}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export const MemoCommonCalendarGrid = React.memo(CalendarGrid);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: ms(8),
  },
  weekRow: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: ms(8),
    paddingBottom: ms(10),
    gap: ms(8),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray30,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
  },
});
