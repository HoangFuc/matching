import React from 'react';

import ReactNativeBlobUtil from 'react-native-blob-util';
import EventSource from 'react-native-sse';

import type { AppDispatch, RootState } from '@/src/store/index';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { prepareUploadData, fetchUpload } from '@/src/services/uploadService';
import { API_BASE_URL } from '@env';
import { getToken } from '@/src/services/tokenService';
import type {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
} from '@reduxjs/toolkit';

export interface IUploadProgress {
  uploadId: string;
  status: 'uploading' | 'completed' | 'error' | 'cancelled';
  percent: number;
  fileName: string;
  error?: string;
}

interface UploadProgressConfig {
  /** Redux selector for progress state */
  progressSelector: (state: RootState) => IUploadProgress | null;
  /** Action to set full progress state */
  setProgress: ActionCreatorWithPayload<IUploadProgress>;
  /** Action to partially update progress state */
  updateProgress: ActionCreatorWithPayload<Partial<IUploadProgress>>;
  /** Action to clear progress state */
  clearProgress: ActionCreatorWithoutPayload;
  /** Base path for SSE and cancel endpoints (e.g., 'data-room/uploads') */
  basePath: string;
  /** Encoding mode for file upload ('base64' or 'stream') */
  encoding?: 'base64' | 'stream';
  /** Called when upload completes successfully */
  onCompleted?: (dispatch: AppDispatch) => void;
}

const THROTTLE_MS = 300;

export function createUploadProgressHook(config: UploadProgressConfig) {
  // Module-level refs scoped per factory call (isolated between features)
  let sharedEventSource: InstanceType<typeof EventSource> | null = null;
  let sharedUploadTask: ReturnType<typeof ReactNativeBlobUtil.fetch> | null =
    null;
  let isCancelling = false;
  let lastDispatchTime = 0;

  return function useUploadProgress() {
    const dispatch = useAppDispatch();
    const progress = useAppSelector(config.progressSelector);

    //---------------------------------------
    const closeEventSource = React.useCallback(() => {
      if (sharedEventSource) {
        sharedEventSource.close();
        sharedEventSource = null;
      }
    }, []);

    //---------------------------------------
    const listenProgress = React.useCallback(
      async (uploadId: string) => {
        closeEventSource();

        const url = `${API_BASE_URL}/${config.basePath}/${uploadId}/progress`;
        const token = await getToken();

        const es = new EventSource<'message' | 'progress'>(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        sharedEventSource = es;

        const handleEventData = (eventData: string | null) => {
          if (!eventData || !sharedEventSource) {
            return;
          }

          try {
            let parsed = JSON.parse(eventData);
            // Handle double-stringified data
            if (typeof parsed === 'string') {
              parsed = JSON.parse(parsed);
            }
            const dataProcess = parsed.data ?? parsed;

            const isFinished =
              dataProcess.status === 'completed' ||
              dataProcess.status === 'error';

            const now = Date.now();
            if (!isFinished && now - lastDispatchTime < THROTTLE_MS) {
              return;
            }
            lastDispatchTime = now;

            dispatch(
              config.setProgress({
                uploadId: dataProcess.uploadId ?? uploadId,
                status: dataProcess.status,
                percent: dataProcess.percent ?? 0,
                fileName: dataProcess.fileName ?? '',
                error: dataProcess.error,
              }),
            );

            if (isFinished) {
              es.close();
              sharedEventSource = null;

              if (dataProcess.status === 'completed') {
                config.onCompleted?.(dispatch);
              }
            }
          } catch (e) {
            console.error(
              '[SSE] Failed to parse event data:',
              e,
              'raw:',
              eventData,
            );
          }
        };

        // Wait for SSE connection before resolving
        await new Promise<void>((resolve) => {
          const timeout = setTimeout(() => {
            console.warn('[SSE] Connection timeout, proceeding with upload');
            resolve();
          }, 5000);

          es.addEventListener('open', () => {
            clearTimeout(timeout);
            console.log('[SSE] Connected to progress stream:', uploadId);
            resolve();
          });

          es.addEventListener('error', event => {
            clearTimeout(timeout);
            console.error('[SSE] Error:', event);
            dispatch(
              config.updateProgress({
                status: 'error',
                error: 'Connection lost',
              }),
            );
            es.close();
            sharedEventSource = null;
            resolve();
          });
        });

        es.addEventListener('message', event => {
          handleEventData(event.data);
        });
        es.addEventListener('progress', event => {
          handleEventData(event.data);
        });
      },
      [closeEventSource, dispatch],
    );

    //---------------------------------------
    const initProgress = React.useCallback(
      (fileName: string) => {
        isCancelling = false;
        dispatch(
          config.setProgress({
            uploadId: '',
            status: 'uploading',
            percent: 0,
            fileName,
          }),
        );
      },
      [dispatch],
    );

    //---------------------------------------
    const updateProgressState = React.useCallback(
      (payload: Partial<IUploadProgress>) => {
        dispatch(config.updateProgress(payload));
      },
      [dispatch],
    );

    //---------------------------------------
    const setUploadTask = React.useCallback(
      (task: ReturnType<typeof ReactNativeBlobUtil.fetch> | null) => {
        sharedUploadTask = task;
      },
      [],
    );

    //---------------------------------------
    const handleUploadError = React.useCallback(
      (error?: string) => {
        sharedUploadTask = null;
        if (!isCancelling) {
          dispatch(
            config.updateProgress({
              status: 'error',
              error: error ?? 'Upload failed',
            }),
          );
        }
      },
      [dispatch],
    );

    //---------------------------------------
    const cancelUpload = React.useCallback(async () => {
      if (isCancelling) {
        return;
      }
      isCancelling = true;

      const uploadId = progress?.uploadId;

      // 1. Close SSE connection
      closeEventSource();

      // 2. Abort the client-side upload
      if (sharedUploadTask) {
        sharedUploadTask.cancel();
        sharedUploadTask = null;
      }

      // 3. Cancel on server
      if (uploadId) {
        try {
          const token = await getToken();
          await fetch(`${API_BASE_URL}/${config.basePath}/${uploadId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (e) {
          console.warn('[Cancel] Server cancel failed:', e);
        }
      }

      // 4. Notify cancelled → clear Redux state
      dispatch(
        config.setProgress({
          uploadId: uploadId ?? '',
          status: 'cancelled',
          percent: 0,
          fileName: progress?.fileName ?? '',
        }),
      );
      dispatch(config.clearProgress());
    }, [progress?.uploadId, progress?.fileName, closeEventSource, dispatch]);

    //---------------------------------------
    const dismiss = React.useCallback(() => {
      closeEventSource();
      dispatch(config.clearProgress());
    }, [closeEventSource, dispatch]);

    //---------------------------------------
    const performUpload = React.useCallback(
      async (
        uploadId: string,
        file: { uri: string; name: string; type: string },
        extraFields?: Record<string, string>,
      ) => {
        updateProgressState({ uploadId });
        await listenProgress(uploadId);

        const token = await getToken();
        const encoding = config.encoding ?? 'stream';
        const uploadData = await prepareUploadData(file, encoding, extraFields);
        const task = fetchUpload(
          `${config.basePath}/${uploadId}`,
          uploadData,
          token,
        );

        setUploadTask(task);

        try {
          await task;
          setUploadTask(null);
        } catch (uploadErr) {
          console.error(`[Upload] File upload error:`, uploadErr);
          handleUploadError(
            uploadErr instanceof Error ? uploadErr.message : 'Upload failed',
          );
          throw uploadErr;
        }
      },
      [
        updateProgressState,
        listenProgress,
        setUploadTask,
        handleUploadError,
      ],
    );

    return {
      progress,
      initProgress,
      updateProgressState,
      listenProgress,
      setUploadTask,
      handleUploadError,
      cancelUpload,
      dismiss,
      performUpload,
    };
  };
}
