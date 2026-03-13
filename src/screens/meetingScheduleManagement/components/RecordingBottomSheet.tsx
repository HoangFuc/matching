import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { Stop } from 'iconsax-react-nativejs';
import { useSoundRecorderWithStates } from 'react-native-nitro-sound';
import { moderateScale as ms } from 'react-native-size-matters/extend';
import Toast from 'react-native-toast-message';

import { AppText } from '@/src/component/AppText';
import { MemoBottomSheetModal } from '@/src/component/BottomSheetModal';
import { AppColors } from '@/src/constants/colors';

interface IProps {
  visible: boolean;
  onClose: () => void;
  onRecordingComplete: (
    filePath: string,
    waveformData: number[],
    durationMs: number,
  ) => void;
}

const WAVEFORM_BAR_COUNT = 40;
const SUBSCRIPTION_DURATION_SEC = 0.1; // 100ms

const RecordingBottomSheet: React.FC<IProps> = ({
  visible,
  onClose,
  onRecordingComplete,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [meteringLevels, setMeteringLevels] = useState<number[]>(
    Array(WAVEFORM_BAR_COUNT).fill(0),
  );
  const filePathRef = useRef<string>('');
  const allMeteringRef = useRef<number[]>([]);

  //---------------------------------------
  const { startRecorder, pauseRecorder, resumeRecorder, stopRecorder, state } =
    useSoundRecorderWithStates({
      subscriptionDuration: SUBSCRIPTION_DURATION_SEC,
      onRecord: e => {
        if (e.currentMetering !== undefined) {
          const normalized = Math.max(
            0,
            Math.min(1, (e.currentMetering + 60) / 60),
          );
          setMeteringLevels(prev => [...prev.slice(1), normalized]);
          allMeteringRef.current.push(normalized);
        }
      },
    });

  const { isRecording, currentPosition } = state;

  //---------------------------------------
  const formatTime = useCallback((_ms: number) => {
    const totalSeconds = Math.floor(_ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  //---------------------------------------
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      return true;
    }

    const micPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    );

    if (micPermission !== PermissionsAndroid.RESULTS.GRANTED) {
      Toast.show({ type: 'error', text1: '마이크 권한이 필요합니다' });
      return false;
    }

    if (Number(Platform.Version) < 33) {
      const storagePermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (storagePermission !== PermissionsAndroid.RESULTS.GRANTED) {
        Toast.show({ type: 'error', text1: '저장소 권한이 필요합니다' });
        return false;
      }
    }

    return true;
  }, []);

  //---------------------------------------
  const handleStartRecording = useCallback(async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        return;
      }

      setMeteringLevels(Array(WAVEFORM_BAR_COUNT).fill(0));
      setIsPaused(false);
      allMeteringRef.current = [];

      const path = await startRecorder(undefined, undefined, true);
      filePathRef.current = path;
    } catch {
      Toast.show({ type: 'error', text1: '녹음을 시작할 수 없습니다' });
    }
  }, [requestPermissions, startRecorder]);

  //---------------------------------------
  const handleStopRecording = useCallback(async () => {
    try {
      if (isPaused) {
        await resumeRecorder();
      }
      const durationMs = currentPosition;
      await stopRecorder();
      setIsPaused(false);
      setMeteringLevels(Array(WAVEFORM_BAR_COUNT).fill(0));
      onRecordingComplete(filePathRef.current, allMeteringRef.current, durationMs);
    } catch {
      Toast.show({ type: 'error', text1: '녹음 중지에 실패했습니다' });
    }
  }, [isPaused, currentPosition, resumeRecorder, stopRecorder, onRecordingComplete]);

  //---------------------------------------
  const handleTogglePause = useCallback(async () => {
    try {
      if (isPaused) {
        await resumeRecorder();
        setIsPaused(false);
      } else {
        await pauseRecorder();
        setIsPaused(true);
      }
    } catch {
      Toast.show({ type: 'error', text1: '녹음 일시정지에 실패했습니다' });
    }
  }, [isPaused, pauseRecorder, resumeRecorder]);

  //---------------------------------------
  const handleClose = useCallback(async () => {
    if (isRecording) {
      try {
        await stopRecorder();
      } catch {}
    }
    setIsPaused(false);
    setMeteringLevels(Array(WAVEFORM_BAR_COUNT).fill(0));
    onClose();
  }, [isRecording, stopRecorder, onClose]);

  //---------------------------------------
  useEffect(() => {
    if (!visible && isRecording) {
      stopRecorder().catch(() => {});
    }
  }, [visible, isRecording, stopRecorder]);

  return (
    <MemoBottomSheetModal
      visible={visible}
      onClose={handleClose}
      title="초대하기"
    >
      <View style={styles.content}>
        {/* Waveform */}
        <View style={styles.waveformContainer}>
          {meteringLevels.map((level, index) => (
            <View
              key={index}
              style={[
                styles.waveformBar,
                {
                  height: Math.max(ms(2), level * ms(20)),
                },
              ]}
            />
          ))}
        </View>

        {/* Timer */}
        <AppText variant="detail" color={AppColors.gray100}>
          {formatTime(currentPosition)}
        </AppText>

        {/* Controls */}
        <View style={styles.controlsRow}>
          {isRecording ? (
            <>
              <View style={styles.controlSpacer} />

              <TouchableOpacity
                onPress={handleTogglePause}
                style={isPaused ? styles.playTriangle : styles.recordButton}
              />

              <View style={styles.controlSpacer}>
                <TouchableOpacity
                  onPress={handleStopRecording}
                  style={styles.stopButton}
                >
                  <Stop
                    size={ms(20)}
                    variant="Linear"
                    style={{
                      borderColor: AppColors.gray90,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={styles.controlSpacer} />
              <TouchableOpacity
                style={styles.recordButton}
                onPress={handleStartRecording}
              />
              <View style={styles.controlSpacer} />
            </>
          )}
        </View>
      </View>
    </MemoBottomSheetModal>
  );
};

export const MemoRecordingBottomSheet = React.memo(RecordingBottomSheet);

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingVertical: ms(24),
    paddingHorizontal: ms(20),
    gap: ms(16),
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: ms(28),
    width: '100%',
  },
  waveformBar: {
    flex: 1,
    marginHorizontal: ms(1),
    borderRadius: ms(2),
    backgroundColor: AppColors.gray40,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  recordButton: {
    width: ms(26),
    height: ms(26),
    borderRadius: ms(28),
    backgroundColor: AppColors.negative,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlSpacer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  stopButton: {
    width: ms(26),
    height: ms(26),
    borderRadius: ms(13),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.gray20,
  },
  stopIcon: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(2),
    backgroundColor: AppColors.gray80,
  },
  playTriangle: {
    marginLeft: ms(4),
    width: 0,
    height: 0,
    borderLeftWidth: ms(20),
    borderTopWidth: ms(12),
    borderBottomWidth: ms(12),
    borderLeftColor: AppColors.negative,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
});
