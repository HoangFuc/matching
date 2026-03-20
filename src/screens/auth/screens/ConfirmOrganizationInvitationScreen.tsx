import React from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, View } from 'react-native';

import { CommonActions } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
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
import { saveTokens, saveUserInfo, saveCompanyInfo } from '@/src/services/tokenService';
import { useJoinCompanyMutation } from '@/src/store/api/auth.api';
import type { AuthStackParamList } from '@/src/interface/tab.interface';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'ConfirmOrganizationInvitation'
>;

const BREADCRUMB_COLORS = [
  AppColors.lightCream,
  AppColors.lightGreen,
  AppColors.lightBlue,
];

const ConfirmOrganizationInvitationScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { invitation, inviteCode, fromSocialLogin } = route.params;
  const [joinCompany, { isLoading: isJoining }] = useJoinCompanyMutation();

  console.log('======================nodePath', invitation.nodePath);

  //---------------------------------------
  const breadcrumbs = React.useMemo(() => {
    const items: { label: string; bgColor: string; textColor: string }[] = [];

    if (invitation.directors?.[0]?.fullName) {
      items.push({
        label: `총괄 ${invitation.directors[0].fullName}`,
        bgColor: BREADCRUMB_COLORS[0],
        textColor: AppColors.burntOrange,
      });
    }

    if (invitation.department?.name) {
      items.push({
        label: `${invitation.department.name}본부`,
        bgColor: BREADCRUMB_COLORS[1],
        textColor: AppColors.green,
      });
    }

    if (invitation.team?.name) {
      items.push({
        label: `${invitation.team.name}팀`,
        bgColor: BREADCRUMB_COLORS[2],
        textColor: AppColors.strongBlue,
      });
    }

    return items;
  }, [invitation.directors, invitation.department, invitation.team]);

  //---------------------------------------
  const handleReject = React.useCallback(() => {
    navigation.navigate('Welcome');
  }, [navigation]);

  //---------------------------------------
  const handleJoin = React.useCallback(async () => {
    if (fromSocialLogin) {
      try {
        const result = await joinCompany({ inviteCode }).unwrap();
        if (result.accessToken) {
          await saveTokens(result.accessToken, result.refreshToken);
        }
        if (result.user) {
          await saveUserInfo(result.user);
        }
        if (result.companies) {
          await saveCompanyInfo(result.companies);
        }
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          }),
        );
      } catch (error) {
        console.error('Failed to join company:', error);
      }
    } else {
      navigation.navigate('JoinMembership', { inviteCode });
    }
  }, [navigation, fromSocialLogin, inviteCode, joinCompany]);

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
            <Image
              source={
                invitation.company.logoUrl
                  ? { uri: invitation.company.logoUrl }
                  : AppImages.logoSquare
              }
              style={styles.orgLogo}
            />

            <View style={styles.orgInfo}>
              <AppText variant="heading3" color={AppColors.gray90}>
                {invitation.company.name}
              </AppText>
            </View>
          </MemoBaseCard>

          {/* 소속 위치 */}
          {breadcrumbs.length > 0 && (
            <MemoBaseCard style={styles.section}>
              <AppText variant="body6" color={AppColors.gray90}>
                소속 위치
              </AppText>

              <View style={styles.breadcrumbRow}>
                {breadcrumbs.map((item, index) => (
                  <React.Fragment key={index}>
                    <View
                      style={[
                        styles.breadcrumbTag,
                        { backgroundColor: item.bgColor },
                      ]}
                    >
                      <AppText variant="body6" color={item.textColor}>
                        {item.label}
                      </AppText>
                    </View>

                    {index < breadcrumbs.length - 1 && (
                      <ArrowRight2
                        size={ms(14)}
                        color={AppColors.gray50}
                        variant="Linear"
                      />
                    )}
                  </React.Fragment>
                ))}
              </View>
            </MemoBaseCard>
          )}

          {/* 부여된 직책 */}
          <MemoBaseCard style={styles.section}>
            <AppText variant="body6" color={AppColors.gray90}>
              부여된 직책
            </AppText>

            <AppText variant="body8" color={AppColors.gray90}>
              <AppText variant="body5" color={AppColors.gray90}>
                {invitation.role.name}:
              </AppText>{' '}
              {invitation.role.description}
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
                    source={
                      invitation.inviter.avatarUrl
                        ? { uri: invitation.inviter.avatarUrl }
                        : AppImages.avatar
                    }
                    style={styles.avatar}
                    resizeMode="cover"
                  />

                  <AppText variant="body6" color={AppColors.gray90}>
                    {invitation.inviter.fullName} {invitation.inviter.roleName}
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
                    {(() => {
                      const d = new Date(invitation.expiresAt);
                      return `${d.getFullYear()}.${
                        d.getMonth() + 1
                      }.${d.getDate()}`;
                    })()}
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
            backgroundColor={AppColors.pastelPink}
          />

          <MemoAppButton
            label="조직 참여하기"
            variant="primary"
            onPress={handleJoin}
            loading={isJoining}
            disabled={isJoining}
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
    gap: ms(6),
  },
  breadcrumbTag: {
    flex: 1,
    paddingVertical: ms(4),
    borderRadius: ms(100),
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
    borderWidth: 1,
    borderColor: AppColors.gray20,
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
  },
  noticeText: {
    flex: 1,
    lineHeight: ms(18),
  },
});
