import reducer, {
  setMode,
  setSelectedDate,
  resetSchedule,
} from '@/src/store/slices/scheduleSlice';

const initialState = {
  mode: 'schedule' as const,
  selectedDate: null,
};

describe('scheduleSlice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, {type: 'unknown'})).toEqual(initialState);
  });

  //---------------------------------------
  it('setMode changes mode to attendance', () => {
    const state = reducer(initialState, setMode('attendance'));
    expect(state.mode).toBe('attendance');
  });

  //---------------------------------------
  it('setMode changes mode to schedule', () => {
    const attendanceState = {...initialState, mode: 'attendance' as const};
    const state = reducer(attendanceState, setMode('schedule'));
    expect(state.mode).toBe('schedule');
  });

  //---------------------------------------
  it('setSelectedDate sets a date', () => {
    const state = reducer(initialState, setSelectedDate('2025-03-15'));
    expect(state.selectedDate).toBe('2025-03-15');
  });

  //---------------------------------------
  it('setSelectedDate can set null', () => {
    const stateWithDate = {...initialState, selectedDate: '2025-03-15'};
    const state = reducer(stateWithDate, setSelectedDate(null));
    expect(state.selectedDate).toBeNull();
  });

  //---------------------------------------
  it('resetSchedule returns initial state', () => {
    const modifiedState = {mode: 'attendance' as const, selectedDate: '2025-03-15'};
    const state = reducer(modifiedState, resetSchedule());
    expect(state).toEqual(initialState);
  });
});
