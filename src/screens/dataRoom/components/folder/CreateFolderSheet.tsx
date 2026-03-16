import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ArrowDown2 } from '@/src/constants/icons';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ms } from 'react-native-size-matters/extend';

import { MemoAppBottomSheet } from '@/src/component/AppBottomSheet';
import { MemoAppButton } from '@/src/component/AppButton';
import { MemoAppSheetInput } from '@/src/component/AppSheetInput';
import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { useCreateFolderMutation } from '@/src/store/api/dataRoom.api';
import { DATA_ROOM_LABEL_TO_TYPE } from '../../constants';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

interface IFormValues {
  folderType: string;
  folderName: string;
}

const FOLDER_TYPES = ['시세 자료', '분양자료'] as const;

const CreateFolderSheet: React.FC<IProps> = ({ visible, onClose }) => {
  const [createFolder, { isLoading }] = useCreateFolderMutation();
  const [showTypeDropdown, setShowTypeDropdown] = React.useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: {
      folderType: '시세 자료',
      folderName: '',
    },
  });

  //---------------------------------------
  const formValue = watch();

  //---------------------------------------
  const isDisabled = React.useMemo(() => {
    return !!formValue.folderName && !!formValue.folderType;
  }, [formValue.folderName, formValue.folderType]);

  //---------------------------------------
  const handleClose = React.useCallback(() => {
    reset();
    setShowTypeDropdown(false);
    onClose();
  }, [reset, onClose]);

  //---------------------------------------
  const onSubmit = React.useCallback(
    async (data: IFormValues) => {
      try {
        await createFolder({
          name: data.folderName,
          type: DATA_ROOM_LABEL_TO_TYPE[data.folderType],
        }).unwrap();
        handleClose();
      } catch (error) {
        console.log('Create folder error:', error);
      }
    },
    [createFolder, handleClose],
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
          onPress={handleSubmit(onSubmit)}
          disabled={!isDisabled || isLoading}
          style={styles.button}
        />
      </>
    ),
    [handleClose, handleSubmit, onSubmit, isDisabled, isLoading],
  );

  return (
    <MemoAppBottomSheet
      visible={visible}
      onClose={handleClose}
      title="폴더 생성"
      showHandle={false}
      scrollable={false}
      footer={footer}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        extraScrollHeight={ms(20)}
      >
      <Controller
        control={control}
        name="folderType"
        rules={{ required: '폴더 유형을 선택하세요' }}
        render={({ field: { value } }) => (
          <View style={styles.headerInput}>
            <AppText
              variant="body7"
              color={AppColors.gray90}
              style={styles.label}
            >
              폴더 유형
            </AppText>

            <Pressable
              style={styles.dropdownButton}
              onPress={() => setShowTypeDropdown(prev => !prev)}
            >
              <AppText variant="body8" color={AppColors.gray80}>
                {value}
              </AppText>

              <ArrowDown2
                size={`${ms(16)}`}
                color={AppColors.gray50}
                variant="Linear"
              />
            </Pressable>

            {showTypeDropdown && (
              <View style={styles.dropdownList}>
                {FOLDER_TYPES.map(type => (
                  <Pressable
                    key={type}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setValue('folderType', type);
                      setShowTypeDropdown(false);
                    }}
                  >
                    <AppText
                      variant="body8"
                      color={
                        value === type ? AppColors.purple : AppColors.gray80
                      }
                    >
                      {type}
                    </AppText>
                  </Pressable>
                ))}
              </View>
            )}
            {errors.folderType?.message && (
              <AppText
                variant="detail"
                color={AppColors.negative}
                style={styles.errorText}
              >
                {errors.folderType.message}
              </AppText>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="folderName"
        rules={{ required: '폴더명을 입력해주세요' }}
        render={({ field: { value, onChange } }) => (
          <MemoAppSheetInput
            label="폴더명"
            value={value}
            onChangeText={onChange}
            placeholder="일정명을 입력하세요"
            error={errors.folderName?.message}
          />
        )}
      />
      </KeyboardAwareScrollView>
    </MemoAppBottomSheet>
  );
};

export const MemoCreateFolderSheet = React.memo(CreateFolderSheet);

const styles = StyleSheet.create({
  label: {
    marginBottom: ms(6),
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: ms(8),
    paddingHorizontal: ms(16),
    height: ms(40),
    backgroundColor: AppColors.gray10,
  },
  dropdownList: {
    marginTop: ms(4),
    borderRadius: ms(8),
    backgroundColor: AppColors.gray10,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: ms(16),
    paddingVertical: ms(10),
  },
  errorText: {
    marginTop: ms(4),
  },
  button: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ms(20),
    gap: ms(16),
  },
  headerInput: {
    paddingTop: ms(16),
  },
});
