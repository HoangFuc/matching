import React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ms } from 'react-native-size-matters/extend';

import { InfoCircle, TickCircle } from 'iconsax-react-nativejs';
import { AppColors } from '../constants/colors';
import { FontWeight } from '../constants/typography';
import { MemoAppButton } from './AppButton';
import { AppText } from './AppText';
import { formatKoreanPhone } from './PhoneInput';

export type VerificationStatus = 'sent' | 'verified' | 'error' | 'expired';

interface IVerificationCodeSectionProps {
  phoneNumber: string;
  status: VerificationStatus;
  code: string;
  onChangeCode: (code: string) => void;
  onConfirm: () => void;
  onResend: () => void;
  remainingSeconds: number;
}

//---------------------------------------
const formatTime = (seconds: number): string => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min.toString().padStart(2, '0')}:${sec
    .toString()
    .padStart(2, '0')}`;
};

//---------------------------------------
const VerificationCodeSection: React.FC<IVerificationCodeSectionProps> = ({
  phoneNumber,
  status,
  code,
  onChangeCode,
  onConfirm,
  onResend,
  remainingSeconds,
}) => {
  const isVerified = status === 'verified';
  const isError = status === 'error';
  const isExpired = status === 'expired';
  const showTimer = !isVerified;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <InfoCircle
          size={`${ms(20)}`}
          color={AppColors.gray90}
          variant="Linear"
        />

        <AppText
          variant="body2"
          color={AppColors.gray90}
          style={{ lineHeight: ms(20) }}
        >
          인증 코드 검증
        </AppText>
      </View>

      {/* Description */}
      <AppText variant="body7" color={AppColors.gray90}>
        {formatKoreanPhone(phoneNumber)}으로 인증코드를 전송했습니다.
      </AppText>

      <View style={{ gap: ms(4) }}>
        {/* Label */}
        <AppText variant="body7" color={AppColors.gray90}>
          6자리 인증코드
        </AppText>

        {/* Code input row */}
        <View style={styles.codeRow}>
          <View
            style={[
              styles.inputContainer,
              isError && styles.inputError,
              isVerified && styles.inputSuccess,
            ]}
          >
            <TextInput
              style={styles.codeInput}
              value={code}
              onChangeText={onChangeCode}
              placeholder="인증코드를 입력하세요"
              placeholderTextColor={AppColors.gray40}
              keyboardType="number-pad"
              maxLength={6}
              editable={!isVerified}
            />

            {isVerified && (
              <TickCircle
                size={`${ms(20)}`}
                color={AppColors.green}
                variant="Bold"
              />
            )}

            {showTimer && (
              <AppText variant="body8" color={AppColors.gray90}>
                {formatTime(remainingSeconds)}
              </AppText>
            )}
          </View>

          <MemoAppButton
            label="확인"
            textVariant="body8"
            style={styles.confirmButton}
            disabled={code.length < 6 || isVerified}
            onPress={onConfirm}
          />
        </View>

        {/* Helper text */}
        {status === 'sent' && (
          <View style={styles.helperRow}>
            <TickCircle
              size={`${ms(14)}`}
              color={AppColors.green}
              variant="Linear"
            />
            <AppText variant="body8" color={AppColors.green}>
              인증코드가 전송되었습니다. 2분 이내에 만료됩니다.
            </AppText>
          </View>
        )}

        {isError && (
          <AppText variant="body8" color={AppColors.negative}>
            잘못된 인증코드입니다. 다시 시도하세요.
          </AppText>
        )}

        {isExpired && (
          <AppText variant="body8" color={AppColors.negative}>
            잘못된 인증코드입니다. 다시 시도하세요.
          </AppText>
        )}

        {/* Resend row */}
        <View style={styles.resendRow}>
          <AppText variant="body7" color={AppColors.gray90}>
            코드를 받지 못하셨나요?
          </AppText>

          {isExpired && (
            <TouchableOpacity onPress={onResend}>
              <AppText variant="body5" color={AppColors.gray90}>
                재전송
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export const MemoVerificationCodeSection = React.memo(VerificationCodeSection);

//---------------------------------------
const styles = StyleSheet.create({
  container: {
    gap: ms(16),
    marginTop: ms(16),
    borderTopWidth: 1,
    borderTopColor: AppColors.gray20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    marginTop: ms(17),
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ms(8),
    backgroundColor: AppColors.gray10,
    paddingHorizontal: ms(12),
    height: ms(36),
  },
  inputError: {
    borderWidth: 1,
    borderColor: AppColors.negative,
  },
  inputSuccess: {
    borderWidth: 1,
    borderColor: AppColors.green,
  },
  codeInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: FontWeight.regular,
    color: AppColors.gray90,
    paddingVertical: 0,
    ...Platform.select({
      ios: { paddingVertical: ms(8) },
      default: {},
    }),
  },
  confirmButton: {
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
    borderRadius: ms(8),
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
