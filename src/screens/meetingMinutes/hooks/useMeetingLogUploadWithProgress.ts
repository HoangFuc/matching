import React from 'react';

import { createUploadProgressHook } from '@/src/hooks/useUploadWithProgress';
import { prepareUploadData, fetchUpload } from '@/src/services/uploadService';
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
    updateProgressState,
    listenProgress,
    setUploadTask,
    handleUploadError,
    cancelUpload,
    dismiss,
  } = useMeetingLogProgress();

  //---------------------------------------
  const [createMeetingLog] = useCreateMeetingLogMutation();

  //---------------------------------------
  const uploadFileToServer = React.useCallback(
    (uploadId: string, file: { uri: string; name: string; type: string }) => {
      const doUpload = async () => {
        const token = await getToken();
        const uploadData = await prepareUploadData(file, 'base64');
        const task = fetchUpload(
          `meeting-logs/uploads/${uploadId}`,
          uploadData,
          token,
        );

        setUploadTask(task);

        task
          .then(() => {
            setUploadTask(null);
          })
          .catch((uploadErr: unknown) => {
            console.error('[MeetingLog Upload] File upload error:', uploadErr);
            handleUploadError(
              uploadErr instanceof Error ? uploadErr.message : 'Upload failed',
            );
          });
      };

      doUpload();
    },
    [setUploadTask, handleUploadError],
  );

  //---------------------------------------
  const uploadRecordingToExisting = React.useCallback(
    async (
      meetingLogId: string,
      file: { uri: string; name: string; type: string },
    ) => {
      try {
        initProgress(file.name);

        // Phase 1: POST /meeting-logs/:id/recordings → returns uploadId
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

        // Save uploadId to Redux
        updateProgressState({ uploadId });

        // Phase 2: listen for progress BEFORE starting upload
        listenProgress(uploadId);

        // Phase 3: upload file
        uploadFileToServer(uploadId, file);
      } catch (err) {
        console.error('[MeetingLog Upload] Error:', err);
        handleUploadError(err instanceof Error ? err.message : 'Upload failed');
        throw err;
      }
    },
    [
      initProgress,
      updateProgressState,
      listenProgress,
      uploadFileToServer,
      handleUploadError,
    ],
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

        // Phase 1: POST /meeting-logs with form data → returns uploadId
        const result = await createMeetingLog(formData).unwrap();

        console.log('======================result', result);

        const uploadId = result?.uploadId;

        if (!uploadId) {
          throw new Error('No uploadId returned from server');
        }

        // Save uploadId to Redux
        updateProgressState({ uploadId });

        // Phase 2: listen for progress BEFORE starting upload
        listenProgress(uploadId);

        // Phase 3: upload file
        uploadFileToServer(uploadId, file);

        return result;
      } catch (err) {
        console.error('[MeetingLog Upload] Error:', err);
        handleUploadError(err instanceof Error ? err.message : 'Upload failed');
        throw err;
      }
    },
    [
      initProgress,
      createMeetingLog,
      updateProgressState,
      listenProgress,
      uploadFileToServer,
      handleUploadError,
    ],
  );

  //---------------------------------------
  const uploadFileWithUploadId = React.useCallback(
    (uploadId: string, file: { uri: string; name: string; type: string }) => {
      initProgress(file.name);
      updateProgressState({ uploadId });
      listenProgress(uploadId);
      uploadFileToServer(uploadId, file);
    },
    [initProgress, updateProgressState, listenProgress, uploadFileToServer],
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
