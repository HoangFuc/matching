import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ms } from 'react-native-size-matters/extend';

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
  const fromSocialLogin = route.params?.fromSocialLogin;
  const [selectedOption, setSelectedOption] = useState<
    'hasCode' | 'noCode' | null
  >(null);

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
          />

          <MemoNoCodeOption
            isSelected={selectedOption === 'noCode'}
            onSelect={handleNoInviteCode}
            fromSocialLogin={fromSocialLogin}
          />
        </View>

        {/* Bottom */}
        <View style={styles.bottomContainer}>
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
    paddingTop: ms(16),
    gap: ms(24),
  },
  bottomContainer: {
    paddingBottom: ms(32),
    gap: ms(24),
  },
  footer: {
    textAlign: 'center',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
});
