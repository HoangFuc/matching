import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { getCalendarDays, isToday, toKey } from '@/src/utils/calendar.helper';
import { ms } from 'react-native-size-matters/extend';

import { AppColors } from '@/src/constants/colors';
import { TDayCell, TScheduleEvent } from '@/src/interface/schedule.interface';
import type { ScheduleNavigationProp } from '@/src/interface/tab.interface';
import { MemoDateNumber } from './DateNumber';
import { MemoEvents } from './Events';

interface IProps {
  year: number;
  month: number;
}

// ── Mock data ──────────────────────────────────────────
const MOCK_EVENTS: Record<string, TScheduleEvent[]> = {
  '2025-12-17': [
    {
      id: '1',
      title: '지방출장',
      type: '지방출장',
      description: '부산 지사 방문 및 현장 점검',
      color: AppColors.purple,
      backgroundColor: AppColors.lavendar,
    },
  ],
  '2025-12-19': [
    {
      id: '2',
      title: '고객 미팅',
      type: '고객 미팅',
      description: '고객 요구사항 확인 및 서비스 설명',
      color: AppColors.strongBlue,
      backgroundColor: AppColors.lightBlue,
    },
    {
      id: '3',
      title: '계약 일정',
      type: '계약 일정',
      description: '계약 조건 최종 확인 및 체결',
      color: AppColors.negative,
      backgroundColor: AppColors.pastelPink,
    },
  ],
  '2025-12-20': [
    {
      id: '4',
      title: '계약 일정',
      type: '계약 일정',
      description: '계약서 검토 및 서명',
      color: AppColors.negative,
      backgroundColor: AppColors.pastelPink,
    },
  ],
  '2025-12-21': [
    {
      id: '5',
      title: '계약 일정',
      type: '계약 일정',
      description: '최종 계약 확인',
      color: AppColors.negative,
      backgroundColor: AppColors.pastelPink,
    },
  ],
};

const CalendarGrid: React.FC<IProps> = props => {
  const { year, month } = props;
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
    (dateKey: string, events: TScheduleEvent[]) => {
      navigation.navigate('ScheduleDetail', { dateKey, events });
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
            const events = MOCK_EVENTS[key] || [];

            return (
              <Pressable
                key={`${wi}-${di}`}
                style={styles.dayCell}
                onPress={() => handleDayPress(key, events)}
              >
                <MemoDateNumber cell={cell} today={today} />

                <MemoEvents events={events} />
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
