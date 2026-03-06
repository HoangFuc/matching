import React from 'react';
import {
  Pressable,
  StyleSheet,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppColors } from '../constants/colors';
import { CardShadow } from '../constants/shadows';

interface IProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const BaseCard: React.FC<IProps> = ({ children, style, onPress }) => {
  if (onPress) {
    return (
      <Pressable style={[styles.card, style]} onPress={onPress}>
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
};

export const MemoBaseCard = React.memo(BaseCard);

const styles = StyleSheet.create({
  card: {
    borderRadius: ms(16),
    borderWidth: 1,
    borderColor: AppColors.gray30,
    backgroundColor: AppColors.white,
    padding: ms(16),
    ...CardShadow,
  },
});
