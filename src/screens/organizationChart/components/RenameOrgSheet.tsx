import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Controller, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { MemoBottomSheetModal } from '@/src/component/BottomSheetModal';
import { MemoAppSheetInput } from '@/src/component/AppSheetInput';

interface IProps {
  visible: boolean;
  onClose: () => void;
  currentName: string;
  onSave: (newName: string) => void;
  title?: string;
  inputLabel?: string;
  placeholder?: string;
}

interface IFormValues {
  name: string;
}

//---------------------------------------
const RenameOrgSheet: React.FC<IProps> = ({
  visible,
  onClose,
  currentName,
  onSave,
  title = '이름 변경',
  inputLabel = '조직명',
  placeholder = '조직명을 입력해 주세요',
}) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: {
      name: currentName,
    },
  });

  const nameValue = watch('name');

  //---------------------------------------
  const handleClose = React.useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  //---------------------------------------
  const onSubmit = React.useCallback(
    (data: IFormValues) => {
      onSave(data.name);
      handleClose();
    },
    [onSave, handleClose],
  );

  //---------------------------------------
  React.useEffect(() => {
    if (visible) {
      reset({ name: currentName });
    }
  }, [visible, currentName, reset]);

  return (
    <MemoBottomSheetModal
      visible={visible}
      onClose={handleClose}
      title={title}
      sheetStyle={styles.sheet}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        extraScrollHeight={ms(20)}
      >
        <View style={styles.container}>
          <Controller
            control={control}
            name="name"
            rules={{ required: `${inputLabel}을 입력해 주세요` }}
            render={({ field: { value, onChange } }) => (
              <MemoAppSheetInput
                label={inputLabel}
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                error={errors.name?.message}
              />
            )}
          />
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.buttonGroup}>
        <View style={styles.buttonWrapper}>
          <MemoAppButton label="취소" variant="secondary" onPress={handleClose} />
        </View>

        <View style={styles.buttonWrapper}>
          <MemoAppButton
            label="저장"
            variant="primary"
            onPress={handleSubmit(onSubmit)}
            disabled={!nameValue?.trim()}
          />
        </View>
      </View>
    </MemoBottomSheetModal>
  );
};

export const MemoRenameOrgSheet = React.memo(RenameOrgSheet);

//---------------------------------------
const styles = StyleSheet.create({
  scrollContent: {
    gap: ms(16),
    paddingBottom: ms(12),
    width: '100%',
  },
  container: {
    paddingTop: ms(16),
    paddingHorizontal: ms(20),
  },
  sheet: {
    paddingBottom: ms(10),
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: ms(8),
    paddingTop: ms(16),
    paddingHorizontal: ms(16),
    width: '100%',
  },
  buttonWrapper: {
    flex: 1,
  },
});
