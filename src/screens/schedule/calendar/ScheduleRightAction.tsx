import React from 'react';

import { useMutation } from '@tanstack/react-query';
import { ms } from 'react-native-size-matters/extend';

import { _storeData } from '@/src/api/async.storage';
import { getSeed } from '@/src/api/seed.api';
import { MemoAppButton } from '@/src/component/AppButton';
import { AppColors } from '@/src/constants/colors';
import { Add } from '@/src/constants/icons';
import { StyleSheet } from 'react-native';
import { MemoScheduleRegisterModal } from './ScheduleRegisterModal';

const ScheduleRightAction: React.FC = () => {
  const [showRegisterModal, setShowRegisterModal] = React.useState(false);

  const mutation = useMutation({
    mutationFn: getSeed,
    onSuccess: async (res: { accessToken: string }) => {
      await _storeData('auth', res.accessToken);
    },
  });

  return (
    <>
      <MemoAppButton
        label="일정 등록"
        textVariant="detail"
        icon={
          <Add size={`${ms(14)}`} color={AppColors.purple} variant="Linear" />
        }
        onPress={() => {
          mutation.mutate();
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
