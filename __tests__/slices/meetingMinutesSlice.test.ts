import reducer, {
  setMeetingLogUploadProgress,
  updateMeetingLogUploadProgress,
  clearMeetingLogUploadProgress,
  IMeetingLogUploadProgress,
} from '@/src/store/slices/meetingMinutesSlice';

const initialState = {
  meetingLogUploadProgress: null,
};

const mockProgress: IMeetingLogUploadProgress = {
  uploadId: 'log-upload-1',
  status: 'uploading',
  percent: 45,
  fileName: 'minutes.pdf',
};

describe('meetingMinutesSlice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, {type: 'unknown'})).toEqual(initialState);
  });

  //---------------------------------------
  it('setMeetingLogUploadProgress sets progress', () => {
    const state = reducer(initialState, setMeetingLogUploadProgress(mockProgress));
    expect(state.meetingLogUploadProgress).toEqual(mockProgress);
  });

  //---------------------------------------
  it('updateMeetingLogUploadProgress updates partial fields', () => {
    const stateWithProgress = {meetingLogUploadProgress: mockProgress};
    const state = reducer(
      stateWithProgress,
      updateMeetingLogUploadProgress({percent: 90, status: 'completed'}),
    );
    expect(state.meetingLogUploadProgress?.percent).toBe(90);
    expect(state.meetingLogUploadProgress?.status).toBe('completed');
    expect(state.meetingLogUploadProgress?.fileName).toBe('minutes.pdf');
  });

  //---------------------------------------
  it('updateMeetingLogUploadProgress does nothing when null', () => {
    const state = reducer(
      initialState,
      updateMeetingLogUploadProgress({percent: 90}),
    );
    expect(state.meetingLogUploadProgress).toBeNull();
  });

  //---------------------------------------
  it('clearMeetingLogUploadProgress resets to null', () => {
    const stateWithProgress = {meetingLogUploadProgress: mockProgress};
    const state = reducer(stateWithProgress, clearMeetingLogUploadProgress());
    expect(state.meetingLogUploadProgress).toBeNull();
  });
});
