import React from 'react';
import { Alert, Modal, Pressable, StyleSheet, View } from 'react-native';

import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { moderateScale as ms } from 'react-native-size-matters/extend';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

import Postcode from '@actbase/react-daum-postcode';
import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { MemoDropdownButton } from '@/src/component/DropdownButton';
import { MemoPhoneInput, stripDashes } from '@/src/component/PhoneInput';
import { RHFFormInput } from '@/src/component/RHFFormInput';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { MemoDatePickerModal } from '@/src/component/calendar/DatePickerModal';
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
  date: string;
  address: string;
  customerName: string;
  phone: string;
  content: string;
}

const CreateMeetingMinutesScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();

  //---------------------------------------
  const { uploadMeetingLog } = useMeetingLogUploadWithProgress();

  //---------------------------------------
  const { control, handleSubmit, watch } = useForm<IFormData>({
    defaultValues: {
      meetingType: '오프라인',
      date: '',
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
  const [showPostcode, setShowPostcode] = React.useState(false);
  const [uploadFiles, setUploadFiles] = React.useState<TUploadFile[]>([]);
  const isPickingRef = React.useRef(false);

  //---------------------------------------
  const isFormValid = React.useMemo(
    () =>
      !!formValue.meetingType &&
      !!formValue.date &&
      !!formValue.address.trim() &&
      !!formValue.customerName.trim() &&
      !!formValue.phone.trim() &&
      !!formValue.content.trim(),
    [formValue],
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
        console.warn('[CreateMeetingMinutes] getAudioDuration failed:', durErr);
      }

      const newFile: TUploadFile = {
        id: `${Date.now()}`,
        name: file.name ?? 'unknown',
        size: formatFileSize(fileSizeBytes),
        progress: 100,
        status: 'done',
        uri: file.uri,
        type: file.type ?? 'audio/m4a',
        durationSeconds,
      };

      setUploadFiles(prev => [...prev, newFile]);
    } catch (err) {
      if (isErrorWithCode(err) && err.code !== errorCodes.OPERATION_CANCELED) {
        console.error('DocumentPicker error:', err);
      }
    } finally {
      isPickingRef.current = false;
    }
  }, [getAudioDuration]);

  //---------------------------------------
  const handleRemoveFile = React.useCallback((id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  //---------------------------------------
  const onSubmit = React.useCallback(
    async (data: IFormData) => {
      if (!data.date) return;

      const phone = stripDashes(data.phone);
      if (!phone.startsWith('010') || phone.length < 10) {
        Alert.alert('알림', '연락처는 010으로 시작해야 합니다.');
        return;
      }

      const firstFile = uploadFiles.find(f => f.status === 'done');
      const meetingDate = data.date.replace(/\./g, '-');

      const formPayload = {
        meetingType: LABEL_TO_KEY[data.meetingType],
        meetingDate,
        customerName: data.customerName.trim(),
        customerPhone: stripDashes(data.phone),
        address: data.address.trim(),
        consultationContent: data.content.trim(),
      };

      try {
        const result = await uploadMeetingLog(
          formPayload,
          firstFile
            ? {
                uri: firstFile.uri!,
                name: firstFile.name,
                type: firstFile.type || 'audio/m4a',
              }
            : undefined,
          firstFile?.durationSeconds,
        );

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
        <KeyboardAwareScrollView
          style={styles.flex1}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid
          extraScrollHeight={ms(20)}
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
              name="address"
              render={({ field: { value, onChange } }) => (
                <>
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
                            onChange(data.address);
                            setShowPostcode(false);
                          }}
                          onError={() => setShowPostcode(false)}
                        />
                      </View>
                    </View>
                  </Modal>
                </>
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

          <Controller
            control={control}
            name="phone"
            render={({ field: { value, onChange } }) => (
              <MemoPhoneInput
                value={value}
                onChangeText={onChange}
                required
              />
            )}
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
        </KeyboardAwareScrollView>

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
  flex1: {
    flex: 1,
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
