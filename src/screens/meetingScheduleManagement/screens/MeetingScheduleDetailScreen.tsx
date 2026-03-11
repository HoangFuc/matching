import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { MemoChip } from '@/src/component/Chip';
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
import { useGetMeetingScheduleDetailQuery } from '@/src/store/api/meetingScheduleManagement.api';
import dayjs from 'dayjs';
import { MemoRecordedAudioCard } from '../components/RecordedAudioCard';
import { MemoRecordingBottomSheet } from '../components/RecordingBottomSheet';
import { MemoUploadProgressBar } from '@/src/screens/dataRoom/components/UploadProgressBar';
import { useAppSelector } from '@/src/store/hooks';
import { useBase64AudioFile } from '../hooks/useBase64AudioFile';
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

type TInfoRow =
  | { label: string; type: 'text'; value: string; flex?: boolean }
  | { label: string; type: 'chip'; status: TMeetingScheduleStatus };

const buildInfoRows = (item: IMeetingScheduleManagement): TInfoRow[] => [
  { label: '상태', type: 'chip', status: item.status },
  {
    label: '날짜',
    type: 'text',
    value: `${dayjs(item.scheduleDate).format('YYYY.MM.DD')} ${dayjs(
      item.startTime,
    ).format('HH:mm')}`,
  },
  { label: '방문 장소', type: 'text', value: item.address, flex: true },
  { label: '고객명', type: 'text', value: item.customerName },
  { label: '연락처', type: 'text', value: item.customerPhone },
  { label: '일정명', type: 'text', value: item.title },
  { label: '메모', type: 'text', value: item.memo, flex: true },
];

//---------------------------------------
const InfoRow: React.FC<{ row: TInfoRow }> = ({ row }) => (
  <View style={styles.infoRow}>
    <AppText variant="body6" color={AppColors.gray90} style={styles.label}>
      {row.label}
    </AppText>

    {row.type === 'chip' ? (
      <MemoChip
        label={MEETING_SCHEDULE_STATUS_LABEL[row.status] ?? row.status}
        bgColor={(STATUS_CONFIG[row.status] ?? DEFAULT_STATUS_CONFIG).bgColor}
        textColor={
          (STATUS_CONFIG[row.status] ?? DEFAULT_STATUS_CONFIG).textColor
        }
        textVariant="detail"
      />
    ) : (
      <AppText
        variant="body8"
        color={AppColors.gray90}
        style={row.flex ? styles.infoValue : undefined}
      >
        {row.value}
      </AppText>
    )}
  </View>
);

const MemoInfoRow = React.memo(InfoRow);

//---------------------------------------
const MeetingScheduleDetailScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();
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

  const { filePath: serverAudioPath, isLoading: isAudioLoading } =
    useBase64AudioFile(displayItem.meetingLog?.content, displayItem.id);

  const [showRecording, setShowRecording] = React.useState(false);
  const [recordedFile, setRecordedFile] = React.useState<{
    path: string;
    name: string;
    waveformData: number[];
  } | null>(null);

  const infoRows = React.useMemo(
    () => buildInfoRows(displayItem),
    [displayItem],
  );

  //---------------------------------------
  const handleOpenRecording = React.useCallback(() => {
    setShowRecording(true);
  }, []);

  //---------------------------------------
  const handleCloseRecording = React.useCallback(() => {
    setShowRecording(false);
  }, []);

  //---------------------------------------
  const handleRecordingComplete = React.useCallback(
    (filePath: string, waveformData: number[]) => {
      setShowRecording(false);
      const fileName = filePath.split('/').pop() ?? 'recording.m4a';
      setRecordedFile({ path: filePath, name: fileName, waveformData });
    },
    [],
  );

  //---------------------------------------
  const isUploading = uploadProgress?.status === 'uploading';
  const isUploadCompleted = uploadProgress?.status === 'completed';

  //---------------------------------------
  const handleComplete = React.useCallback(async () => {
    if (!recordedFile) {
      return;
    }

    const fileName = recordedFile.name;
    const ext = fileName.split('.').pop()?.toLowerCase() ?? 'm4a';
    const mimeMap: Record<string, string> = {
      m4a: 'audio/m4a',
      mp4: 'audio/mp4',
      '3gp': 'audio/3gpp',
      wav: 'audio/wav',
      aac: 'audio/aac',
    };
    const mimeType = mimeMap[ext] ?? 'audio/octet-stream';
    const memo = displayItem.memo ?? '';

    try {
      await uploadRecording(
        item.id,
        {
          uri: recordedFile.path,
          name: fileName,
          type: mimeType,
        },
        memo,
      );
    } catch {
      // error is handled via Redux progress state
    }
  }, [item.id, recordedFile, uploadRecording, displayItem.memo]);

  //---------------------------------------
  React.useEffect(() => {
    if (isUploadCompleted) {
      dismissUpload();
      navigation.goBack();
    }
  }, [isUploadCompleted, dismissUpload, navigation]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MemoScreenHeader title="예약 상세" />

      <MemoScreenBody>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Info Card */}
          <View style={styles.card}>
            {infoRows.map(row => (
              <MemoInfoRow key={row.label} row={row} />
            ))}
          </View>

          {/* Recording Section */}
          {isCompleted && serverAudioPath ? (
            <MemoRecordedAudioCard
              filePath={serverAudioPath}
              fileName={`meeting_audio_${displayItem.id}.m4a`}
            />
          ) : isCompleted && isAudioLoading ? (
            <MemoBaseCard style={styles.recordSection}>
              <AppText variant="body7" color={AppColors.gray50}>
                오디오 로딩 중...
              </AppText>
            </MemoBaseCard>
          ) : uploadProgress ? (
            <MemoUploadProgressBar
              progress={uploadProgress}
              onCancel={cancelUpload}
              containerStyle={styles.uploadCard}
            />
          ) : recordedFile ? (
            <MemoRecordedAudioCard
              filePath={recordedFile.path}
              fileName={recordedFile.name}
              waveformData={recordedFile.waveformData}
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
          <View style={styles.bottomContainer}>
            <MemoAppButton
              label={isUploading ? '업로드 중...' : '저장'}
              onPress={handleComplete}
              style={styles.completeBtn}
              disabled={!recordedFile || isUploading}
            />
          </View>
        )}
      </MemoScreenBody>

      {!isCompleted && (
        <MemoRecordingBottomSheet
          visible={showRecording}
          onClose={handleCloseRecording}
          onRecordingComplete={handleRecordingComplete}
        />
      )}
    </SafeAreaView>
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: {
    width: ms(70),
  },
  infoValue: {
    flex: 1,
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
  },
  completeBtn: {
    width: ms(200),
    paddingVertical: ms(12),
  },
});
