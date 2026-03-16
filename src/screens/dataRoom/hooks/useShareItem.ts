import React from 'react';
import { Alert, Platform } from 'react-native';

import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';

import { IFile } from '@/src/store/api/dataRoom.api';

export function useShareItem() {
  const [sharing, setSharing] = React.useState(false);

  //---------------------------------------
  const shareFile = React.useCallback(async (file: IFile) => {
    if (sharing) return;
    setSharing(true);

    try {
      const ext = file.originalName.split('.').pop() || '';
      const filePath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${file.originalName}`;

      const res = await ReactNativeBlobUtil.config({
        fileCache: true,
        path: filePath,
      }).fetch('GET', file.downloadUrl);

      const path =
        Platform.OS === 'android'
          ? `file://${res.path()}`
          : res.path();

      await Share.open({
        url: path,
        type: file.mimeType || 'application/octet-stream',
        filename: file.originalName,
      });

      // Clean up cache
      ReactNativeBlobUtil.fs.unlink(res.path()).catch(() => {});
    } catch (err: any) {
      // User cancelled share dialog
      if (err?.message?.includes?.('User did not share')) return;
      if (err?.code === 'ECANCELLED') return;

      Alert.alert('오류', '파일을 공유할 수 없습니다.');
    } finally {
      setSharing(false);
    }
  }, [sharing]);

  //---------------------------------------
  const shareFolder = React.useCallback(async (folderName: string) => {
    try {
      await Share.open({
        message: `폴더: ${folderName}`,
      });
    } catch (err: any) {
      if (err?.message?.includes?.('User did not share')) return;
      if (err?.code === 'ECANCELLED') return;
    }
  }, []);

  return { shareFile, shareFolder, sharing };
}
