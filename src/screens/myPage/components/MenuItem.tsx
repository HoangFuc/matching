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
  gap?: number;
  labelVariant?: React.ComponentProps<typeof AppText>['variant'];
  onPress?: () => void;
  isLast?: boolean;
  isFirst?: boolean;
}

const MenuItem: React.FC<IMenuItemProps> = ({
  icon,
  label,
  rightText,
  showArrow = true,
  gap,
  labelVariant = 'body7',
  onPress,
  isLast,
  isFirst,
}) => {
  return (
    <Pressable
      style={[
        styles.container,
        isLast && styles.isLast,
        isFirst && styles.isFirst,
      ]}
      onPress={onPress}
    >
      <View style={[styles.left, gap !== undefined && { gap }]}>
        {icon && <View style={styles.icon}>{icon}</View>}

        <AppText variant={labelVariant} color={AppColors.gray90}>
          {label}
        </AppText>
      </View>

      <View style={styles.right}>
        {rightText && (
          <AppText variant="detail" color={AppColors.gray90}>
            {rightText}
          </AppText>
        )}

        {showArrow && (
          <ArrowRight2
            size={`${ms(20)}`}
            color={AppColors.gray90}
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
    borderBottomWidth: ms(1),
    borderColor: AppColors.gray20,
    paddingVertical: ms(16),
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
  isLast: {
    paddingBottom: ms(0),
    paddingTop: ms(16),
    borderBottomWidth: 0,
  },
  isFirst: {
    paddingBottom: ms(16),
    paddingTop: 0,
  },
});
