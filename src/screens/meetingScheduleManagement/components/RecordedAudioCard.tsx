import React, { useCallback, useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useSoundWithStates } from 'react-native-nitro-sound';
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

interface IProps {
  filePath: string;
  fileName: string;
}

const WAVEFORM_BARS = [
  0.3, 0.5, 0.7, 0.4, 0.8, 0.6, 0.9, 0.5, 0.3, 0.7, 0.8, 0.4, 0.6, 0.9, 0.5,
  0.7, 0.4, 0.8, 0.3, 0.6, 0.7, 0.5, 0.9, 0.4, 0.8, 0.6, 0.3, 0.7, 0.5, 0.8,
];
const SEEK_OFFSET_MS = 10_000;

const formatTime = (_ms: number) => {
  const totalSec = Math.floor(_ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
};

const RecordedAudioCard: React.FC<IProps> = ({ filePath, fileName }) => {
  const {
    startPlayer,
    pausePlayer,
    resumePlayer,
    seekToPlayer,
    stopPlayer,
    state,
  } = useSoundWithStates();

  const { isPlaying, playback } = state;

  //---------------------------------------
  useEffect(() => {
    return () => {
      stopPlayer().catch(() => {});
    };
  }, [stopPlayer]);

  //---------------------------------------
  const handleTogglePlay = useCallback(async () => {
    try {
      if (isPlaying) {
        await pausePlayer();
      } else if (playback.position > 0) {
        await resumePlayer();
      } else {
        await startPlayer(filePath);
      }
    } catch {
      Toast.show({ type: 'error', text1: '재생에 실패했습니다' });
    }
  }, [
    isPlaying,
    playback.position,
    pausePlayer,
    resumePlayer,
    startPlayer,
    filePath,
  ]);

  //---------------------------------------
  const handleSeekBackward = useCallback(async () => {
    try {
      const newPos = Math.max(0, playback.position - SEEK_OFFSET_MS);
      await seekToPlayer(newPos);
    } catch {
      Toast.show({ type: 'error', text1: '탐색에 실패했습니다' });
    }
  }, [playback.position, seekToPlayer]);

  //---------------------------------------
  const handleSeekForward = useCallback(async () => {
    try {
      const newPos = Math.min(
        playback.duration || playback.position,
        playback.position + SEEK_OFFSET_MS,
      );
      await seekToPlayer(newPos);
    } catch {
      Toast.show({ type: 'error', text1: '탐색에 실패했습니다' });
    }
  }, [playback.position, playback.duration, seekToPlayer]);

  return (
    <MemoBaseCard style={styles.card}>
      {/* File name */}
      <AppText variant="body7" color={AppColors.gray90} numberOfLines={1}>
        {fileName}
      </AppText>

      {/* Waveform */}
      <View style={styles.waveformContainer}>
        {WAVEFORM_BARS.map((level, index) => (
          <View
            key={index}
            style={[
              styles.waveformBar,
              { height: Math.max(ms(2), level * ms(20)) },
            ]}
          />
        ))}
      </View>

      {/* Controls + Time row */}
      <View style={styles.controls}>
        <AppText variant="detail" color={AppColors.gray50}>
          {formatTime(playback.position)}
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
          >
            {isPlaying ? (
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
          {formatTime(playback.duration)}
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
