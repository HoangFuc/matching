import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import DatePicker from 'react-native-date-picker';

import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { MemoAddressPickerInput } from '@/src/component/AddressPickerInput';
import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { MemoFormInput } from '@/src/component/FormInput';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import { ArrowDown2, Calendar } from '@/src/constants/icons';
import {
  TMeetingTypeKey,
  TMeetingTypeLabel,
  TUploadFile,
} from '@/src/interface/meetingMinutes.interface';
import { MeetingMinutesStackParamList } from '@/src/interface/tab.interface';
import { MemoFileUploadSection } from '../components/FileUploadSection';
import { MemoMeetingTypePicker } from '../components/MeetingTypePicker';
import { useMeetingLogUploadWithProgress } from '../hooks/useMeetingLogUploadWithProgress';

type TNav = NativeStackNavigationProp<MeetingMinutesStackParamList>;

const LABEL_TO_KEY: Record<TMeetingTypeLabel, TMeetingTypeKey> = {
  오프라인: 'offline',
  유선: 'recording',
};

const CreateMeetingMinutesScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();

  //---------------------------------------
  const { uploadMeetingLog } = useMeetingLogUploadWithProgress();

  //---------------------------------------
  const [meetingType, setMeetingType] =
    React.useState<TMeetingTypeLabel>('오프라인');
  const [showTypePicker, setShowTypePicker] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [address, setAddress] = React.useState('');
  const [customerName, setCustomerName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [content, setContent] = React.useState('');
  const [uploadFiles, setUploadFiles] = React.useState<TUploadFile[]>([]);
  const isPickingRef = React.useRef(false);

  //---------------------------------------
  const formattedDate = React.useMemo(() => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  }, [date]);

  //---------------------------------------
  const isFormValid = React.useMemo(
    () =>
      !!meetingType &&
      !!address.trim() &&
      !!customerName.trim() &&
      !!phone.trim() &&
      !!content.trim() &&
      uploadFiles.some(f => f.status === 'done'),
    [meetingType, address, customerName, phone, content, uploadFiles],
  );

  //---------------------------------------
  const formatFileSize = React.useCallback((bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }, []);

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
        progress: 100,
        status: 'done',
        uri: file.uri,
        type: file.type ?? 'audio/m4a',
      };

      setUploadFiles(prev => [...prev, newFile]);
    } catch (err) {
      if (isErrorWithCode(err) && err.code !== errorCodes.OPERATION_CANCELED) {
        console.error('DocumentPicker error:', err);
      }
    } finally {
      isPickingRef.current = false;
    }
  }, [formatFileSize]);

  //---------------------------------------
  const handleRemoveFile = React.useCallback((id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  }, []);

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

    const firstFile = uploadFiles.find(f => f.status === 'done');
    if (!firstFile?.uri) {
      Alert.alert('', '녹음파일을 업로드해주세요.');
      return;
    }

    const meetingDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const formPayload = {
      meetingType: LABEL_TO_KEY[meetingType],
      meetingDate,
      customerName: customerName.trim(),
      customerPhone: phone.trim(),
      address: address.trim(),
      consultationContent: content.trim(),
    };

    try {
      const result = await uploadMeetingLog(formPayload, {
        uri: firstFile.uri,
        name: firstFile.name,
        type: firstFile.type || 'audio/m4a',
      });

      navigation.replace('MeetingMinutesDetail', { id: result.id });
    } catch (err) {
      console.error('[CreateMeetingMinutes] Submit error:', err);
      Alert.alert('', '등록에 실패했습니다. 다시 시도해주세요.');
    }
  }, [
    customerName,
    content,
    uploadFiles,
    date,
    uploadMeetingLog,
    meetingType,
    phone,
    address,
    navigation,
  ]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MemoScreenHeader title="미팅록 작성" />

      <MemoScreenBody>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View>
            <AppText variant="body7" color={AppColors.gray90}>
              미팅종류
              <AppText variant="body7" color={AppColors.negative}>
                {' '}
                *
              </AppText>
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
              <AppText variant="body7" color={AppColors.negative}>
                {' '}
                *
              </AppText>
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

          <View>
            <AppText variant="body7" color={AppColors.gray90}>
              방문 장소{' '}
              <AppText variant="body7" color={AppColors.negative}>
                *
              </AppText>
            </AppText>

            <MemoAddressPickerInput value={address} onChange={setAddress} />
          </View>

          <MemoFormInput
            label="고객명"
            placeholder="고객명을 입력해주세요"
            value={customerName}
            onChangeText={setCustomerName}
            required
          />

          <MemoFormInput
            label="연락처"
            placeholder="연락처를 입력해주세요"
            value={phone}
            onChangeText={setPhone}
            required
          />

          <MemoFormInput
            label="상담내용"
            placeholder="상담 내용을 입력해주세요"
            value={content}
            onChangeText={setContent}
            multiline
            required
          />

          <View style={styles.uploadSection}>
            <AppText variant="body7" color={AppColors.gray90}>
              녹음파일
            </AppText>

            <MemoFileUploadSection
              files={uploadFiles}
              onPickFile={handlePickFile}
              onRemoveFile={handleRemoveFile}
            />
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <MemoAppButton
            label="등록"
            onPress={handleSubmit}
            variant="primary"
            style={styles.submitBtn}
            disabled={!isFormValid}
          />
        </View>
      </MemoScreenBody>
    </SafeAreaView>
  );
};

export const MemoCreateMeetingMinutesScreen = React.memo(
  CreateMeetingMinutesScreen,
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
