import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ms, s } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';

export type TScheduleType = '일반일정' | '고객 미팅' | '계약 일정';

const SCHEDULE_TYPES: TScheduleType[] = ['일반일정', '고객 미팅', '계약 일정'];

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
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          <AppText
            variant="heading3"
            color={AppColors.gray100}
            style={styles.title}
          >
            일정 종류
          </AppText>

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
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export const MemoScheduleTypePicker = React.memo(ScheduleTypePicker);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    paddingTop: ms(14),
  },
  sheet: {
    backgroundColor: AppColors.white,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    alignItems: 'center',
  },
  handleBar: {
    width: s(50),
    height: s(6),
    borderRadius: ms(100),
    backgroundColor: AppColors.gray20,
    alignSelf: 'center',
    marginTop: ms(14),
  },
  title: {
    textAlign: 'center',
    paddingVertical: ms(8),
    paddingHorizontal: ms(16),
    gap: ms(8),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray20,
    alignSelf: 'stretch',
  },
  optionContainer: {
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
    paddingBottom: ms(24),
    gap: ms(16),
  },
});
