import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Add } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoAppButton } from '@/src/component/AppButton';
import { AppColors } from '@/src/constants/colors';

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
      />
    </View>
  );
};

export const MemoHeaderDraft = React.memo(HeaderDraft);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
