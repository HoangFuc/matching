import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Edit2 } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import type { TDepartment } from '../type';

interface IHqSelectorProps {
  departments: TDepartment[];
  selectedIndex: number;
  showPicker: boolean;
  showEditButton?: boolean;
  onTogglePicker: () => void;
  onSelect: (index: number) => void;
  onPressEdit: () => void;
}

//---------------------------------------
const HqSelector: React.FC<IHqSelectorProps> = ({
  departments,
  selectedIndex,
  showPicker,
  showEditButton = false,
  onTogglePicker,
  onSelect,
  onPressEdit,
}) => {
  const currentDept = departments[selectedIndex];

  return (
    <>
      <View style={styles.hqSelectorRow}>
        <Pressable style={styles.hqDropdown} onPress={onTogglePicker}>
          <AppText variant="body6" color={AppColors.gray90}>
            {currentDept?.name ?? ''}
          </AppText>

          <AppText variant="body7" color={AppColors.gray50}>
            {`(${departments.length})`}
          </AppText>
        </Pressable>

        {showEditButton && (
          <Pressable
            hitSlop={8}
            onPress={onPressEdit}
            style={styles.editButton}
          >
            <Edit2
              size={`${ms(20)}`}
              color={AppColors.gray90}
              variant="Linear"
            />
          </Pressable>
        )}
      </View>

      {showPicker && (
        <View style={styles.hqPickerDropdown}>
          {departments.map((dept, index) => (
            <Pressable
              key={dept.id}
              style={[
                styles.hqPickerItem,
                index === selectedIndex && styles.hqPickerItemActive,
              ]}
              onPress={() => onSelect(index)}
            >
              <AppText
                variant="body7"
                color={
                  index === selectedIndex ? AppColors.purple : AppColors.gray90
                }
              >
                {dept.name}
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
