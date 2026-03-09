import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { MemoCommonCalendar } from '@/src/component/calendar/CommonCalendar';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { AppColors } from '@/src/constants/colors';
import { CloseCircle } from '@/src/constants/icons';
import { TDayCell, TScheduleEvent } from '@/src/interface/schedule.interface';
import { useGetSchedulesQuery } from '@/src/store/api';
import { convertSchedulesToEvents } from '@/src/utils/schedule.helper';
import { TScheduleMode } from '../type';
import { MemoAttendanceSummary } from './AttendanceSummary';
import { MemoDateNumber } from './DateNumber';
import { MemoEvents } from './Events';
import { MemoScheduleRightAction } from './ScheduleRightAction';

// ── Mock checkin times ─────────────────────────────────
const CHECKIN_ON_TIME = '08:00';

const MOCK_CHECKIN_TIMES: Record<string, string> = {
  '2025-12-01': '08:00',
  '2025-12-02': '08:00',
  '2025-12-03': '08:00',
  '2025-12-04': '08:00',
  '2025-12-05': '08:00',
  '2025-12-08': '08:00',
  '2025-12-09': '11:30',
  '2025-12-10': '08:00',
  '2025-12-11': '08:00',
  '2025-12-12': '08:00',
  '2025-12-15': '08:00',
  '2025-12-16': '08:00',
  '2025-12-17': '08:00',
};

interface IProps {
  mode: TScheduleMode;
  onDayPress: (dateKey: string, events: TScheduleEvent[]) => void;
}

const ScheduleCalendar: React.FC<IProps> = ({ mode, onDayPress }) => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  //---------------------------------------
  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(
    lastDay,
  ).padStart(2, '0')}`;

  //---------------------------------------
  const { data: schedules = [] } = useGetSchedulesQuery({ startDate, endDate });
  const events = React.useMemo(
    () => convertSchedulesToEvents(schedules),
    [schedules],
  );

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
  const handleDayPress = React.useCallback(
    (dateKey: string) => {
      const dayEvents = events[dateKey] || [];
      onDayPress(dateKey, dayEvents);
    },
    [events, onDayPress],
  );

  //---------------------------------------
  const checkinDateKeys = React.useMemo(
    () => Object.keys(MOCK_CHECKIN_TIMES).sort(),
    [],
  );

  //---------------------------------------
  const firstCheckinDate = checkinDateKeys[0];
  const lastCheckinDate = checkinDateKeys[checkinDateKeys.length - 1];

  //---------------------------------------
  const attendanceStats = React.useMemo(() => {
    const entries = Object.entries(MOCK_CHECKIN_TIMES);
    const onTime = entries.filter(([, t]) => t === CHECKIN_ON_TIME).length;
    const late = entries.filter(([, t]) => t !== CHECKIN_ON_TIME).length;
    let absent = 0;
    if (firstCheckinDate && lastCheckinDate) {
      let current = new Date(firstCheckinDate);
      const end = new Date(lastCheckinDate);
      while (current <= end) {
        const key = current.toISOString().slice(0, 10);
        if (!MOCK_CHECKIN_TIMES[key]) absent++;
        current.setDate(current.getDate() + 1);
      }
    }
    return { onTime, late, absent };
  }, [firstCheckinDate, lastCheckinDate]);

  //---------------------------------------
  const renderDayContent = React.useCallback(
    (cell: TDayCell, dateKey: string, today: boolean) => {
      const dayEvents = events[dateKey] || [];
      const checkinTime = MOCK_CHECKIN_TIMES[dateKey];

      let cellContent: React.ReactNode;
      if (mode === 'attendance' && cell.isCurrentMonth) {
        if (checkinTime) {
          const isOnTime = checkinTime === CHECKIN_ON_TIME;
          cellContent = (
            <MemoEvents
              events={[
                {
                  id: `checkin-${dateKey}`,
                  title: checkinTime,
                  color: isOnTime ? AppColors.strongBlue : AppColors.purple,
                  backgroundColor: isOnTime
                    ? AppColors.lightBlue
                    : AppColors.lavendar,
                },
              ]}
              styleEventItem={styles.checkinEventItem}
              containerStyle={styles.checkinContainer}
            />
          );
        } else if (dateKey >= firstCheckinDate && dateKey <= lastCheckinDate) {
          cellContent = (
            <View style={styles.absentContainer}>
              <CloseCircle
                size={ms(10)}
                color={AppColors.negative}
                variant="Linear"
              />
            </View>
          );
        } else {
          cellContent = null;
        }
      } else {
        cellContent = <MemoEvents events={dayEvents} />;
      }

      return (
        <>
          <MemoDateNumber cell={cell} today={today} />

          {cellContent}
        </>
      );
    },
    [events, mode, firstCheckinDate, lastCheckinDate],
  );

  return (
    <MemoScreenBody style={styles.body}>
      <MemoCommonCalendar
        year={year}
        month={month}
        onPrev={goToPrev}
        onNext={goToNext}
        rightAction={
          mode !== 'attendance' ? <MemoScheduleRightAction /> : undefined
        }
        renderDayContent={renderDayContent}
        onDayPress={handleDayPress}
      />

      {mode === 'attendance' && (
        <MemoAttendanceSummary
          onTime={attendanceStats.onTime}
          late={attendanceStats.late}
          absent={attendanceStats.absent}
        />
      )}
    </MemoScreenBody>
  );
};

export const MemoScheduleCalendar = React.memo(ScheduleCalendar);

const styles = StyleSheet.create({
  body: {
    paddingVertical: ms(16),
    gap: ms(16),
  },
  absentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absentText: {
    fontSize: ms(10),
    lineHeight: ms(14),
    color: AppColors.negative,
    fontWeight: '600',
  },
  checkinContainer: {
    gap: ms(10),
  },
  checkinEventItem: {
    paddingHorizontal: ms(4),
    paddingVertical: ms(4),
  },
});
