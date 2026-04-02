import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import type {
  RecordBackType,
  PlayBackType,
  PlaybackEndType,
  AudioSet,
} from 'react-native-audio-recorder-player';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 300;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

//---------------------------------------
// Wrapper an toàn cho AudioRecorderPlayer.
// Nitro HybridObject có thể crash nếu native module chưa sẵn sàng.
// Wrapper này retry initialization và trả lỗi JS thay vì crash app.
//---------------------------------------

const safeCall = async <T>(
  fn: () => T | Promise<T>,
  fallback?: T,
): Promise<T> => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.warn(
        `[AudioService] Attempt ${attempt}/${MAX_RETRIES} failed:`,
        error,
      );
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
      } else if (fallback !== undefined) {
        return fallback;
      } else {
        throw error;
      }
    }
  }
  // Không bao giờ đến đây nhưng TypeScript cần return
  throw new Error('[AudioService] Unexpected: all retries exhausted');
};

//---------------------------------------
const safeCallSync = <T>(fn: () => T): boolean => {
  try {
    fn();
    return true;
  } catch (error) {
    console.warn('[AudioService] Sync call failed:', error);
    return false;
  }
};

//---------------------------------------
export const AudioService = {
  // Recording
  startRecorder: (
    uri?: string,
    audioSets?: AudioSet,
    meteringEnabled?: boolean,
  ): Promise<string> =>
    safeCall(() =>
      AudioRecorderPlayer.startRecorder(uri, audioSets, meteringEnabled),
    ),

  pauseRecorder: (): Promise<string> =>
    safeCall(() => AudioRecorderPlayer.pauseRecorder()),

  resumeRecorder: (): Promise<string> =>
    safeCall(() => AudioRecorderPlayer.resumeRecorder()),

  stopRecorder: (): Promise<string> =>
    safeCall(() => AudioRecorderPlayer.stopRecorder(), ''),

  // Playback
  startPlayer: (
    uri?: string,
    httpHeaders?: Record<string, string>,
  ): Promise<string> =>
    safeCall(() => AudioRecorderPlayer.startPlayer(uri, httpHeaders)),

  stopPlayer: (): Promise<string> =>
    safeCall(() => AudioRecorderPlayer.stopPlayer(), ''),

  pausePlayer: (): Promise<string> =>
    safeCall(() => AudioRecorderPlayer.pausePlayer()),

  resumePlayer: (): Promise<string> =>
    safeCall(() => AudioRecorderPlayer.resumePlayer()),

  seekToPlayer: (time: number): Promise<string> =>
    safeCall(() => AudioRecorderPlayer.seekToPlayer(time)),

  setVolume: (volume: number): Promise<string> =>
    safeCall(() => AudioRecorderPlayer.setVolume(volume)),

  // Listeners — sync, dùng safeCallSync
  addRecordBackListener: (
    callback: (e: RecordBackType) => void,
  ): boolean => safeCallSync(() => AudioRecorderPlayer.addRecordBackListener(callback)),

  removeRecordBackListener: (): void => {
    try {
      AudioRecorderPlayer.removeRecordBackListener();
    } catch {}
  },

  addPlayBackListener: (
    callback: (e: PlayBackType) => void,
  ): boolean => safeCallSync(() => AudioRecorderPlayer.addPlayBackListener(callback)),

  removePlayBackListener: (): void => {
    try {
      AudioRecorderPlayer.removePlayBackListener();
    } catch {}
  },

  addPlaybackEndListener: (
    callback: (e: PlaybackEndType) => void,
  ): boolean =>
    safeCallSync(() => AudioRecorderPlayer.addPlaybackEndListener(callback)),

  removePlaybackEndListener: (): void => {
    try {
      AudioRecorderPlayer.removePlaybackEndListener();
    } catch {}
  },
};
