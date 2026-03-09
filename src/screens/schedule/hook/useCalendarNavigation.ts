import React from 'react';

export const useCalendarNavigation = () => {
  const now = new Date();
  const [year, setYear] = React.useState(now.getFullYear());
  const [month, setMonth] = React.useState(now.getMonth());

  //---------------------------------------
  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(
    lastDay,
  ).padStart(2, '0')}`;

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
  };
};
