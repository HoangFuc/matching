import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { Add } from '@/src/constants/icons';

const HeaderDraft: React.FC = () => {
  return (
    <View style={styles.container}>
      <AppText variant="body1" color={AppColors.gray90}>
        기안
      </AppText>

      <MemoAppButton
        label="기안 올리기"
        icon={<Add size={`${ms(16)}`} color={AppColors.purple} />}
        onPress={() => console.log('======================asdasdsa')}
        style={styles.button}
      />
    </View>
  );
};

export const MemoHeaderDraft = React.memo(HeaderDraft);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    flex: 0,
    paddingHorizontal: ms(12),
    flexDirection: 'row',
    gap: ms(4),
  },
});
