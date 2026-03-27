import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ms } from 'react-native-size-matters/extend';

interface IBottomButtonGroupProps {
  children: React.ReactNode;
}

const BottomButtonGroup: React.FC<IBottomButtonGroupProps> = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { marginBottom: Math.max(insets.bottom, ms(16)) },
      ]}
    >
      {React.Children.map(children, child => (
        <View style={styles.buttonWrapper}>{child}</View>
      ))}
    </View>
  );
};

export const MemoBottomButtonGroup = React.memo(BottomButtonGroup);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: ms(8),
    paddingVertical: ms(16),
    paddingHorizontal: ms(16),
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#5329C2',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.14,
        shadowRadius: 8,
      },
      default: {
        boxShadow: '0px -2px 10px 0px #5353530D',
      },
    }),
  },
  buttonWrapper: {
    flex: 1,
  },
});
