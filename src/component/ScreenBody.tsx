import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppColors } from '../constants/colors';

interface IProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const ScreenBody: React.FC<IProps> = ({ style, children }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

export const MemoScreenBody = React.memo(ScreenBody);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    overflow: 'hidden',
  },
});
