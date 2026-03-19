import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ArrowDown2, Edit2 } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import type { THeadquarters } from '../type';

interface IHqSelectorProps {
  headquarters: THeadquarters[];
  selectedHqIndex: number;
  showPicker: boolean;
  onTogglePicker: () => void;
  onSelectHq: (index: number) => void;
  onPressEdit: () => void;
}

//---------------------------------------
const HqSelector: React.FC<IHqSelectorProps> = ({
  headquarters,
  selectedHqIndex,
  showPicker,
  onTogglePicker,
  onSelectHq,
  onPressEdit,
}) => {
  const currentHq = headquarters[selectedHqIndex];

  return (
    <>
      <View style={styles.hqSelectorRow}>
        <Pressable style={styles.hqDropdown} onPress={onTogglePicker}>
          <AppText variant="body6" color={AppColors.gray90}>
            {currentHq?.name ?? ''}
          </AppText>

          <ArrowDown2
            size={`${ms(16)}`}
            color={AppColors.gray90}
            variant="Linear"
          />
        </Pressable>

        <Pressable hitSlop={8} onPress={onPressEdit} style={styles.editButton}>
          <Edit2 size={`${ms(20)}`} color={AppColors.gray90} variant="Linear" />
        </Pressable>
      </View>

      {showPicker && (
        <View style={styles.hqPickerDropdown}>
          {headquarters.map((hq, index) => (
            <Pressable
              key={hq.id}
              style={[
                styles.hqPickerItem,
                index === selectedHqIndex && styles.hqPickerItemActive,
              ]}
              onPress={() => onSelectHq(index)}
            >
              <AppText
                variant="body7"
                color={
                  index === selectedHqIndex
                    ? AppColors.purple
                    : AppColors.gray90
                }
              >
                {hq.name}
              </AppText>
            </Pressable>
          ))}
        </View>
      )}
    </>
  );
};

export const MemoHqSelector = React.memo(HqSelector);

//---------------------------------------
const styles = StyleSheet.create({
  hqSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hqDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
  },
  hqPickerDropdown: {
    backgroundColor: AppColors.white,
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: AppColors.gray20,
    overflow: 'hidden',
  },
  hqPickerItem: {
    paddingHorizontal: ms(16),
    paddingVertical: ms(10),
  },
  hqPickerItemActive: {
    backgroundColor: AppColors.lavendar,
  },
  editButton: {
    borderRadius: ms(8),
    padding: ms(4),
    gap: ms(10),
    backgroundColor: AppColors.gray20,
  },
});
