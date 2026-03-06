import React from 'react';
import { StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { CardShadow } from '@/src/constants/shadows';

interface IProps {
  onTime: number;
  late: number;
  absent: number;
}

const AttendanceSummary: React.FC<IProps> = ({ onTime, late, absent }) => {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <AppText variant="body7" color={AppColors.gray100}>
          {'정시'}
        </AppText>

        <AppText variant="body6" color={AppColors.strongBlue}>
          {`${onTime}일`}
        </AppText>
      </View>

      <View style={styles.item}>
        <AppText variant="body7" color={AppColors.gray100}>
          {'지각'}
        </AppText>

        <AppText variant="body6" color={AppColors.purple}>
          {`${late}일`}
        </AppText>
      </View>

      <View style={styles.item}>
        <AppText variant="body7" color={AppColors.gray100}>
          {'휴무'}
        </AppText>

        <AppText variant="body6" color={AppColors.negative}>
          {`${absent}일`}
        </AppText>
      </View>
    </View>
  );
};

export const MemoAttendanceSummary = React.memo(AttendanceSummary);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: ms(100),
    paddingHorizontal: ms(16),
    gap: ms(8),
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    gap: ms(8),
    paddingVertical: ms(8),
    paddingHorizontal: ms(16),
    borderRadius: ms(100),
    ...CardShadow,
    borderWidth: 1,
    borderColor: AppColors.gray30,
    backgroundColor: AppColors.white,
  },
});
