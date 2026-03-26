import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Controller, useForm } from 'react-hook-form';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { MemoFormInput } from '@/src/component/FormInput';
import { MemoPhoneInput } from '@/src/component/PhoneInput';
import { MemoVerificationCodeSection } from '@/src/component/VerificationCodeSection';
import { AppColors } from '@/src/constants/colors';
import { useVerificationCode } from '@/src/hooks/useVerificationCode';
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from '@/src/store/api';
import { useUpdateProfileMutation } from '@/src/store/api/user.api';

type TEditFormValues = {
  name: string;
  phone: string;
  team: string;
  position: string;
};

interface IPersonalInfoEditSectionProps {
  name: string;
  phone: string;
  team: string;
  position: string;
  onCancel: () => void;
  onSave: (data: TEditFormValues) => void;
}

//---------------------------------------
const PersonalInfoEditSection: React.FC<IPersonalInfoEditSectionProps> = ({
  name,
  phone,
  team,
  position,
  onCancel,
  onSave,
}) => {
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation({
    fixedCacheKey: 'sendOtp',
  });
  const [resendOtp] = useSendOtpMutation({ fixedCacheKey: 'resendOtp' });
  const [verifyOtp] = useVerifyOtpMutation();
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateProfileMutation();

  const { control, handleSubmit, watch } = useForm<TEditFormValues>({
    defaultValues: {
      name,
      phone: phone.replace(/[^0-9]/g, ''),
      team,
      position,
    },
  });

  const [phoneError, setPhoneError] = React.useState('');
  const [verificationToken, setVerificationToken] = React.useState('');

  const currentPhone = watch('phone');
  const originalPhone = phone.replace(/[^0-9]/g, '');
  const isPhoneChanged = currentPhone !== originalPhone;

  //---------------------------------------
  const verification = useVerificationCode({
    onSendCode: async (phoneNumber: string) => {
      const cleaned = phoneNumber.replace(/[^0-9]/g, '');
      await sendOtp({ phone: cleaned, purpose: 'register' }).unwrap();
    },
    onResendCode: async (phoneNumber: string) => {
      const cleaned = phoneNumber.replace(/[^0-9]/g, '');
      await resendOtp({ phone: cleaned, purpose: 'register' }).unwrap();
    },
    onVerifyCode: async (phoneNumber: string, code: string) => {
      try {
        const cleaned = phoneNumber.replace(/[^0-9]/g, '');
        const response = await verifyOtp({ phone: cleaned, code }).unwrap();
        setVerificationToken(response.phoneVerificationToken);
        return true;
      } catch (error: any) {
        const errorCode = error?.data?.code ?? error?.code ?? '';
        return typeof errorCode === 'string' && errorCode ? errorCode : false;
      }
    },
  });

  //---------------------------------------
  const handleSendCode = React.useCallback(() => {
    setPhoneError('');
    const phoneValue = watch('phone');
    if (!phoneValue.startsWith('010')) {
      setPhoneError('010으로 시작하는 휴대폰 번호를 입력하세요.');
      return;
    }
    verification.sendCode(phoneValue);
  }, [watch, verification]);

  //---------------------------------------
  const onSubmit = React.useCallback(
    async (data: TEditFormValues) => {
      if (isPhoneChanged && !verificationToken) {
        setPhoneError('휴대폰 번호 인증이 필요합니다.');
        return;
      }

      const originalName = name;
      const isNameChanged = data.name !== originalName;

      if (!isNameChanged && !isPhoneChanged) {
        onSave(data);
        return;
      }

      const payload: {
        fullName?: string;
        phone?: string;
        phoneVerificationToken?: string;
      } = {};

      if (isNameChanged) {
        payload.fullName = data.name;
      }

      if (isPhoneChanged) {
        payload.phone = data.phone;
        payload.phoneVerificationToken = verificationToken;
      }

      await updateProfile(payload).unwrap();
      onSave(data);
    },
    [isPhoneChanged, verificationToken, onSave, name, updateProfile],
  );

  return (
    <View style={styles.container}>
      <View style={styles.fields}>
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange } }) => (
            <MemoFormInput
              label="이름"
              value={value}
              onChangeText={onChange}
              placeholder="이름을 입력하세요"
              gap={ms(4)}
            />
          )}
        />

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
                    gap={ms(4)}
                  />
                )}
              />
            </View>

            <MemoAppButton
              label="인증코드 전송"
              textVariant="body6"
              style={styles.verifyButton}
              disabled={!isPhoneChanged || isSendingOtp}
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

        <Controller
          control={control}
          name="team"
          render={({ field: { value, onChange } }) => (
            <MemoFormInput
              label="소속 팀"
              value={value}
              onChangeText={onChange}
              placeholder="소속 팀"
              editable={false}
              inputBackgroundColor={AppColors.gray20}
              gap={ms(4)}
            />
          )}
        />

        <Controller
          control={control}
          name="position"
          render={({ field: { value, onChange } }) => (
            <MemoFormInput
              label="직책"
              value={value}
              onChangeText={onChange}
              placeholder="직책"
              editable={false}
              inputBackgroundColor={AppColors.gray20}
              gap={ms(4)}
            />
          )}
        />
      </View>

      <View style={styles.buttonRow}>
        <MemoAppButton
          label="취소"
          variant="secondary"
          textVariant="body6"
          style={styles.actionButton}
          onPress={onCancel}
        />

        <MemoAppButton
          label="저장"
          variant="primary"
          textVariant="body6"
          style={styles.actionButton}
          loading={isUpdating}
          disabled={isUpdating}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
};

export const MemoPersonalInfoEditSection = React.memo(PersonalInfoEditSection);

const styles = StyleSheet.create({
  container: {
    gap: ms(16),
  },
  fields: {
    gap: ms(12),
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
  buttonRow: {
    flexDirection: 'row',
    gap: ms(8),
  },
  actionButton: {
    flex: 1,
    paddingVertical: ms(10),
    borderRadius: ms(8),
  },
});
