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
import type { AuthStackParamList } from '@/src/interface/tab.interface';
import { MemoInviteCard } from '../components/inviteMember/InviteCard';
import type { TInviteLink } from '../type';

type Props = NativeStackScreenProps<AuthStackParamList, 'InviteMember'>;

const ROLE_OPTIONS_SINGLE = ['본부장', '팀장', '팀원'];
const ROLE_OPTIONS_DUAL = ['총괄 2', '본부장', '팀장', '팀원'];
const LOCATION_OPTIONS = ['본부1 > 팀1', '본부1 > 팀2', '본부2 > 팀1'];
const EXPIRY_OPTIONS = ['1일', '3일', '7일', '14일', '30일'];

let nextId = 1;

//---------------------------------------
const createInviteCard = (): TInviteLink => ({
  id: `invite-${nextId++}`,
  role: '',
  location: '본부1 > 팀1',
  expiry: '',
  generatedLink: '',
});

//---------------------------------------
const InviteMemberScreen: React.FC<Props> = ({ navigation, route }) => {
  const managementType = route.params?.managementType ?? 'single';
  const hideStepBar = route.params?.hideStepBar;
  const roleOptions =
    managementType === 'dual' ? ROLE_OPTIONS_DUAL : ROLE_OPTIONS_SINGLE;

  const [invites, setInvites] = React.useState<TInviteLink[]>([
    {
      id: 'invite-0',
      role: '팀원',
      location: '본부1 > 팀1',
      expiry: '7일',
      generatedLink: 'https://app.work.com/invite/eyJ0eX...',
    },
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
  const updateInviteField = React.useCallback(
    (inviteId: string, field: keyof TInviteLink, value: string) => {
      setInvites(prev =>
        prev.map(inv =>
          inv.id === inviteId ? { ...inv, [field]: value } : inv,
        ),
      );
    },
    [],
  );

  //---------------------------------------
  const handleSelectRole = React.useCallback(
    (inviteId: string, value: string) => {
      updateInviteField(inviteId, 'role', value);
    },
    [updateInviteField],
  );

  //---------------------------------------
  const handleSelectLocation = React.useCallback(
    (inviteId: string, value: string) => {
      updateInviteField(inviteId, 'location', value);
    },
    [updateInviteField],
  );

  //---------------------------------------
  const handleSelectExpiry = React.useCallback(
    (inviteId: string, value: string) => {
      updateInviteField(inviteId, 'expiry', value);
    },
    [updateInviteField],
  );

  //---------------------------------------
  const handleGenerateLink = React.useCallback((inviteId: string) => {
    // TODO: call API to generate link
    setInvites(prev =>
      prev.map(inv =>
        inv.id === inviteId
          ? {
              ...inv,
              generatedLink: `https://app.work.com/invite/eyJ0eX${Date.now().toString(
                36,
              )}...`,
            }
          : inv,
      ),
    );
  }, []);

  //---------------------------------------
  const handleCopy = React.useCallback((_inviteId: string) => {
    // TODO: copy link to clipboard
  }, []);

  //---------------------------------------
  const handleShare = React.useCallback((_inviteId: string) => {
    // TODO: open share sheet
  }, []);

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
              locationOptions={LOCATION_OPTIONS}
              expiryOptions={EXPIRY_OPTIONS}
              onSelectRole={handleSelectRole}
              onSelectLocation={handleSelectLocation}
              onSelectExpiry={handleSelectExpiry}
              onGenerateLink={handleGenerateLink}
              onCopy={handleCopy}
              onShare={handleShare}
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
