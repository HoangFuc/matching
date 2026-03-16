import React from 'react';

import dayjs from 'dayjs';

import { useGetMyAttendanceQuery } from '@/src/store/api';
import { TScheduleMode } from '../type';

export type TCheckinInfo = { time: string; isLate: boolean };

export const useAttendanceData = (
  startDate: string,
  endDate: string,
  mode: TScheduleMode,
) => {
  // Cap endDate to today so future dates don't get marked as absent
  const today = dayjs().format('YYYY-MM-DD');
  const effectiveEndDate = today < endDate ? today : endDate;
  const isFutureRange = effectiveEndDate < startDate;

  //---------------------------------------
  const { data: attendanceData } = useGetMyAttendanceQuery(
    { startDate, endDate: effectiveEndDate },
    { skip: mode !== 'attendance' || isFutureRange },
  );

  //---------------------------------------
  const checkinTimes = React.useMemo(() => {
    const map: Record<string, TCheckinInfo> = {};

    // Default all days in query range to late (trễ giờ)
    let current = dayjs(startDate);
    const end = dayjs(effectiveEndDate);
    while (!current.isAfter(end, 'day')) {
      const dateKey = current.format('YYYY-MM-DD');
      map[dateKey] = { time: '', isLate: true };
      current = current.add(1, 'day');
    }

    // Override with actual data from API
    if (Array.isArray(attendanceData?.records)) {
      for (const record of attendanceData.records) {
        const date = dayjs(record.checkInDate).format('YYYY-MM-DD');
        const time = dayjs(record.checkInTime).format('HH:mm');
        map[date] = { time, isLate: record.isLate };
      }
    }

    return map;
  }, [attendanceData, startDate, effectiveEndDate]);

  //---------------------------------------
  const attendanceStats = attendanceData?.summary ?? {
    onTime: 0,
    late: 0,
    absent: 0,
  };

  return { checkinTimes, attendanceStats };
};
