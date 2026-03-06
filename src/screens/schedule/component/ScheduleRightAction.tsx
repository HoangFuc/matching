import React from 'react';

import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppColors } from '@/src/constants/colors';
import { Add } from '@/src/constants/icons';
import { StyleSheet } from 'react-native';
import { MemoScheduleRegisterModal } from './ScheduleRegisterModal';

const ScheduleRightAction: React.FC = () => {
  const [showRegisterModal, setShowRegisterModal] = React.useState(false);

  return (
    <>
      <MemoAppButton
        label="일정 등록"
        textVariant="detail"
        icon={
          <Add size={`${ms(14)}`} color={AppColors.purple} variant="Linear" />
        }
        onPress={() => {
          setShowRegisterModal(true);
        }}
        style={styles.button}
      />

      <MemoScheduleRegisterModal
        visible={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
    </>
  );
};

export const MemoScheduleRightAction = React.memo(ScheduleRightAction);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    width: ms(86),
  },
});
