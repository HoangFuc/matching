import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { TickSquare } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { AppColors } from '../constants/colors';
import { AppText } from './AppText';

interface IAgreementCheckboxProps {
  label: string;
  checked: boolean;
  bold?: boolean;
  onPress: () => void;
  testID?: string;
}

const AgreementCheckbox: React.FC<IAgreementCheckboxProps> = ({
  label,
  checked,
  bold = false,
  onPress,
  testID,
}) => (
  <Pressable
    testID={testID}
    accessibilityLabel={label}
    style={styles.item}
    onPress={onPress}
  >
    <View style={styles.wrapper}>
      {checked ? (
        <TickSquare size={`${ms(20)}`} color={AppColors.purple} variant="Bold" />
      ) : (
        <View style={styles.empty} />
      )}
    </View>
    <AppText variant={bold ? 'body6' : 'body8'} color={AppColors.gray90}>
      {label}
    </AppText>
  </Pressable>
);

export const MemoAgreementCheckbox = React.memo(AgreementCheckbox);

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  wrapper: {
    width: ms(20),
    height: ms(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(4),
    borderWidth: 1.5,
    borderColor: AppColors.gray30,
  },
});
