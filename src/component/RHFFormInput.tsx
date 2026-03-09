import React from 'react';
import { TextInputProps } from 'react-native';

import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

import { MemoFormInput } from './FormInput';
import { TypographyVariant } from '../constants/typography';

interface IProps<T extends FieldValues>
  extends Omit<TextInputProps, 'style' | 'value' | 'onChangeText'> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  labelVariant?: TypographyVariant;
  multiline?: boolean;
}

const RHFFormInputInner = <T extends FieldValues>({
  control,
  name,
  ...rest
}: IProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <MemoFormInput value={value} onChangeText={onChange} {...rest} />
      )}
    />
  );
};

export const RHFFormInput = React.memo(
  RHFFormInputInner,
) as typeof RHFFormInputInner;
