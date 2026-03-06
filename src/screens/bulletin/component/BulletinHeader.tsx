import React from 'react';
import { Pressable } from 'react-native';

import { Add } from 'iconsax-react-nativejs';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';

interface IProps {
  onPressAdd?: () => void;
}

const BulletinHeader: React.FC<IProps> = ({ onPressAdd }) => {
  return (
    <MemoScreenHeader
      title="팀 와글와글"
      rightElement={
        <Pressable hitSlop={8} onPress={onPressAdd}>
          <Add size={`${ms(24)}`} color={AppColors.white} variant="Linear" />
        </Pressable>
      }
    />
  );
};

export const MemoBulletinHeader = React.memo(BulletinHeader);
