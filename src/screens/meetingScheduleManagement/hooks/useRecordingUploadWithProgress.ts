import React from 'react';

import { createUploadProgressHook } from '@/src/hooks/useUploadWithProgress';
import { prepareUploadData, fetchUpload } from '@/src/services/uploadService';
import { getToken } from '@/src/services/tokenService';
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
    updateProgressState,
    listenProgress,
    setUploadTask,
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
    ) => {
      try {
        initProgress(file.name);

        // Phase 1: POST meeting-log with memo content → returns uploadId
        const result = await createMeetingLog({
          scheduleId,
          content: memo,
        }).unwrap();

        const uploadId = result?.uploadId;

        if (!uploadId) {
          throw new Error('No uploadId returned from server');
        }

        // Save uploadId to Redux
        updateProgressState({ uploadId });

        // Phase 2: listen for progress BEFORE starting upload
        listenProgress(uploadId);

        // Phase 3: upload file as multipart
        const token = await getToken();
        const uploadData = await prepareUploadData(file, 'base64');
        const task = fetchUpload(
          `meeting-logs/uploads/${uploadId}`,
          uploadData,
          token,
        );

        setUploadTask(task);

        await task;
        setUploadTask(null);
      } catch (err) {
        console.error('[Upload] Error:', err);
        handleUploadError(err instanceof Error ? err.message : 'Upload failed');
        throw err;
      }
    },
    [
      initProgress,
      createMeetingLog,
      updateProgressState,
      listenProgress,
      setUploadTask,
      handleUploadError,
    ],
  );

  //---------------------------------------
  return {
    progress,
    uploadRecording,
    cancelUpload,
    dismiss,
  };
};
