import React from 'react';
import { TextInputProps } from 'react-native';

import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';

import { MemoFormInput } from './FormInput';
import { TypographyVariant } from '../constants/typography';

interface IProps<T extends FieldValues>
  extends Omit<TextInputProps, 'style' | 'value' | 'onChangeText'> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  labelVariant?: TypographyVariant;
  multiline?: boolean;
  required?: boolean;
  rules?: RegisterOptions<T, FieldPath<T>>;
  gap?: number;
}

const RHFFormInputInner = <T extends FieldValues>({
  control,
  name,
  rules,
  required,
  ...rest
}: IProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange } }) => (
        <MemoFormInput
          value={value}
          onChangeText={onChange}
          required={required}
          {...rest}
        />
      )}
    />
  );
};

export const RHFFormInput = React.memo(
  RHFFormInputInner,
) as typeof RHFFormInputInner;
