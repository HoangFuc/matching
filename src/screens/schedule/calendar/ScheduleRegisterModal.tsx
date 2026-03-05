import React from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import dayjs from 'dayjs';
import { ms, s } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';

import { createSchedule } from '@/src/api/schedule.api';
import { FontWeight } from '@/src/constants/typography';
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
        <View>
          <AppText variant="body7" color={AppColors.gray90}>
            일정명
          </AppText>

          <TextInput
            style={styles.input}
            placeholder="일정명을 입력하세요"
            placeholderTextColor={AppColors.gray40}
            value={scheduleName}
            onChangeText={setScheduleName}
          />
        </View>

        <View>
          <AppText variant="body7" color={AppColors.gray90}>
            일정내용
          </AppText>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="일정 내용을 입력하세요"
            placeholderTextColor={AppColors.gray40}
            value={scheduleContent}
            onChangeText={setScheduleContent}
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>
    ),
    [scheduleName, scheduleContent],
  );

  //---------------------------------------
  const renderMeetingFields = React.useMemo(
    () => (
      <View style={{ gap: ms(16) }}>
        <View>
          <AppText variant="body6" color={AppColors.gray90}>
            고객명
          </AppText>
          <TextInput
            style={styles.input}
            placeholder="고객명을 입력하세요"
            placeholderTextColor={AppColors.gray40}
            value={customerName}
            onChangeText={setCustomerName}
          />
        </View>

        <View>
          <AppText variant="body6" color={AppColors.gray90}>
            연락처
          </AppText>
          <TextInput
            style={styles.input}
            placeholder="연락처를 입력하세요"
            placeholderTextColor={AppColors.gray40}
            value={contact}
            onChangeText={setContact}
            keyboardType="phone-pad"
          />
        </View>

        <View>
          <AppText variant="body6" color={AppColors.gray90}>
            일정명
          </AppText>
          <TextInput
            style={styles.input}
            placeholder="일정명을 입력하세요"
            placeholderTextColor={AppColors.gray40}
            value={scheduleName}
            onChangeText={setScheduleName}
          />
        </View>

        <View>
          <AppText variant="body6" color={AppColors.gray90}>
            메모
          </AppText>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="메모를 입력하세요"
            placeholderTextColor={AppColors.gray40}
            value={memo}
            onChangeText={setMemo}
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>
    ),
    [customerName, contact, scheduleName, memo],
  );

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <Pressable style={styles.overlay} onPress={handleClose}>
          <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
            <View style={styles.handleBar} />

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
              <Pressable style={styles.registerButton} onPress={handleRegister}>
                <AppText variant="body6" color={AppColors.purple}>
                  일정등록
                </AppText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: AppColors.white,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    maxHeight: s(716),
  },
  handleBar: {
    width: s(50),
    height: s(6),
    borderRadius: ms(100),
    backgroundColor: AppColors.gray20,
    alignSelf: 'center',
    marginTop: ms(14),
  },
  buttonContainer: {
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: AppColors.lavendar,
    borderRadius: ms(100),
    width: s(163),
    height: s(36),
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(10),
  },
  input: {
    borderRadius: ms(8),
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
    backgroundColor: AppColors.gray10,
    height: ms(36),
    fontSize: 14,
    fontWeight: FontWeight.regular,
    color: AppColors.gray100,
    gap: ms(8),
    ...Platform.select({
      ios: {},
      default: { paddingVertical: 0 },
    }),
  },
  textArea: {
    height: ms(100),
    paddingTop: ms(14),
    paddingVertical: ms(14),
    textAlignVertical: 'top',
    minHeight: ms(100),
    maxHeight: ms(200),
  },
});
