import React from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { MemoDatePickerModal } from '@/src/component/calendar/DatePickerModal';
import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { moderateScale as ms } from 'react-native-size-matters/extend';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

import Postcode from '@actbase/react-daum-postcode';
import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { MemoDropdownButton } from '@/src/component/DropdownButton';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import { Calendar } from '@/src/constants/icons';
import {
  TMeetingTypeLabel,
  TRecording,
  TUploadFile,
} from '@/src/interface/meetingMinutes.interface';
import {
  MEETING_TYPE_KEY,
  MEETING_TYPE_LABEL,
} from '@/src/constants/meetingMinutes';
import { MeetingMinutesStackParamList } from '@/src/interface/tab.interface';
import { MemoFileInfoCard } from '@/src/component/FileInfoCard';
import { fixBrokenUtf8Encoding } from '@/src/utils/fixBrokenUtf8Encoding';
import { MemoPhoneInput } from '@/src/component/PhoneInput';
import { RHFFormInput } from '@/src/component/RHFFormInput';
import { MemoFileUploadSection } from '../components/FileUploadSection';
import { MemoMeetingTypePicker } from '../components/MeetingTypePicker';
import {
  useDeleteRecordingMutation,
  useUpdateMeetingLogMutation,
} from '@/src/store/api/meetingLog.api';
import { formatFileSize } from '@/src/utils/format';
import { useMeetingLogUploadWithProgress } from '../hooks/useMeetingLogUploadWithProgress';
import { useAppSelector } from '@/src/store/hooks';

type TRoute = NativeStackScreenProps<
  MeetingMinutesStackParamList,
  'EditMeetingMinutes'
>['route'];

interface IFormData {
  meetingType: TMeetingTypeLabel;
  date: string;
  visitLocation: string;
  customerName: string;
  phone: string;
  content: string;
}

const formatDateToDisplay = (dateStr: string) => {
  if (!dateStr) return '';
  const dateOnly = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  return dateOnly.replace(/-/g, '.');
};

const EditMeetingMinutesScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<TRoute>();
  const { item } = route.params;

  //---------------------------------------
  const { control, handleSubmit, setValue } = useForm<IFormData>({
    defaultValues: {
      meetingType: MEETING_TYPE_LABEL[item.meetingType],
      date: item.meetingDate ? formatDateToDisplay(item.meetingDate) : '',
      visitLocation: item.address,
      customerName: item.customerName,
      phone: item.customerPhone,
      content: item.consultationContent,
    },
  });

  //---------------------------------------
  const [showTypePicker, setShowTypePicker] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [uploadFiles, setUploadFiles] = React.useState<TUploadFile[]>([]);
  const [recordings, setRecordings] = React.useState<TRecording[]>(
    item.recordings ?? [],
  );
  const [savedUploadId, setSavedUploadId] = React.useState<string | null>(null);
  const [showPostcode, setShowPostcode] = React.useState(false);
  const isPickingRef = React.useRef(false);

  //---------------------------------------
  const [updateMeetingLog] = useUpdateMeetingLogMutation();
  const [deleteRecording] = useDeleteRecordingMutation();
  const { uploadFileWithUploadId, cancelUpload } =
    useMeetingLogUploadWithProgress();
  const progress = useAppSelector(
    state => state.meetingMinutes.meetingLogUploadProgress,
  );

  //---------------------------------------
  const handleRemoveRecording = React.useCallback(
    async (recordingId: string) => {
      try {
        const result = await deleteRecording(item.id).unwrap();
        const uploadId = result?.uploadId;
        if (uploadId) {
          setSavedUploadId(uploadId);
        }
        setRecordings(prev => prev.filter(r => r.id !== recordingId));
      } catch (err) {
        console.error('[EditMeetingMinutes] Delete recording error:', err);
        Alert.alert('', '녹음파일 삭제에 실패했습니다.');
      }
    },
    [deleteRecording, item.id],
  );

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
    if (isPickingRef.current) return;
    isPickingRef.current = true;
    try {
      const result = await pick({
        type: [types.audio],
        allowMultiSelection: false,
      });

      const file = result[0];
      if (!file) return;

      const fileSizeBytes = file.size ?? 0;
      const MAX_SIZE = 100 * 1024 * 1024; // 100MB
      if (fileSizeBytes > MAX_SIZE) {
        Alert.alert('', '파일 최대 용량은 100MB입니다.');
        return;
      }

      // Get duration (best effort — never block upload)
      let durationSeconds: number | undefined;
      try {
        const durationMs = await getAudioDuration(file.uri);
        durationSeconds =
          durationMs > 0 ? Math.round(durationMs / 1000) : undefined;
      } catch (durErr) {
        console.warn('[EditMeetingMinutes] getAudioDuration failed:', durErr);
      }

      const newFile: TUploadFile = {
        id: `${Date.now()}`,
        name: file.name ?? 'unknown',
        size: formatFileSize(fileSizeBytes),
        progress: 0,
        status: 'uploading',
        uri: file.uri,
        type: file.type ?? 'audio/m4a',
      };

      setUploadFiles(prev => [...prev, newFile]);

      const filePayload = {
        uri: file.uri,
        name: file.name ?? 'recording',
        type: file.type ?? 'audio/m4a',
      };

      if (savedUploadId) {
        uploadFileWithUploadId(savedUploadId, filePayload, durationSeconds);
      } else {
        try {
          const res = await deleteRecording(item.id).unwrap();
          const uploadId = res?.uploadId;
          if (uploadId) {
            setSavedUploadId(uploadId);
            uploadFileWithUploadId(uploadId, filePayload, durationSeconds);
          }
        } catch (err) {
          console.error('[EditMeetingMinutes] Get uploadId error:', err);
          setUploadFiles(prev => prev.filter(f => f.id !== newFile.id));
          Alert.alert('', '파일 업로드 준비에 실패했습니다.');
        }
      }
    } catch (err) {
      if (isErrorWithCode(err) && err.code !== errorCodes.OPERATION_CANCELED) {
        console.error('DocumentPicker error:', err);
      }
    } finally {
      isPickingRef.current = false;
    }
  }, [savedUploadId, uploadFileWithUploadId, deleteRecording, item.id, getAudioDuration]);

  //---------------------------------------
  const handleRemoveFile = React.useCallback(
    (id: string) => {
      setUploadFiles(prev => prev.filter(f => f.id !== id));
      if (progress) {
        cancelUpload();
      }
    },
    [progress, cancelUpload],
  );

  //---------------------------------------
  const onSubmit = React.useCallback(
    async (data: IFormData) => {
      try {
        const meetingDateStr = data.date.replace(/\./g, '-');
        await updateMeetingLog({
          id: item.id,
          meetingType: MEETING_TYPE_KEY[data.meetingType],
          meetingDate: meetingDateStr,
          customerName: data.customerName.trim(),
          customerPhone: data.phone,
          address: data.visitLocation,
          consultationContent: data.content.trim(),
        }).unwrap();

        navigation.goBack();
      } catch (err) {
        console.error('[EditMeetingMinutes] Update error:', err);
        Alert.alert('', '수정에 실패했습니다.');
      }
    },
    [item.id, updateMeetingLog, navigation],
  );

  //---------------------------------------
  React.useEffect(() => {
    if (!progress) return;
    setUploadFiles(prev =>
      prev.map(f => ({
        ...f,
        progress: progress.percent,
        status: progress.status === 'completed' ? 'done' : f.status,
      })),
    );
  }, [progress]);

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <MemoScreenHeader title="미팅록 수정" />

      <MemoScreenBody>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid
          extraScrollHeight={ms(20)}
        >
          <View>
            <AppText variant="body7" color={AppColors.gray90}>
              미팅종류
            </AppText>

            <Controller
              control={control}
              name="meetingType"
              render={({ field: { value, onChange } }) => (
                <>
                  <MemoDropdownButton
                    label={value}
                    onPress={() => setShowTypePicker(v => !v)}
                  />
                  <MemoMeetingTypePicker
                    visible={showTypePicker}
                    onSelect={(type: TMeetingTypeLabel) => {
                      onChange(type);
                      setShowTypePicker(false);
                    }}
                    onClose={() => setShowTypePicker(false)}
                  />
                </>
              )}
            />
          </View>

          <View>
            <AppText variant="body7" color={AppColors.gray90}>
              날짜
            </AppText>

            <Controller
              control={control}
              name="date"
              render={({ field: { value, onChange } }) => (
                <>
                  <MemoDropdownButton
                    label={value || 'yyyy.mm.dd'}
                    textColor={value ? AppColors.gray100 : AppColors.gray40}
                    onPress={() => setShowDatePicker(true)}
                    icon={
                      <Calendar
                        size={`${ms(16)}`}
                        color={AppColors.gray60}
                        variant="Linear"
                      />
                    }
                  />
                  <MemoDatePickerModal
                    visible={showDatePicker}
                    value={value}
                    onConfirm={dateStr => {
                      setShowDatePicker(false);
                      onChange(dateStr);
                    }}
                    onCancel={() => setShowDatePicker(false)}
                  />
                </>
              )}
            />
          </View>

          <View>
            <AppText variant="body7" color={AppColors.gray90}>
              방문 장소{' '}
              <AppText variant="body7" color={AppColors.negative}>
                *
              </AppText>
            </AppText>

            <Controller
              control={control}
              name="visitLocation"
              render={({ field: { value } }) => (
                <Pressable
                  style={styles.dropdownBtn}
                  onPress={() => setShowPostcode(true)}
                >
                  <AppText
                    variant="body7"
                    color={value ? AppColors.gray100 : AppColors.gray40}
                  >
                    {value || '방문 장소를 입력하세요'}
                  </AppText>
                </Pressable>
              )}
            />

            <Modal
              visible={showPostcode}
              transparent
              animationType="slide"
              statusBarTranslucent
              onRequestClose={() => setShowPostcode(false)}
            >
              <View style={styles.postcodeOverlay}>
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => setShowPostcode(false)}
                />
                <View style={styles.postcodeSheet}>
                  <View style={styles.postcodeHandleBar} />
                  <AppText
                    variant="heading3"
                    color={AppColors.gray100}
                    style={styles.postcodeTitle}
                  >
                    주소 검색
                  </AppText>
                  <Postcode
                    style={styles.postcode}
                    jsOptions={{ animation: true }}
                    onSelected={data => {
                      setValue('visitLocation', data.address);
                      setShowPostcode(false);
                    }}
                    onError={() => setShowPostcode(false)}
                  />
                </View>
              </View>
            </Modal>
          </View>

          <RHFFormInput
            control={control}
            name="customerName"
            label="고객명"
            placeholder="고객명을 입력해주세요"
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { value, onChange } }) => (
              <MemoPhoneInput
                value={value}
                onChangeText={onChange}
                label="연락처"
                placeholder="연락처을 입력하세요"
              />
            )}
          />

          <RHFFormInput
            control={control}
            name="content"
            label="상담내용"
            placeholder="상담 내용을 입력해주세요"
            multiline
          />

          <View style={styles.uploadSection}>
            <AppText variant="body7" color={AppColors.gray90}>
              녹음파일
            </AppText>

            {recordings.length > 0 ? (
              recordings.map(rec => (
                <MemoFileInfoCard
                  key={rec.id}
                  fileName={fixBrokenUtf8Encoding(rec.fileName)}
                  fileSize={rec.fileSize}
                  onRemove={() => handleRemoveRecording(rec.id)}
                />
              ))
            ) : (
              <MemoFileUploadSection
                files={uploadFiles}
                onPickFile={handlePickFile}
                onRemoveFile={handleRemoveFile}
              />
            )}
          </View>
        </KeyboardAwareScrollView>

        <View style={styles.bottomContainer}>
          <MemoAppButton
            label="저장"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            style={styles.submitBtn}
          />
        </View>
      </MemoScreenBody>
    </AppSafeAreaView>
  );
};

export const MemoEditMeetingMinutesScreen = React.memo(
  EditMeetingMinutesScreen,
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
  uploadSection: {
    gap: ms(8),
  },
  bottomContainer: {
    backgroundColor: AppColors.white,
    paddingVertical: ms(16),
    alignItems: 'center',
    marginBottom: ms(10),
  },
  submitBtn: {
    width: ms(163),
    paddingVertical: ms(8),
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: ms(8),
    paddingHorizontal: ms(16),
    paddingVertical: ms(10),
    backgroundColor: AppColors.gray10,
    marginTop: ms(4),
  },
  postcodeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  postcodeSheet: {
    backgroundColor: AppColors.white,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    height: '80%',
  },
  postcodeHandleBar: {
    width: ms(50),
    height: ms(6),
    borderRadius: ms(100),
    backgroundColor: AppColors.gray20,
    alignSelf: 'center',
    marginTop: ms(14),
  },
  postcodeTitle: {
    textAlign: 'center',
    paddingVertical: ms(8),
    paddingHorizontal: ms(16),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray20,
  },
  postcode: {
    flex: 1,
  },
});
