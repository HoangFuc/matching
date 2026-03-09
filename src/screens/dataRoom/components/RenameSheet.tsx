import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Controller, useForm } from 'react-hook-form';

import { MemoAppBottomSheet } from '@/src/component/AppBottomSheet';
import { MemoAppButton } from '@/src/component/AppButton';
import { MemoAppSheetInput } from '@/src/component/AppSheetInput';
import { useRenameItemMutation } from '@/src/store/api/dataRoom.api';

interface IProps {
  visible: boolean;
  onClose: () => void;
  itemId: string;
  currentName: string;
  kind: 'file' | 'folder';
}

interface IFormValues {
  name: string;
}

const RenameSheet: React.FC<IProps> = ({
  visible,
  onClose,
  itemId,
  currentName,
  kind,
}) => {
  const [renameItem, { isLoading }] = useRenameItemMutation();

  //---------------------------------------
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: {
      name: currentName,
    },
  });

  //---------------------------------------
  const handleClose = React.useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  //---------------------------------------
  const onSubmit = React.useCallback(
    async (data: IFormValues) => {
      try {
        await renameItem({ id: itemId, name: data.name, kind }).unwrap();

        handleClose();
      } catch (error) {
        console.log('Rename error:', error);
      }
    },
    [renameItem, itemId, kind, handleClose],
  );

  //---------------------------------------
  const footer = React.useMemo(
    () => (
      <>
        <MemoAppButton
          label="취소"
          variant="secondary"
          onPress={handleClose}
          style={styles.button}
        />

        <MemoAppButton
          label="확인"
          variant="primary"
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          style={styles.button}
        />
      </>
    ),
    [handleClose, handleSubmit, onSubmit, isLoading],
  );

  //---------------------------------------
  React.useEffect(() => {
    if (visible) {
      reset({ name: currentName });
    }
  }, [visible, currentName, reset]);

  return (
    <MemoAppBottomSheet
      visible={visible}
      onClose={handleClose}
      title="이름 변경"
      showHandle={true}
      footer={footer}
    >
      <View style={styles.container}>
        <Controller
          control={control}
          name="name"
          rules={{ required: '이름을 입력해주세요' }}
          render={({ field: { value, onChange } }) => (
            <MemoAppSheetInput
              label="명"
              value={value}
              onChangeText={onChange}
              placeholder="파일명을 입력해주세요"
              error={errors.name?.message}
            />
          )}
        />
      </View>
    </MemoAppBottomSheet>
  );
};

export const MemoRenameSheet = React.memo(RenameSheet);

const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  container: {
    paddingTop: 16,
  },
});
