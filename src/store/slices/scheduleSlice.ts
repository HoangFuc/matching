import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TScheduleMode} from '@/src/screens/schedule/type';

interface IScheduleState {
  mode: TScheduleMode;
  selectedDate: string | null;
}

const initialState: IScheduleState = {
  mode: 'schedule',
  selectedDate: null,
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<TScheduleMode>) {
      state.mode = action.payload;
    },
    setSelectedDate(state, action: PayloadAction<string | null>) {
      state.selectedDate = action.payload;
    },
    resetSchedule() {
      return initialState;
    },
  },
});

export const {setMode, setSelectedDate, resetSchedule} = scheduleSlice.actions;

export default scheduleSlice.reducer;
