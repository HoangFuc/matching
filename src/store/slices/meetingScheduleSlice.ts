import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface IRecordingUploadProgress {
  uploadId: string;
  status: 'uploading' | 'completed' | 'error' | 'cancelled';
  percent: number;
  fileName: string;
  error?: string;
}

interface IMeetingScheduleState {
  recordingUploadProgress: IRecordingUploadProgress | null;
}

const initialState: IMeetingScheduleState = {
  recordingUploadProgress: null,
};

const meetingScheduleSlice = createSlice({
  name: 'meetingSchedule',
  initialState,
  reducers: {
    setRecordingUploadProgress(
      state,
      action: PayloadAction<IRecordingUploadProgress>,
    ) {
      state.recordingUploadProgress = action.payload;
    },
    updateRecordingUploadProgress(
      state,
      action: PayloadAction<Partial<IRecordingUploadProgress>>,
    ) {
      if (state.recordingUploadProgress) {
        Object.assign(state.recordingUploadProgress, action.payload);
      }
    },
    clearRecordingUploadProgress(state) {
      state.recordingUploadProgress = null;
    },
  },
});

export const {
  setRecordingUploadProgress,
  updateRecordingUploadProgress,
  clearRecordingUploadProgress,
} = meetingScheduleSlice.actions;

export default meetingScheduleSlice.reducer;
