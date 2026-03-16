import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import ReactNativeBlobUtil from 'react-native-blob-util';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { moderateScale as ms } from 'react-native-size-matters/extend';
import Toast from 'react-native-toast-message';

import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { AppColors } from '@/src/constants/colors';
import {
  Backward10Seconds,
  Forward10Seconds,
  Pause,
  Play,
} from '@/src/constants/icons';
import { getToken } from '@/src/services/tokenService';

interface IProps {
  filePath: string;
  fileName: string;
  waveformData?: number[];
  durationMs?: number;
}

const WAVEFORM_BAR_COUNT = 30;
const SEEK_OFFSET_MS = 10_000;

const audioPlayer = AudioRecorderPlayer;

const generatePlaceholderWaveform = (barCount: number): number[] => {
  const pattern = [
    0.3, 0.5, 0.4, 0.7, 0.6, 0.8, 0.5, 0.9, 0.7, 0.4, 0.6, 0.8, 0.5, 0.7,
    0.3, 0.6, 0.9, 0.5, 0.7, 0.4, 0.8, 0.6, 0.3, 0.7, 0.5, 0.9, 0.4, 0.6,
    0.8, 0.5,
  ];
  return Array.from({ length: barCount }, (_, i) => pattern[i % pattern.length]);
};

const downsampleWaveform = (data: number[], barCount: number): number[] => {
  if (data.length === 0) {
    return generatePlaceholderWaveform(barCount);
  }
  if (data.length <= barCount) {
    const padded = [...data];
    while (padded.length < barCount) {
      padded.push(0.1);
    }
    return padded;
  }
  const chunkSize = data.length / barCount;
  const result: number[] = [];
  for (let i = 0; i < barCount; i++) {
    const start = Math.floor(i * chunkSize);
    const end = Math.floor((i + 1) * chunkSize);
    const chunk = data.slice(start, end);
    const avg = chunk.reduce((sum, v) => sum + v, 0) / chunk.length;
    result.push(avg);
  }
  return result;
};

const formatTime = (_ms: number) => {
  const totalSec = Math.floor(_ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
};

const isRemoteUrl = (path: string) => /^https?:\/\//i.test(path);

const RecordedAudioCard: React.FC<IProps> = ({
  filePath,
  fileName,
  waveformData,
  durationMs: initialDurationMs,
}) => {
  const waveformBars = React.useMemo(
    () => downsampleWaveform(waveformData ?? [], WAVEFORM_BAR_COUNT),
    [waveformData],
  );

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [hasEnded, setHasEnded] = React.useState(false);
  const [hasStarted, setHasStarted] = React.useState(false);
  const [currentPositionMs, setCurrentPositionMs] = React.useState(0);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const cachedPathRef = React.useRef<string | null>(null);

  //---------------------------------------
  const resolveLocalPath = React.useCallback(async (): Promise<string> => {
    if (!isRemoteUrl(filePath)) {
      return filePath;
    }

    if (cachedPathRef.current) {
      const exists = await ReactNativeBlobUtil.fs.exists(cachedPathRef.current);
      if (exists) {
        return cachedPathRef.current;
      }
      cachedPathRef.current = null;
    }

    setIsDownloading(true);
    try {
      const ext = fileName.split('.').pop() || 'm4a';
      const cachePath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/audio_${Date.now()}.${ext}`;

      console.log('[Audio] Downloading from:', filePath);

      const isPresigned = filePath.includes('Signature=');
      const headers: Record<string, string> = {};
      if (!isPresigned) {
        const token = await getToken();
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await ReactNativeBlobUtil.config({ path: cachePath }).fetch(
        'GET',
        filePath,
        headers,
      );

      const status = res.respInfo?.status;
      console.log('[Audio] Download status:', status);

      if (status && status >= 400) {
        const body = await res.text();
        console.error('[Audio] Download failed:', status, body);
        throw new Error(`Download failed with status ${status}`);
      }

      const localPath = res.path();
      const fileExists = await ReactNativeBlobUtil.fs.exists(localPath);
      const stat = fileExists
        ? await ReactNativeBlobUtil.fs.stat(localPath)
        : null;

      console.log('[Audio] Downloaded to:', localPath, 'size:', stat?.size);

      if (!fileExists || !stat?.size || Number(stat.size) === 0) {
        throw new Error('Downloaded file is empty or missing');
      }

      cachedPathRef.current = localPath;
      return localPath;
    } finally {
      setIsDownloading(false);
    }
  }, [filePath, fileName]);

  //---------------------------------------
  const startPlayback = React.useCallback(
    async (localPath: string) => {
      console.log('[Audio] startPlayback localPath:', localPath);
      const fileExists = await ReactNativeBlobUtil.fs.exists(localPath);
      const stat = fileExists
        ? await ReactNativeBlobUtil.fs.stat(localPath)
        : null;
      console.log('[Audio] startPlayback file exists:', fileExists, 'size:', stat?.size, 'type:', stat?.type);

      // Stop any previous playback to reset audio session state
      await audioPlayer.stopPlayer().catch(() => {});
      audioPlayer.removePlayBackListener();
      audioPlayer.removePlaybackEndListener();

      // Setup listeners BEFORE startPlayer to avoid native timer self-destruct race
      audioPlayer.addPlayBackListener(e => {
        setCurrentPositionMs(e.currentPosition);
      });

      audioPlayer.addPlaybackEndListener(e => {
        setIsPlaying(false);
        setHasEnded(true);
        setCurrentPositionMs(e.currentPosition);
        audioPlayer.removePlayBackListener();
        audioPlayer.removePlaybackEndListener();
      });

      await audioPlayer.startPlayer(localPath);
      await audioPlayer.setVolume(1.0);
      setIsPlaying(true);
      setHasStarted(true);
    },
    [],
  );

  //---------------------------------------
  const handleTogglePlay = React.useCallback(async () => {
    try {
      if (isPlaying) {
        await audioPlayer.pausePlayer();
        setIsPlaying(false);
      } else if (hasEnded) {
        setHasEnded(false);
        setCurrentPositionMs(0);
        const localPath = await resolveLocalPath();
        await startPlayback(localPath);
      } else if (hasStarted) {
        await audioPlayer.resumePlayer();
        setIsPlaying(true);
      } else {
        const localPath = await resolveLocalPath();
        await startPlayback(localPath);
      }
    } catch (err) {
      console.log('======================handleTogglePlay error', err);
      setHasStarted(false);
      Toast.show({ type: 'error', text1: '재생에 실패했습니다' });
    }
  }, [isPlaying, hasEnded, hasStarted, resolveLocalPath, startPlayback]);

  //---------------------------------------
  const handleSeekBackward = React.useCallback(async () => {
    try {
      const newPos = Math.max(0, currentPositionMs - SEEK_OFFSET_MS);
      await audioPlayer.seekToPlayer(newPos);
      setCurrentPositionMs(newPos);
    } catch {
      Toast.show({ type: 'error', text1: '탐색에 실패했습니다' });
    }
  }, [currentPositionMs]);

  //---------------------------------------
  const handleSeekForward = React.useCallback(async () => {
    try {
      const maxPos = initialDurationMs || currentPositionMs;
      const newPos = Math.min(maxPos, currentPositionMs + SEEK_OFFSET_MS);
      await audioPlayer.seekToPlayer(newPos);
      setCurrentPositionMs(newPos);
    } catch {
      Toast.show({ type: 'error', text1: '탐색에 실패했습니다' });
    }
  }, [currentPositionMs, initialDurationMs]);

  //---------------------------------------
  React.useEffect(() => {
    return () => {
      audioPlayer.stopPlayer().catch(() => {});
      audioPlayer.removePlayBackListener();
      audioPlayer.removePlaybackEndListener();
    };
  }, []);

  //---------------------------------------
  const progress =
    initialDurationMs && initialDurationMs > 0
      ? currentPositionMs / initialDurationMs
      : 0;

  return (
    <MemoBaseCard style={styles.card}>
      {/* File name */}
      <AppText variant="body7" color={AppColors.gray90} numberOfLines={1}>
        {fileName.replace(/\.[^.]+$/, '')}
      </AppText>

      {/* Waveform */}
      <View style={styles.waveformContainer}>
        {waveformBars.map((level, index) => {
          const isPlayed = index / waveformBars.length < progress;
          return (
            <View
              key={index}
              style={[
                styles.waveformBar,
                {
                  height: Math.max(ms(2), level * ms(20)),
                  backgroundColor: isPlayed
                    ? AppColors.gray80
                    : AppColors.gray40,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Controls + Time row */}
      <View style={styles.controls}>
        <AppText variant="detail" color={AppColors.gray50}>
          {formatTime(currentPositionMs)}
        </AppText>

        <View style={styles.styleAction}>
          <Pressable onPress={handleSeekBackward} hitSlop={8}>
            <Backward10Seconds
              size={`${ms(24)}`}
              color={AppColors.gray80}
              variant="Linear"
            />
          </Pressable>

          <Pressable
            onPress={handleTogglePlay}
            style={styles.playButton}
            hitSlop={8}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <ActivityIndicator size={ms(24)} color={AppColors.gray80} />
            ) : isPlaying ? (
              <Pause
                size={`${ms(24)}`}
                color={AppColors.gray80}
                variant="Linear"
              />
            ) : (
              <Play
                size={`${ms(24)}`}
                color={AppColors.gray80}
                variant="Linear"
              />
            )}
          </Pressable>

          <Pressable onPress={handleSeekForward} hitSlop={8}>
            <Forward10Seconds
              size={`${ms(24)}`}
              color={AppColors.gray80}
              variant="Linear"
            />
          </Pressable>
        </View>

        <AppText variant="detail" color={AppColors.gray50}>
          {formatTime(initialDurationMs || 0)}
        </AppText>
      </View>
    </MemoBaseCard>
  );
};

export const MemoRecordedAudioCard = React.memo(RecordedAudioCard);

const styles = StyleSheet.create({
  card: {
    padding: ms(16),
    gap: ms(12),
    borderRadius: ms(14),
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: ms(28),
  },
  waveformBar: {
    flex: 1,
    marginHorizontal: ms(1),
    borderRadius: ms(2),
    backgroundColor: AppColors.gray40,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playButton: {
    padding: ms(4),
  },
  styleAction: {
    flexDirection: 'row',
    gap: ms(19),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
