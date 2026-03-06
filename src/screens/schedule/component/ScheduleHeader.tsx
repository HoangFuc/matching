import React from 'react';
import { Pressable } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import { Sort } from '@/src/constants/icons';

interface IProps {
  onPressFilter: () => void;
  mode?: string;
}

const ScheduleHeader: React.FC<IProps> = ({ onPressFilter, mode }) => {
  return (
    <MemoScreenHeader
      title="일정"
      rightElement={
        mode !== 'attendance' ? (
          <Pressable hitSlop={8} onPress={onPressFilter}>
            <Sort size={`${ms(24)}`} color={AppColors.white} variant="Linear" />
          </Pressable>
        ) : undefined
      }
    />
  );
};

export const MemoScheduleHeader = React.memo(ScheduleHeader);
