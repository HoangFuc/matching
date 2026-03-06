import React, { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

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
import { ArrowDown2, Calendar, Trash } from '@/src/constants/icons';
import { TMeetingType } from '@/src/interface/meetingMinutes.interface';
import { MeetingMinutesStackParamList } from '@/src/interface/tab.interface';
import { MemoMeetingTypePicker } from '../components/MeetingTypePicker';

type TRoute = NativeStackScreenProps<
  MeetingMinutesStackParamList,
  'EditMeetingMinutes'
>['route'];

const EditMeetingMinutesScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<TRoute>();
  const { item } = route.params;

  const [meetingType, setMeetingType] = useState<TMeetingType>(item.type);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [date, setDate] = useState(item.date);
  const [customerName, setCustomerName] = useState(item.customerName);
  const [content, setContent] = useState(item.content);
  const [recordingFile, setRecordingFile] = useState(
    item.recordingFile ?? null,
  );

  const handleRemoveFile = useCallback(() => {
    setRecordingFile(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!customerName.trim()) {
      Alert.alert('', '고객명을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('', '상담내용을 입력해주세요.');
      return;
    }
    // TODO: call API to update meeting minutes
    navigation.goBack();
  }, [customerName, content, navigation]);

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

            <Pressable style={styles.dropdownBtn}>
              <AppText variant="body8" color={AppColors.gray90}>
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

            {recordingFile && (
              <View style={styles.fileItem}>
                <View style={styles.fileInfo}>
                  <AppText
                    variant="body7"
                    color={AppColors.gray80}
                    numberOfLines={1}
                  >
                    {recordingFile.name}
                  </AppText>

                  <AppText variant="detail" color={AppColors.gray50}>
                    {recordingFile.size}
                  </AppText>
                </View>

                <Pressable hitSlop={8} onPress={handleRemoveFile}>
                  <Trash
                    size={`${ms(20)}`}
                    color={AppColors.negative}
                    variant="Linear"
                  />
                </Pressable>
              </View>
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
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: ms(14),
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: AppColors.gray30,
    backgroundColor: AppColors.white,
    padding: ms(16),
    gap: ms(8),
    height: ms(109),
  },
  fileInfo: {
    flex: 1,
    gap: ms(2),
    marginRight: ms(8),
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
