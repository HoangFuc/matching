import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ArrowDown2 } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';

export type TDropdownOption = {
  label: string;
  value: string;
  departmentId?: string;
  teamId?: string;
};

interface IProps {
  label: string;
  value: string;
  placeholder?: string;
  options: TDropdownOption[];
  onSelect: (option: TDropdownOption) => void;
  disabled?: boolean;
}

//---------------------------------------
const InviteDropdownField: React.FC<IProps> = ({
  label,
  value,
  placeholder = '',
  options,
  onSelect,
  disabled,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <View style={styles.fieldContainer}>
      <AppText variant="body7" color={AppColors.gray90}>
        {label}
      </AppText>

      <Pressable
        style={[styles.dropdownRow, disabled && styles.dropdownDisabled]}
        onPress={disabled ? undefined : () => setShowDropdown(prev => !prev)}
      >
        <AppText
          variant="body8"
          color={value ? AppColors.gray90 : AppColors.gray40}
        >
          {value || placeholder}
        </AppText>

        <ArrowDown2
          size={`${ms(16)}`}
          color={AppColors.gray40}
          variant="Linear"
        />
      </Pressable>

      {showDropdown && (
        <View style={styles.dropdownList}>
          {options.map(option => (
            <Pressable
              key={option.value}
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(option);
                setShowDropdown(false);
              }}
            >
              <AppText
                variant="body8"
                color={
                  value === option.label ? AppColors.purple : AppColors.gray80
                }
              >
                {option.label}
              </AppText>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export const MemoInviteDropdownField = React.memo(InviteDropdownField);

const styles = StyleSheet.create({
  fieldContainer: {
    gap: ms(6),
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.gray10,
    borderRadius: ms(8),
    paddingHorizontal: ms(12),
    paddingVertical: ms(10),
  },
  dropdownDisabled: {
    opacity: 0.5,
  },
  dropdownList: {
    backgroundColor: AppColors.white,
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: AppColors.gray20,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: ms(12),
    paddingVertical: ms(10),
  },
});
