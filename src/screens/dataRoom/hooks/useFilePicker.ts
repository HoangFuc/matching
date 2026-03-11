import React from 'react';

import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';

import { useFileUploadWithProgress } from './useFileUploadWithProgress';

export function useFilePicker(folderId: string) {
  const { uploadInFolder } = useFileUploadWithProgress();

  //---------------------------------------
  const pickAndUpload = React.useCallback(async () => {
    try {
      const result = await pick({
        type: [types.allFiles],
        allowMultiSelection: true,
      });

      const pickedFiles = result.map(file => ({
        uri: file.uri,
        name: file.name ?? 'file',
        type: file.type ?? 'application/octet-stream',
      }));

      await uploadInFolder(folderId, pickedFiles);
    } catch (err) {
      if (isErrorWithCode(err) && err.code !== errorCodes.OPERATION_CANCELED) {
        console.error('Upload error:', err);
      }
    }
  }, [folderId, uploadInFolder]);

  return { pickAndUpload };
}
