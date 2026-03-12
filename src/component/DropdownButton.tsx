import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from './AppText';
import { AppColors } from '../constants/colors';
import { TypographyVariant } from '../constants/typography';
import { ArrowDown2 } from '../constants/icons';

interface IProps {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  textColor?: string;
  textVariant?: TypographyVariant;
  style?: ViewStyle;
}

const DropdownButton: React.FC<IProps> = ({
  label,
  onPress,
  icon,
  textColor = AppColors.gray90,
  textVariant = 'body7',
  style,
}) => {
  return (
    <Pressable style={[styles.container, style]} onPress={onPress}>
      <AppText variant={textVariant} color={textColor}>
        {label}
      </AppText>

      {icon ?? (
        <ArrowDown2
          size={`${ms(16)}`}
          color={AppColors.gray60}
          variant="Linear"
        />
      )}
    </Pressable>
  );
};

export const MemoDropdownButton = React.memo(DropdownButton);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: ms(8),
    paddingHorizontal: ms(16),
    paddingVertical: ms(10),
    backgroundColor: AppColors.gray10,
    marginTop: ms(4),
  },
});
