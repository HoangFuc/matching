import React from 'react';
import { Image, StatusBar, StyleSheet, View } from 'react-native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { AppImages } from '@/src/constants/images';
import type { AuthStackParamList } from '@/src/interface/tab.interface';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;
};

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  //---------------------------------------
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  //---------------------------------------
  const handleSignUp = () => {
    navigation.navigate('JoinOrganization');
  };

  return (
    <AppSafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.white} />

      {/* Logo */}
      <Image
        source={AppImages.logoDefault}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.content}>
        {/* Welcome illustration */}
        <Image
          source={AppImages.gifIllustration}
          style={styles.illustration}
          resizeMode="contain"
        />

        <View style={{ gap: ms(8), alignItems: 'center' }}>
          {/* Welcome text */}
          <AppText
            variant="heading1"
            color={AppColors.gray90}
            style={styles.title}
          >
            환영
          </AppText>

          <AppText variant="body7" color={AppColors.gray90}>
            당신의 여정은 여기서 시작됩니다
          </AppText>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <MemoAppButton
          label="로그인"
          variant="primary"
          onPress={handleLogin}
          style={styles.loginButton}
        />

        <MemoAppButton
          label="회원가입"
          variant="secondary"
          onPress={handleSignUp}
          style={styles.signUpButton}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <AppText variant="body7" color={AppColors.gray90}>
          비밀번호나 ID를 잊으셨나요?
        </AppText>
      </View>
    </AppSafeAreaView>
  );
};

export const MemoWelcomeScreen = React.memo(WelcomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    paddingHorizontal: ms(24),
  },
  content: {
    alignItems: 'center',
    gap: ms(40),
    paddingTop: ms(40),
    marginBottom: ms(24),
  },
  logo: {
    width: ms(80),
    height: ms(40),
    alignSelf: 'center',
  },
  illustration: {
    width: ms(260),
    height: ms(260),
  },
  title: {
    marginBottom: ms(8),
  },
  buttonContainer: {
    gap: ms(16),
  },
  loginButton: {
    paddingVertical: ms(10),
    paddingHorizontal: ms(16),
  },
  signUpButton: {
    paddingVertical: ms(10),
    paddingHorizontal: ms(16),
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: ms(32),
    paddingTop: ms(8),
  },
});
