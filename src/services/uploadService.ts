import ReactNativeBlobUtil from 'react-native-blob-util';

import { API_BASE_URL } from '@env';
import { getToken } from '@/src/services/tokenService';

type UploadFileInfo = {
  uri: string;
  name: string;
  type: string;
};

type UploadMode = 'base64' | 'stream';

//---------------------------------------
export const prepareUploadData = async (
  file: UploadFileInfo,
  mode: UploadMode,
) => {
  const cleanPath = file.uri.replace('file://', '');

  if (mode === 'base64') {
    const base64Data = await ReactNativeBlobUtil.fs.readFile(
      cleanPath,
      'base64',
    );
    return [
      {
        name: 'file',
        filename: file.name || 'file',
        type: file.type || 'application/octet-stream',
        data: base64Data,
      },
    ];
  }

  return [
    {
      name: 'file',
      filename: file.name || 'file',
      type: file.type || 'application/octet-stream',
      data: ReactNativeBlobUtil.wrap(cleanPath),
    },
  ];
};

//---------------------------------------
/**
 * Upload multipart data to the server. Returns a cancellable StatefulPromise.
 *
 * @param path - API path (e.g. 'meeting-logs/uploads/abc123')
 * @param uploadData - Prepared multipart data from prepareUploadData()
 */
export const fetchUpload = (
  path: string,
  uploadData: { name: string; filename: string; type: string; data: string }[],
  token: string,
) => {
  return ReactNativeBlobUtil.fetch(
    'POST',
    `${API_BASE_URL}/${path}`,
    {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    uploadData,
  );
};

//---------------------------------------
/**
 * Convenience: prepare data + upload in one call.
 * Returns the cancellable StatefulPromise task.
 */
export const uploadFile = async (
  path: string,
  file: UploadFileInfo,
  mode: UploadMode = 'stream',
) => {
  const token = await getToken();
  const uploadData = await prepareUploadData(file, mode);
  return fetchUpload(path, uploadData, token);
};
