import React from 'react';
import {
  BackHandler,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { CommonActions, useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Add, InfoCircle } from 'iconsax-react-nativejs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { AppText } from '@/src/component/AppText';
import { MemoBottomButtonGroup } from '@/src/component/BottomButtonGroup';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { MemoStepProgressBar } from '@/src/component/StepProgressBar';
import { AppColors } from '@/src/constants/colors';
import {
  ROLE_SLUGS,
  type ICompanyResponse,
  type TRoleSlug,
} from '@/src/interface/auth.interface';
import { getCompanyInfo } from '@/src/services/tokenService';
import type { AuthStackParamList } from '@/src/interface/tab.interface';
import { useToast } from '@/src/providers/ToastProvider';
import type { TInvitablePosition } from '@/src/store/api/auth.api';
import {
  useCreateInvitationMutation,
  useGetInvitableRolesQuery,
  useLazyGetInvitablePositionsQuery,
} from '@/src/store/api/auth.api';
import { MemoInviteCard } from '../components/inviteMember/InviteCard';
import type { TDropdownOption } from '../components/inviteMember/InviteDropdownField';
import type { TInviteLink } from '../type';

type Props = NativeStackScreenProps<AuthStackParamList, 'InviteMember'>;

const ROLE_SLUG_MAP: Record<string, TRoleSlug> = {
  '총괄 2': ROLE_SLUGS.DIRECTOR_2,
  본부장: ROLE_SLUGS.DEPARTMENT_HEAD,
  팀장: ROLE_SLUGS.TEAM_LEADER,
  팀원: ROLE_SLUGS.MEMBER,
};

const EXPIRY_OPTIONS: TDropdownOption[] = [
  { label: '1일', value: '1' },
  { label: '3일', value: '3' },
  { label: '7일', value: '7' },
  { label: '14일', value: '14' },
  { label: '30일', value: '30' },
];

let nextId = 1;

//---------------------------------------
const createInviteCard = (): TInviteLink => ({
  id: `invite-${nextId++}`,
  role: '',
  roleSlug: '',
  location: '',
  departmentId: '',
  teamId: '',
  expiry: '',
  generatedLink: '',
});

//---------------------------------------
const InviteMemberScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const hideStepBar = route.params?.hideStepBar;
  const directorCount = route.params?.directorCount ?? 1;

  const { data: invitableRoles, refetch: refetchRoles } =
    useGetInvitableRolesQuery();
  const [fetchPositions] = useLazyGetInvitablePositionsQuery();

  const [positionsByRoleSlug, setPositionsByRoleSlug] = React.useState<
    Record<string, TInvitablePosition[]>
  >({});

  const [companyInfo, setCompanyInfo] = React.useState<ICompanyResponse | null>(
    null,
  );

  const [createInvitation, { isLoading: isCreatingInvitation }] =
    useCreateInvitationMutation();
  const [generatingInviteId, setGeneratingInviteId] = React.useState<
    string | null
  >(null);

  //---------------------------------------
  const roleOptions = React.useMemo<TDropdownOption[]>(() => {
    if (invitableRoles) {
      return invitableRoles.map(r => ({
        label: r.name,
        value: r.slug,
      }));
    }
    const options: TDropdownOption[] = [];
    if (directorCount === 2) {
      options.push({ label: '총괄 2', value: '총괄 2' });
    }
    options.push(
      { label: '본부장', value: '본부장' },
      { label: '팀장', value: '팀장' },
      { label: '팀원', value: '팀원' },
    );
    return options;
  }, [invitableRoles, directorCount]);

  //---------------------------------------
  const getDeptLocationOptions = React.useCallback(
    (roleSlug: string): TDropdownOption[] => {
      const positions = positionsByRoleSlug[roleSlug];
      if (positions) {
        return positions.map(p => ({
          label: `본부${p.departmentName}`,
          value: `dept-${p.departmentId}`,
          departmentId: p.departmentId,
          disabled: false,
        }));
      }
      return [];
    },
    [positionsByRoleSlug],
  );

  //---------------------------------------
  const getTeamLocationOptions = React.useCallback(
    (roleSlug: string): TDropdownOption[] => {
      const positions = positionsByRoleSlug[roleSlug];
      if (positions) {
        return positions.flatMap(p =>
          p.teams.map(t => ({
            label: `본부${p.departmentName} > 팀${t.teamName}`,
            value: `team-${p.departmentId}-${t.teamId}`,
            departmentId: p.departmentId,
            teamId: t.teamId,
            disabled:
              roleSlug === ROLE_SLUGS.TEAM_LEADER &&
              companyInfo?.teamId === t.teamId,
          })),
        );
      }
      return [];
    },
    [positionsByRoleSlug, companyInfo],
  );

  //---------------------------------------
  const getLocationOptionsForRoleSlug = React.useCallback(
    (roleSlug: string): TDropdownOption[] => {
      if (roleSlug === ROLE_SLUGS.DEPARTMENT_HEAD) {
        return getDeptLocationOptions(roleSlug);
      }
      if (
        roleSlug === ROLE_SLUGS.TEAM_LEADER ||
        roleSlug === ROLE_SLUGS.MEMBER
      ) {
        return getTeamLocationOptions(roleSlug);
      }
      return [];
    },
    [getDeptLocationOptions, getTeamLocationOptions],
  );

  //---------------------------------------
  const isLocationDisabledBySlug = React.useCallback(
    (roleSlug: string): boolean => {
      return (
        roleSlug === ROLE_SLUGS.DIRECTOR_2 ||
        roleSlug === ROLE_SLUGS.DIRECTOR ||
        roleSlug === ''
      );
    },
    [],
  );

  //---------------------------------------
  const isDirectorSlug = React.useCallback((roleSlug: string): boolean => {
    return (
      roleSlug === ROLE_SLUGS.DIRECTOR || roleSlug === ROLE_SLUGS.DIRECTOR_2
    );
  }, []);

  //---------------------------------------
  const getDirectorLabel = React.useCallback(
    (roleSlug: string): string | undefined => {
      const positions = positionsByRoleSlug[roleSlug];
      if (!isDirectorSlug(roleSlug) || !positions) {
        return undefined;
      }
      return positions.map(p => `${p.departmentName}본부`).join(', ');
    },
    [isDirectorSlug, positionsByRoleSlug],
  );

  //---------------------------------------
  const { showToast } = useToast();

  const [invites, setInvites] = React.useState<TInviteLink[]>([
    createInviteCard(),
  ]);

  //---------------------------------------
  const hasUnsavedChanges = React.useMemo(() => {
    return invites.some(
      inv => (inv.role || inv.location || inv.expiry) && !inv.generatedLink,
    );
  }, [invites]);

  //---------------------------------------
  const handleShare = React.useCallback(() => {
    showToast({
      type: 'success',
      message: '초대장이 성공적으로 생성되었습니다',
    });
    navigation.navigate('OrganizationChart' as any);
  }, [navigation, showToast]);

  //---------------------------------------
  const handleFinish = React.useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      }),
    );
  }, [navigation]);

  //---------------------------------------
  const handleLater = React.useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      }),
    );
    return;
  }, [navigation]);

  //---------------------------------------
  const handleAddInvite = React.useCallback(() => {
    setInvites(prev => [...prev, createInviteCard()]);
  }, []);

  //---------------------------------------
  const handleSelectRole = React.useCallback(
    async (inviteId: string, option: TDropdownOption) => {
      const slug = invitableRoles
        ? option.value
        : ROLE_SLUG_MAP[option.value] ?? option.value;

      setInvites(prev =>
        prev.map(inv => {
          if (inv.id !== inviteId) {
            return inv;
          }
          return {
            ...inv,
            role: option.label,
            roleSlug: slug,
            location: '',
            departmentId: '',
            teamId: '',
          };
        }),
      );

      if (slug && !positionsByRoleSlug[slug]) {
        const result = await fetchPositions(slug);
        if (result.data) {
          const data = result.data;
          setPositionsByRoleSlug(prev => ({
            ...prev,
            [slug]: data,
          }));
        }
      }
    },
    [invitableRoles, positionsByRoleSlug, fetchPositions],
  );

  //---------------------------------------
  const handleSelectLocation = React.useCallback(
    (inviteId: string, option: TDropdownOption) => {
      setInvites(prev =>
        prev.map(inv =>
          inv.id === inviteId
            ? {
                ...inv,
                location: option.label,
                departmentId: option.departmentId ?? '',
                teamId: option.teamId ?? '',
              }
            : inv,
        ),
      );
    },
    [],
  );

  //---------------------------------------
  const handleSelectExpiry = React.useCallback(
    (inviteId: string, option: TDropdownOption) => {
      setInvites(prev =>
        prev.map(inv =>
          inv.id === inviteId ? { ...inv, expiry: option.label } : inv,
        ),
      );
    },
    [],
  );

  //---------------------------------------
  const handleGenerateLink = React.useCallback(
    async (inviteId: string) => {
      const invite = invites.find(inv => inv.id === inviteId);
      if (!invite) {
        return;
      }

      const roleSlug = (invite.roleSlug ||
        ROLE_SLUG_MAP[invite.role]) as TRoleSlug;
      if (!roleSlug) {
        return;
      }

      const expiresInDays = parseInt(invite.expiry, 10);
      if (isNaN(expiresInDays)) {
        return;
      }

      setGeneratingInviteId(inviteId);

      const params: {
        roleSlug: TRoleSlug;
        departmentId?: string;
        teamId?: string;
        expiresInDays: number;
      } = { roleSlug, expiresInDays };

      if (invite.departmentId) {
        params.departmentId = invite.departmentId;
      }
      if (invite.teamId) {
        params.teamId = invite.teamId;
      }

      const response = await createInvitation(params);

      if ('data' in response && response.data) {
        const inviteUrl = response.data.inviteUrl;
        setInvites(prev =>
          prev.map(inv =>
            inv.id === inviteId ? { ...inv, generatedLink: inviteUrl } : inv,
          ),
        );
      }

      setGeneratingInviteId(null);
    },
    [invites, createInvitation],
  );

  //---------------------------------------
  useFocusEffect(
    React.useCallback(() => {
      refetchRoles();
      getCompanyInfo().then(info => {
        if (info) {
          setCompanyInfo(info);
        }
      });
    }, [refetchRoles]),
  );

  //---------------------------------------
  React.useEffect(() => {
    navigation.setOptions({ gestureEnabled: false });

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={AppColors.purple} />

      <MemoScreenHeader
        title="새로운 멤버 초대"
        hideBackButton={!hideStepBar}
        onPressBack={hideStepBar ? () => navigation.goBack() : undefined}
      />

      <MemoScreenBody>
        {!hideStepBar && (
          <View style={styles.stepBarContainer}>
            <MemoStepProgressBar currentStep={4} totalSteps={4} />
          </View>
        )}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Info text */}
          {!hideStepBar && (
            <View style={styles.infoRow}>
              <InfoCircle
                size={`${ms(14)}`}
                color={AppColors.gray80}
                variant="Linear"
              />

              <AppText
                variant="detail"
                color={AppColors.gray80}
                style={styles.infoText}
              >
                팀원들이 쉽고 빠르게 합류할 수 있도록 초대 링크를 생성합니다.
              </AppText>
            </View>
          )}

          {/* Section header */}
          <View style={styles.sectionHeader}>
            <AppText variant="body5" color={AppColors.gray90}>
              초대 링크 생성
            </AppText>

            <Pressable style={styles.addButton} onPress={handleAddInvite}>
              <Add
                size={`${ms(14)}`}
                color={AppColors.purple}
                variant="Linear"
              />

              <AppText variant="body6" color={AppColors.purple}>
                추가
              </AppText>
            </Pressable>
          </View>

          {/* Invite cards */}
          {invites.map(invite => (
            <MemoInviteCard
              key={invite.id}
              invite={invite}
              roleOptions={roleOptions}
              locationOptions={getLocationOptionsForRoleSlug(invite.roleSlug)}
              locationDisabled={isLocationDisabledBySlug(invite.roleSlug)}
              expiryOptions={EXPIRY_OPTIONS}
              directorLabel={getDirectorLabel(invite.roleSlug)}
              onSelectRole={handleSelectRole}
              onSelectLocation={handleSelectLocation}
              onSelectExpiry={handleSelectExpiry}
              onGenerateLink={handleGenerateLink}
              isGeneratingLink={
                isCreatingInvitation && generatingInviteId === invite.id
              }
            />
          ))}
        </ScrollView>

        {hideStepBar ? (
          <View
            style={[
              styles.container,
              { marginBottom: Math.max(insets.bottom, ms(16)) },
            ]}
          >
            <MemoAppButton
              label="공유하기"
              variant="primary"
              textVariant="body6"
              disabled={hasUnsavedChanges}
              onPress={handleShare}
              style={styles.buttonWrapper}
            />
          </View>
        ) : (
          <MemoBottomButtonGroup>
            <MemoAppButton
              label="나중에"
              variant="secondary"
              textVariant="body6"
              onPress={handleLater}
            />

            <MemoAppButton
              label="완료"
              variant="primary"
              textVariant="body6"
              onPress={handleFinish}
            />
          </MemoBottomButtonGroup>
        )}
      </MemoScreenBody>
    </AppSafeAreaView>
  );
};

export const MemoInviteMemberScreen = React.memo(InviteMemberScreen);

//---------------------------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
  stepBarContainer: {
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
    marginBottom: ms(8),
  },
  scrollContent: {
    flexGrow: 1,
    padding: ms(16),
    gap: ms(16),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ms(4),
  },
  infoText: {
    flex: 1,
  },
  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
    borderRadius: ms(100),
    paddingHorizontal: ms(10),
    paddingVertical: ms(4),
    backgroundColor: AppColors.lavendar,
  },
  shareButtonContainer: {
    alignItems: 'center',
    paddingVertical: ms(16),
    paddingHorizontal: ms(16),
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: ms(8),
    paddingVertical: ms(16),
    paddingHorizontal: ms(16),
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#5329C2',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.14,
        shadowRadius: 8,
      },
      default: {
        boxShadow: '0px -2px 10px 0px #5353530D',
      },
    }),
  },
  buttonWrapper: {
    alignSelf: 'center',
    paddingVertical: ms(8),
    paddingHorizontal: ms(12),
    width: ms(163),
    marginBottom: ms(10),
  },
});
