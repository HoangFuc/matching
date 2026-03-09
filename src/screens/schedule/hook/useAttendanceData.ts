import React from 'react';

import dayjs from 'dayjs';

import { useGetMyAttendanceQuery } from '@/src/store/api';
import { TScheduleMode } from '../type';

const CHECKIN_ON_TIME = '08:00';

export const useAttendanceData = (
  startDate: string,
  endDate: string,
  mode: TScheduleMode,
) => {
  const { data: attendanceData } = useGetMyAttendanceQuery(
    { startDate, endDate },
    { skip: mode !== 'attendance' },
  );

  //---------------------------------------
  const checkinTimes = React.useMemo(() => {
    const map: Record<string, string> = {};
    if (attendanceData?.data) {
      for (const record of attendanceData.data) {
        const date = dayjs(record.checkInDate).format('YYYY-MM-DD');
        const timeCheckin = dayjs(record.checkInTime).format('HH:mm');
        map[date] = timeCheckin;
      }
    }
    return map;
  }, [attendanceData]);

  //---------------------------------------
  const checkinDateKeys = React.useMemo(
    () => Object.keys(checkinTimes).sort(),
    [checkinTimes],
  );

  //---------------------------------------
  const firstCheckinDate = checkinDateKeys[0];
  const lastCheckinDate = checkinDateKeys[checkinDateKeys.length - 1];

  //---------------------------------------
  const attendanceStats = React.useMemo(() => {
    const entries = Object.entries(checkinTimes);
    const onTime = entries.filter(([, t]) => t === CHECKIN_ON_TIME).length;
    const late = entries.filter(([, t]) => t !== CHECKIN_ON_TIME).length;
    let absent = 0;
    if (firstCheckinDate && lastCheckinDate) {
      let current = new Date(firstCheckinDate);
      const end = new Date(lastCheckinDate);
      while (current <= end) {
        const key = current.toISOString().slice(0, 10);
        if (!checkinTimes[key]) absent++;
        current.setDate(current.getDate() + 1);
      }
    }
    return { onTime, late, absent };
  }, [checkinTimes, firstCheckinDate, lastCheckinDate]);

  return { checkinTimes, firstCheckinDate, lastCheckinDate, attendanceStats };
};

export { CHECKIN_ON_TIME };
