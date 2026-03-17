import React from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { CommonActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Eye, EyeSlash, TickSquare } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { AppText } from '@/src/component/AppText';
import { MemoPhoneInput } from '@/src/component/PhoneInput';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import { AppImages } from '@/src/constants/images';
import { FontWeight } from '@/src/constants/typography';
import type { AuthStackParamList } from '@/src/interface/tab.interface';

const HeaderLogo = () => (
  <Image
    source={AppImages.matchingLogo}
    style={{ width: ms(77), height: ms(40) }}
    resizeMode="contain"
  />
);

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = React.useState(false);
  const [saveId, setSaveId] = React.useState(false);

  //---------------------------------------
  const handleLogin = React.useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      }),
    );
  }, [navigation]);

  //---------------------------------------
  const togglePasswordVisibility = React.useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <MemoScreenHeader title="로그인" icon={<HeaderLogo />} />

      <MemoScreenBody>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Phone input */}
          <MemoPhoneInput
            value={phone}
            onChangeText={setPhone}
            label="사용자 ID (전화번호)"
            placeholder="전화번호를 입력해 주세요"
          />

          {/* Password input */}
          <View style={styles.inputGroup}>
            <AppText variant="body7" color={AppColors.gray90}>
              비밀번호
            </AppText>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="비밀번호를 입력해주세요"
                placeholderTextColor={AppColors.gray40}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={styles.eyeIcon}
              >
                {showPassword ? (
                  <Eye
                    size={ms(20)}
                    color={AppColors.gray50}
                    variant="Linear"
                  />
                ) : (
                  <EyeSlash
                    size={ms(20)}
                    color={AppColors.gray50}
                    variant="Linear"
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Checkboxes */}
          <View style={styles.checkboxRow}>
            <Pressable
              style={styles.checkboxItem}
              onPress={() => setKeepLoggedIn(prev => !prev)}
            >
              <View style={styles.checkboxWrapper}>
                {keepLoggedIn ? (
                  <TickSquare
                    size={`${ms(18)}`}
                    color={AppColors.purple}
                    variant="Bold"
                  />
                ) : (
                  <View style={styles.checkboxEmpty} />
                )}
              </View>
              <AppText variant="body8" color={AppColors.gray90}>
                로그인 유지
              </AppText>
            </Pressable>

            <Pressable
              style={styles.checkboxItem}
              onPress={() => setSaveId(prev => !prev)}
            >
              <View style={styles.checkboxWrapper}>
                {saveId ? (
                  <TickSquare
                    size={`${ms(18)}`}
                    color={AppColors.purple}
                    variant="Bold"
                  />
                ) : (
                  <View style={styles.checkboxEmpty} />
                )}
              </View>
              <AppText variant="body8" color={AppColors.gray90}>
                아이디 저장
              </AppText>
            </Pressable>
          </View>

          {/* Login button */}
          <MemoAppButton
            label="로그인"
            textVariant="body6"
            style={styles.loginButton}
            onPress={handleLogin}
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <AppText
              variant="body7"
              color={AppColors.gray50}
              style={styles.dividerText}
            >
              또는
            </AppText>
            <View style={styles.dividerLine} />
          </View>

          {/* Social login */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={[styles.socialButton]}>
              <Image
                source={AppImages.kakao}
                style={styles.socialIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton]}>
              <Image
                source={AppImages.naver}
                style={styles.socialIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton]}
            >
              <Image
                source={AppImages.google}
                style={styles.googleIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <AppText variant="body7" color={AppColors.gray90}>
            비밀번호나 ID를 잊으셨나요?
          </AppText>
        </View>
      </MemoScreenBody>
    </AppSafeAreaView>
  );
};

export const MemoLoginScreen = React.memo(LoginScreen);

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
  inputGroup: {
    gap: ms(4),
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ms(8),
    backgroundColor: AppColors.gray10,
    borderWidth: 1,
    borderColor: AppColors.gray20,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: ms(16),
    paddingVertical: ms(10),
    fontSize: 14,
    fontWeight: FontWeight.regular,
    color: AppColors.gray100,
    ...Platform.select({
      ios: {},
      default: { paddingVertical: ms(8) },
    }),
  },
  eyeIcon: {
    paddingHorizontal: ms(12),
  },
  checkboxRow: {
    flexDirection: 'row',
    gap: ms(20),
    marginBottom: ms(24),
  },
  checkboxWrapper: {
    width: ms(18),
    height: ms(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxEmpty: {
    width: ms(18),
    height: ms(18),
    borderRadius: ms(4),
    borderWidth: 1.5,
    borderColor: AppColors.gray30,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
  },
  loginButton: {
    backgroundColor: AppColors.lavendar,
    borderRadius: ms(100),
    paddingVertical: ms(10),
    paddingHorizontal: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(10),
    marginBottom: ms(12),
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(12),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: AppColors.gray20,
  },
  dividerText: {
    paddingHorizontal: ms(12),
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: ms(40),
    marginBottom: ms(24),
  },
  socialButton: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButton: {
    backgroundColor: AppColors.gray10,
    borderWidth: 1,
    borderColor: AppColors.gray20,
  },
  socialIcon: {
    width: ms(50),
    height: ms(50),
  },
  googleIcon: {
    width: ms(24),
    height: ms(24),
  },
  footer: {
    alignItems: 'center',
    paddingBottom: ms(32),
    paddingTop: ms(8),
  },
});
