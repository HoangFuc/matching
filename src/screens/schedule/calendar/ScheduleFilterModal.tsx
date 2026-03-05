import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ms, s } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { TScheduleType } from './ScheduleTypePicker';

const SCHEDULE_TYPES: TScheduleType[] = ['일반일정', '고객 미팅', '계약 일정'];

interface IProps {
  visible: boolean;
  selectedTypes: TScheduleType[];
  onApply: (types: TScheduleType[]) => void;
  onClose: () => void;
}

const ScheduleFilterModal: React.FC<IProps> = ({
  visible,
  selectedTypes,
  onApply,
  onClose,
}) => {
  const [localSelected, setLocalSelected] =
    React.useState<TScheduleType[]>(selectedTypes);

  React.useEffect(() => {
    if (visible) {
      setLocalSelected(selectedTypes);
    }
  }, [visible, selectedTypes]);

  const handleToggle = React.useCallback((type: TScheduleType) => {
    setLocalSelected(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type],
    );
  }, []);

  const handleReset = React.useCallback(() => {
    setLocalSelected([]);
  }, []);

  const handleApply = React.useCallback(() => {
    onApply(localSelected);
    onClose();
  }, [localSelected, onApply, onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
          <View style={styles.handleBar} />

          <AppText
            variant="heading3"
            color={AppColors.gray100}
            style={styles.title}
          >
            필터
          </AppText>

          <View style={styles.body}>
            <AppText variant="body7" color={AppColors.gray90}>
              일정 종류
            </AppText>

            <View style={styles.chipContainer}>
              {SCHEDULE_TYPES.map(type => {
                const isSelected = localSelected.includes(type);
                return (
                  <Pressable
                    key={type}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => handleToggle(type)}
                  >
                    <AppText
                      variant="body4"
                      color={isSelected ? AppColors.purple : AppColors.gray60}
                    >
                      {type}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.buttonRow}>
            <Pressable style={styles.resetButton} onPress={handleReset}>
              <AppText variant="body6" color={AppColors.gray60}>
                초기화
              </AppText>
            </Pressable>

            <Pressable style={styles.applyButton} onPress={handleApply}>
              <AppText variant="body6" color={AppColors.purple}>
                확인
              </AppText>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export const MemoScheduleFilterModal = React.memo(ScheduleFilterModal);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: AppColors.white,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
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
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray20,
  },
  body: {
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
    paddingBottom: ms(24),
    gap: ms(12),
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(8),
  },
  chip: {
    borderRadius: ms(100),
    borderWidth: 1,
    borderColor: AppColors.gray30,
    paddingHorizontal: ms(16),
    paddingVertical: ms(6),
  },
  chipSelected: {
    borderColor: AppColors.purple,
    backgroundColor: AppColors.lavendar,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: ms(12),
    paddingBottom: ms(24),
  },
  resetButton: {
    borderRadius: ms(100),
    borderWidth: 1,
    borderColor: AppColors.gray30,
    paddingHorizontal: ms(24),
    paddingVertical: ms(8),
  },
  applyButton: {
    borderRadius: ms(100),
    backgroundColor: AppColors.lavendar,
    paddingHorizontal: ms(24),
    paddingVertical: ms(8),
  },
});
