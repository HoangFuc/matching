import React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppColors } from '@/src/constants/colors';
import { FontWeight } from '@/src/constants/typography';
import { AppText } from './AppText';

interface IProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  multiline?: boolean;
}

const AppSheetInput: React.FC<IProps> = ({
  label,
  value,
  onChangeText,
  error,
  multiline = false,
  placeholder,
  ...rest
}) => {
  return (
    <View>
      {label && (
        <AppText
          variant="body7"
          color={AppColors.gray90}
          style={styles.label}>
          {label}
        </AppText>
      )}

      <TextInput
        style={[styles.input, multiline && styles.textArea, error && styles.errorBorder]}
        placeholder={placeholder}
        placeholderTextColor={AppColors.gray40}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...rest}
      />

      {error && (
        <AppText variant="detail" color={AppColors.negative} style={styles.errorText}>
          {error}
        </AppText>
      )}
    </View>
  );
};

export const MemoAppSheetInput = React.memo(AppSheetInput);

const styles = StyleSheet.create({
  label: {
    marginBottom: ms(6),
  },
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
      default: {paddingVertical: 0},
    }),
  },
  textArea: {
    height: ms(100),
    paddingTop: ms(14),
    paddingVertical: ms(14),
    textAlignVertical: 'top',
    minHeight: ms(100),
    maxHeight: ms(200),
  },
  errorBorder: {
    borderWidth: 1,
    borderColor: AppColors.negative,
  },
  errorText: {
    marginTop: ms(4),
  },
});
