import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ms } from 'react-native-size-matters/extend';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { AppText } from '@/src/component/AppText';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import type { AuthStackParamList } from '@/src/interface/tab.interface';
import { MemoHasCodeOption } from '@/src/screens/auth/components/HasCodeOption';
import { MemoNoCodeOption } from '@/src/screens/auth/components/NoCodeOption';

type Props = NativeStackScreenProps<AuthStackParamList, 'JoinOrganization'>;

const JoinOrganizationScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const fromSocialLogin = route.params?.fromSocialLogin;
  const deepLinkInviteCode = route.params?.inviteCode;
  const [selectedOption, setSelectedOption] = useState<
    'hasCode' | 'noCode' | null
  >(deepLinkInviteCode ? 'hasCode' : null);

  //---------------------------------------
  const handleHasInviteCode = () => {
    setSelectedOption('hasCode');
  };

  //---------------------------------------
  const handleNoInviteCode = () => {
    setSelectedOption('noCode');
  };

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={AppColors.purple} />

      <MemoScreenHeader title="조직 참여 방법" />

      <MemoScreenBody style={styles.body}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid
          extraScrollHeight={ms(120)}
        >
          {/* Content */}
          <View style={styles.content}>
            <AppText
              variant="body2"
              color={AppColors.gray100}
              style={{
                textAlign: 'center',
              }}
            >
              어떻게 참여하시겠어요?
            </AppText>

            <MemoHasCodeOption
              isSelected={selectedOption === 'hasCode'}
              onSelect={handleHasInviteCode}
              fromSocialLogin={fromSocialLogin}
              deepLinkInviteCode={deepLinkInviteCode}
            />

            <MemoNoCodeOption
              isSelected={selectedOption === 'noCode'}
              onSelect={handleNoInviteCode}
              fromSocialLogin={fromSocialLogin}
            />
          </View>

          {/* Bottom */}
          <View
            style={[
              styles.bottomContainer,
              { paddingBottom: ms(32) + insets.bottom },
            ]}>
            <AppText
              variant="body8"
              color={AppColors.gray90}
              style={styles.footer}
            >
              계속 진행함으로써{' '}
              <AppText
                variant="body8"
                color={AppColors.gray90}
                style={styles.underlineText}
                onPress={() => {}}
              >
                서비스 이용약관
              </AppText>{' '}
              및{' '}
              <AppText
                variant="body8"
                color={AppColors.gray90}
                style={styles.underlineText}
                onPress={() => {}}
              >
                개인정보처리방침
              </AppText>
              에 동의하게 됩니다.
            </AppText>
          </View>
        </KeyboardAwareScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingTop: ms(16),
    gap: ms(24),
  },
  bottomContainer: {
    gap: ms(24),
  },
  footer: {
    textAlign: 'center',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
});
