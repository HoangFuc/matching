import React from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppText } from './AppText';
import { AppColors } from '../constants/colors';
import { FontWeight } from '../constants/typography';

interface IProps {
  value: string;
  onChangeText: (raw: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

//---------------------------------------
const formatKoreanPhone = (digits: string): string => {
  if (digits.length <= 3) {
    return digits;
  }
  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
};

//---------------------------------------
const KOREAN_PHONE_REGEX = /^01[016789]\d{7,8}$/;

export const validateKoreanPhone = (value: string): boolean => {
  const digits = value.replace(/-/g, '');
  return KOREAN_PHONE_REGEX.test(digits);
};

//---------------------------------------
export const stripDashes = (value: string): string => value.replace(/-/g, '');

//---------------------------------------
const PhoneInput: React.FC<IProps> = ({
  value,
  onChangeText,
  label = '연락처',
  placeholder = '010-xxxx-xxxx',
  required,
}) => {
  const displayValue = formatKoreanPhone(value.replace(/-/g, ''));

  //---------------------------------------
  const handleChange = (text: string) => {
    const digits = text.replace(/[^0-9]/g, '').slice(0, 11);
    onChangeText(digits);
  };

  return (
    <View>
      {label && (
        <AppText variant="body7" color={AppColors.gray90}>
          {label}
          {required && (
            <AppText variant="body7" color={AppColors.negative}>
              {' '}
              *
            </AppText>
          )}
        </AppText>
      )}

      <TextInput
        style={styles.input}
        value={displayValue}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor={AppColors.gray40}
        keyboardType="phone-pad"
        maxLength={13}
      />
    </View>
  );
};

export const MemoPhoneInput = React.memo(PhoneInput);

const styles = StyleSheet.create({
  input: {
    borderRadius: ms(8),
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
    backgroundColor: AppColors.gray10,
    height: ms(36),
    fontSize: 14,
    fontWeight: FontWeight.regular,
    color: AppColors.gray100,
    ...Platform.select({
      ios: {},
      default: { paddingVertical: 0 },
    }),
  },
});
