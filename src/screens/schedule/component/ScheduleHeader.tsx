import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import { Sort } from '@/src/constants/icons';

interface IProps {
  onPressFilter: () => void;
  mode?: string;
  detailDateKey?: string;
  isFilterActive?: boolean;
}

const ScheduleHeader: React.FC<IProps> = props => {
  const { onPressFilter, mode, detailDateKey, isFilterActive } = props;

  return (
    <MemoScreenHeader
      title={
        mode === 'attendance' ? '근태현황' : detailDateKey ? '일정 상세' : '일정'
      }
      rightElement={
        mode !== 'attendance' && !detailDateKey ? (
          <Pressable hitSlop={8} onPress={onPressFilter}>
            <Sort size={`${ms(24)}`} color={AppColors.white} variant="Linear" />
            {isFilterActive && <View style={styles.filterDot} />}
          </Pressable>
        ) : undefined
      }
    />
  );
};

const styles = StyleSheet.create({
  filterDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: ms(8),
    height: ms(8),
    borderRadius: ms(100),
    backgroundColor: AppColors.amber,
  },
});

export const MemoScheduleHeader = React.memo(ScheduleHeader);
