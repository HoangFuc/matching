import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  type ViewStyle,
  type StyleProp,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale as ms } from 'react-native-size-matters/extend';

const EXTRA_TOP_PADDING = ms(15);

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const AppSafeAreaView: React.FC<Props> = ({ children, style }) => {
  const insets = useSafeAreaInsets();

  const safeTop =
    Platform.OS === 'android'
      ? Math.max(insets.top, StatusBar.currentHeight ?? 0)
      : insets.top;

  const topPadding = safeTop < 50 ? safeTop + EXTRA_TOP_PADDING : safeTop;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: topPadding },
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
