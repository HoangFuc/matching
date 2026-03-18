import React from 'react';
import { StyleSheet, View } from 'react-native';
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
    paddingTop: ms(16),
    paddingHorizontal: ms(16),
  },
  buttonWrapper: {
    flex: 1,
  },
});
