import React from 'react';
import { StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { MemoCommonCalendar } from '@/src/component/calendar/CommonCalendar';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { AppColors } from '@/src/constants/colors';
import { CloseCircle } from '@/src/constants/icons';
import { TDayCell, TScheduleEvent } from '@/src/interface/schedule.interface';
import { useGetSchedulesQuery } from '@/src/store/api';
import { convertSchedulesToEvents } from '@/src/utils/schedule.helper';
import { CHECKIN_ON_TIME, useAttendanceData } from '../hook/useAttendanceData';
import { useCalendarNavigation } from '../hook/useCalendarNavigation';
import { TScheduleMode } from '../type';
import { MemoAttendanceSummary } from './AttendanceSummary';
import { MemoDateNumber } from './DateNumber';
import { MemoEvents } from './Events';
import { MemoScheduleRightAction } from './ScheduleRightAction';
import { TScheduleType } from './ScheduleTypePicker';

interface IProps {
  mode: TScheduleMode;
  selectedFilterTypes: TScheduleType[];
  onDayPress: (dateKey: string, events: TScheduleEvent[]) => void;
}

const ScheduleCalendar: React.FC<IProps> = ({ mode, selectedFilterTypes, onDayPress }) => {
  const {
    year,
    month,
    startDate,
    endDate,
    goToPrev,
    goToNext,
    handleSelectYearMonth,
  } = useCalendarNavigation();

  //---------------------------------------
  const { data: schedules = [] } = useGetSchedulesQuery({ startDate, endDate });

  //---------------------------------------
  const allEvents = React.useMemo(
    () => convertSchedulesToEvents(schedules),
    [schedules],
  );

  //---------------------------------------
  const events = React.useMemo(() => {
    if (selectedFilterTypes.length === 0) return allEvents;
    const filtered: Record<string, TScheduleEvent[]> = {};
    for (const [dateKey, dayEvents] of Object.entries(allEvents)) {
      const matched = dayEvents.filter(e =>
        selectedFilterTypes.includes(e.type as TScheduleType),
      );
      if (matched.length > 0) {
        filtered[dateKey] = matched;
      }
    }
    return filtered;
  }, [allEvents, selectedFilterTypes]);

  //---------------------------------------
  const { checkinTimes, firstCheckinDate, lastCheckinDate, attendanceStats } =
    useAttendanceData(startDate, endDate, mode);

  //---------------------------------------
  const handleDayPress = React.useCallback(
    (dateKey: string) => {
      if (mode === 'attendance') return;
      const dayEvents = events[dateKey] || [];
      onDayPress(dateKey, dayEvents);
    },
    [events, mode, onDayPress],
  );

  //---------------------------------------
  const renderDayContent = React.useCallback(
    (cell: TDayCell, dateKey: string, today: boolean) => {
      const dayEvents = events[dateKey] || [];
      const checkinTime = checkinTimes[dateKey];

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
    [events, mode, checkinTimes, firstCheckinDate, lastCheckinDate],
  );

  return (
    <MemoScreenBody style={styles.body}>
      <MemoCommonCalendar
        year={year}
        month={month}
        onPrev={goToPrev}
        onNext={goToNext}
        onSelectYearMonth={handleSelectYearMonth}
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
  checkinContainer: {
    gap: ms(10),
  },
  checkinEventItem: {
    paddingHorizontal: ms(4),
    paddingVertical: ms(4),
  },
});
