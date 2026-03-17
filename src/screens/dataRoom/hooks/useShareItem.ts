import React from 'react';
import { Alert, Platform } from 'react-native';

import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';

import { IFile } from '@/src/store/api/dataRoom.api';

interface UseShareItemOptions {
  onShareSuccess?: () => void;
}

export function useShareItem(options?: UseShareItemOptions) {
  const [sharing, setSharing] = React.useState(false);

  //---------------------------------------
  const shareFile = React.useCallback(async (file: IFile) => {
    if (sharing) return;
    setSharing(true);

    try {
      const filePath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${file.originalName}`;

      const res = await ReactNativeBlobUtil.config({
        fileCache: true,
        path: filePath,
      }).fetch('GET', file.downloadUrl);

      const path =
        Platform.OS === 'android'
          ? `file://${res.path()}`
          : res.path();

      const result = await Share.open({
        url: path,
        type: file.mimeType || 'application/octet-stream',
        filename: file.originalName,
      });

      // Share completed successfully - user shared and returned to app
      if (result?.success) {
        options?.onShareSuccess?.();
      }

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
  }, [sharing, options]);

  //---------------------------------------
  const shareFolder = React.useCallback(async (folderName: string) => {
    try {
      const result = await Share.open({
        message: `폴더: ${folderName}`,
      });

      if (result?.success) {
        options?.onShareSuccess?.();
      }
    } catch (err: any) {
      if (err?.message?.includes?.('User did not share')) return;
      if (err?.code === 'ECANCELLED') return;
    }
  }, [options]);

  return { shareFile, shareFolder, sharing };
}
