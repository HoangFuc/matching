import React from 'react';

import { createUploadProgressHook } from '@/src/hooks/useUploadWithProgress';
import { API_BASE_URL } from '@env';
import { getToken } from '@/src/services/tokenService';
import {
  meetingLogApi,
  useCreateMeetingLogMutation,
} from '@/src/store/api/meetingLog.api';
import {
  clearMeetingLogUploadProgress,
  setMeetingLogUploadProgress,
  updateMeetingLogUploadProgress,
} from '@/src/store/slices/meetingMinutesSlice';
import { TMeetingTypeKey } from '@/src/interface/meetingMinutes.interface';

const useMeetingLogProgress = createUploadProgressHook({
  progressSelector: state => state.meetingMinutes.meetingLogUploadProgress,
  setProgress: setMeetingLogUploadProgress,
  updateProgress: updateMeetingLogUploadProgress,
  clearProgress: clearMeetingLogUploadProgress,
  basePath: 'meeting-logs/uploads',
  encoding: 'base64',
  onCompleted: dispatch => {
    dispatch(
      meetingLogApi.util.invalidateTags(['MeetingLogList', 'MeetingLogDetail']),
    );
  },
});

export const useMeetingLogUploadWithProgress = () => {
  //---------------------------------------
  const {
    progress,
    initProgress,
    performUpload,
    handleUploadError,
    cancelUpload,
    dismiss,
  } = useMeetingLogProgress();

  //---------------------------------------
  const [createMeetingLog] = useCreateMeetingLogMutation();

  //---------------------------------------
  const uploadRecordingToExisting = React.useCallback(
    async (
      meetingLogId: string,
      file: { uri: string; name: string; type: string },
    ) => {
      try {
        initProgress(file.name);

        const token = await getToken();
        const response = await fetch(
          `${API_BASE_URL}/meeting-logs/${meetingLogId}/recordings`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to create recording upload');
        }

        const result = await response.json();
        const uploadId = result?.data?.uploadId ?? result?.uploadId;

        if (!uploadId) {
          throw new Error('No uploadId returned from server');
        }

        await performUpload(uploadId, file);
      } catch (err) {
        console.error('[MeetingLog Upload] Error:', err);
        handleUploadError(err instanceof Error ? err.message : 'Upload failed');
        throw err;
      }
    },
    [initProgress, performUpload, handleUploadError],
  );

  //---------------------------------------
  const uploadMeetingLog = React.useCallback(
    async (
      formData: {
        meetingType: TMeetingTypeKey;
        meetingDate: string;
        customerName: string;
        customerPhone: string;
        address: string;
        consultationContent: string;
      },
      file: { uri: string; name: string; type: string },
    ) => {
      try {
        initProgress(file.name);

        const result = await createMeetingLog(formData).unwrap();

        console.log('======================result', result);

        const uploadId = result?.uploadId;

        if (!uploadId) {
          throw new Error('No uploadId returned from server');
        }

        await performUpload(uploadId, file);

        return result;
      } catch (err) {
        console.error('[MeetingLog Upload] Error:', err);
        handleUploadError(err instanceof Error ? err.message : 'Upload failed');
        throw err;
      }
    },
    [initProgress, createMeetingLog, performUpload, handleUploadError],
  );

  //---------------------------------------
  const uploadFileWithUploadId = React.useCallback(
    (uploadId: string, file: { uri: string; name: string; type: string }) => {
      initProgress(file.name);
      performUpload(uploadId, file).catch(() => {});
    },
    [initProgress, performUpload],
  );

  //---------------------------------------
  return {
    progress,
    uploadMeetingLog,
    uploadRecordingToExisting,
    uploadFileWithUploadId,
    cancelUpload,
    dismiss,
  };
};
