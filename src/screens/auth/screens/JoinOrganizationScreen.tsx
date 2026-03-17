import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Link1, Link21 } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { AppText } from '@/src/component/AppText';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import type { AuthStackParamList } from '@/src/interface/tab.interface';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'JoinOrganization'>;
};

const JoinOrganizationScreen: React.FC<Props> = ({ navigation }) => {
  //---------------------------------------
  const handleHasInviteCode = () => {
    // TODO: navigate to invite code input
  };

  //---------------------------------------
  const handleNoInviteCode = () => {
    // TODO: navigate to create organization
  };

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <MemoScreenHeader title="조직 참여 방법" />

      <MemoScreenBody style={styles.body}>
        {/* Content */}
        <View style={styles.content}>
          <AppText variant="body2" color={AppColors.gray100}>
            어떻게 참여하시겠어요?
          </AppText>

          {/* Option 1 - Has invite code */}
          <TouchableOpacity style={styles.optionCard} onPress={handleHasInviteCode}>
            <View style={styles.optionIconContainer}>
              <Link1 size={ms(28)} color={AppColors.purple} variant="Linear" />
            </View>
            <View style={styles.optionTextContainer}>
              <AppText variant="body2" color={AppColors.gray100}>
                초대 코드가 있어요
              </AppText>
              <AppText variant="body8" color={AppColors.gray60} style={styles.optionDescription}>
                전달받은 초대 코드를 입력하여 기존 조직에 바로 참여합니다.
              </AppText>
            </View>
          </TouchableOpacity>

          {/* Option 2 - No invite code */}
          <TouchableOpacity style={styles.optionCard} onPress={handleNoInviteCode}>
            <View style={styles.optionIconContainer}>
              <Link21 size={ms(28)} color={AppColors.purple} variant="Linear" />
            </View>
            <View style={styles.optionTextContainer}>
              <AppText variant="body2" color={AppColors.gray100}>
                초대 코드가 없어요
              </AppText>
              <AppText variant="body8" color={AppColors.gray60} style={styles.optionDescription}>
                새로운 대화시를 직접 만들고 팀원을 초대할 수 있습니다.
              </AppText>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.joinButton}>
            <AppText variant="body2" color={AppColors.white}>
              조직 참여하기
            </AppText>
          </TouchableOpacity>

          {/* Footer */}
          <AppText variant="detail" color={AppColors.gray50} style={styles.footer}>
            계속 진행함으로써 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다.
          </AppText>
        </View>
      </MemoScreenBody>
    </AppSafeAreaView>
  );
};

export const MemoJoinOrganizationScreen = React.memo(JoinOrganizationScreen);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
  body: {
    paddingHorizontal: ms(24),
  },
  content: {
    flex: 1,
    paddingTop: ms(28),
    gap: ms(16),
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(16),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: AppColors.gray20,
    gap: ms(14),
  },
  optionIconContainer: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    backgroundColor: AppColors.lavendar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTextContainer: {
    flex: 1,
    gap: ms(4),
  },
  optionDescription: {
    lineHeight: ms(18),
  },
  bottomContainer: {
    paddingBottom: ms(32),
  },
  joinButton: {
    backgroundColor: AppColors.purple,
    borderRadius: ms(99),
    paddingVertical: ms(14),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ms(12),
  },
  footer: {
    textAlign: 'center',
  },
});
