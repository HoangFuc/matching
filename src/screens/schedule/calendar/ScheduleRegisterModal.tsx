import React from 'react';
import { StyleSheet, View } from 'react-native';

import dayjs from 'dayjs';
import { ms, s } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { MemoBottomSheetModal } from '@/src/component/BottomSheetModal';
import { MemoFormInput } from '@/src/component/FormInput';

import { createSchedule } from '@/src/api/schedule.api';
import { useMutation } from '@tanstack/react-query';
import { MemoFormCreateSchedule } from './FormCreateSchedule';
import { MemoScheduleTypePicker, TScheduleType } from './ScheduleTypePicker';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

const ScheduleRegisterModal: React.FC<IProps> = ({ visible, onClose }) => {
  //---------------------------------------
  const [scheduleType, setScheduleType] =
    React.useState<TScheduleType>('일반일정');
  const [showTypePicker, setShowTypePicker] = React.useState(false);

  //---------------------------------------
  const [date, setDate] = React.useState(dayjs().format('YYYY.MM.DD'));
  const [time, setTime] = React.useState(dayjs().format('HH:mm'));

  //---------------------------------------
  const [scheduleName, setScheduleName] = React.useState('');
  const [scheduleContent, setScheduleContent] = React.useState('');

  //---------------------------------------
  const [customerName, setCustomerName] = React.useState('');
  const [contact, setContact] = React.useState('');
  const [memo, setMemo] = React.useState('');

  //---------------------------------------
  const createScheduleMutation = useMutation({
    mutationFn: createSchedule,
    onSuccess: res => {
      console.log('======================res', res);
    },
  });

  //---------------------------------------
  const resetForm = React.useCallback(() => {
    setScheduleType('일반일정');
    setDate(dayjs().format('YYYY.MM.DD'));
    setTime(dayjs().format('HH:mm'));
    setScheduleName('');
    setScheduleContent('');
    setCustomerName('');
    setContact('');
    setMemo('');
  }, []);

  //---------------------------------------
  const handleClose = React.useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  //---------------------------------------
  const handleRegister = React.useCallback(() => {
    // const payload = {
    //   scheduleType,
    //   title: scheduleName,
    //   description: scheduleContent,
    //   startTime: time,
    //   scheduleDate: date,
    // };
    createScheduleMutation.mutate();
    handleClose();
  }, [createScheduleMutation, handleClose]);

  //---------------------------------------
  const renderGeneralFields = React.useMemo(
    () => (
      <View style={{ gap: ms(16) }}>
        <MemoFormInput
          label="일정명"
          placeholder="일정명을 입력하세요"
          value={scheduleName}
          onChangeText={setScheduleName}
        />

        <MemoFormInput
          label="일정내용"
          placeholder="일정 내용을 입력하세요"
          value={scheduleContent}
          onChangeText={setScheduleContent}
          multiline
        />
      </View>
    ),
    [scheduleName, scheduleContent],
  );

  //---------------------------------------
  const renderMeetingFields = React.useMemo(
    () => (
      <View style={{ gap: ms(16) }}>
        <MemoFormInput
          label="고객명"
          labelVariant="body6"
          placeholder="고객명을 입력하세요"
          value={customerName}
          onChangeText={setCustomerName}
        />

        <MemoFormInput
          label="연락처"
          labelVariant="body6"
          placeholder="연락처를 입력하세요"
          value={contact}
          onChangeText={setContact}
          keyboardType="phone-pad"
        />

        <MemoFormInput
          label="일정명"
          labelVariant="body6"
          placeholder="일정명을 입력하세요"
          value={scheduleName}
          onChangeText={setScheduleName}
        />

        <MemoFormInput
          label="메모"
          labelVariant="body6"
          placeholder="메모를 입력하세요"
          value={memo}
          onChangeText={setMemo}
          multiline
        />
      </View>
    ),
    [customerName, contact, scheduleName, memo],
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
          setShowTypePicker={setShowTypePicker}
          scheduleType={scheduleType}
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          renderGeneralFields={() => renderGeneralFields}
          renderMeetingFields={() => renderMeetingFields}
        />

        {/* Register button */}
        <View style={styles.buttonContainer}>
          <MemoAppButton
            label="일정등록"
            onPress={handleRegister}
            style={styles.registerButton}
          />
        </View>
      </MemoBottomSheetModal>

      <MemoScheduleTypePicker
        visible={showTypePicker}
        selected={scheduleType}
        onSelect={setScheduleType}
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
  },
  registerButton: {
    width: s(163),
    height: s(36),
  },
});
