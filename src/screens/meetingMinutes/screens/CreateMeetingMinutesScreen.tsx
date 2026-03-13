import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import DatePicker from 'react-native-date-picker';

import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { MemoAddressPickerInput } from '@/src/component/AddressPickerInput';
import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { MemoDropdownButton } from '@/src/component/DropdownButton';
import { RHFFormInput } from '@/src/component/RHFFormInput';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import { Calendar } from '@/src/constants/icons';
import {
  TMeetingTypeKey,
  TMeetingTypeLabel,
  TUploadFile,
} from '@/src/interface/meetingMinutes.interface';
import { MeetingMinutesStackParamList } from '@/src/interface/tab.interface';
import { formatFileSize } from '@/src/utils/format';
import { MemoFileUploadSection } from '../components/FileUploadSection';
import { MemoMeetingTypePicker } from '../components/MeetingTypePicker';
import { useMeetingLogUploadWithProgress } from '../hooks/useMeetingLogUploadWithProgress';

type TNav = NativeStackNavigationProp<MeetingMinutesStackParamList>;

const LABEL_TO_KEY: Record<TMeetingTypeLabel, TMeetingTypeKey> = {
  오프라인: 'offline',
  유선: 'recording',
};

interface IFormData {
  meetingType: TMeetingTypeLabel;
  date: Date;
  address: string;
  customerName: string;
  phone: string;
  content: string;
}

const formatDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
};

const CreateMeetingMinutesScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();

  //---------------------------------------
  const { uploadMeetingLog } = useMeetingLogUploadWithProgress();

  //---------------------------------------
  const { control, handleSubmit, watch } = useForm<IFormData>({
    defaultValues: {
      meetingType: '오프라인',
      date: new Date(),
      address: '',
      customerName: '',
      phone: '',
      content: '',
    },
  });

  const formValue = watch();

  //---------------------------------------
  const [showTypePicker, setShowTypePicker] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [uploadFiles, setUploadFiles] = React.useState<TUploadFile[]>([]);
  const isPickingRef = React.useRef(false);

  //---------------------------------------
  const isFormValid = React.useMemo(
    () =>
      !!formValue.meetingType &&
      !!formValue.address.trim() &&
      !!formValue.customerName.trim() &&
      !!formValue.phone.trim() &&
      !!formValue.content.trim() &&
      uploadFiles.some(f => f.status === 'done'),
    [formValue, uploadFiles],
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
  }, []);

  //---------------------------------------
  const handleRemoveFile = React.useCallback((id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  //---------------------------------------
  const onSubmit = React.useCallback(
    async (data: IFormData) => {
      const firstFile = uploadFiles.find(f => f.status === 'done');
      if (!firstFile?.uri) {
        Alert.alert('', '녹음파일을 업로드해주세요.');
        return;
      }

      const meetingDate = `${data.date.getFullYear()}-${String(
        data.date.getMonth() + 1,
      ).padStart(2, '0')}-${String(data.date.getDate()).padStart(2, '0')}`;

      const formPayload = {
        meetingType: LABEL_TO_KEY[data.meetingType],
        meetingDate,
        customerName: data.customerName.trim(),
        customerPhone: data.phone.trim(),
        address: data.address.trim(),
        consultationContent: data.content.trim(),
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
    },
    [uploadFiles, uploadMeetingLog, navigation],
  );

  return (
    <AppSafeAreaView style={styles.safeArea}>
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
              <AppText variant="body7" color={AppColors.negative}>
                {' '}
                *
              </AppText>
            </AppText>

            <Controller
              control={control}
              name="date"
              render={({ field: { value, onChange } }) => (
                <>
                  <MemoDropdownButton
                    label={formatDate(value)}
                    textColor={AppColors.gray100}
                    onPress={() => setShowDatePicker(true)}
                    icon={
                      <Calendar
                        size={`${ms(16)}`}
                        color={AppColors.gray60}
                        variant="Linear"
                      />
                    }
                  />
                  <DatePicker
                    modal
                    open={showDatePicker}
                    date={value}
                    mode="date"
                    onConfirm={selectedDate => {
                      setShowDatePicker(false);
                      onChange(selectedDate);
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
              name="address"
              render={({ field: { value, onChange } }) => (
                <MemoAddressPickerInput value={value} onChange={onChange} />
              )}
            />
          </View>

          <RHFFormInput
            control={control}
            name="customerName"
            label="고객명"
            placeholder="고객명을 입력해주세요"
            required
          />

          <RHFFormInput
            control={control}
            name="phone"
            label="연락처"
            placeholder="연락처를 입력해주세요"
            required
          />

          <RHFFormInput
            control={control}
            name="content"
            label="상담내용"
            placeholder="상담 내용을 입력해주세요"
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
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            style={styles.submitBtn}
            disabled={!isFormValid}
          />
        </View>
      </MemoScreenBody>
    </AppSafeAreaView>
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
