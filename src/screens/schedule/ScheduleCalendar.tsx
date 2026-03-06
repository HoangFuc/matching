import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { MemoCommonCalendar } from '@/src/component/calendar/CommonCalendar';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { AppColors } from '@/src/constants/colors';
import { TDayCell, TScheduleEvent } from '@/src/interface/schedule.interface';
import type {
  ScheduleNavigationProp,
  TScheduleMode,
} from '@/src/interface/tab.interface';
import { CloseCircle } from 'iconsax-react-nativejs';
import { MemoAttendanceSummary } from './calendar/AttendanceSummary';
import { MemoDateNumber } from './calendar/DateNumber';
import { MemoEvents } from './calendar/Events';
import { MemoScheduleRightAction } from './calendar/ScheduleRightAction';

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
}

const ScheduleCalendar: React.FC<IProps> = ({ mode }) => {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(11);
  const navigation = useNavigation<ScheduleNavigationProp>();

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
      const dayEvents = MOCK_EVENTS[dateKey] || [];
      navigation.navigate('ScheduleDetail', { dateKey, events: dayEvents });
    },
    [navigation],
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
      const dayEvents = MOCK_EVENTS[dateKey] || [];
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
    [mode, firstCheckinDate, lastCheckinDate],
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
