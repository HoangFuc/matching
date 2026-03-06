import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { ms, s } from 'react-native-size-matters/extend';

import { AppText } from './AppText';
import { AppColors } from '../constants/colors';

type ButtonVariant = 'primary' | 'secondary';

interface IAppButtonProps
  extends Omit<TouchableOpacityProps, 'children' | 'style'> {
  label: string;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
}

const AppButton: React.FC<IAppButtonProps> = ({
  label,
  variant = 'primary',
  disabled,
  style,
  ...rest
}) => {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
      {...rest}
    >
      <AppText
        variant="body6"
        color={isPrimary ? AppColors.purple : AppColors.gray90}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  );
};

export const MemoAppButton = React.memo(AppButton);
export const AppButton_ = MemoAppButton;

const styles = StyleSheet.create({
  base: {
    flex: 1,

    borderRadius: ms(99),
    paddingVertical: ms(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: AppColors.lavendar,
  },
  secondary: {
    backgroundColor: AppColors.gray20,
  },
  disabled: {
    opacity: 0.5,
  },
});
