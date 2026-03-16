import React from 'react';
import { StyleSheet, View } from 'react-native';

import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { ms, s } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { MemoBottomSheetModal } from '@/src/component/BottomSheetModal';
import { SCHEDULE_LABEL_TO_ENUM } from '@/src/constants/schedule';
import { useCreateScheduleMutation } from '@/src/store/api/schedule.api';

import { MemoFormCreateSchedule } from './FormCreateSchedule';
import { MemoScheduleTypePicker, TScheduleType } from './ScheduleTypePicker';
import type { ISchedulePayload } from '@/src/screens/schedule/type';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

const ScheduleRegisterModal: React.FC<IProps> = ({ visible, onClose }) => {
  const [showTypePicker, setShowTypePicker] = React.useState(false);
  const [createSchedule] = useCreateScheduleMutation();

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<ISchedulePayload>({
      defaultValues: {
        scheduleType: '일반일정',
      },
    });

  const scheduleType = watch('scheduleType') as TScheduleType;
  const formValue = watch();

  //---------------------------------------
  const isDisableButton = React.useMemo(() => {
    const isEnableGeneralType =
      !!formValue.description &&
      !!formValue.title &&
      !!formValue.scheduleDate &&
      !!formValue.startTime;

    if (scheduleType === '일반일정') {
      return !isEnableGeneralType;
    }

    const isEnableRemain =
      !!formValue.memo &&
      !!formValue.customerName &&
      !!formValue.customerPhone &&
      !!formValue.title;

    return !isEnableRemain;
  }, [
    formValue.customerName,
    formValue.customerPhone,
    formValue.description,
    formValue.memo,
    formValue.scheduleDate,
    formValue.startTime,
    formValue.title,
    scheduleType,
  ]);

  //---------------------------------------
  const handleClose = React.useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  //---------------------------------------
  const onSubmit = React.useCallback(
    async (data: ISchedulePayload) => {
      try {
        const startTime =
          data.startTime instanceof Date
            ? `${String(data.startTime.getHours()).padStart(2, '0')}:${String(data.startTime.getMinutes()).padStart(2, '0')}`
            : data.startTime;

        const payload: ISchedulePayload = {
          ...data,
          scheduleType:
            SCHEDULE_LABEL_TO_ENUM[data.scheduleType] ?? data.scheduleType,
          scheduleDate: dayjs(data.scheduleDate.replace(/\./g, '-'))
            .add(1, 'day')
            .toISOString(),
          startTime,
        };

        await createSchedule(payload).unwrap();

        handleClose();
      } catch (error) {
        console.error('Failed to create schedule:', error);
      }
    },
    [createSchedule, handleClose],
  );

  //---------------------------------------
  const handleSelectType = React.useCallback(
    (type: TScheduleType) => {
      setValue('scheduleType', type);
    },
    [setValue],
  );

  return (
    <>
      <MemoBottomSheetModal
        visible={visible}
        onClose={handleClose}
        overlayOpacity={0.7}
        sheetStyle={styles.sheet}
      >
        <MemoFormCreateSchedule
          control={control}
          setShowTypePicker={setShowTypePicker}
          scheduleType={scheduleType}
        />

        {/* Register button */}
        <View style={styles.buttonContainer}>
          <MemoAppButton
            label="일정등록"
            onPress={handleSubmit(onSubmit)}
            style={styles.registerButton}
            disabled={isDisableButton}
          />
        </View>
      </MemoBottomSheetModal>

      <MemoScheduleTypePicker
        visible={showTypePicker}
        selected={scheduleType}
        onSelect={handleSelectType}
        onClose={() => setShowTypePicker(false)}
      />
    </>
  );
};

export const MemoScheduleRegisterModal = React.memo(ScheduleRegisterModal);

const styles = StyleSheet.create({
  sheet: {
    maxHeight: s(716),
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: ms(10),
  },
  registerButton: {
    width: s(163),
    height: s(36),
  },
});
