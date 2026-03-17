import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { MemoUnderDevelopmentModal } from '@/src/component/UnderDevelopmentModal';
import { AppColors } from '@/src/constants/colors';
import { Add } from '@/src/constants/icons';

const HeaderDraft: React.FC = () => {
  const [showDevModal, setShowDevModal] = useState(false);

  //---------------------------------------
  const handlePress = useCallback(() => {
    setShowDevModal(true);
  }, []);

  //---------------------------------------
  const handleClose = useCallback(() => {
    setShowDevModal(false);
  }, []);

  return (
    <View style={styles.container}>
      <AppText variant="body1" color={AppColors.gray90}>
        기안
      </AppText>

      <MemoAppButton
        label="기안 올리기"
        icon={<Add size={`${ms(16)}`} color={AppColors.purple} />}
        onPress={handlePress}
        style={styles.button}
      />

      <MemoUnderDevelopmentModal
        visible={showDevModal}
        onClose={handleClose}
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
