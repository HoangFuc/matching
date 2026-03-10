import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoChip } from '@/src/component/Chip';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import {
  Backward10Seconds,
  Edit2,
  Forward10Seconds,
  Play,
} from '@/src/constants/icons';
import {
  MEETING_BADGE_CONFIG,
  MEETING_TYPE_CONFIG,
} from '@/src/constants/meetingMinutes';
import { CardShadow } from '@/src/constants/shadows';
import { MeetingMinutesStackParamList } from '@/src/interface/tab.interface';

type TRoute = NativeStackScreenProps<
  MeetingMinutesStackParamList,
  'MeetingMinutesDetail'
>['route'];
type TNav = NativeStackNavigationProp<MeetingMinutesStackParamList>;

const MeetingMinutesDetailScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();
  const route = useRoute<TRoute>();
  const { item } = route.params;

  const typeConfig = MEETING_TYPE_CONFIG[item.type];
  const badgeConfig = MEETING_BADGE_CONFIG['녹취미팅'];

  const handleEdit = React.useCallback(() => {
    navigation.navigate('EditMeetingMinutes', { item });
  }, [navigation, item]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
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
            <View style={styles.infoRow}>
              <AppText
                variant="body7"
                color={AppColors.gray60}
                style={styles.label}
              >
                미팅종류
              </AppText>
              <View style={styles.badges}>
                <MemoChip
                  label={item.type}
                  bgColor={typeConfig.bgColor}
                  textColor={typeConfig.textColor}
                  textVariant="detail"
                />
                {item.isRecorded && (
                  <MemoChip
                    label="녹취파일"
                    bgColor={badgeConfig.bgColor}
                    textColor={badgeConfig.textColor}
                    textVariant="detail"
                  />
                )}
              </View>
            </View>

            <View style={styles.infoRow}>
              <AppText
                variant="body7"
                color={AppColors.gray60}
                style={styles.label}
              >
                날짜
              </AppText>
              <AppText variant="body7" color={AppColors.gray90}>
                {item.date}
              </AppText>
            </View>

            {!!item.visitLocation && (
              <View style={styles.infoRow}>
                <AppText
                  variant="body7"
                  color={AppColors.gray60}
                  style={styles.label}
                >
                  방문 장소
                </AppText>
                <AppText
                  variant="body7"
                  color={AppColors.gray90}
                  style={styles.infoValue}
                >
                  {item.visitLocation}
                </AppText>
              </View>
            )}

            <View style={styles.infoRow}>
              <AppText
                variant="body7"
                color={AppColors.gray60}
                style={styles.label}
              >
                고객명
              </AppText>
              <AppText variant="body7" color={AppColors.gray90}>
                {item.customerName}
              </AppText>
            </View>

            {!!item.phone && (
              <View style={styles.infoRow}>
                <AppText
                  variant="body7"
                  color={AppColors.gray60}
                  style={styles.label}
                >
                  연락처
                </AppText>
                <AppText variant="body7" color={AppColors.gray90}>
                  {item.phone}
                </AppText>
              </View>
            )}

            <View style={styles.infoRow}>
              <AppText
                variant="body7"
                color={AppColors.gray60}
                style={styles.label}
              >
                상담내용
              </AppText>
              <AppText variant="body7" color={AppColors.gray90}>
                {item.content}
              </AppText>
            </View>
          </View>

          {/* Audio Player */}
          {item.recordingFile && (
            <View style={styles.audioCard}>
              <AppText variant="body7" color={AppColors.gray90}>
                {item.recordingFile.name}
              </AppText>

              {/* Waveform placeholder */}
              <View style={styles.waveform}>
                {Array.from({ length: 40 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.waveBar,
                      { height: ms(8 + Math.random() * 24) },
                    ]}
                  />
                ))}
              </View>

              {/* Playback controls */}
              <View style={styles.controls}>
                <AppText variant="detail" color={AppColors.gray50}>
                  0:00
                </AppText>

                <Pressable hitSlop={8}>
                  <Backward10Seconds
                    size={`${ms(24)}`}
                    color={AppColors.gray80}
                    variant="Linear"
                  />
                </Pressable>

                <Pressable style={styles.playButton} hitSlop={8}>
                  <Play
                    size={`${ms(24)}`}
                    color={AppColors.gray80}
                    variant="Linear"
                  />
                </Pressable>

                <Pressable hitSlop={8}>
                  <Forward10Seconds
                    size={`${ms(24)}`}
                    color={AppColors.gray80}
                    variant="Linear"
                  />
                </Pressable>

                <AppText variant="detail" color={AppColors.gray50}>
                  {item.recordingFile.duration}
                </AppText>
              </View>
            </View>
          )}
        </ScrollView>
      </MemoScreenBody>
    </SafeAreaView>
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    width: ms(70),
  },
  infoValue: {
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: ms(4),
  },
  audioCard: {
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: AppColors.gray30,
    backgroundColor: AppColors.white,
    padding: ms(16),
    gap: ms(16),
    ...CardShadow,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: ms(40),
  },
  waveBar: {
    width: ms(3),
    borderRadius: ms(2),
    backgroundColor: AppColors.gray80,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playButton: {
    padding: ms(4),
  },
  iconContainer: {
    borderRadius: ms(8),
    padding: ms(4),
    gap: ms(10),
    backgroundColor: AppColors.gray20,
  },
});
