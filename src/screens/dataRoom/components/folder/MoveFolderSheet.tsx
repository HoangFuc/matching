import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { MemoAppBottomSheet } from '@/src/component/AppBottomSheet';
import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { RadioCheck } from '@/src/constants/icons';
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
  const [selectedType, setSelectedType] = React.useState<string | null>(null);

  //---------------------------------------
  const handleConfirm = React.useCallback(() => {
    if (!selectedType) {
      return;
    }
    // TODO: API move folder chưa hỗ trợ
    console.log('Move folder:', { folderId, targetType: selectedType });
    onClose();
  }, [selectedType, folderId, onClose]);

  //---------------------------------------
  const footer = React.useMemo(
    () => (
      <>
        <MemoAppButton
          label="취소"
          variant="secondary"
          onPress={onClose}
          style={styles.button}
        />

        <MemoAppButton
          label="확인"
          variant="primary"
          onPress={handleConfirm}
          disabled={!selectedType}
          style={styles.button}
        />
      </>
    ),
    [onClose, handleConfirm, selectedType],
  );

  //---------------------------------------
  React.useEffect(() => {
    if (visible) {
      setSelectedType(null);
    }
  }, [visible]);

  return (
    <MemoAppBottomSheet
      visible={visible}
      onClose={onClose}
      title="이동"
      footer={footer}
    >
      <View style={styles.container}>
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
              {isSelected && <RadioCheck width={ms(20)} height={ms(20)} />}
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
  button: {
    flex: 1,
  },
  container: {
    paddingVertical: ms(16),
    gap: 16,
  },
});
