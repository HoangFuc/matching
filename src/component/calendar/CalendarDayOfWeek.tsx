import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { DAY_LABELS } from '@/src/constants/schedule';

const CalendarDayOfWeek: React.FC = () => {
  return (
    <View style={styles.container}>
      {DAY_LABELS.map((label, i) => (
        <View key={label} style={styles.dayCell}>
          <AppText
            variant="body2"
            color={i === 0 || i === 6 ? AppColors.purple : AppColors.gray80}
          >
            {label}
          </AppText>
        </View>
      ))}
    </View>
  );
};

export const MemoCalendarDayOfWeek = React.memo(CalendarDayOfWeek);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: ms(16),
    paddingHorizontal: ms(8),
    gap: ms(4),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray30,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
  },
});
