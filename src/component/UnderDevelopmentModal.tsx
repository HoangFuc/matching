import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppColors } from '@/src/constants/colors';
import { MemoAppButton } from './AppButton';
import { AppText } from './AppText';
import { MemoBottomSheetModal } from './BottomSheetModal';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

const UnderDevelopmentModal: React.FC<IProps> = ({ visible, onClose }) => {
  return (
    <MemoBottomSheetModal
      visible={visible}
      onClose={onClose}
      sheetStyle={styles.sheet}
    >
      <Text style={styles.icon}>🎉</Text>

      <AppText variant="body6" color={AppColors.black} style={styles.message}>
        개발 중인 기능입니다.
      </AppText>

      <MemoAppButton
        label="확인"
        onPress={onClose}
        style={styles.button}
      />
    </MemoBottomSheetModal>
  );
};

export const MemoUnderDevelopmentModal = React.memo(UnderDevelopmentModal);

const styles = StyleSheet.create({
  sheet: {
    alignItems: 'center',
    paddingBottom: ms(32),
  },
  icon: {
    fontSize: ms(48),
    marginTop: ms(16),
    marginBottom: ms(12),
    textAlign: 'center',
    alignSelf: 'center',
  },
  message: {
    marginBottom: ms(20),
    textAlign: 'center',
    alignSelf: 'center',
  },
  button: {
    paddingHorizontal: ms(32),
  },
});
