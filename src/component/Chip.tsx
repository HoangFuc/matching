import React from 'react';
import {
  Pressable,
  StyleSheet,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppText } from './AppText';
import { TypographyVariant } from '../constants/typography';

interface IProps {
  label: string;
  bgColor: string;
  textColor: string;
  selected?: boolean;
  textVariant?: TypographyVariant;
  paddingHorizontal?: number;
  paddingVertical?: number;
  opacity?: number;
  onPress?: () => void;
  leftIcon?: React.ReactNode;
  leftIconStyle?: StyleProp<ViewStyle>;
}

const Chip: React.FC<IProps> = ({
  label,
  bgColor,
  textColor,
  selected,
  textVariant = 'body4',
  paddingHorizontal,
  paddingVertical,
  opacity,
  onPress,
  leftIcon,
  leftIconStyle,
}) => {
  return (
    <Pressable
      style={[
        styles.chip,
        // eslint-disable-next-line react-native/no-inline-styles
        {
          backgroundColor: bgColor,
          borderWidth: 1,
          borderColor: selected ? textColor : 'transparent',
          opacity: opacity ?? (selected ? 1 : 0.6),
          ...(paddingHorizontal !== undefined && {
            paddingHorizontal: ms(paddingHorizontal),
          }),
          ...(paddingVertical !== undefined && {
            paddingVertical: ms(paddingVertical),
          }),
        },
      ]}
      onPress={onPress}
    >
      {leftIcon && <View style={leftIconStyle}>{leftIcon}</View>}

      <AppText variant={textVariant} color={textColor}>
        {label}
      </AppText>
    </Pressable>
  );
};

export const MemoChip = React.memo(Chip);

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    borderRadius: ms(100),
    paddingHorizontal: ms(8),
    paddingVertical: ms(4),
  },
});
