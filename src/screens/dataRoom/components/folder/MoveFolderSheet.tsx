import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { MemoAppBottomSheet } from '@/src/component/AppBottomSheet';
import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { RadioCheck } from '@/src/constants/icons';
import { useMoveFolderMutation } from '@/src/store/api/dataRoom.api';

interface IProps {
  visible: boolean;
  onClose: () => void;
  folderId: string;
  currentType: string;
}

const FOLDER_TYPES = ['시세 자료', '분양자료'];

const MoveFolderSheet: React.FC<IProps> = ({
  visible,
  onClose,
  folderId,
  currentType,
}) => {
  const [moveFolder, { isLoading }] = useMoveFolderMutation();
  const [selectedType, setSelectedType] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (visible) {
      setSelectedType(null);
    }
  }, [visible]);

  const handleConfirm = React.useCallback(async () => {
    if (!selectedType) {
      return;
    }
    try {
      await moveFolder({ folderId, targetType: selectedType }).unwrap();
      onClose();
    } catch (error) {
      console.log('Move folder error:', error);
    }
  }, [selectedType, moveFolder, folderId, onClose]);

  const footer = React.useMemo(
    () => (
      <>
        <MemoAppButton label="취소" variant="secondary" onPress={onClose} />
        <MemoAppButton
          label="확인"
          variant="primary"
          onPress={handleConfirm}
          disabled={!selectedType || isLoading}
        />
      </>
    ),
    [onClose, handleConfirm, selectedType, isLoading],
  );

  return (
    <MemoAppBottomSheet
      visible={visible}
      onClose={onClose}
      title="이동"
      footer={footer}
    >
      <View style={{ paddingVertical: ms(16), gap: 16 }}>
        <AppText variant="body2" color={AppColors.gray100}>
          자료 유형
        </AppText>

        {FOLDER_TYPES.map(type => {
          const isCurrent = type === currentType;
          const isSelected = selectedType === type;

          return (
            <Pressable
              key={type}
              style={styles.typeItem}
              onPress={() => {
                if (!isCurrent) {
                  setSelectedType(type);
                }
              }}
              disabled={isCurrent}
            >
              <AppText
                variant={isSelected ? 'body2' : 'body4'}
                color={
                  isCurrent
                    ? AppColors.gray40
                    : isSelected
                    ? AppColors.purple
                    : AppColors.gray80
                }
              >
                {type}
              </AppText>
              {isSelected && (
                <RadioCheck width={ms(20)} height={ms(20)} />
              )}
            </Pressable>
          );
        })}
      </View>
    </MemoAppBottomSheet>
  );
};

export const MemoMoveFolderSheet = React.memo(MoveFolderSheet);

const styles = StyleSheet.create({
  typeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
