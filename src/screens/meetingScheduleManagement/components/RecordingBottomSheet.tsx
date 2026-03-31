import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { Stop } from 'iconsax-react-nativejs';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { moderateScale as ms } from 'react-native-size-matters/extend';
import Toast from 'react-native-toast-message';

import { AppText } from '@/src/component/AppText';
import { MemoBottomSheetModal } from '@/src/component/BottomSheetModal';
import { AppColors } from '@/src/constants/colors';
import { AppImages } from '@/src/constants/images';

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

const RecordingBottomSheet: React.FC<IProps> = ({
  visible,
  onClose,
  onRecordingComplete,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [meteringLevels, setMeteringLevels] = useState<number[]>(
    Array(WAVEFORM_BAR_COUNT).fill(0),
  );
  const filePathRef = useRef<string>('');
  const allMeteringRef = useRef<number[]>([]);
  const isRecordingRef = useRef(false);

  //---------------------------------------
  const formatTime = useCallback((_ms: number) => {
    const totalSeconds = Math.floor(_ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  //---------------------------------------
  const handleStartRecording = useCallback(async () => {
    try {
      setMeteringLevels(Array(WAVEFORM_BAR_COUNT).fill(0));
      setIsPaused(false);
      setCurrentPosition(0);
      allMeteringRef.current = [];

      const recordPath = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/recording_${Date.now()}.m4a`;
      const path = await AudioRecorderPlayer.startRecorder(
        recordPath,
        undefined,
        true,
      );
      filePathRef.current = path;
      isRecordingRef.current = true;
      setIsRecording(true);

      AudioRecorderPlayer.addRecordBackListener(e => {
        setCurrentPosition(e.currentPosition);
        if (e.currentMetering !== undefined && e.currentMetering !== null) {
          const normalized = Math.max(
            0,
            Math.min(1, (e.currentMetering + 60) / 60),
          );
          setMeteringLevels(prev => [...prev.slice(1), normalized]);
          allMeteringRef.current.push(normalized);
        }
      });
    } catch {
      Toast.show({ type: 'error', text1: '녹음을 시작할 수 없습니다' });
    }
  }, []);

  //---------------------------------------
  const handleStopRecording = useCallback(async () => {
    try {
      if (isPaused) {
        await AudioRecorderPlayer.resumeRecorder();
      }

      const durationMs = currentPosition;
      await AudioRecorderPlayer.stopRecorder();
      AudioRecorderPlayer.removeRecordBackListener();
      isRecordingRef.current = false;
      setIsRecording(false);
      setIsPaused(false);
      setMeteringLevels(Array(WAVEFORM_BAR_COUNT).fill(0));
      onRecordingComplete(
        filePathRef.current,
        allMeteringRef.current,
        durationMs,
      );
    } catch {
      Toast.show({ type: 'error', text1: '녹음 중지에 실패했습니다' });
    }
  }, [isPaused, currentPosition, onRecordingComplete]);

  //---------------------------------------
  const handleTogglePause = useCallback(async () => {
    try {
      if (isPaused) {
        await AudioRecorderPlayer.resumeRecorder();
        setIsPaused(false);
      } else {
        await AudioRecorderPlayer.pauseRecorder();
        setIsPaused(true);
      }
    } catch {
      Toast.show({ type: 'error', text1: '녹음 일시정지에 실패했습니다' });
    }
  }, [isPaused]);

  //---------------------------------------
  const handleClose = useCallback(async () => {
    if (isRecordingRef.current) {
      try {
        await AudioRecorderPlayer.stopRecorder();
        AudioRecorderPlayer.removeRecordBackListener();
        isRecordingRef.current = false;
      } catch {}
    }
    setIsRecording(false);
    setIsPaused(false);
    setCurrentPosition(0);
    setMeteringLevels(Array(WAVEFORM_BAR_COUNT).fill(0));
    onClose();
  }, [onClose]);

  //---------------------------------------
  useEffect(() => {
    if (!visible && isRecordingRef.current) {
      AudioRecorderPlayer.stopRecorder().catch(() => {});
      AudioRecorderPlayer.removeRecordBackListener();
      isRecordingRef.current = false;
      setIsRecording(false);
    }
  }, [visible]);

  //---------------------------------------
  useEffect(() => {
    return () => {
      if (isRecordingRef.current) {
        AudioRecorderPlayer.stopRecorder().catch(() => {});
        AudioRecorderPlayer.removeRecordBackListener();
        isRecordingRef.current = false;
      }
    };
  }, []);

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
                style={styles.recordButton}
              >
                {isPaused && (
                  <Image
                    source={AppImages.playVector}
                    style={styles.playIcon}
                  />
                )}

                {!isPaused && (
                  <Image
                    source={AppImages.ellipse}
                    style={styles.ellipseIcon}
                  />
                )}
              </TouchableOpacity>

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
              >
                <Image
                  source={AppImages.ellipse}
                  style={styles.ellipseIcon}
                />
              </TouchableOpacity>
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
  playIcon: {
    width: ms(24),
    height: ms(26),
    resizeMode: 'contain' as const,
  },
  ellipseIcon: {
    width: ms(24),
    height: ms(26),
    resizeMode: 'contain' as const,
  },
});
