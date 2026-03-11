import React from 'react';

import ReactNativeBlobUtil from 'react-native-blob-util';
import EventSource from 'react-native-sse';

import {
  dataRoomApi,
  useCancelUploadMutation,
  useInitUploadMutation,
} from '@/src/store/api/dataRoom.api';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  clearUploadProgress,
  setUploadProgress,
  updateUploadProgress,
} from '@/src/store/slices/dataRoomSlice';
import { API_BASE_URL, TOKEN } from '@env';
import type { TDataRoomTabType } from '../constants';

export type { IUploadProgress } from '@/src/store/slices/dataRoomSlice';

// Module-level refs so all hook instances share the same references
let sharedEventSource: InstanceType<typeof EventSource> | null = null;
let sharedUploadTask: ReturnType<typeof ReactNativeBlobUtil.fetch> | null =
  null;
let isCancelling = false;
let lastDispatchTime = 0;
const THROTTLE_MS = 300;

export const useFileUploadWithProgress = () => {
  //---------------------------------------
  const dispatch = useAppDispatch();
  const progress = useAppSelector(state => state.dataRoom.uploadProgress);

  //---------------------------------------
  const [initUpload] = useInitUploadMutation();
  const [cancelUploadApi] = useCancelUploadMutation();

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

      const url = `${API_BASE_URL}/data-room/uploads/${uploadId}/progress`;

      const es = new EventSource<'message' | 'progress'>(url, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      sharedEventSource = es;

      const handleEventData = (eventData: string | null) => {
        if (!eventData) {
          return;
        }
        if (!sharedEventSource) {
          return;
        }

        try {
          const parsed = JSON.parse(eventData);
          // Handle both wrapped { data: {...} } and flat { status, percent, ... }
          const dataProcess = parsed.data ?? parsed;

          const isFinished =
            dataProcess.status === 'completed' ||
            dataProcess.status === 'error';

          // Throttle intermediate progress updates to keep JS thread responsive
          const now = Date.now();
          if (!isFinished && now - lastDispatchTime < THROTTLE_MS) {
            return;
          }
          lastDispatchTime = now;

          dispatch(
            setUploadProgress({
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
              dispatch(dataRoomApi.util.invalidateTags(['Folders', 'Files']));
              setTimeout(() => {
                dispatch(clearUploadProgress());
              }, 1500);
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
        console.log('[SSE] message event:', event.data);
        handleEventData(event.data);
      });
      es.addEventListener('progress', event => {
        console.log('[SSE] progress event:', event.data);
        handleEventData(event.data);
      });

      es.addEventListener('error', event => {
        console.error('[SSE] Error:', event);
        dispatch(
          updateUploadProgress({ status: 'error', error: 'Connection lost' }),
        );
        es.close();
        sharedEventSource = null;
      });
    },
    [closeEventSource, dispatch],
  );

  //---------------------------------------
  const uploadInFolder = React.useCallback(
    async (
      folderId: string,
      files: { uri: string; name: string; type: string }[],
    ) => {
      try {
        isCancelling = false;

        dispatch(
          setUploadProgress({
            uploadId: '',
            status: 'uploading',
            percent: 0,
            fileName: files[0]?.name ?? '',
          }),
        );

        // Phase 1: init upload with folderId
        const { uploadId } = await initUpload({ folderId }).unwrap();

        // Save uploadId to Redux immediately
        dispatch(updateUploadProgress({ uploadId }));

        // Phase 2: listen for progress BEFORE starting upload
        listenProgress(uploadId);

        // Phase 3: stream file to server
        const file = files[0];
        const uploadData = [
          {
            name: 'file',
            filename: file.name || 'file',
            type: file.type || 'application/octet-stream',
            data: ReactNativeBlobUtil.wrap(file.uri.replace('file://', '')),
          },
        ];

        sharedUploadTask = ReactNativeBlobUtil.fetch(
          'POST',
          `${API_BASE_URL}/data-room/uploads/${uploadId}`,
          {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'multipart/form-data',
          },
          uploadData,
        );

        await sharedUploadTask;
        sharedUploadTask = null;
      } catch (err) {
        sharedUploadTask = null;
        if (!isCancelling) {
          dispatch(
            updateUploadProgress({ status: 'error', error: 'Upload failed' }),
          );
        }
        throw err;
      }
    },
    [dispatch, initUpload, listenProgress],
  );

  //---------------------------------------
  const upload = React.useCallback(
    async (
      files: { uri: string; name: string; type: string }[],
      dataRoomType: TDataRoomTabType,
    ) => {
      try {
        isCancelling = false;

        dispatch(
          setUploadProgress({
            uploadId: '',
            status: 'uploading',
            percent: 0,
            fileName: files[0]?.name ?? '',
          }),
        );

        // Phase 1: init upload with type
        const { uploadId } = await initUpload({ type: dataRoomType }).unwrap();

        // Save uploadId to Redux immediately
        dispatch(updateUploadProgress({ uploadId }));

        // Phase 2: listen for progress BEFORE starting upload
        listenProgress(uploadId);

        // Phase 3: stream file to server
        const file = files[0];
        const uploadData = [
          {
            name: 'file',
            filename: file.name || 'file',
            type: file.type || 'application/octet-stream',
            data: ReactNativeBlobUtil.wrap(file.uri.replace('file://', '')),
          },
        ];

        sharedUploadTask = ReactNativeBlobUtil.fetch(
          'POST',
          `${API_BASE_URL}/data-room/uploads/${uploadId}`,
          {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'multipart/form-data',
          },
          uploadData,
        );

        await sharedUploadTask;
        sharedUploadTask = null;
      } catch (err) {
        sharedUploadTask = null;
        if (!isCancelling) {
          dispatch(
            updateUploadProgress({ status: 'error', error: 'Upload failed' }),
          );
        }
        throw err;
      }
    },
    [dispatch, initUpload, listenProgress],
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
        await cancelUploadApi(uploadId).unwrap();
      } catch (e) {
        console.warn('[Cancel] Server cancel failed:', e);
      }
    }

    // 4. Notify cancelled → clear Redux state
    dispatch(
      setUploadProgress({
        uploadId: uploadId ?? '',
        status: 'cancelled',
        percent: 0,
        fileName: progress?.fileName ?? '',
      }),
    );
    dispatch(clearUploadProgress());
  }, [
    progress?.uploadId,
    progress?.fileName,
    closeEventSource,
    dispatch,
    cancelUploadApi,
  ]);

  //---------------------------------------
  const dismiss = React.useCallback(() => {
    closeEventSource();
    dispatch(clearUploadProgress());
  }, [closeEventSource, dispatch]);

  return {
    progress,
    uploadInFolder,
    upload,
    cancelUpload,
    dismiss,
  };
};
