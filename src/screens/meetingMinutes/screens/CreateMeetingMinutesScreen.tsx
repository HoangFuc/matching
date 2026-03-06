import React, { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
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
  TMeetingType,
  TUploadFile,
} from '@/src/interface/meetingMinutes.interface';
import { MemoFileUploadSection } from '../components/FileUploadSection';
import { MemoMeetingTypePicker } from '../components/MeetingTypePicker';

const CreateMeetingMinutesScreen: React.FC = () => {
  const navigation = useNavigation();

  //---------------------------------------
  const [meetingType, setMeetingType] = useState<TMeetingType>('오프라인');
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [date, setDate] = useState('2025.12.13');
  const [customerName, setCustomerName] = useState('');
  const [content, setContent] = useState('');
  const [uploadFiles, setUploadFiles] = useState<TUploadFile[]>([]);

  //---------------------------------------
  const handlePickFile = useCallback(() => {
    Alert.alert('파일 선택', '파일 선택 기능은 추후 연동 예정입니다.');
  }, []);

  //---------------------------------------
  const handleRemoveFile = useCallback((id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  //---------------------------------------
  const handleRetryFile = useCallback((id: string) => {
    // TODO: retry upload
  }, []);

  //---------------------------------------
  const handleSubmit = useCallback(() => {
    if (!customerName.trim()) {
      Alert.alert('', '고객명을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('', '상담내용을 입력해주세요.');
      return;
    }
    // TODO: call API to create meeting minutes
    navigation.goBack();
  }, [customerName, content, navigation]);

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
            <Pressable style={styles.dropdownBtn}>
              <AppText variant="body7" color={AppColors.gray100}>
                {date}
              </AppText>
              <Calendar
                size={`${ms(16)}`}
                color={AppColors.gray60}
                variant="Linear"
              />
            </Pressable>
          </View>

          <MemoFormInput
            label="고객명"
            placeholder="고객명을 입력해주세요"
            value={customerName}
            onChangeText={setCustomerName}
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

            <MemoFileUploadSection
              files={uploadFiles}
              onPickFile={handlePickFile}
              onRemoveFile={handleRemoveFile}
              onRetryFile={handleRetryFile}
            />
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <MemoAppButton
            label="등록"
            onPress={handleSubmit}
            variant="primary"
            style={styles.submitBtn}
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
