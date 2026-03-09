import React from 'react';
import { Pressable } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import { Sort } from '@/src/constants/icons';
import { TDetailData } from '../type';

interface IProps {
  onPressFilter: () => void;
  mode?: string;
  detailData?: TDetailData;
}

const ScheduleHeader: React.FC<IProps> = props => {
  const { onPressFilter, mode, detailData } = props;

  return (
    <MemoScreenHeader
      title={
        mode === 'attendance' ? '근태현황' : detailData ? '일정 상세' : '일정'
      }
      rightElement={
        mode !== 'attendance' && !detailData ? (
          <Pressable hitSlop={8} onPress={onPressFilter}>
            <Sort size={`${ms(24)}`} color={AppColors.white} variant="Linear" />
          </Pressable>
        ) : undefined
      }
    />
  );
};

export const MemoScheduleHeader = React.memo(ScheduleHeader);
