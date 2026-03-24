import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { ArrowRight2 } from '@/src/constants/icons';

interface IMenuItemProps {
  icon?: React.ReactNode;
  label: string;
  rightText?: string;
  showArrow?: boolean;
  onPress?: () => void;
}

const MenuItem: React.FC<IMenuItemProps> = ({
  icon,
  label,
  rightText,
  showArrow = true,
  onPress,
}) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.left}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <AppText variant="body7" color={AppColors.gray90}>
          {label}
        </AppText>
      </View>

      <View style={styles.right}>
        {rightText && (
          <AppText variant="body7" color={AppColors.gray50}>
            {rightText}
          </AppText>
        )}
        {showArrow && (
          <ArrowRight2
            size={`${ms(20)}`}
            color={AppColors.gray40}
            variant="Linear"
          />
        )}
      </View>
    </Pressable>
  );
};

export const MemoMenuItem = React.memo(MenuItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ms(14),
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(12),
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  icon: {
    width: ms(24),
    alignItems: 'center',
  },
});
