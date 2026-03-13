import React from 'react';

import { createUploadProgressHook } from '@/src/hooks/useUploadWithProgress';
import {
  meetingScheduleManagementApi,
  useCreateMeetingLogMutation,
} from '@/src/store/api/meetingScheduleManagement.api';
import {
  clearRecordingUploadProgress,
  setRecordingUploadProgress,
  updateRecordingUploadProgress,
} from '@/src/store/slices/meetingScheduleSlice';

const useMeetingUploadProgress = createUploadProgressHook({
  progressSelector: state => state.meetingSchedule.recordingUploadProgress,
  setProgress: setRecordingUploadProgress,
  updateProgress: updateRecordingUploadProgress,
  clearProgress: clearRecordingUploadProgress,
  basePath: 'meeting-logs/uploads',
  encoding: 'base64',
  onCompleted: dispatch => {
    dispatch(
      meetingScheduleManagementApi.util.invalidateTags([
        'MeetingScheduleManagement',
      ]),
    );
  },
});

export const useRecordingUploadWithProgress = () => {
  //---------------------------------------
  const {
    progress,
    initProgress,
    performUpload,
    handleUploadError,
    cancelUpload,
    dismiss,
  } = useMeetingUploadProgress();

  //---------------------------------------
  const [createMeetingLog] = useCreateMeetingLogMutation();

  //---------------------------------------
  const uploadRecording = React.useCallback(
    async (
      scheduleId: string,
      file: { uri: string; name: string; type: string },
      memo: string,
      durationSeconds?: number,
    ) => {
      try {
        initProgress(file.name);

        const result = await createMeetingLog({
          scheduleId,
          content: memo,
        }).unwrap();

        const uploadId = result?.uploadId;

        if (!uploadId) {
          throw new Error('No uploadId returned from server');
        }

        const extraFields = durationSeconds != null
          ? { duration: String(durationSeconds) }
          : undefined;

        console.log('[Upload] uploadId:', uploadId);
        console.log('[Upload] file:', file);
        console.log('[Upload] durationSeconds:', durationSeconds);
        console.log('[Upload] extraFields:', extraFields);

        await performUpload(uploadId, file, extraFields);
      } catch (err) {
        console.error('[Upload] Error:', err);
        handleUploadError(err instanceof Error ? err.message : 'Upload failed');
        throw err;
      }
    },
    [initProgress, createMeetingLog, performUpload, handleUploadError],
  );

  //---------------------------------------
  return {
    progress,
    uploadRecording,
    cancelUpload,
    dismiss,
  };
};
