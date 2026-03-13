import reducer, {
  setRecordingUploadProgress,
  updateRecordingUploadProgress,
  clearRecordingUploadProgress,
  IRecordingUploadProgress,
} from '@/src/store/slices/meetingScheduleSlice';

const initialState = {
  recordingUploadProgress: null,
};

const mockProgress: IRecordingUploadProgress = {
  uploadId: 'rec-upload-1',
  status: 'uploading',
  percent: 30,
  fileName: 'recording.m4a',
};

describe('meetingScheduleSlice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, {type: 'unknown'})).toEqual(initialState);
  });

  //---------------------------------------
  it('setRecordingUploadProgress sets progress', () => {
    const state = reducer(initialState, setRecordingUploadProgress(mockProgress));
    expect(state.recordingUploadProgress).toEqual(mockProgress);
  });

  //---------------------------------------
  it('updateRecordingUploadProgress updates partial fields', () => {
    const stateWithProgress = {recordingUploadProgress: mockProgress};
    const state = reducer(
      stateWithProgress,
      updateRecordingUploadProgress({percent: 80, status: 'uploading'}),
    );
    expect(state.recordingUploadProgress?.percent).toBe(80);
    expect(state.recordingUploadProgress?.fileName).toBe('recording.m4a');
  });

  //---------------------------------------
  it('updateRecordingUploadProgress does nothing when null', () => {
    const state = reducer(
      initialState,
      updateRecordingUploadProgress({percent: 80}),
    );
    expect(state.recordingUploadProgress).toBeNull();
  });

  //---------------------------------------
  it('clearRecordingUploadProgress resets to null', () => {
    const stateWithProgress = {recordingUploadProgress: mockProgress};
    const state = reducer(stateWithProgress, clearRecordingUploadProgress());
    expect(state.recordingUploadProgress).toBeNull();
  });
});
