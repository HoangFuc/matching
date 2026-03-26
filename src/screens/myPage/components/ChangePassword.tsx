import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Controller, useForm } from 'react-hook-form';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { MemoFormInput } from '@/src/component/FormInput';

type TChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

interface IChangePasswordProps {
  onCancel: () => void;
  onSave: (data: TChangePasswordFormValues) => void;
}

//---------------------------------------
const ChangePassword: React.FC<IChangePasswordProps> = ({
  onCancel,
  onSave,
}) => {
  const { control, handleSubmit } = useForm<TChangePasswordFormValues>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  //---------------------------------------
  const onSubmit = React.useCallback(
    (data: TChangePasswordFormValues) => {
      onSave(data);
    },
    [onSave],
  );

  return (
    <View style={styles.container}>
      <View style={styles.fields}>
        <Controller
          control={control}
          name="currentPassword"
          render={({ field: { value, onChange } }) => (
            <MemoFormInput
              label="현재 비밀번호"
              required
              value={value}
              onChangeText={onChange}
              placeholder="현재 비밀번호를 입력하세요"
              secureTextEntry
              gap={ms(4)}
            />
          )}
        />

        <Controller
          control={control}
          name="newPassword"
          render={({ field: { value, onChange } }) => (
            <MemoFormInput
              label="새 비밀번호"
              required
              value={value}
              onChangeText={onChange}
              placeholder="새 비밀번호를 입력하세요"
              secureTextEntry
              gap={ms(4)}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { value, onChange } }) => (
            <MemoFormInput
              label="새 비밀번호 확인"
              required
              value={value}
              onChangeText={onChange}
              placeholder="비밀번호를 다시 입력하세요"
              secureTextEntry
              gap={ms(4)}
            />
          )}
        />
      </View>

      <View style={styles.buttonRow}>
        <MemoAppButton
          label="취소"
          variant="secondary"
          textVariant="body6"
          style={styles.actionButton}
          onPress={onCancel}
        />

        <MemoAppButton
          label="저장"
          variant="primary"
          textVariant="body6"
          style={styles.actionButton}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
};

export const MemoChangePassword = React.memo(ChangePassword);

const styles = StyleSheet.create({
  container: {
    gap: ms(16),
  },
  fields: {
    gap: ms(12),
  },
  buttonRow: {
    flexDirection: 'row',
    gap: ms(8),
  },
  actionButton: {
    flex: 1,
    paddingVertical: ms(10),
    borderRadius: ms(8),
  },
});
