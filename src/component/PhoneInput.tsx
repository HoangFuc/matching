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
  error?: string;
}

//---------------------------------------
export const formatKoreanPhone = (digits: string): string => {
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
const digitPosToCharPos = (formatted: string, digitPos: number): number => {
  if (digitPos <= 0) {
    return 0;
  }
  let count = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/[0-9]/.test(formatted[i])) {
      count++;
      if (count === digitPos) {
        return i + 1;
      }
    }
  }
  return formatted.length;
};

//---------------------------------------
const PhoneInput: React.FC<IProps> = ({
  value,
  onChangeText,
  label = '연락처',
  placeholder = '연락처을 입력하세요',
  required,
  error,
}) => {
  const inputRef = React.useRef<TextInput>(null);
  const cursorRef = React.useRef(0);
  const displayValue = formatKoreanPhone(value.replace(/-/g, ''));

  //---------------------------------------
  const handleSelectionChange = React.useCallback(
    (e: { nativeEvent: { selection: { start: number } } }) => {
      cursorRef.current = e.nativeEvent.selection.start;
    },
    [],
  );

  //---------------------------------------
  const handleChange = React.useCallback(
    (text: string) => {
      const prevDisplay = displayValue;
      const cursorPos = cursorRef.current;

      const oldDigits = prevDisplay.replace(/[^0-9]/g, '');
      const digitsBefore = prevDisplay
        .slice(0, cursorPos)
        .replace(/[^0-9]/g, '').length;

      const newDigits = text.replace(/[^0-9]/g, '').slice(0, 11);
      const delta = newDigits.length - oldDigits.length;
      const newDigitCursor = Math.max(
        0,
        Math.min(newDigits.length, digitsBefore + delta),
      );

      const newDisplay = formatKoreanPhone(newDigits);
      const newCursor = digitPosToCharPos(newDisplay, newDigitCursor);

      onChangeText(newDigits);

      setTimeout(() => {
        inputRef.current?.setNativeProps({
          selection: { start: newCursor, end: newCursor },
        });
      }, 1);
    },
    [displayValue, onChangeText],
  );

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
        ref={inputRef}
        style={[styles.input, error ? styles.inputError : undefined]}
        value={displayValue}
        onChangeText={handleChange}
        onSelectionChange={handleSelectionChange}
        placeholder={placeholder}
        placeholderTextColor={AppColors.gray40}
        keyboardType="phone-pad"
        maxLength={13}
      />

      {error && (
        <AppText
          variant="body8"
          color={AppColors.negative}
          style={styles.errorText}
        >
          {error}
        </AppText>
      )}
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
  inputError: {
    borderWidth: 1,
    borderColor: AppColors.negative,
  },
  errorText: {
    marginTop: ms(4),
  },
});
