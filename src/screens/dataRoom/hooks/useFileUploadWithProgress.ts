import React from 'react';

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
import type { TDataRoomTabType } from '../constants';

export type { IUploadProgress };

const useDataRoomUploadProgress = createUploadProgressHook({
  progressSelector: state => state.dataRoom.uploadProgress,
  setProgress: setUploadProgress,
  updateProgress: updateUploadProgress,
  clearProgress: clearUploadProgress,
  basePath: 'data-room/uploads',
  encoding: 'stream',
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
    performUpload,
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
        const { uploadId } = await initUpload({ folderId }).unwrap();
        await performUpload(uploadId, files[0]);
      } catch (err) {
        handleUploadError();
        throw err;
      }
    },
    [initProgress, initUpload, performUpload, handleUploadError],
  );

  //---------------------------------------
  const upload = React.useCallback(
    async (
      files: { uri: string; name: string; type: string }[],
      dataRoomType: TDataRoomTabType,
    ) => {
      try {
        initProgress(files[0]?.name ?? '');
        const { uploadId } = await initUpload({ type: dataRoomType }).unwrap();
        await performUpload(uploadId, files[0]);
      } catch (err) {
        handleUploadError();
        throw err;
      }
    },
    [initProgress, initUpload, performUpload, handleUploadError],
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
