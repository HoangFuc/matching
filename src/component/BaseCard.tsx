import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppColors } from '../constants/colors';

interface IProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  shadow?: boolean;
}

const BaseCard: React.FC<IProps> = ({
  children,
  style,
  onPress,
  shadow = true,
}) => {
  const cardStyle = [styles.card, shadow && styles.shadow, style];

  if (onPress) {
    return (
      <Pressable style={cardStyle} onPress={onPress}>
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

export const MemoBaseCard = React.memo(BaseCard);

const styles = StyleSheet.create({
  card: {
    borderRadius: ms(16),
    backgroundColor: AppColors.white,
    padding: ms(16),
  },
  shadow: Platform.select({
    ios: {
      shadowColor: '#5329C2',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.14,
      shadowRadius: 8,
    },
    default: {
      boxShadow: '0px 2px 8px 0px #5329C224',
    },
  }),
});
