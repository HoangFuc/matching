import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { getCalendarDays, isToday, toKey } from '@/src/utils/calendar.helper';
import { ms } from 'react-native-size-matters/extend';

import { AppColors } from '@/src/constants/colors';
import { TDayCell, TScheduleEvent } from '@/src/interface/schedule.interface';
import type { ScheduleNavigationProp } from '@/src/interface/tab.interface';
import { TCheckinInfo } from '../hook/useAttendanceData';
import { MemoDateNumber } from './DateNumber';
import { MemoEvents } from './Events';

interface IProps {
  year: number;
  month: number;
  events: Record<string, TScheduleEvent[]>;
  checkinTimes?: Record<string, TCheckinInfo>;
}

const CalendarGrid: React.FC<IProps> = props => {
  const { year, month, events, checkinTimes } = props;
  const navigation = useNavigation<ScheduleNavigationProp>();

  //---------------------------------------
  const days = React.useMemo(() => getCalendarDays(year, month), [year, month]);

  //---------------------------------------
  const weeks = React.useMemo(() => {
    const result: TDayCell[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  //---------------------------------------
  const handleDayPress = React.useCallback(
    (dateKey: string) => {
      navigation.navigate('ScheduleDetail', { dateKey });
    },
    [navigation],
  );

  return (
    <View style={styles.container}>
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.weekRow}>
          {week.map((cell, di) => {
            const today = isToday(cell);
            const key = toKey(cell.year, cell.month, cell.date);
            const dayEvents = events[key] || [];
            const checkinTime = checkinTimes?.[key];

            return (
              <Pressable
                key={`${wi}-${di}`}
                style={styles.dayCell}
                onPress={() => handleDayPress(key)}
              >
                <MemoDateNumber cell={cell} today={today} />

                {checkinTime && cell.isCurrentMonth ? (
                  <MemoEvents
                    events={[
                      {
                        id: `checkin-${key}`,
                        title: checkinTime.time,
                        color: AppColors.gray90,
                        backgroundColor: 'transparent',
                      },
                    ]}
                  />
                ) : (
                  <MemoEvents events={dayEvents} />
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export const MemoCalendarGrid = React.memo(CalendarGrid);

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
