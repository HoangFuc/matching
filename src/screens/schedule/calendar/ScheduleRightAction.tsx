import React from 'react';

import { Add } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';
import { useMutation } from '@tanstack/react-query';

import { _storeData } from '@/src/api/async.storage';
import { getSeed } from '@/src/api/seed.api';
import { MemoAppButton } from '@/src/component/AppButton';
import { AppColors } from '@/src/constants/colors';
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
      />

      <MemoScheduleRegisterModal
        visible={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
    </>
  );
};

export const MemoScheduleRightAction = React.memo(ScheduleRightAction);
