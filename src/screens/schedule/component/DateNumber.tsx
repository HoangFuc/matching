import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ms, s } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { TDayCell } from '@/src/interface/schedule.interface';
import { getDayColor, padZero } from '@/src/utils/calendar.helper';

interface IProps {
  cell: TDayCell;
  today?: boolean;
}

const DateNumber: React.FC<IProps> = props => {
  const { cell, today } = props;

  return (
    <View style={[styles.container]}>
      <AppText
        variant={today ? 'body6' : 'body8'}
        color={today ? AppColors.purple : getDayColor(cell)}
        style={today ? styles.highlightedDate : undefined}
      >
        {padZero(cell.date)}
      </AppText>
    </View>
  );
};

export const MemoDateNumber = React.memo(DateNumber);

const styles = StyleSheet.create({
  container: {
    width: s(28),
    height: s(28),
    borderRadius: s(14),
    alignItems: 'center',
    justifyContent: 'center',
  },

  highlightedDate: {
    borderRadius: ms(100),
    borderColor: AppColors.purple,
    borderWidth: 1,
    gap: ms(10),
    width: s(39.86),
    textAlign: 'center',
  },
});
