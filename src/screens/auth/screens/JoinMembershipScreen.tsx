import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Eye, EyeSlash, TickSquare } from 'iconsax-react-nativejs';
import { Controller, useForm } from 'react-hook-form';
import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { AppText } from '@/src/component/AppText';
import { MemoPhoneInput } from '@/src/component/PhoneInput';
import { RHFFormInput } from '@/src/component/RHFFormInput';
import { MemoBottomButtonGroup } from '@/src/component/BottomButtonGroup';
import { MemoStepProgressBar } from '@/src/component/StepProgressBar';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { MemoVerificationCodeSection } from '@/src/component/VerificationCodeSection';
import { useVerificationCode } from '@/src/hooks/useVerificationCode';
import { AppColors } from '@/src/constants/colors';
import { FontWeight } from '@/src/constants/typography';
import type { AuthStackParamList } from '@/src/interface/tab.interface';

type Props = NativeStackScreenProps<AuthStackParamList, 'JoinMembership'>;

type AgreementKey = 'all' | 'terms' | 'privacy' | 'marketing';

type FormValues = {
  name: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const JoinMembershipScreen: React.FC<Props> = ({ navigation, route }) => {
  const withSteps = route.params?.withSteps ?? false;

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      name: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [phoneError, setPhoneError] = React.useState('');

  const verification = useVerificationCode({
    onSendCode: async (_phone: string) => {
      // TODO: call API to send verification code
    },
    onVerifyCode: async (_phone: string, _code: string) => {
      // TODO: call API to verify code, return true if valid
      return false;
    },
  });
  const [agreements, setAgreements] = React.useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
  });

  //---------------------------------------
  const toggleAgreement = React.useCallback((key: AgreementKey) => {
    setAgreements(prev => {
      if (key === 'all') {
        const newValue = !prev.all;
        return {
          all: newValue,
          terms: newValue,
          privacy: newValue,
          marketing: newValue,
        };
      }

      const updated = { ...prev, [key]: !prev[key] };
      updated.all = updated.terms && updated.privacy && updated.marketing;
      return updated;
    });
  }, []);

  //---------------------------------------
  const handleSendCode = React.useCallback(() => {
    const phone = watch('phone');
    if (!phone.startsWith('010')) {
      setPhoneError('010으로 시작하는 휴대폰 번호를 입력하세요.');
      return;
    }
    setPhoneError('');
    verification.sendCode(phone);
  }, [watch, verification]);

  //---------------------------------------
  const togglePasswordVisibility = React.useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  //---------------------------------------
  const toggleConfirmPasswordVisibility = React.useCallback(() => {
    setShowConfirmPassword(prev => !prev);
  }, []);

  //---------------------------------------
  const handleCancel = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  //---------------------------------------
  const onSubmit = React.useCallback(
    (_data: FormValues) => {
      if (withSteps) {
        navigation.navigate('CreateAgency');
      } else {
        // TODO: implement registration logic
        navigation.navigate('Login');
      }
    },
    [navigation, withSteps],
  );

  //---------------------------------------
  const renderCheckbox = React.useCallback(
    (key: AgreementKey, label: string) => (
      <Pressable
        key={key}
        testID={`checkbox-${key}`}
        accessibilityLabel={label}
        style={styles.checkboxItem}
        onPress={() => toggleAgreement(key)}
      >
        <View style={styles.checkboxWrapper}>
          {agreements[key] ? (
            <TickSquare
              size={`${ms(20)}`}
              color={AppColors.purple}
              variant="Bold"
            />
          ) : (
            <View style={styles.checkboxEmpty} />
          )}
        </View>
        <AppText
          variant={key === 'all' ? 'body6' : 'body8'}
          color={AppColors.gray90}
        >
          {label}
        </AppText>
      </Pressable>
    ),
    [agreements, toggleAgreement],
  );

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={AppColors.purple} />

      <MemoScreenHeader title="회원 가입" />

      <MemoScreenBody>
        {withSteps ? (
          <View style={styles.stepBarContainer}>
            <MemoStepProgressBar currentStep={1} totalSteps={4} />
          </View>
        ) : (
          <View style={styles.stepBarContainer}>
            <AppText variant="detail" color={AppColors.gray80}>
              * 모든 필드를 작성하여 가입하고 서비스를 이용하세요.
            </AppText>
          </View>
        )}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 이름 & 휴대폰 번호 */}
          <MemoBaseCard>
            <RHFFormInput
              control={control}
              name="name"
              label="이름"
              placeholder="이름을 입력하세요"
              required
            />

            {/* 휴대폰 번호 */}
            <View style={styles.inputGroup}>
              <View style={styles.phoneRow}>
                <View style={styles.phoneInputWrapper}>
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field: { value, onChange } }) => (
                      <MemoPhoneInput
                        value={value}
                        onChangeText={onChange}
                        label="휴대폰 번호"
                        placeholder="휴대폰 번호를 입력하세요"
                        required
                      />
                    )}
                  />
                </View>

                <MemoAppButton
                  label="인증코드 전송"
                  textVariant="body6"
                  style={styles.verifyButton}
                  disabled={!watch('phone')}
                  onPress={handleSendCode}
                />
              </View>
              {phoneError ? (
                <AppText variant="detail" color={AppColors.negative}>
                  {phoneError}
                </AppText>
              ) : null}
            </View>

            {verification.isVisible && (
              <MemoVerificationCodeSection
                phoneNumber={watch('phone')}
                status={verification.status}
                code={verification.code}
                onChangeCode={verification.setCode}
                onConfirm={() => verification.verifyCode(watch('phone'))}
                onResend={() => verification.resend(watch('phone'))}
                remainingSeconds={verification.remainingSeconds}
              />
            )}
          </MemoBaseCard>

          {/* 비밀번호 & 비밀번호 확인 */}
          <MemoBaseCard>
            {/* 비밀번호 */}
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <View style={styles.inputGroup}>
                  <AppText variant="body7" color={AppColors.gray90}>
                    비밀번호
                  </AppText>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="비밀번호를 입력하세요"
                      placeholderTextColor={AppColors.gray40}
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showPassword}
                    />

                    <TouchableOpacity
                      onPress={togglePasswordVisibility}
                      style={styles.eyeIcon}
                    >
                      {showPassword ? (
                        <Eye
                          size={ms(16)}
                          color={AppColors.gray50}
                          variant="Linear"
                        />
                      ) : (
                        <EyeSlash
                          size={ms(16)}
                          color={AppColors.gray50}
                          variant="Linear"
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />

            {/* 비밀번호 확인 */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { value, onChange } }) => (
                <View style={styles.inputGroup}>
                  <AppText variant="body7" color={AppColors.gray90}>
                    비밀번호 확인{' '}
                    <AppText variant="body7" color={AppColors.negative}>
                      *
                    </AppText>
                  </AppText>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="비밀번호를 다시 입력하세요"
                      placeholderTextColor={AppColors.gray40}
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity
                      onPress={toggleConfirmPasswordVisibility}
                      style={styles.eyeIcon}
                    >
                      {showConfirmPassword ? (
                        <Eye
                          size={ms(16)}
                          color={AppColors.gray50}
                          variant="Linear"
                        />
                      ) : (
                        <EyeSlash
                          size={ms(16)}
                          color={AppColors.gray50}
                          variant="Linear"
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </MemoBaseCard>

          {/* Agreements */}
          <View style={styles.agreementSection}>
            {renderCheckbox('all', '아래의 모든 약관에 동의')}
            {renderCheckbox('terms', '(필수) 이용 약관에 대한 동의')}
            {renderCheckbox(
              'privacy',
              '(필수) 개인정보 수집 및 이용에 대한 동의',
            )}
            {renderCheckbox(
              'marketing',
              '(선택) 광고성 정보 수신 이용에 대한 동의',
            )}
          </View>
        </ScrollView>

        {/* Bottom buttons */}
        <MemoBottomButtonGroup>
          <MemoAppButton
            label="취소"
            variant="secondary"
            textVariant="body6"
            onPress={handleCancel}
          />

          <MemoAppButton
            label={withSteps ? '다음' : '회원 가입 및 조직 참여'}
            variant="primary"
            textVariant="body6"
            onPress={handleSubmit(onSubmit)}
          />
        </MemoBottomButtonGroup>
      </MemoScreenBody>
    </AppSafeAreaView>
  );
};

export const MemoJoinMembershipScreen = React.memo(JoinMembershipScreen);

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
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: ms(8),
  },
  phoneInputWrapper: {
    flex: 1,
  },
  verifyButton: {
    paddingHorizontal: ms(12),
    paddingVertical: ms(8),
    borderRadius: ms(8),
    gap: ms(10),
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ms(8),
    backgroundColor: AppColors.gray10,
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
  agreementSection: {
    gap: ms(12),
    marginTop: ms(8),
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray20,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  checkboxWrapper: {
    width: ms(20),
    height: ms(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxEmpty: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(4),
    borderWidth: 1.5,
    borderColor: AppColors.gray30,
  },
  stepBarContainer: {
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
  },
});
