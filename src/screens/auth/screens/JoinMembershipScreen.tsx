import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ms } from 'react-native-size-matters/extend';

import { MemoAgreementCheckbox } from '@/src/component/AgreementCheckbox';
import { MemoAppButton } from '@/src/component/AppButton';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { MemoBottomButtonGroup } from '@/src/component/BottomButtonGroup';
import { MemoPasswordInput } from '@/src/component/PasswordInput';
import { MemoPhoneInput } from '@/src/component/PhoneInput';
import { RHFFormInput } from '@/src/component/RHFFormInput';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { MemoStepProgressBar } from '@/src/component/StepProgressBar';
import { MemoVerificationCodeSection } from '@/src/component/VerificationCodeSection';
import { AppColors } from '@/src/constants/colors';
import { useVerificationCode } from '@/src/hooks/useVerificationCode';
import type { AuthStackParamList } from '@/src/interface/tab.interface';
import { saveTokens, saveUserInfo, saveCompanyInfo } from '@/src/services/tokenService';
import { useSendOtpMutation, useVerifyOtpMutation, useRegisterWithInviteMutation } from '@/src/store/api';
import { useRegisterCompany } from '../context/RegisterCompanyContext';

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
  const inviteCode = route.params?.inviteCode ?? '';
  const { setStepData } = useRegisterCompany();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [registerWithInvite, { isLoading: isRegistering }] = useRegisterWithInviteMutation();

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      name: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [phoneError, setPhoneError] = React.useState('');
  const [agreements, setAgreements] = React.useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
  });

  const watchedFields = watch(['name', 'phone', 'password', 'confirmPassword']);

  const [passwordError, setPasswordError] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState('');

  const [verificationToken, setVerificationToken] = React.useState('');

  const isSubmitEnabled =
    watchedFields.every(field => field.trim().length > 0) &&
    agreements.terms &&
    agreements.privacy &&
    verificationToken !== '';

  //---------------------------------------
  const verification = useVerificationCode({
    onSendCode: async (phone: string) => {
      const cleaned = phone.replace(/[^0-9]/g, '');
      await sendOtp({ phone: cleaned, purpose: 'register' }).unwrap();
    },
    onVerifyCode: async (phone: string, code: string) => {
      try {
        const cleaned = phone.replace(/[^0-9]/g, '');
        const response = await verifyOtp({ phone: cleaned, code }).unwrap();
        setVerificationToken(response.phoneVerificationToken);
        return true;
      } catch (error: any) {
        const code = error?.data?.code ?? error?.code ?? '';
        return typeof code === 'string' && code ? code : false;
      }
    },
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
  const handleCancel = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  //---------------------------------------
  const onSubmit = React.useCallback(
    async (data: FormValues) => {
      let hasError = false;

      if (data.password.length < 6) {
        setPasswordError('비밀번호는 최소 6자 이상이어야 합니다.');
        hasError = true;
      } else {
        setPasswordError('');
      }

      if (data.password !== data.confirmPassword) {
        setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
        hasError = true;
      } else {
        setConfirmPasswordError('');
      }

      if (hasError) {
        return;
      }

      const stepData = {
        fullName: data.name,
        phone: data.phone.replace(/[^0-9]/g, ''),
        password: data.password,
        passwordConfirm: data.confirmPassword,
        phoneVerificationToken: verificationToken,
        termsAgreed: agreements.terms,
        privacyAgreed: agreements.privacy,
        marketingAgreed: agreements.marketing,
      };
      if (withSteps) {
        setStepData(stepData);
        navigation.navigate('CreateAgency');
      } else {
        try {
          const result = await registerWithInvite({
            inviteCode,
            ...stepData,
          }).unwrap();
          await saveTokens(result.accessToken, result.refreshToken);
          await saveUserInfo(result.user);
          await saveCompanyInfo(result.companies);
          navigation.navigate('Login');
        } catch (error) {
        }
      }
    },
    [navigation, withSteps, setStepData, agreements, verificationToken, inviteCode, registerWithInvite],
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

        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid
          extraScrollHeight={ms(120)}
        >
          {/* 이름 & 휴대폰 번호 */}
          <MemoBaseCard style={{ gap: ms(16) }}>
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
                  disabled={!watch('phone') || isSendingOtp}
                  loading={isSendingOtp}
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
                errorMessage={verification.errorMessage}
              />
            )}
          </MemoBaseCard>

          {/* 비밀번호 & 비밀번호 확인 */}
          <MemoBaseCard style={{ gap: ms(16) }}>
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <MemoPasswordInput
                  label="비밀번호"
                  placeholder="비밀번호를 입력하세요"
                  value={value}
                  onChangeText={onChange}
                  required
                  error={passwordError}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { value, onChange } }) => (
                <MemoPasswordInput
                  label="비밀번호 확인"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={value}
                  onChangeText={onChange}
                  required
                  error={confirmPasswordError}
                />
              )}
            />
          </MemoBaseCard>

          {/* Agreements */}
          <View style={styles.agreementSection}>
            <MemoAgreementCheckbox
              testID="checkbox-all"
              label="아래의 모든 약관에 동의"
              checked={agreements.all}
              bold
              onPress={() => toggleAgreement('all')}
            />
            <MemoAgreementCheckbox
              testID="checkbox-terms"
              label="(필수) 이용 약관에 대한 동의"
              checked={agreements.terms}
              onPress={() => toggleAgreement('terms')}
            />
            <MemoAgreementCheckbox
              testID="checkbox-privacy"
              label="(필수) 개인정보 수집 및 이용에 대한 동의"
              checked={agreements.privacy}
              onPress={() => toggleAgreement('privacy')}
            />
            <MemoAgreementCheckbox
              testID="checkbox-marketing"
              label="(선택) 광고성 정보 수신 이용에 대한 동의"
              checked={agreements.marketing}
              onPress={() => toggleAgreement('marketing')}
            />
          </View>
        </KeyboardAwareScrollView>

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
            disabled={!isSubmitEnabled || isRegistering}
            loading={isRegistering}
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
  agreementSection: {
    gap: ms(12),
    marginTop: ms(8),
  },
  stepBarContainer: {
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
  },
});
