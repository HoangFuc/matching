import React from 'react';
import { Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppText } from './AppText';
import { AppColors } from '../constants/colors';
import { TypographyVariant } from '../constants/typography';

type ButtonVariant = 'primary' | 'secondary';

interface IProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  textVariant?: TypographyVariant;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const variantStyles: Record<ButtonVariant, { bg: string; color: string }> = {
  primary: { bg: AppColors.lavendar, color: AppColors.purple },
  secondary: { bg: AppColors.gray20, color: AppColors.gray90 },
};

const AppButton: React.FC<IProps> = ({
  label,
  onPress,
  variant = 'primary',
  textVariant = 'body6',
  icon,
  style,
}) => {
  const { bg, color } = variantStyles[variant];

  return (
    <Pressable
      style={[styles.button, { backgroundColor: bg }, style]}
      onPress={onPress}
    >
      {icon}
      <AppText variant={textVariant} color={color}>
        {label}
      </AppText>
    </Pressable>
  );
};

export const MemoAppButton = React.memo(AppButton);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(4),
    borderRadius: ms(100),
    paddingHorizontal: ms(12),
    paddingVertical: ms(4),
  },
});
