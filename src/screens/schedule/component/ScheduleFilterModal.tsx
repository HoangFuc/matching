import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoAppButton } from '@/src/component/AppButton';
import { MemoBottomSheetModal } from '@/src/component/BottomSheetModal';
import { MemoChip } from '@/src/component/Chip';
import { AppColors } from '@/src/constants/colors';
import { TScheduleType } from './ScheduleTypePicker';

const SCHEDULE_TYPES: {
  label: TScheduleType;
  bgColor: string;
  textColor: string;
}[] = [
  {
    label: '일반일정',
    bgColor: AppColors.lavendar,
    textColor: AppColors.purple,
  },
  {
    label: '고객 미팅',
    bgColor: AppColors.lightBlue,
    textColor: AppColors.strongBlue,
  },
  {
    label: '계약 일정',
    bgColor: AppColors.lightPink,
    textColor: AppColors.negative,
  },
];

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

  //---------------------------------------
  const handleToggle = React.useCallback((type: TScheduleType) => {
    setLocalSelected(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type],
    );
  }, []);

  //---------------------------------------
  const handleReset = React.useCallback(() => {
    setLocalSelected([]);
  }, []);

  //---------------------------------------
  const handleApply = React.useCallback(() => {
    onApply(localSelected);
    onClose();
  }, [localSelected, onApply, onClose]);

  //---------------------------------------
  React.useEffect(() => {
    if (visible) {
      setLocalSelected(selectedTypes);
    }
  }, [visible, selectedTypes]);

  return (
    <MemoBottomSheetModal visible={visible} onClose={onClose} title="필터">
      <View style={styles.body}>
        <AppText variant="body5" color={AppColors.gray100}>
          일정 종류
        </AppText>

        <View style={styles.chipContainer}>
          {SCHEDULE_TYPES.map(({ label, bgColor, textColor }) => (
            <MemoChip
              key={label}
              label={label}
              bgColor={bgColor}
              textColor={textColor}
              selected={localSelected.includes(label)}
              onPress={() => handleToggle(label)}
            />
          ))}
        </View>
      </View>

      <View style={styles.buttonRow}>
        <MemoAppButton
          label="초기화"
          variant="secondary"
          onPress={handleReset}
          style={styles.flexButton}
        />

        <MemoAppButton
          label="확인"
          onPress={handleApply}
          style={styles.flexButton}
        />
      </View>
    </MemoBottomSheetModal>
  );
};

export const MemoScheduleFilterModal = React.memo(ScheduleFilterModal);

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
    paddingBottom: ms(24),
    gap: ms(8),
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(8),
  },
  buttonRow: {
    flexDirection: 'row',
    gap: ms(8),
    paddingHorizontal: ms(16),
  },
  flexButton: {
    flex: 1,
    paddingVertical: ms(12),
  },
});
