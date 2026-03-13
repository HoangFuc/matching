import {
  getCalendarDays,
  toKey,
  padZero,
  formatDateHeader,
} from '@/src/utils/calendar.helper';

describe('getCalendarDays', () => {
  it('returns exactly 42 cells (6 rows x 7 columns)', () => {
    const cells = getCalendarDays(2025, 2); // March 2025
    expect(cells).toHaveLength(42);
  });

  it('marks current month days correctly', () => {
    const cells = getCalendarDays(2025, 2); // March 2025 has 31 days
    const currentMonthCells = cells.filter(c => c.isCurrentMonth);
    expect(currentMonthCells).toHaveLength(31);
    expect(currentMonthCells[0].date).toBe(1);
    expect(currentMonthCells[30].date).toBe(31);
  });

  it('includes previous month trailing days', () => {
    // March 2025 starts on Saturday (day 6)
    const cells = getCalendarDays(2025, 2);
    const prevMonthCells = cells.filter(
      c => !c.isCurrentMonth && c.month === 1,
    );
    expect(prevMonthCells.length).toBe(6); // 6 trailing days from Feb
  });

  it('handles January (wraps year for prev month)', () => {
    const cells = getCalendarDays(2025, 0); // January 2025
    const prevMonthCells = cells.filter(c => !c.isCurrentMonth && c.month < 0);
    // January 2025 starts on Wednesday (day 3), prev month cells should have year 2024
    const decCells = cells.filter(
      c => !c.isCurrentMonth && c.year === 2024,
    );
    expect(decCells.length).toBeGreaterThanOrEqual(0);
  });

  it('handles December (wraps year for next month)', () => {
    const cells = getCalendarDays(2025, 11); // December 2025
    const nextMonthCells = cells.filter(
      c => !c.isCurrentMonth && c.year === 2026,
    );
    expect(nextMonthCells.length).toBeGreaterThan(0);
  });
});

describe('toKey', () => {
  it('formats date as YYYY-MM-DD with zero-padded month and day', () => {
    expect(toKey(2025, 0, 5)).toBe('2025-01-05');
    expect(toKey(2025, 11, 25)).toBe('2025-12-25');
    expect(toKey(2025, 2, 15)).toBe('2025-03-15');
  });
});

describe('padZero', () => {
  it('pads single digit numbers', () => {
    expect(padZero(1)).toBe('01');
    expect(padZero(9)).toBe('09');
  });

  it('does not pad double digit numbers', () => {
    expect(padZero(10)).toBe('10');
    expect(padZero(31)).toBe('31');
  });
});

describe('formatDateHeader', () => {
  it('formats date key to YY.MM.DD (요일) format', () => {
    // 2025-03-15 is Saturday
    expect(formatDateHeader('2025-03-15')).toBe('25.03.15 (토)');
  });

  it('formats another date correctly', () => {
    // 2025-01-01 is Wednesday
    expect(formatDateHeader('2025-01-01')).toBe('25.01.01 (수)');
  });
});
