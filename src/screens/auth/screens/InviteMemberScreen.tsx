import React from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Add, InfoCircle } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { AppText } from '@/src/component/AppText';
import { MemoBottomButtonGroup } from '@/src/component/BottomButtonGroup';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { MemoStepProgressBar } from '@/src/component/StepProgressBar';
import { AppColors } from '@/src/constants/colors';
import { ROLE_SLUGS, type TRoleSlug } from '@/src/interface/auth.interface';
import type { AuthStackParamList } from '@/src/interface/tab.interface';
import { useCreateInvitationMutation } from '@/src/store/api/auth.api';
import type { TDropdownOption } from '../components/inviteMember/InviteDropdownField';
import { MemoInviteCard } from '../components/inviteMember/InviteCard';
import type { TInviteLink } from '../type';

type Props = NativeStackScreenProps<AuthStackParamList, 'InviteMember'>;

const ROLE_SLUG_MAP: Record<string, TRoleSlug> = {
  '총괄 2': ROLE_SLUGS.DIRECTOR_2,
  '본부장': ROLE_SLUGS.DEPARTMENT_HEAD,
  '팀장': ROLE_SLUGS.TEAM_LEADER,
  '팀원': ROLE_SLUGS.MEMBER,
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
  location: '',
  departmentId: '',
  teamId: '',
  expiry: '',
  generatedLink: '',
});

//---------------------------------------
const InviteMemberScreen: React.FC<Props> = ({ navigation, route }) => {
  const company = route.params?.company;
  const hideStepBar = route.params?.hideStepBar;

  const departments = company?.departments ?? [];
  const directorCount = company?.directorCount ?? 1;
  const [createInvitation] = useCreateInvitationMutation();

  //---------------------------------------
  const roleOptions = React.useMemo<TDropdownOption[]>(() => {
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
  }, [directorCount]);

  //---------------------------------------
  const deptLocationOptions = React.useMemo<TDropdownOption[]>(
    () =>
      departments.map(d => ({
        label: d.name,
        value: `dept-${d.id}`,
        departmentId: d.id,
      })),
    [departments],
  );

  //---------------------------------------
  const teamLocationOptions = React.useMemo<TDropdownOption[]>(
    () =>
      departments.flatMap(d =>
        d.teams.map(t => ({
          label: `본부${d.name} > 팀${t.name}`,
          value: `team-${d.id}-${t.id}`,
          departmentId: d.id,
          teamId: t.id,
        })),
      ),
    [departments],
  );

  //---------------------------------------
  const getLocationOptionsForRole = React.useCallback(
    (role: string): TDropdownOption[] => {
      if (role === '본부장') {
        return deptLocationOptions;
      }
      if (role === '팀장' || role === '팀원') {
        return teamLocationOptions;
      }
      return [];
    },
    [deptLocationOptions, teamLocationOptions],
  );

  //---------------------------------------
  const isLocationDisabled = React.useCallback((role: string): boolean => {
    return role === '총괄 2' || role === '';
  }, []);

  const [invites, setInvites] = React.useState<TInviteLink[]>([
    createInviteCard(),
  ]);

  //---------------------------------------
  const handleBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  //---------------------------------------
  const handleFinish = React.useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }, [navigation]);

  //---------------------------------------
  const handleLater = React.useCallback(() => {
    // TODO: skip and navigate to main app
  }, []);

  //---------------------------------------
  const handleAddInvite = React.useCallback(() => {
    setInvites(prev => [...prev, createInviteCard()]);
  }, []);

  //---------------------------------------
  const handleSelectRole = React.useCallback(
    (inviteId: string, option: TDropdownOption) => {
      setInvites(prev =>
        prev.map(inv => {
          if (inv.id !== inviteId) {
            return inv;
          }
          const newRole = option.label;
          // Clear location if role type changed (different location options)
          const oldIsTeamLevel =
            inv.role === '팀장' || inv.role === '팀원';
          const newIsTeamLevel =
            newRole === '팀장' || newRole === '팀원';
          const oldIsDeptLevel = inv.role === '본부장';
          const newIsDeptLevel = newRole === '본부장';
          const locationCompatible =
            (oldIsTeamLevel && newIsTeamLevel) ||
            (oldIsDeptLevel && newIsDeptLevel);

          return {
            ...inv,
            role: newRole,
            location: locationCompatible ? inv.location : '',
            departmentId: locationCompatible ? inv.departmentId : '',
            teamId: locationCompatible ? inv.teamId : '',
          };
        }),
      );
    },
    [],
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

      const roleSlug = ROLE_SLUG_MAP[invite.role];
      if (!roleSlug) {
        return;
      }

      const expiresInDays = parseInt(invite.expiry, 10);
      if (isNaN(expiresInDays)) {
        return;
      }

      try {
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

        console.log('[InviteMember] Step 4 data:', params);
        const result = await createInvitation(params).unwrap();
        setInvites(prev =>
          prev.map(inv =>
            inv.id === inviteId
              ? { ...inv, generatedLink: result.inviteUrl }
              : inv,
          ),
        );
      } catch (error) {
        console.error('Failed to create invitation:', error);
      }
    },
    [invites, createInvitation],
  );

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={AppColors.purple} />

      <MemoScreenHeader title="새로운 멤버 초대" onPressBack={handleBack} />

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
              locationOptions={getLocationOptionsForRole(invite.role)}
              locationDisabled={isLocationDisabled(invite.role)}
              expiryOptions={EXPIRY_OPTIONS}
              onSelectRole={handleSelectRole}
              onSelectLocation={handleSelectLocation}
              onSelectExpiry={handleSelectExpiry}
              onGenerateLink={handleGenerateLink}
            />
          ))}
        </ScrollView>

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
});
