import { useCallback, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBlobUtil from 'react-native-blob-util';

const RECORDING_METADATA_KEY = '@recording_in_progress';

export interface IRecordingMetadata {
  filePath: string;
  m4aPath?: string;
  scheduleId: string;
  startTime: number;
  encrypted?: boolean;
  iv?: string;
  authTag?: string;
  algorithm?: string;
}

export interface IRecoveredRecording {
  filePath: string;
  m4aPath?: string;
  scheduleId: string;
  fileSize: number;
  encrypted?: boolean;
  iv?: string;
  authTag?: string;
  algorithm?: string;
}

//---------------------------------------
export const saveRecordingMetadata = async (
  metadata: IRecordingMetadata,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      RECORDING_METADATA_KEY,
      JSON.stringify(metadata),
    );
  } catch (error) {
    console.error('[RecordingRecovery] Failed to save metadata:', error);
  }
};

//---------------------------------------
export const clearRecordingMetadata = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(RECORDING_METADATA_KEY);
  } catch (error) {
    console.error('[RecordingRecovery] Failed to clear metadata:', error);
  }
};

//---------------------------------------
const checkRecovery = async (): Promise<IRecoveredRecording | null> => {
  try {
    const raw = await AsyncStorage.getItem(RECORDING_METADATA_KEY);
    if (!raw) {
      return null;
    }

    const metadata: IRecordingMetadata = JSON.parse(raw);
    const fileExists = await ReactNativeBlobUtil.fs.exists(metadata.filePath);
    if (!fileExists) {
      await AsyncStorage.removeItem(RECORDING_METADATA_KEY);
      return null;
    }

    const stat = await ReactNativeBlobUtil.fs.stat(metadata.filePath);
    const fileSize = Number(stat.size);

    // File quá nhỏ (< 1KB) → không đủ dữ liệu audio
    if (fileSize < 1024) {
      await ReactNativeBlobUtil.fs.unlink(metadata.filePath);
      await AsyncStorage.removeItem(RECORDING_METADATA_KEY);
      return null;
    }

    // Kiểm tra m4a còn tồn tại không
    let m4aPath = metadata.m4aPath;
    if (m4aPath) {
      const m4aExists = await ReactNativeBlobUtil.fs.exists(m4aPath);
      if (!m4aExists) {
        m4aPath = undefined;
      }
    }

    return {
      filePath: metadata.filePath,
      m4aPath,
      scheduleId: metadata.scheduleId,
      fileSize,
      encrypted: metadata.encrypted,
      iv: metadata.iv,
      authTag: metadata.authTag,
      algorithm: metadata.algorithm,
    };
  } catch (error) {
    console.error('[RecordingRecovery] Failed to check recovery:', error);
    await AsyncStorage.removeItem(RECORDING_METADATA_KEY).catch(() => {});
    return null;
  }
};

//---------------------------------------
export const useRecordingRecovery = (scheduleId: string) => {
  const [recoveredRecording, setRecoveredRecording] =
    useState<IRecoveredRecording | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    checkRecovery().then(result => {
      if (!mounted) {
        return;
      }
      // Chỉ hiện recovery nếu đúng scheduleId
      if (result && result.scheduleId === scheduleId) {
        setRecoveredRecording(result);
      }
      setIsChecking(false);
    });
    return () => {
      mounted = false;
    };
  }, [scheduleId]);

  //---------------------------------------
  const acceptRecovery = useCallback(() => {
    const recording = recoveredRecording;
    setRecoveredRecording(null);
    clearRecordingMetadata();
    return recording;
  }, [recoveredRecording]);

  //---------------------------------------
  const dismissRecovery = useCallback(async () => {
    if (recoveredRecording) {
      await ReactNativeBlobUtil.fs
        .unlink(recoveredRecording.filePath)
        .catch(() => {});
      if (recoveredRecording.m4aPath) {
        await ReactNativeBlobUtil.fs
          .unlink(recoveredRecording.m4aPath)
          .catch(() => {});
      }
    }
    setRecoveredRecording(null);
    await clearRecordingMetadata();
  }, [recoveredRecording]);

  return {
    recoveredRecording,
    isChecking,
    acceptRecovery,
    dismissRecovery,
  };
};
