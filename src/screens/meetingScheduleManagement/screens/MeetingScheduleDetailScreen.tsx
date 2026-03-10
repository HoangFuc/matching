import React, { useCallback, useState } from 'react';
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
import { CardShadow } from '@/src/constants/shadows';
import { TMeetingScheduleStatus } from '@/src/interface/meetingScheduleManagement.interface';
import { RootStackParamList } from '@/src/interface/tab.interface';
import { Microphone2 } from '@/src/constants/icons';
import { MemoRecordedAudioCard } from '../components/RecordedAudioCard';
import { MemoRecordingBottomSheet } from '../components/RecordingBottomSheet';

type TRoute = NativeStackScreenProps<
  RootStackParamList,
  'MeetingScheduleDetail'
>['route'];
type TNav = NativeStackNavigationProp<RootStackParamList>;

const STATUS_CONFIG: Record<
  TMeetingScheduleStatus,
  { bgColor: string; textColor: string }
> = {
  미완료: {
    bgColor: AppColors.lightCream,
    textColor: AppColors.amber,
  },
  작성완료: {
    bgColor: AppColors.lightBlue,
    textColor: AppColors.strongBlue,
  },
};

const MeetingScheduleDetailScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();
  const route = useRoute<TRoute>();
  const { item } = route.params;

  const statusConfig = STATUS_CONFIG[item.status];
  const [showRecording, setShowRecording] = useState(false);
  const [recordedFile, setRecordedFile] = useState<{ path: string; name: string } | null>(null);

  //---------------------------------------
  const handleOpenRecording = useCallback(() => {
    setShowRecording(true);
  }, []);

  //---------------------------------------
  const handleCloseRecording = useCallback(() => {
    setShowRecording(false);
  }, []);

  //---------------------------------------
  const handleRecordingComplete = useCallback((filePath: string) => {
    setShowRecording(false);
    const fileName = filePath.split('/').pop() ?? 'recording.m4a';
    setRecordedFile({ path: filePath, name: fileName });
  }, []);

  //---------------------------------------
  const handleComplete = useCallback(() => {
    // TODO: call API to complete meeting
    navigation.goBack();
  }, [navigation]);

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
            <View style={styles.infoRow}>
              <AppText
                variant="body6"
                color={AppColors.gray90}
                style={styles.label}
              >
                상태
              </AppText>

              <MemoChip
                label={item.status}
                bgColor={statusConfig.bgColor}
                textColor={statusConfig.textColor}
                textVariant="detail"
              />
            </View>

            <View style={styles.infoRow}>
              <AppText
                variant="body6"
                color={AppColors.gray90}
                style={styles.label}
              >
                날짜
              </AppText>

              <AppText variant="body8" color={AppColors.gray90}>
                {item.date} {item.time}
              </AppText>
            </View>

            <View style={styles.infoRow}>
              <AppText
                variant="body6"
                color={AppColors.gray90}
                style={styles.label}
              >
                방문 장소
              </AppText>

              <AppText
                variant="body8"
                color={AppColors.gray90}
                style={styles.infoValue}
              >
                {item.visitLocation}
              </AppText>
            </View>

            <View style={styles.infoRow}>
              <AppText
                variant="body6"
                color={AppColors.gray90}
                style={styles.label}
              >
                고객명
              </AppText>

              <AppText variant="body8" color={AppColors.gray90}>
                {item.customerName}
              </AppText>
            </View>

            <View style={styles.infoRow}>
              <AppText
                variant="body6"
                color={AppColors.gray90}
                style={styles.label}
              >
                연락처
              </AppText>

              <AppText variant="body8" color={AppColors.gray90}>
                {item.phone}
              </AppText>
            </View>

            <View style={styles.infoRow}>
              <AppText
                variant="body6"
                color={AppColors.gray90}
                style={styles.label}
              >
                일정명
              </AppText>

              <AppText variant="body8" color={AppColors.gray90}>
                {item.scheduleName}
              </AppText>
            </View>

            <View style={styles.infoRow}>
              <AppText
                variant="body6"
                color={AppColors.gray90}
                style={styles.label}
              >
                메모
              </AppText>

              <AppText
                variant="body8"
                color={AppColors.gray90}
                style={styles.infoValue}
              >
                {item.memo}
              </AppText>
            </View>
          </View>

          {/* Recording Section */}
          {recordedFile ? (
            <MemoRecordedAudioCard
              filePath={recordedFile.path}
              fileName={recordedFile.name}
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
        <View style={styles.bottomContainer}>
          <MemoAppButton
            label="회의 완료"
            onPress={handleComplete}
            style={styles.completeBtn}
          />
        </View>
      </MemoScreenBody>

      <MemoRecordingBottomSheet
        visible={showRecording}
        onClose={handleCloseRecording}
        onRecordingComplete={handleRecordingComplete}
      />
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
