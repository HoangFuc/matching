import React from 'react';
import { StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoChip } from '@/src/component/Chip';
import { AppColors } from '@/src/constants/colors';

export type TDetailInfoRow =
  | { label: string; type: 'text'; value: string; flex?: boolean }
  | {
      label: string;
      type: 'chip';
      chips: { label: string; bgColor: string; textColor: string }[];
    };

interface IProps {
  row: TDetailInfoRow;
}

//---------------------------------------
const DetailInfoRow: React.FC<IProps> = ({ row }) => (
  <View style={styles.infoRow}>
    <AppText variant="body7" color={AppColors.gray60} style={styles.label}>
      {row.label}
    </AppText>

    {row.type === 'chip' ? (
      <View style={styles.chips}>
        {row.chips.map(chip => (
          <MemoChip
            key={chip.label}
            label={chip.label}
            bgColor={chip.bgColor}
            textColor={chip.textColor}
            textVariant="detail"
          />
        ))}
      </View>
    ) : (
      <AppText
        variant="body7"
        color={AppColors.gray90}
        style={row.flex ? styles.infoValue : undefined}
      >
        {row.value}
      </AppText>
    )}
  </View>
);

export const MemoDetailInfoRow = React.memo(DetailInfoRow);

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    width: ms(70),
  },
  infoValue: {
    flex: 1,
  },
  chips: {
    flexDirection: 'row',
    gap: ms(4),
  },
});
