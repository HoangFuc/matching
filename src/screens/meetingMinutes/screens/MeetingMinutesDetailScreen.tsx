import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { formatKoreanPhone } from '@/src/component/PhoneInput';
import {
  MemoDetailInfoRow,
  TDetailInfoRow,
} from '@/src/component/DetailInfoRow';
import { MemoRecordedAudioCard } from '@/src/component/RecordedAudioCard';
import { fixBrokenUtf8Encoding } from '@/src/utils/fixBrokenUtf8Encoding';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import { Edit2 } from '@/src/constants/icons';
import {
  MEETING_BADGE_CONFIG,
  MEETING_TYPE_CONFIG,
  MEETING_TYPE_LABEL,
} from '@/src/constants/meetingMinutes';
import { CardShadow } from '@/src/constants/shadows';
import {
  TMeetingMinutes,
  TUploadFile,
} from '@/src/interface/meetingMinutes.interface';
import { MeetingMinutesStackParamList } from '@/src/interface/tab.interface';
import { MemoUploadProgressBar } from '@/src/screens/dataRoom/components/UploadProgressBar';
import { useGetMeetingLogDetailQuery } from '@/src/store/api/meetingLog.api';
import { useAppSelector } from '@/src/store/hooks';
import { formatFileSize } from '@/src/utils/format';
import { MemoFileUploadSection } from '../components/FileUploadSection';
import { useMeetingLogUploadWithProgress } from '../hooks/useMeetingLogUploadWithProgress';

type TRoute = NativeStackScreenProps<
  MeetingMinutesStackParamList,
  'MeetingMinutesDetail'
>['route'];
type TNav = NativeStackNavigationProp<MeetingMinutesStackParamList>;

//---------------------------------------
const buildInfoRows = (item: TMeetingMinutes): TDetailInfoRow[] => {
  const typeLabel = MEETING_TYPE_LABEL[item.meetingType];
  const typeConfig = MEETING_TYPE_CONFIG[typeLabel];
  const badgeConfig = MEETING_BADGE_CONFIG['녹취미팅'];

  const chips: { label: string; bgColor: string; textColor: string }[] = [
    {
      label: typeLabel,
      bgColor: typeConfig.bgColor,
      textColor: typeConfig.textColor,
    },
  ];
  if (item.recordings?.length) {
    chips.push({
      label: '녹취파일',
      bgColor: badgeConfig.bgColor,
      textColor: badgeConfig.textColor,
    });
  }

  const rows: TDetailInfoRow[] = [
    { label: '미팅종류', type: 'chip', chips },
    { label: '날짜', type: 'text', value: item.meetingDate?.split('T')[0]?.replace(/-/g, '.') },
  ];

  if (item.address) {
    rows.push({
      label: '방문 장소',
      type: 'text',
      value: item.address,
      flex: true,
    });
  }

  rows.push({ label: '고객명', type: 'text', value: item.customerName });

  if (item.customerPhone) {
    rows.push({ label: '연락처', type: 'text', value: formatKoreanPhone(item.customerPhone ?? '') });
  }

  rows.push({
    label: '상담내용',
    type: 'text',
    value: item.consultationContent,
  });

  return rows;
};

//---------------------------------------
const MeetingMinutesDetailScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();
  const route = useRoute<TRoute>();
  const { id } = route.params;

  //---------------------------------------
  const { data: item, isLoading, refetch } = useGetMeetingLogDetailQuery(id);

  //---------------------------------------
  const uploadProgress = useAppSelector(
    state => state.meetingMinutes.meetingLogUploadProgress,
  );
  const {
    uploadRecordingToExisting,
    cancelUpload,
    dismiss: dismissUpload,
  } = useMeetingLogUploadWithProgress();

  //---------------------------------------
  const isUploadCompleted = uploadProgress?.status === 'completed';

  React.useEffect(() => {
    if (isUploadCompleted) {
      refetch();
      dismissUpload();
    }
  }, [isUploadCompleted, dismissUpload, refetch]);

  //---------------------------------------
  const infoRows = React.useMemo(
    () => (item ? buildInfoRows(item) : []),
    [item],
  );

  //---------------------------------------
  const recordings = item?.recordings;

  //---------------------------------------
  const handleEdit = React.useCallback(() => {
    if (item) {
      navigation.navigate('EditMeetingMinutes', { item });
    }
  }, [navigation, item]);

  //---------------------------------------
  const isPickingRef = React.useRef(false);
  const [uploadFiles, setUploadFiles] = React.useState<TUploadFile[]>([]);

  //---------------------------------------
  const getAudioDuration = React.useCallback(
    async (uri: string): Promise<number> => {
      try {
        const durationMs = await new Promise<number>(resolve => {
          const timeout = setTimeout(() => {
            AudioRecorderPlayer.stopPlayer().catch(() => {});
            AudioRecorderPlayer.removePlayBackListener();
            resolve(0);
          }, 5000);

          AudioRecorderPlayer.addPlayBackListener(e => {
            if (e.duration > 0) {
              clearTimeout(timeout);
              AudioRecorderPlayer.stopPlayer().catch(() => {});
              AudioRecorderPlayer.removePlayBackListener();
              resolve(e.duration);
            }
          });

          AudioRecorderPlayer.startPlayer(uri).catch(() => {
            clearTimeout(timeout);
            AudioRecorderPlayer.removePlayBackListener();
            resolve(0);
          });
        });
        return durationMs;
      } catch {
        return 0;
      }
    },
    [],
  );

  //---------------------------------------
  const handlePickFile = React.useCallback(async () => {
    if (isPickingRef.current || !item) return;
    isPickingRef.current = true;
    try {
      const result = await pick({
        type: [types.audio],
        allowMultiSelection: false,
      });

      const file = result[0];
      if (!file) return;

      const fileSizeBytes = file.size ?? 0;
      const MAX_SIZE = 100 * 1024 * 1024;
      if (fileSizeBytes > MAX_SIZE) {
        Alert.alert('', '파일 최대 용량은 100MB입니다.');
        return;
      }

      const pickedFile = {
        uri: file.uri,
        name: file.name ?? 'unknown',
        type: file.type ?? 'audio/m4a',
      };

      // Get duration (best effort — never block upload)
      let durationSeconds: number | undefined;
      try {
        const durationMs = await getAudioDuration(pickedFile.uri);
        durationSeconds =
          durationMs > 0 ? Math.round(durationMs / 1000) : undefined;
      } catch (durErr) {
        console.warn('[MeetingMinutes] getAudioDuration failed:', durErr);
      }

      setUploadFiles([
        {
          id: `${Date.now()}`,
          name: pickedFile.name,
          size: formatFileSize(fileSizeBytes),
          progress: 100,
          status: 'done' as const,
          uri: pickedFile.uri,
          type: pickedFile.type,
        },
      ]);

      await uploadRecordingToExisting(item.id, pickedFile, durationSeconds);
    } catch (err) {
      if (isErrorWithCode(err)) {
        if (err.code !== errorCodes.OPERATION_CANCELED) {
          console.error('DocumentPicker error:', err);
        }
      } else {
        console.error('[MeetingMinutes] Upload error:', err);
      }
    } finally {
      isPickingRef.current = false;
    }
  }, [item, uploadRecordingToExisting, getAudioDuration]);

  //---------------------------------------
  const handleRemoveFile = React.useCallback((fileId: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  //---------------------------------------
  if (isLoading || !item) {
    return (
      <AppSafeAreaView style={styles.safeArea}>
        <MemoScreenHeader title="미팅록 세부 정보" />
        <MemoScreenBody>
          <ActivityIndicator
            style={styles.centerLoader}
            color={AppColors.purple}
          />
        </MemoScreenBody>
      </AppSafeAreaView>
    );
  }

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <MemoScreenHeader title="미팅록 세부 정보" />

      <MemoScreenBody>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Meeting Info Header */}
          <View style={styles.cardHeader}>
            <AppText variant="body5" color={AppColors.gray90}>
              회의 정보
            </AppText>

            <Pressable
              hitSlop={8}
              onPress={handleEdit}
              style={styles.iconContainer}
            >
              <Edit2
                size={`${ms(20)}`}
                color={AppColors.gray90}
                variant="Linear"
              />
            </Pressable>
          </View>

          {/* Meeting Info Card */}
          <View style={styles.card}>
            {infoRows.map(row => (
              <MemoDetailInfoRow key={row.label} row={row} />
            ))}
          </View>

          {/* Upload Progress */}
          {uploadProgress && (
            <MemoUploadProgressBar
              progress={uploadProgress}
              onCancel={cancelUpload}
              containerStyle={styles.uploadCard}
            />
          )}

          {/* Recordings */}
          {recordings?.map(rec => (
            <MemoRecordedAudioCard
              key={rec.id}
              filePath={rec.playUrl}
              fileName={fixBrokenUtf8Encoding(rec.fileName)}
              durationMs={
                rec.durationSeconds ? rec.durationSeconds * 1000 : undefined
              }
            />
          ))}

          {/* Import file when no recording */}
          {!recordings?.length && !uploadProgress && (
            <View style={styles.uploadSection}>
              <AppText variant="body5" color={AppColors.gray90}>
                녹음파일
              </AppText>

              <MemoFileUploadSection
                files={uploadFiles}
                onPickFile={handlePickFile}
                onRemoveFile={handleRemoveFile}
              />
            </View>
          )}
        </ScrollView>
      </MemoScreenBody>
    </AppSafeAreaView>
  );
};

export const MemoMeetingMinutesDetailScreen = React.memo(
  MeetingMinutesDetailScreen,
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
  scrollContent: {
    padding: ms(16),
    gap: ms(16),
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  iconContainer: {
    borderRadius: ms(8),
    padding: ms(4),
    gap: ms(10),
    backgroundColor: AppColors.gray20,
  },
  uploadSection: {
    gap: ms(8),
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
