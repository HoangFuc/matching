import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { ms } from 'react-native-size-matters/extend';

import { AppColors } from '../constants/colors';
import { TypographyVariant } from '../constants/typography';
import { AppText } from './AppText';

type ButtonVariant = 'primary' | 'secondary';

interface IAppButtonProps
  extends Omit<TouchableOpacityProps, 'children' | 'style'> {
  label: string;
  icon?: React.ReactNode;
  variant?: ButtonVariant;
  textVariant?: TypographyVariant;
  style?: StyleProp<ViewStyle>;
}

const AppButton: React.FC<IAppButtonProps> = ({
  label,
  icon,
  variant = 'primary',
  textVariant = 'body6',
  disabled,
  style,
  ...rest
}) => {
  const isPrimary = variant === 'primary';

  console.log('======================label', label);

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
      {icon}

      <AppText
        variant={textVariant}
        color={isPrimary ? AppColors.purple : AppColors.gray90}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  );
};

export const MemoAppButton = React.memo(AppButton);

const styles = StyleSheet.create({
  base: {
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
