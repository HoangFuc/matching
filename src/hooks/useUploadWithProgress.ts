import React from 'react';

import ReactNativeBlobUtil from 'react-native-blob-util';
import EventSource from 'react-native-sse';

import type { AppDispatch, RootState } from '@/src/store/index';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { API_BASE_URL, TOKEN } from '@env';
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
      (uploadId: string) => {
        closeEventSource();

        const url = `${API_BASE_URL}/${config.basePath}/${uploadId}/progress`;

        const es = new EventSource<'message' | 'progress'>(url, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });

        console.log('======================es', es);

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

        es.addEventListener('open', () => {
          console.log('[SSE] Connected to progress stream:', uploadId);
        });

        es.addEventListener('message', event => {
          handleEventData(event.data);
        });
        es.addEventListener('progress', event => {
          handleEventData(event.data);
        });

        es.addEventListener('error', event => {
          console.error('[SSE] Error:', event);
          dispatch(
            config.updateProgress({
              status: 'error',
              error: 'Connection lost',
            }),
          );
          es.close();
          sharedEventSource = null;
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
          await fetch(`${API_BASE_URL}/${config.basePath}/${uploadId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${TOKEN}` },
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

    return {
      progress,
      initProgress,
      updateProgressState,
      listenProgress,
      setUploadTask,
      handleUploadError,
      cancelUpload,
      dismiss,
    };
  };
}
