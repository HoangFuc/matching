import React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppText } from './AppText';
import { AppColors } from '../constants/colors';
import { FontWeight, TypographyVariant } from '../constants/typography';

interface IProps extends Omit<TextInputProps, 'style'> {
  label: string;
  labelVariant?: TypographyVariant;
  multiline?: boolean;
  required?: boolean;
  gap?: number;
  inputBackgroundColor?: string;
}

const FormInput: React.FC<IProps> = ({
  label,
  labelVariant = 'body7',
  multiline,
  required,
  gap = 0,
  inputBackgroundColor,
  ...textInputProps
}) => {
  return (
    <View style={{ gap: ms(gap) }}>
      <AppText variant={labelVariant} color={AppColors.gray90}>
        {label}
        {required && (
          <AppText variant={labelVariant} color={AppColors.negative}>
            {' '}
            *
          </AppText>
        )}
      </AppText>

      <TextInput
        style={[styles.input, multiline && styles.textArea, inputBackgroundColor ? { backgroundColor: inputBackgroundColor } : undefined]}
        placeholderTextColor={AppColors.gray40}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : undefined}
        {...textInputProps}
      />
    </View>
  );
};

export const MemoFormInput = React.memo(FormInput);

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
    gap: ms(8),
    ...Platform.select({
      ios: {},
      default: { paddingVertical: 0 },
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
});
