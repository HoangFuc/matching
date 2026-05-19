import React from 'react';

import { createUploadProgressHook } from '@/src/hooks/useUploadWithProgress';
import { TMeetingTypeKey } from '@/src/interface/meetingMinutes.interface';
import { parseEncFileHeaders } from '@/src/services/encryptionService';
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
import { API_BASE_URL } from '@env';

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
      durationSeconds?: number,
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
        const uploadId = result?.data?.uploadId;

        if (!uploadId) {
          throw new Error('No uploadId returned from server');
        }

        const isEncrypted =
          /\.enc$/i.test(file.name) || /\.enc$/i.test(file.uri);

        const extraFields: Record<string, string> = {
          ...(durationSeconds != null
            ? { duration: String(durationSeconds) }
            : {}),
        };

        if (isEncrypted) {
          const { iv, authTag } = await parseEncFileHeaders(file.uri);
          extraFields.encryptionIv = iv;
          extraFields.encryptionTag = authTag;
          extraFields.encryptionAlgo = 'aes-256-gcm';
        }

        await performUpload(uploadId, file, extraFields);
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
      file?: { uri: string; name: string; type: string },
      durationSeconds?: number,
    ) => {
      try {
        if (file) {
          initProgress(file.name);
        }

        const result = await createMeetingLog(formData).unwrap();

        if (file) {
          const uploadId = result?.uploadId;

          if (!uploadId) {
            throw new Error('No uploadId returned from server');
          }

          const extraFields =
            durationSeconds != null
              ? { duration: String(durationSeconds) }
              : undefined;

          await performUpload(uploadId, file, extraFields);
        }

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
    (
      uploadId: string,
      file: { uri: string; name: string; type: string },
      durationSeconds?: number,
    ) => {
      const extraFields =
        durationSeconds != null
          ? { duration: String(durationSeconds) }
          : undefined;
      initProgress(file.name);
      performUpload(uploadId, file, extraFields).catch(() => {});
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
