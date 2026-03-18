import React from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, View } from 'react-native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { AppText } from '@/src/component/AppText';
import { MemoBottomButtonGroup } from '@/src/component/BottomButtonGroup';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import { ArrowRight2, Calendar, TickCircle } from '@/src/constants/icons';
import { AppImages } from '@/src/constants/images';
import type { AuthStackParamList } from '@/src/interface/tab.interface';

type Props = {
  navigation: NativeStackNavigationProp<
    AuthStackParamList,
    'ConfirmOrganizationInvitation'
  >;
};

const ConfirmOrganizationInvitationScreen: React.FC<Props> = ({
  navigation,
}) => {
  //---------------------------------------
  const handleReject = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  //---------------------------------------
  const handleJoin = React.useCallback(() => {
    navigation.navigate('JoinMembership');
  }, [navigation]);

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={AppColors.purple} />

      <MemoScreenHeader title="조직 초대 확인" />

      <MemoScreenBody>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top message */}
          <View style={styles.messageSection}>
            <AppText
              variant="body2"
              color={AppColors.gray90}
              style={styles.textCenter}
            >
              새로운 조직에서 귀하를 초대했습니다.
            </AppText>

            <AppText
              variant="detail"
              color={AppColors.gray80}
              style={styles.textCenter}
            >
              조직 내용을 확인하시고 참여 여부를 결정해주세요.
            </AppText>
          </View>

          {/* Organization card */}
          <MemoBaseCard style={styles.orgCard}>
            <Image source={AppImages.logoSquare} style={styles.orgLogo} />

            <View style={styles.orgInfo}>
              <AppText variant="heading3" color={AppColors.gray90}>
                에이전트 시너지
              </AppText>

              <AppText variant="body8" color={AppColors.gray90}>
                종합 광고 대행사
              </AppText>
            </View>
          </MemoBaseCard>

          {/* 소속 위치 */}
          <MemoBaseCard style={styles.section}>
            <AppText variant="body6" color={AppColors.gray90}>
              소속 위치
            </AppText>

            <View style={styles.breadcrumbRow}>
              <View
                style={[
                  styles.breadcrumbTag,
                  { backgroundColor: AppColors.warmIvory },
                ]}
              >
                <View style={{ flexDirection: 'row' }}>
                  <AppText variant="body8" color={AppColors.burntOrange}>
                    총괄{' '}
                  </AppText>

                  <AppText variant="body6" color={AppColors.burntOrange}>
                    A
                  </AppText>
                </View>
              </View>

              <ArrowRight2
                size={ms(14)}
                color={AppColors.gray50}
                variant="Linear"
              />

              <View
                style={[
                  styles.breadcrumbTag,
                  { backgroundColor: AppColors.lightLime },
                ]}
              >
                <AppText variant="body6" color={AppColors.green}>
                  3본부
                </AppText>
              </View>

              <ArrowRight2
                size={ms(14)}
                color={AppColors.gray50}
                variant="Linear"
              />

              <View
                style={[
                  styles.breadcrumbTag,
                  { backgroundColor: AppColors.lightBlue },
                ]}
              >
                <AppText variant="body6" color={AppColors.strongBlue}>
                  12팀
                </AppText>
              </View>
            </View>
          </MemoBaseCard>

          {/* 부여된 직책 */}
          <MemoBaseCard style={styles.section}>
            <AppText variant="body6" color={AppColors.gray90}>
              부여된 직책
            </AppText>

            <AppText variant="body8" color={AppColors.gray90}>
              <AppText variant="body5" color={AppColors.gray90}>
                팀원:
              </AppText>{' '}
              실제 고객을 만나고 계약을 만들어내는 실무 영업의 주체입니다.
            </AppText>
          </MemoBaseCard>

          {/* 초대 정보 */}
          <MemoBaseCard style={styles.section}>
            <AppText variant="body6" color={AppColors.gray90}>
              초대 상세 정보
            </AppText>

            <View style={styles.inviteInfoRow}>
              <MemoBaseCard style={styles.inviteInfoItem} shadow={false}>
                <AppText variant="body7" color={AppColors.gray90}>
                  초대한 사람
                </AppText>

                <View style={styles.personRow}>
                  <Image
                    source={AppImages.avatar}
                    style={styles.avatar}
                    resizeMode="cover"
                  />

                  <AppText variant="body6" color={AppColors.gray90}>
                    김철수 팀장
                  </AppText>
                </View>
              </MemoBaseCard>

              <MemoBaseCard style={styles.inviteInfoItem} shadow={false}>
                <AppText variant="body7" color={AppColors.gray90}>
                  초대 만료일
                </AppText>

                <View style={styles.personRow}>
                  <Calendar
                    size={ms(30)}
                    color={AppColors.gray90}
                    variant="Linear"
                  />

                  <AppText variant="body6" color={AppColors.gray90}>
                    2024.12.31
                  </AppText>
                </View>
              </MemoBaseCard>
            </View>
          </MemoBaseCard>

          {/* Notice */}
          <View style={styles.noticeSection}>
            <TickCircle
              size={ms(16)}
              color={AppColors.gray80}
              variant="Linear"
            />

            <AppText
              variant="detail"
              color={AppColors.gray90}
              style={styles.noticeText}
            >
              조직 참여 시 해당 소속의 공유 문서와 팀 프로젝트에 접근할 수 있는
              권한이 부여됩니다. 본인이 맞는지 확인 후 수락해 주세요.
            </AppText>
          </View>
        </ScrollView>

        {/* Bottom buttons */}
        <MemoBottomButtonGroup>
          <MemoAppButton
            label="거절하기"
            textVariant="body6"
            onPress={handleReject}
            textColor={AppColors.negative}
          />
          <MemoAppButton
            label="조직 참여하기"
            variant="primary"
            onPress={handleJoin}
          />
        </MemoBottomButtonGroup>
      </MemoScreenBody>
    </AppSafeAreaView>
  );
};

export const MemoConfirmOrganizationInvitationScreen = React.memo(
  ConfirmOrganizationInvitationScreen,
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
  scrollContent: {
    flexGrow: 1,
    padding: ms(16),
    gap: ms(16),
  },
  textCenter: {
    textAlign: 'center',
  },
  messageSection: {
    gap: ms(4),
  },
  orgCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    marginTop: ms(12),
  },
  orgLogo: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(100),
    padding: ms(10),
  },
  orgInfo: {
    flex: 1,
    gap: ms(2),
  },
  section: {
    gap: ms(8),
    borderRadius: ms(14),
  },
  breadcrumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  breadcrumbTag: {
    paddingHorizontal: ms(8),
    paddingVertical: ms(4),
    borderRadius: ms(100),
    width: ms(87),
    alignItems: 'center',
  },
  roleCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: ms(12),
    borderRadius: ms(10),
    backgroundColor: AppColors.gray10,
  },
  inviteInfoRow: {
    flexDirection: 'row',
    gap: ms(16),
  },
  inviteInfoItem: {
    flex: 1,
    gap: ms(8),
    padding: ms(8),
    borderRadius: ms(8),
  },
  inviteDivider: {
    width: 1,
    backgroundColor: AppColors.gray20,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  avatar: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
  },
  noticeSection: {
    flexDirection: 'row',
    borderRadius: ms(10),
    gap: ms(6),
    alignItems: 'center',
    backgroundColor: AppColors.pastelPink,
  },
  noticeText: {
    flex: 1,
    lineHeight: ms(18),
  },
});
