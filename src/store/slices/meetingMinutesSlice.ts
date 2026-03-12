import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface IMeetingLogUploadProgress {
  uploadId: string;
  status: 'uploading' | 'completed' | 'error' | 'cancelled';
  percent: number;
  fileName: string;
  error?: string;
}

interface IMeetingMinutesState {
  meetingLogUploadProgress: IMeetingLogUploadProgress | null;
}

const initialState: IMeetingMinutesState = {
  meetingLogUploadProgress: null,
};

const meetingMinutesSlice = createSlice({
  name: 'meetingMinutes',
  initialState,
  reducers: {
    setMeetingLogUploadProgress(
      state,
      action: PayloadAction<IMeetingLogUploadProgress>,
    ) {
      state.meetingLogUploadProgress = action.payload;
    },
    updateMeetingLogUploadProgress(
      state,
      action: PayloadAction<Partial<IMeetingLogUploadProgress>>,
    ) {
      if (state.meetingLogUploadProgress) {
        Object.assign(state.meetingLogUploadProgress, action.payload);
      }
    },
    clearMeetingLogUploadProgress(state) {
      state.meetingLogUploadProgress = null;
    },
  },
});

export const {
  setMeetingLogUploadProgress,
  updateMeetingLogUploadProgress,
  clearMeetingLogUploadProgress,
} = meetingMinutesSlice.actions;

export default meetingMinutesSlice.reducer;
