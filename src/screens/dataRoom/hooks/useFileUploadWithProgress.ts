import { useCallback, useRef, useState } from 'react';

import { API_BASE_URL, TOKEN } from '@env';
import EventSource from 'react-native-sse';

import {
  useUploadFileInFolderMutation,
  useUploadFileMutation,
} from '@/src/store/api/dataRoom.api';

export interface IUploadProgress {
  uploadId: string;
  status: 'uploading' | 'completed' | 'error';
  percent: number;
  fileName: string;
  error?: string;
}

export const useFileUploadWithProgress = () => {
  const [uploadFileInFolder] = useUploadFileInFolderMutation();
  const [uploadFile] = useUploadFileMutation();

  const [progress, setProgress] = useState<IUploadProgress | null>(null);
  const eventSourceRef = useRef<InstanceType<typeof EventSource> | null>(null);

  //---------------------------------------
  const closeEventSource = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  //---------------------------------------
  const listenProgress = useCallback(
    (uploadId: string) => {
      closeEventSource();

      const url = `${API_BASE_URL}/data-room/uploads/${uploadId}/progress`;

      const es = new EventSource<'message' | 'progress'>(url, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      eventSourceRef.current = es;

      const handleEventData = (eventData: string | null) => {
        if (!eventData) {
          return;
        }

        try {
          const data = JSON.parse(eventData);

          const dataProcess = data.data;

          setProgress({
            uploadId: dataProcess.uploadId ?? uploadId,
            status: dataProcess.status,
            percent: dataProcess.percent ?? 0,
            fileName: dataProcess.fileName ?? '',
            error: dataProcess.error,
          });

          if (
            dataProcess.status === 'completed' ||
            dataProcess.status === 'error'
          ) {
            es.close();
            eventSourceRef.current = null;
          }
        } catch (e) {
          console.error('[SSE] Failed to parse event data:', e);
        }
      };

      es.addEventListener('message', event => handleEventData(event.data));
      es.addEventListener('progress', event => handleEventData(event.data));

      es.addEventListener('error', event => {
        console.error('[SSE] Error:', event);
        setProgress(prev =>
          prev ? { ...prev, status: 'error', error: 'Connection lost' } : null,
        );
        es.close();
        eventSourceRef.current = null;
      });
    },
    [closeEventSource],
  );

  //---------------------------------------
  const uploadInFolder = useCallback(
    async (
      folderId: string,
      files: { uri: string; name: string; type: string }[],
    ) => {
      try {
        setProgress({
          uploadId: '',
          status: 'uploading',
          percent: 0,
          fileName: files[0]?.name ?? '',
        });

        const result = await uploadFileInFolder({
          folderId,
          files,
        }).unwrap();

        listenProgress(result.uploadId);
      } catch (err) {
        setProgress(prev =>
          prev ? { ...prev, status: 'error', error: 'Upload failed' } : null,
        );
        throw err;
      }
    },
    [uploadFileInFolder, listenProgress],
  );

  //---------------------------------------
  const upload = useCallback(
    async (files: { uri: string; name: string; type: string }[]) => {
      try {
        setProgress({
          uploadId: '',
          status: 'uploading',
          percent: 0,
          fileName: files[0]?.name ?? '',
        });

        const result = await uploadFile({ files }).unwrap();

        listenProgress(result.uploadId);
      } catch (err) {
        setProgress(prev =>
          prev ? { ...prev, status: 'error', error: 'Upload failed' } : null,
        );
        throw err;
      }
    },
    [uploadFile, listenProgress],
  );

  //---------------------------------------
  const dismiss = useCallback(() => {
    closeEventSource();
    setProgress(null);
  }, [closeEventSource]);

  return {
    progress,
    uploadInFolder,
    upload,
    dismiss,
  };
};
