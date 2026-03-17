import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppText } from './AppText';
import { TypographyVariant } from '../constants/typography';

interface IProps {
  label: string;
  bgColor: string;
  textColor: string;
  selected?: boolean;
  textVariant?: TypographyVariant;
  onPress?: () => void;
}

const Chip: React.FC<IProps> = ({
  label,
  bgColor,
  textColor,
  selected,
  textVariant = 'body4',
  onPress,
}) => {
  return (
    <Pressable
      style={[
        styles.chip,
        {
          backgroundColor: bgColor,
          borderWidth: 1,
          borderColor: selected ? textColor : 'transparent',
          opacity: selected ? 1 : 0.6,
        },
      ]}
      onPress={onPress}
    >
      <AppText variant={textVariant} color={textColor}>
        {label}
      </AppText>
    </Pressable>
  );
};

export const MemoChip = React.memo(Chip);

const styles = StyleSheet.create({
  chip: {
    borderRadius: ms(100),
    paddingHorizontal: ms(8),
    paddingVertical: ms(4),
  },
});
