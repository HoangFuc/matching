import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { MemoCommonCalendar } from '@/src/component/calendar/CommonCalendar';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { AppColors } from '@/src/constants/colors';
import { CloseCircle } from '@/src/constants/icons';
import { TDayCell, TScheduleEvent } from '@/src/interface/schedule.interface';
import { useGetSchedulesQuery } from '@/src/store/api/schedule.api';
import { useHasCompany } from '@/src/hooks/useHasCompany';
import { convertSchedulesToEvents } from '@/src/utils/schedule.helper';
import { useAttendanceData } from '../hook/useAttendanceData';
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
  onDayPress: (dateKey: string) => void;
  showTitle?: boolean;
}

const ScheduleCalendar: React.FC<IProps> = ({
  mode,
  selectedFilterTypes,
  onDayPress,
  showTitle = false,
}) => {
  const {
    year,
    month,
    startDate,
    endDate,
    goToPrev,
    goToNext,
    handleSelectYearMonth,
    resetToCurrentMonth,
  } = useCalendarNavigation();

  //---------------------------------------
  useFocusEffect(
    React.useCallback(() => {
      resetToCurrentMonth();
    }, [resetToCurrentMonth]),
  );

  //---------------------------------------
  const hasCompany = useHasCompany();

  //---------------------------------------
  const { data: schedules = [] } = useGetSchedulesQuery(
    { startDate, endDate },
    { skip: !hasCompany },
  );

  //---------------------------------------
  const allEvents = React.useMemo(
    () => convertSchedulesToEvents(schedules),
    [schedules],
  );

  //---------------------------------------
  const events = React.useMemo(() => {
    if (selectedFilterTypes.length === 0) return {};
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
  const { checkinTimes, attendanceStats } = useAttendanceData(
    startDate,
    endDate,
    mode,
  );

  //---------------------------------------
  const handleDayPress = React.useCallback(
    (dateKey: string) => {
      if (mode === 'attendance') return;
      onDayPress(dateKey);
    },
    [mode, onDayPress],
  );

  //---------------------------------------
  const renderDayContent = React.useCallback(
    (cell: TDayCell, dateKey: string, today: boolean) => {
      const dayEvents = events[dateKey] || [];
      const checkinInfo = checkinTimes[dateKey];

      let cellContent: React.ReactNode;
      if (mode === 'attendance') {
        if (checkinInfo?.time) {
          const isOnTime = !checkinInfo.isLate;
          cellContent = (
            <MemoEvents
              events={[
                {
                  id: `checkin-${dateKey}`,
                  title: checkinInfo.time,
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
        } else if (checkinInfo) {
          // No check-in record
          cellContent = (
            <View style={styles.absentContainer}>
              <CloseCircle size={ms(18)} color={AppColors.negative} />
            </View>
          );
        } else {
          cellContent = null;
        }
      } else {
        const displayEvents = showTitle
          ? dayEvents
          : dayEvents.map(e => ({ ...e, title: e.type || e.title }));
        cellContent = <MemoEvents events={displayEvents} />;
      }

      return (
        <>
          <MemoDateNumber cell={cell} today={today} />
          {cellContent}
        </>
      );
    },
    [events, mode, checkinTimes, showTitle],
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
    alignItems: 'center' as const,
    marginTop: ms(4),
  },
  checkinContainer: {
    gap: ms(10),
  },
  checkinEventItem: {
    paddingHorizontal: ms(4),
    paddingVertical: ms(4),
  },
});
