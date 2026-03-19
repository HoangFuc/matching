import ReactNativeBlobUtil from 'react-native-blob-util';

import { API_BASE_URL } from '@env';
import { getCommonHeaders } from './apiHeaderService';

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
  extraFields?: Record<string, string>,
) => {
  const cleanPath = file.uri.replace('file://', '');

  const parts: { name: string; filename?: string; type?: string; data: string }[] = [];

  if (mode === 'base64') {
    const base64Data = await ReactNativeBlobUtil.fs.readFile(
      cleanPath,
      'base64',
    );
    parts.push({
      name: 'file',
      filename: file.name || 'file',
      type: file.type || 'application/octet-stream',
      data: base64Data,
    });
  } else {
    parts.push({
      name: 'file',
      filename: file.name || 'file',
      type: file.type || 'application/octet-stream',
      data: ReactNativeBlobUtil.wrap(cleanPath),
    });
  }

  if (extraFields) {
    for (const [key, value] of Object.entries(extraFields)) {
      parts.push({ name: key, data: value });
    }
  }

  return parts;
};

//---------------------------------------
/**
 * Upload multipart data to the server. Returns a cancellable StatefulPromise.
 *
 * @param path - API path (e.g. 'meeting-logs/uploads/abc123')
 * @param uploadData - Prepared multipart data from prepareUploadData()
 */
export const fetchUpload = async (
  path: string,
  uploadData: { name: string; filename?: string; type?: string; data: string }[],
  _token?: string,
) => {
  const commonHeaders = await getCommonHeaders();
  return ReactNativeBlobUtil.fetch(
    'POST',
    `${API_BASE_URL}/${path}`,
    {
      ...commonHeaders,
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
  const uploadData = await prepareUploadData(file, mode);
  return fetchUpload(path, uploadData);
};
