import React from 'react';

import dayjs from 'dayjs';

export const useCalendarNavigation = () => {
  const now = new Date();
  const [year, setYear] = React.useState(now.getFullYear());
  const [month, setMonth] = React.useState(now.getMonth());

  //---------------------------------------
  const resetToCurrentMonth = React.useCallback(() => {
    const today = new Date();
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  }, []);

  //---------------------------------------
  const dayOfWeek = new Date(year, month, 1).getDay();
  const firstVisible = new Date(year, month, 1 - dayOfWeek);
  const lastVisible = new Date(year, month, 1 - dayOfWeek + 41);

  const startDate = dayjs(firstVisible).format('YYYY-MM-DD');
  const endDate = dayjs(lastVisible).format('YYYY-MM-DD');

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

  return {
    year,
    month,
    startDate,
    endDate,
    goToPrev,
    goToNext,
    handleSelectYearMonth,
    resetToCurrentMonth,
  };
};
