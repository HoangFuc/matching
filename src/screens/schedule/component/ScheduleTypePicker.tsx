import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoBottomSheetModal } from '@/src/component/BottomSheetModal';
import { AppColors } from '@/src/constants/colors';

export type TScheduleType = '일반일정' | '고객 미팅' | '계약 일정';

export const ALL_SCHEDULE_TYPES: TScheduleType[] = ['일반일정', '고객 미팅', '계약 일정'];

const SCHEDULE_TYPES: TScheduleType[] = ALL_SCHEDULE_TYPES;

interface IProps {
  visible: boolean;
  selected: TScheduleType;
  onSelect: (type: TScheduleType) => void;
  onClose: () => void;
}

const ScheduleTypePicker: React.FC<IProps> = ({
  visible,
  selected,
  onSelect,
  onClose,
}) => {
  return (
    <MemoBottomSheetModal
      visible={visible}
      onClose={onClose}
      title="일정 종류"
      sheetStyle={styles.sheet}
    >
      <View style={styles.optionContainer}>
        {SCHEDULE_TYPES.map(type => {
          const isSelected = type === selected;
          return (
            <Pressable
              key={type}
              onPress={() => {
                onSelect(type);
                onClose();
              }}
            >
              <AppText
                variant={isSelected ? 'body1' : 'body4'}
                color={isSelected ? AppColors.purple : AppColors.gray100}
              >
                {type}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </MemoBottomSheetModal>
  );
};

export const MemoScheduleTypePicker = React.memo(ScheduleTypePicker);

const styles = StyleSheet.create({
  sheet: {
    alignItems: 'center',
  },
  optionContainer: {
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
    paddingBottom: ms(24),
    gap: ms(16),
  },
});
