import { useEffect, useState } from 'react';
import ReactNativeBlobUtil from 'react-native-blob-util';

interface IBase64AudioFileState {
  filePath: string | null;
  isLoading: boolean;
}

export const useBase64AudioFile = (
  base64Content: string | undefined,
  scheduleId: string,
): IBase64AudioFileState => {
  const [filePath, setFilePath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!base64Content) {
      setFilePath(null);
      return;
    }

    let cancelled = false;
    const tempPath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/meeting_audio_${scheduleId}.m4a`;

    const writeFile = async () => {
      setIsLoading(true);
      try {
        await ReactNativeBlobUtil.fs.writeFile(tempPath, base64Content, 'base64');
        if (!cancelled) {
          setFilePath(tempPath);
        }
      } catch {
        if (!cancelled) {
          setFilePath(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    writeFile();

    return () => {
      cancelled = true;
      ReactNativeBlobUtil.fs.unlink(tempPath).catch(() => {});
    };
  }, [base64Content, scheduleId]);

  return { filePath, isLoading };
};
