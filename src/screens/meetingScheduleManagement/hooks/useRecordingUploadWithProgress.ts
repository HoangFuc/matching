import React from 'react';

import ReactNativeBlobUtil from 'react-native-blob-util';

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
import { API_BASE_URL, TOKEN } from '@env';

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
        const cleanPath = file.uri.replace('file://', '');
        const base64Data = await ReactNativeBlobUtil.fs.readFile(
          cleanPath,
          'base64',
        );

        const uploadData = [
          {
            name: 'file',
            filename: file.name || 'recording',
            type: file.type || 'audio/m4a',
            data: base64Data,
          },
        ];

        const task = ReactNativeBlobUtil.fetch(
          'POST',
          `${API_BASE_URL}/meeting-logs/uploads/${uploadId}`,
          {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'multipart/form-data',
          },
          uploadData,
        );

        console.log('======================task', task);

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
