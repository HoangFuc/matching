import React from 'react';
import {
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { API_BASE_URL } from '@env';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { moderateScale as ms } from 'react-native-size-matters/extend';
import Toast from 'react-native-toast-message';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import {
  MemoDetailInfoRow,
  TDetailInfoRow,
} from '@/src/component/DetailInfoRow';
import { formatKoreanPhone } from '@/src/component/PhoneInput';
import { MemoRecordedAudioCard } from '@/src/component/RecordedAudioCard';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import { Microphone2 } from '@/src/constants/icons';
import { MEETING_SCHEDULE_STATUS_LABEL } from '@/src/constants/meetingSchedule';
import { CardShadow } from '@/src/constants/shadows';
import {
  IMeetingScheduleManagement,
  TMeetingScheduleStatus,
} from '@/src/interface/meetingScheduleManagement.interface';
import { RootStackParamList } from '@/src/interface/tab.interface';
import { MemoUploadProgressBar } from '@/src/screens/dataRoom/components/UploadProgressBar';
import { useGetMeetingScheduleDetailQuery } from '@/src/store/api/meetingScheduleManagement.api';
import { useAppSelector } from '@/src/store/hooks';
import { fixBrokenUtf8Encoding } from '@/src/utils/fixBrokenUtf8Encoding';
import {
  encryptFile,
  fetchEncryptionKey,
} from '@/src/services/encryptionService';
import dayjs from 'dayjs';
import { MemoRecordingBottomSheet } from '../components/RecordingBottomSheet';
import { saveRecordingMetadata } from '../hooks/useRecordingRecovery';
import { useRecordingUploadWithProgress } from '../hooks/useRecordingUploadWithProgress';

type TRoute = NativeStackScreenProps<
  RootStackParamList,
  'MeetingScheduleDetail'
>['route'];
type TNav = NativeStackNavigationProp<RootStackParamList>;

const STATUS_CONFIG: Record<
  TMeetingScheduleStatus,
  { bgColor: string; textColor: string }
> = {
  incomplete: {
    bgColor: AppColors.lightCream,
    textColor: AppColors.amber,
  },
  completed: {
    bgColor: AppColors.lightBlue,
    textColor: AppColors.strongBlue,
  },
};

const DEFAULT_STATUS_CONFIG = {
  bgColor: AppColors.lightCream,
  textColor: AppColors.amber,
};

//---------------------------------------
const buildInfoRows = (item: IMeetingScheduleManagement): TDetailInfoRow[] => {
  const statusConfig = STATUS_CONFIG[item.status] ?? DEFAULT_STATUS_CONFIG;
  return [
    {
      label: '상태',
      type: 'chip',
      chips: [
        {
          label: MEETING_SCHEDULE_STATUS_LABEL[item.status] ?? item.status,
          bgColor: statusConfig.bgColor,
          textColor: statusConfig.textColor,
        },
      ],
    },
    {
      label: '날짜',
      type: 'text',
      value: `${dayjs(item.scheduleDate).format('YYYY.MM.DD')}`,
    },
    { label: '방문 장소', type: 'text', value: item.address, flex: true },
    { label: '고객명', type: 'text', value: item.customerName },
    {
      label: '연락처',
      type: 'text',
      value: formatKoreanPhone(item.customerPhone ?? ''),
    },
    { label: '일정명', type: 'text', value: item.title },
    { label: '메모', type: 'text', value: item.memo, flex: true },
  ];
};

//---------------------------------------
const MeetingScheduleDetailScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();
  const insets = useSafeAreaInsets();
  const route = useRoute<TRoute>();
  const { item } = route.params;

  const { data: detailData } = useGetMeetingScheduleDetailQuery(item.id);
  const uploadProgress = useAppSelector(
    state => state.meetingSchedule.recordingUploadProgress,
  );
  const {
    uploadRecording,
    cancelUpload,
    dismiss: dismissUpload,
  } = useRecordingUploadWithProgress();

  const displayItem = detailData ?? item;
  const isCompleted = displayItem.status === 'completed';

  const serverRecording = displayItem.meetingLog?.recordings?.[0];

  const [showRecording, setShowRecording] = React.useState(false);
  const [recordedFile, setRecordedFile] = React.useState<{
    path: string;
    m4aPath?: string;
    localEncPath?: string;
    name: string;
    durationMs: number;
    iv?: string;
    authTag?: string;
    algorithm?: string;
  } | null>(null);

  const infoRows = React.useMemo(
    () => buildInfoRows(displayItem),
    [displayItem],
  );

  //---------------------------------------
  const requestPermissions = React.useCallback(async (): Promise<boolean> => {
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
  const handleOpenRecording = React.useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return;
    }
    setShowRecording(true);
  }, [requestPermissions]);

  //---------------------------------------
  const handleCloseRecording = React.useCallback(() => {
    setShowRecording(false);
  }, []);

  //---------------------------------------
  const saveEncFileToLocal = React.useCallback(
    async (
      sourcePath: string,
      fileName: string,
    ): Promise<string | undefined> => {
      try {
        if (Platform.OS === 'android') {
          const contentUri =
            await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
              {
                name: fileName,
                parentFolder: 'Recordings',
                mimeType: 'application/octet-stream',
              },
              'Download',
              sourcePath,
            );
          return contentUri;
        } else {
          const destDir = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/Recordings`;
          const dirExists = await ReactNativeBlobUtil.fs.isDir(destDir);
          if (!dirExists) {
            await ReactNativeBlobUtil.fs.mkdir(destDir);
          }
          const destPath = `${destDir}/${fileName}`;
          await ReactNativeBlobUtil.fs.cp(sourcePath, destPath);
          return destPath;
        }
      } catch (error) {
        console.error('Failed to save .enc to local:', error);
        return undefined;
      }
    },
    [],
  );

  //---------------------------------------
  const handleRecordingComplete = React.useCallback(
    async (filePath: string, _waveformData: number[], durationMs: number) => {
      setShowRecording(false);

      try {
        // 1. Fetch encryption key + iv (held in RAM only)
        const { key, iv: serverIv, algorithm } = await fetchEncryptionKey();

        // 2. Encrypt the raw .m4a → .enc
        const {
          encryptedFilePath,
          iv: encIv,
          authTag,
          algorithm: algo,
        } = await encryptFile(filePath, key, serverIv);

        // 3. Save .enc to device storage
        const now = dayjs();
        const fileName = `녹음_${now.format('YYYYMMDD_HHmm')}.enc`;
        const localEncPath = await saveEncFileToLocal(
          encryptedFilePath,
          fileName,
        );

        // 4. Update recovery metadata (lưu cả m4aPath để recovery có thể phát lại)
        await saveRecordingMetadata({
          filePath: encryptedFilePath,
          m4aPath: filePath.replace('file://', ''),
          scheduleId: item.id,
          startTime: Date.now(),
          encrypted: true,
          iv: encIv,
          authTag,
          algorithm: algo,
        });

        // 5. Store .enc file info + keep m4a path for playback
        setRecordedFile({
          path: encryptedFilePath,
          m4aPath: filePath.replace('file://', ''),
          localEncPath,
          name: fileName,
          durationMs,
          iv: encIv,
          authTag,
          algorithm: algorithm ?? algo,
        });
      } catch (error) {
        console.error('[Encryption] Failed:', error);
        await ReactNativeBlobUtil.fs
          .unlink(filePath.replace('file://', ''))
          .catch(() => {});
        Toast.show({ type: 'error', text1: '녹음 암호화에 실패했습니다' });
      }
    },
    [item.id, saveEncFileToLocal],
  );

  //---------------------------------------
  const isUploading = uploadProgress?.status === 'uploading';
  const isUploadCompleted = uploadProgress?.status === 'completed';

  //---------------------------------------
  const handleComplete = React.useCallback(async () => {
    if (!recordedFile) {
      return;
    }

    const uploadName = recordedFile.name;
    const memo = displayItem.memo ?? '';
    const durationSeconds = recordedFile.durationMs / 1000;

    // Build encryption metadata for multipart fields
    const encryptionFields: Record<string, string> = {};
    if (recordedFile.iv) {
      encryptionFields.encryptionIv = recordedFile.iv;
    }
    if (recordedFile.authTag) {
      encryptionFields.encryptionTag = recordedFile.authTag;
    }
    if (recordedFile.algorithm) {
      encryptionFields.encryptionAlgo = recordedFile.algorithm;
    }

    try {
      await uploadRecording(
        item.id,
        {
          uri: recordedFile.path,
          name: uploadName,
          type: 'application/octet-stream',
        },
        memo,
        durationSeconds,
        Object.keys(encryptionFields).length > 0 ? encryptionFields : undefined,
      );
    } catch {
      // error is handled via Redux progress state
    }
  }, [item.id, recordedFile, uploadRecording, displayItem.memo]);

  //---------------------------------------
  React.useEffect(() => {
    if (isUploadCompleted) {
      // Upload thành công → xóa file .enc tạm, .m4a, và bản .enc trong Download
      if (recordedFile?.path) {
        ReactNativeBlobUtil.fs.unlink(recordedFile.path).catch(() => {});
      }
      if (recordedFile?.m4aPath) {
        ReactNativeBlobUtil.fs.unlink(recordedFile.m4aPath).catch(() => {});
      }
      if (recordedFile?.localEncPath) {
        ReactNativeBlobUtil.fs
          .unlink(recordedFile.localEncPath)
          .catch(() => {});
      }
      dismissUpload();
      navigation.goBack();
    }
  }, [
    isUploadCompleted,
    dismissUpload,
    navigation,
    recordedFile?.path,
    recordedFile?.m4aPath,
    recordedFile?.localEncPath,
  ]);

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <MemoScreenHeader title="예약 상세" />

      <MemoScreenBody>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Info Card */}
          <View style={styles.card}>
            {infoRows.map(row => (
              <MemoDetailInfoRow key={row.label} row={row} />
            ))}
          </View>

          {/* Recording Section */}
          {isCompleted && serverRecording ? (
            <MemoRecordedAudioCard
              filePath={`${API_BASE_URL}/schedules/recordings/${serverRecording.id}/stream`}
              fileName={fixBrokenUtf8Encoding(serverRecording.fileName)}
              durationMs={
                serverRecording.durationSeconds
                  ? serverRecording.durationSeconds * 1000
                  : undefined
              }
            />
          ) : uploadProgress ? (
            <MemoUploadProgressBar
              progress={uploadProgress}
              onCancel={cancelUpload}
              containerStyle={styles.uploadCard}
            />
          ) : recordedFile ? (
            <MemoRecordedAudioCard
              filePath={recordedFile.m4aPath ?? recordedFile.path}
              fileName={recordedFile.name}
              durationMs={recordedFile.durationMs}
            />
          ) : (
            <MemoBaseCard style={styles.recordSection}>
              <View style={styles.micContainer}>
                <Microphone2
                  size={`${ms(30)}`}
                  color={AppColors.gray40}
                  variant="Bold"
                />

                <AppText variant="body7" color={AppColors.gray50}>
                  회의를 녹음해 주세요
                </AppText>
              </View>

              <MemoAppButton
                label="녹음 시작"
                variant="primary"
                style={styles.recordBtn}
                onPress={handleOpenRecording}
              />
            </MemoBaseCard>
          )}
        </ScrollView>

        {/* Bottom Button */}
        {!isCompleted && (
          <View
            style={[
              styles.bottomContainer,
              { paddingBottom: insets.bottom || ms(16) },
            ]}
          >
            <MemoAppButton
              label={isUploading ? '업로드 중...' : '회의 완료'}
              onPress={handleComplete}
              style={styles.completeBtn}
              disabled={!recordedFile || isUploading}
            />
          </View>
        )}
      </MemoScreenBody>

      {!isCompleted && showRecording && (
        <MemoRecordingBottomSheet
          visible={showRecording}
          scheduleId={item.id}
          onClose={handleCloseRecording}
          onRecordingComplete={handleRecordingComplete}
        />
      )}
    </AppSafeAreaView>
  );
};

export const MemoMeetingScheduleDetailScreen = React.memo(
  MeetingScheduleDetailScreen,
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
  scrollContent: {
    padding: ms(16),
    gap: ms(24),
  },
  card: {
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: AppColors.gray30,
    backgroundColor: AppColors.white,
    padding: ms(16),
    gap: ms(16),
    ...CardShadow,
  },
  uploadCard: {
    padding: ms(16),
    gap: ms(12),
    borderRadius: ms(14),
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.gray30,
    ...CardShadow,
  },
  recordSection: {
    alignItems: 'center',
    gap: ms(16),
    padding: ms(16),
    borderRadius: ms(14),
  },
  micContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(4),
  },
  recordBtn: {
    width: ms(140),
    paddingVertical: ms(8),
  },
  bottomContainer: {
    backgroundColor: AppColors.white,
    paddingVertical: ms(16),
    alignItems: 'center',
    marginBottom: ms(10),
  },
  completeBtn: {
    width: ms(200),
    paddingVertical: ms(12),
  },
});
