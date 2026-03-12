import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import DatePicker from 'react-native-date-picker';
import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { MemoFormInput } from '@/src/component/FormInput';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import { ArrowDown2, Calendar } from '@/src/constants/icons';
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
import { MemoFileUploadSection } from '../components/FileUploadSection';
import { MemoMeetingTypePicker } from '../components/MeetingTypePicker';
import {
  useDeleteRecordingMutation,
  useUpdateMeetingLogMutation,
} from '@/src/store/api/meetingLog.api';
import { useMeetingLogUploadWithProgress } from '../hooks/useMeetingLogUploadWithProgress';
import { useAppSelector } from '@/src/store/hooks';

type TRoute = NativeStackScreenProps<
  MeetingMinutesStackParamList,
  'EditMeetingMinutes'
>['route'];

const EditMeetingMinutesScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<TRoute>();
  const { item } = route.params;

  const [meetingType, setMeetingType] = React.useState<TMeetingTypeLabel>(
    MEETING_TYPE_LABEL[item.meetingType],
  );
  const [showTypePicker, setShowTypePicker] = React.useState(false);
  const [date, setDate] = React.useState(
    item.meetingDate ? new Date(item.meetingDate) : new Date(),
  );
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [visitLocation, setVisitLocation] = React.useState(item.address);
  const [customerName, setCustomerName] = React.useState(item.customerName);
  const [phone, setPhone] = React.useState(item.customerPhone);
  const [content, setContent] = React.useState(item.consultationContent);
  const [uploadFiles, setUploadFiles] = React.useState<TUploadFile[]>([]);
  const [recordings, setRecordings] = React.useState<TRecording[]>(
    item.recordings ?? [],
  );
  const [savedUploadId, setSavedUploadId] = React.useState<string | null>(null);
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
  const formattedDate = React.useMemo(() => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  }, [date]);

  //---------------------------------------
  const formatFileSize = React.useCallback((bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }, []);

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
        uploadFileWithUploadId(savedUploadId, filePayload);
      } else {
        try {
          const res = await deleteRecording(item.id).unwrap();
          const uploadId = res?.uploadId;
          if (uploadId) {
            setSavedUploadId(uploadId);
            uploadFileWithUploadId(uploadId, filePayload);
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
  }, [
    formatFileSize,
    savedUploadId,
    uploadFileWithUploadId,
    deleteRecording,
    item.id,
  ]);

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
  const handleSubmit = React.useCallback(async () => {
    if (!customerName.trim()) {
      Alert.alert('', '고객명을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('', '상담내용을 입력해주세요.');
      return;
    }

    try {
      const meetingDateStr = date.toISOString().split('T')[0];
      await updateMeetingLog({
        id: item.id,
        meetingType: MEETING_TYPE_KEY[meetingType],
        meetingDate: meetingDateStr,
        customerName: customerName.trim(),
        customerPhone: phone,
        address: visitLocation,
        consultationContent: content.trim(),
      }).unwrap();

      navigation.goBack();
    } catch (err) {
      console.error('[EditMeetingMinutes] Update error:', err);
      Alert.alert('', '수정에 실패했습니다.');
    }
  }, [
    customerName,
    content,
    date,
    meetingType,
    phone,
    visitLocation,
    item.id,
    updateMeetingLog,
    navigation,
  ]);

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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MemoScreenHeader title="미팅록 수정" />

      <MemoScreenBody>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View>
            <AppText variant="body7" color={AppColors.gray90}>
              미팅종류
            </AppText>

            <Pressable
              style={styles.dropdownBtn}
              onPress={() => setShowTypePicker(v => !v)}
            >
              <AppText variant="body7" color={AppColors.gray90}>
                {meetingType}
              </AppText>

              <ArrowDown2
                size={`${ms(16)}`}
                color={AppColors.gray60}
                variant="Linear"
              />
            </Pressable>

            <MemoMeetingTypePicker
              visible={showTypePicker}
              onSelect={setMeetingType}
              onClose={() => setShowTypePicker(false)}
            />
          </View>

          <View>
            <AppText variant="body7" color={AppColors.gray90}>
              날짜
            </AppText>

            <Pressable
              style={styles.dropdownBtn}
              onPress={() => setShowDatePicker(true)}
            >
              <AppText variant="body7" color={AppColors.gray100}>
                {formattedDate}
              </AppText>

              <Calendar
                size={`${ms(16)}`}
                color={AppColors.gray60}
                variant="Linear"
              />
            </Pressable>

            <DatePicker
              modal
              open={showDatePicker}
              date={date}
              mode="date"
              onConfirm={selectedDate => {
                setShowDatePicker(false);
                setDate(selectedDate);
              }}
              onCancel={() => setShowDatePicker(false)}
            />
          </View>

          <MemoFormInput
            label="방문 장소"
            placeholder="방문 장소를 입력해주세요"
            value={visitLocation}
            onChangeText={setVisitLocation}
          />

          <MemoFormInput
            label="고객명"
            placeholder="고객명을 입력해주세요"
            value={customerName}
            onChangeText={setCustomerName}
          />

          <MemoFormInput
            label="연락처"
            placeholder="연락처를 입력해주세요"
            value={phone}
            onChangeText={setPhone}
          />

          <MemoFormInput
            label="상담내용"
            placeholder="상담 내용을 입력해주세요"
            value={content}
            onChangeText={setContent}
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
                  fileName={rec.fileName}
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
        </ScrollView>

        <View style={styles.bottomContainer}>
          <MemoAppButton
            label="저장"
            onPress={handleSubmit}
            variant="primary"
            style={styles.submitBtn}
          />
        </View>
      </MemoScreenBody>
    </SafeAreaView>
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
  uploadSection: {
    gap: ms(8),
  },
  bottomContainer: {
    backgroundColor: AppColors.white,
    paddingVertical: ms(16),
    alignItems: 'center',
  },
  submitBtn: {
    width: ms(163),
    paddingVertical: ms(8),
  },
});
