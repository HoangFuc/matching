import React from 'react';

import ReactNativeBlobUtil from 'react-native-blob-util';

import {
  createUploadProgressHook,
  type IUploadProgress,
} from '@/src/hooks/useUploadWithProgress';
import {
  dataRoomApi,
  useInitUploadMutation,
} from '@/src/store/api/dataRoom.api';
import {
  clearUploadProgress,
  setUploadProgress,
  updateUploadProgress,
} from '@/src/store/slices/dataRoomSlice';
import { API_BASE_URL, TOKEN } from '@env';
import type { TDataRoomTabType } from '../constants';

export type { IUploadProgress };

const useDataRoomUploadProgress = createUploadProgressHook({
  progressSelector: state => state.dataRoom.uploadProgress,
  setProgress: setUploadProgress,
  updateProgress: updateUploadProgress,
  clearProgress: clearUploadProgress,
  basePath: 'data-room/uploads',
  onCompleted: dispatch => {
    dispatch(dataRoomApi.util.invalidateTags(['Folders', 'Files']));
    setTimeout(() => {
      dispatch(clearUploadProgress());
    }, 1500);
  },
});

export const useFileUploadWithProgress = () => {
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
  } = useDataRoomUploadProgress();

  //---------------------------------------
  const [initUpload] = useInitUploadMutation();

  //---------------------------------------
  const uploadInFolder = React.useCallback(
    async (
      folderId: string,
      files: { uri: string; name: string; type: string }[],
    ) => {
      try {
        initProgress(files[0]?.name ?? '');

        // Phase 1: init upload with folderId
        const { uploadId } = await initUpload({ folderId }).unwrap();

        // Save uploadId to Redux immediately
        updateProgressState({ uploadId });

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

        const task = ReactNativeBlobUtil.fetch(
          'POST',
          `${API_BASE_URL}/data-room/uploads/${uploadId}`,
          {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'multipart/form-data',
          },
          uploadData,
        );

        setUploadTask(task);
        await task;
        setUploadTask(null);
      } catch (err) {
        handleUploadError();
        throw err;
      }
    },
    [initProgress, initUpload, updateProgressState, listenProgress, setUploadTask, handleUploadError],
  );

  //---------------------------------------
  const upload = React.useCallback(
    async (
      files: { uri: string; name: string; type: string }[],
      dataRoomType: TDataRoomTabType,
    ) => {
      try {
        initProgress(files[0]?.name ?? '');

        // Phase 1: init upload with type
        const { uploadId } = await initUpload({ type: dataRoomType }).unwrap();

        // Save uploadId to Redux immediately
        updateProgressState({ uploadId });

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

        const task = ReactNativeBlobUtil.fetch(
          'POST',
          `${API_BASE_URL}/data-room/uploads/${uploadId}`,
          {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'multipart/form-data',
          },
          uploadData,
        );

        setUploadTask(task);
        await task;
        setUploadTask(null);
      } catch (err) {
        handleUploadError();
        throw err;
      }
    },
    [initProgress, initUpload, updateProgressState, listenProgress, setUploadTask, handleUploadError],
  );

  //---------------------------------------
  return {
    progress,
    uploadInFolder,
    upload,
    cancelUpload,
    dismiss,
  };
};
