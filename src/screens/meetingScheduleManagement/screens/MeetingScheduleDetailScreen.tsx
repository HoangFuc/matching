import React, { useCallback, useMemo, useState } from 'react';
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
import {
  IMeetingScheduleManagement,
  TMeetingScheduleStatus,
} from '@/src/interface/meetingScheduleManagement.interface';
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

type TInfoRow =
  | { label: string; type: 'text'; value: string; flex?: boolean }
  | { label: string; type: 'chip'; status: TMeetingScheduleStatus };

const buildInfoRows = (item: IMeetingScheduleManagement): TInfoRow[] => [
  { label: '상태', type: 'chip', status: item.status },
  { label: '날짜', type: 'text', value: `${item.date} ${item.time}` },
  { label: '방문 장소', type: 'text', value: item.visitLocation, flex: true },
  { label: '고객명', type: 'text', value: item.customerName },
  { label: '연락처', type: 'text', value: item.phone },
  { label: '일정명', type: 'text', value: item.scheduleName },
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
        label={row.status}
        bgColor={STATUS_CONFIG[row.status].bgColor}
        textColor={STATUS_CONFIG[row.status].textColor}
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

  const [showRecording, setShowRecording] = useState(false);
  const [recordedFile, setRecordedFile] = useState<{
    path: string;
    name: string;
  } | null>(null);

  const infoRows = useMemo(() => buildInfoRows(item), [item]);

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
            {infoRows.map(row => (
              <MemoInfoRow key={row.label} row={row} />
            ))}
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
