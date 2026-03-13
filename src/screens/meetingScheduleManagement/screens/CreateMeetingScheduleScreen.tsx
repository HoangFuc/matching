import React from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import Postcode from '@actbase/react-daum-postcode';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import DatePicker from 'react-native-date-picker';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { moderateScale as ms, scale as s } from 'react-native-size-matters/extend';
import { MemoPhoneInput, stripDashes } from '@/src/component/PhoneInput';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { RHFFormInput } from '@/src/component/RHFFormInput';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import { Calendar, Clock } from '@/src/constants/icons';
import { ICreateMeetingSchedulePayload } from '@/src/interface/meetingScheduleManagement.interface';
import { useCreateMeetingScheduleMutation } from '@/src/store/api/meetingScheduleManagement.api';

const formatDate = (d: Date) => dayjs(d).format('YYYY.MM.DD');
const formatTime = (d: Date) => dayjs(d).format('HH:mm');

const CreateMeetingScheduleScreen: React.FC = () => {
  const navigation = useNavigation();

  //---------------------------------------
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [showPostcode, setShowPostcode] = React.useState(false);

  //---------------------------------------
  const { control, handleSubmit, watch } =
    useForm<ICreateMeetingSchedulePayload>({
      defaultValues: {
        scheduleDate: '',
        startTime: '',
        description: '',
        address: '',
        customerName: '',
        customerPhone: '',
        title: '',
        memo: '',
      },
    });

  const formValue = watch();

  //---------------------------------------
  const isDisableButton = React.useMemo(() => {
    return (
      !formValue.scheduleDate ||
      !formValue.customerName ||
      !formValue.customerPhone ||
      !formValue.title
    );
  }, [formValue]);

  //---------------------------------------
  const [createMeetingSchedule] = useCreateMeetingScheduleMutation();

  //---------------------------------------
  const onSubmit = React.useCallback(
    async (data: ICreateMeetingSchedulePayload) => {
      const phone = stripDashes(data.customerPhone);
      if (!phone.startsWith('010') || phone.length < 10) {
        Alert.alert('알림', '연락처는 010으로 시작해야 합니다.');
        return;
      }
      try {
        await createMeetingSchedule({
          ...data,
          scheduleDate: data.scheduleDate.replace(/\./g, '-'),
          customerPhone: phone,
        }).unwrap();
        navigation.goBack();
      } catch (error) {
        console.error('Failed to create meeting schedule:', error);
      }
    },
    [createMeetingSchedule, navigation],
  );

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <MemoScreenHeader title="방문 일정 등록" />

      <MemoScreenBody>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Date & Time */}
          <View>
            <AppText variant="body7" color={AppColors.gray90}>
              날짜{' '}
              <AppText variant="body7" color={AppColors.negative}>
                *
              </AppText>
            </AppText>

            <View style={styles.dateTimeRow}>
              <Controller
                control={control}
                name="scheduleDate"
                render={({ field: { value, onChange } }) => (
                  <>
                    <Pressable
                      style={[styles.dropdownBtn, styles.dateInput]}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <AppText
                        variant="body7"
                        color={value ? AppColors.gray100 : AppColors.gray40}
                      >
                        {value || 'yyyy.mm.dd'}
                      </AppText>
                      <Calendar
                        size={`${ms(16)}`}
                        color={AppColors.gray60}
                        variant="Linear"
                      />
                    </Pressable>

                    <DatePicker
                      modal
                      open={showDatePicker}
                      date={
                        value ? new Date(value.replace(/\./g, '-')) : new Date()
                      }
                      mode="date"
                      onConfirm={d => {
                        setShowDatePicker(false);
                        onChange(formatDate(d));
                      }}
                      onCancel={() => setShowDatePicker(false)}
                    />
                  </>
                )}
              />

              <Controller
                control={control}
                name="startTime"
                render={({ field: { value, onChange } }) => (
                  <>
                    <Pressable
                      style={[styles.dropdownBtn, styles.timeInput]}
                      onPress={() => setShowTimePicker(true)}
                    >
                      <AppText
                        variant="body7"
                        color={value ? AppColors.gray100 : AppColors.gray40}
                      >
                        {value || '00:00'}
                      </AppText>
                      <Clock
                        size={`${ms(16)}`}
                        color={AppColors.gray60}
                        variant="Linear"
                      />
                    </Pressable>

                    <DatePicker
                      modal
                      open={showTimePicker}
                      date={
                        new Date(`2000-01-01T${value || '00:00'}:00`)
                      }
                      mode="time"
                      onConfirm={d => {
                        setShowTimePicker(false);
                        onChange(formatTime(d));
                      }}
                      onCancel={() => setShowTimePicker(false)}
                    />
                  </>
                )}
              />
            </View>
          </View>

          {/* Address */}
          <View>
            <AppText variant="body7" color={AppColors.gray90}>
              방문 장소{' '}
              <AppText variant="body7" color={AppColors.negative}>
                *
              </AppText>
            </AppText>

            <Controller
              control={control}
              name="address"
              render={({ field: { value, onChange } }) => (
                <>
                  <Pressable
                    style={styles.dropdownBtn}
                    onPress={() => setShowPostcode(true)}
                  >
                    <AppText
                      variant="body7"
                      color={value ? AppColors.gray100 : AppColors.gray40}
                    >
                      {value || '방문 장소를 입력하세요'}
                    </AppText>
                  </Pressable>

                  <Modal
                    visible={showPostcode}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowPostcode(false)}
                  >
                    <View style={styles.postcodeContainer}>
                      <Pressable
                        style={styles.postcodeOverlay}
                        onPress={() => setShowPostcode(false)}
                      />
                      <View style={styles.postcodeSheet}>
                        <View style={styles.postcodeHandleBar} />
                        <AppText
                          variant="heading3"
                          color={AppColors.gray100}
                          style={styles.postcodeTitle}
                        >
                          주소 검색
                        </AppText>
                        <Postcode
                          style={styles.postcode}
                          jsOptions={{ animation: true }}
                          onSelected={data => {
                            onChange(data.address);
                            setShowPostcode(false);
                          }}
                          onError={() => setShowPostcode(false)}
                        />
                      </View>
                    </View>
                  </Modal>
                </>
              )}
            />
          </View>

          {/* Customer Name */}
          <RHFFormInput
            control={control}
            name="customerName"
            label="고객명"
            placeholder="고객명을 입력하세요"
            required
          />

          {/* Customer Phone */}
          <View>
            <AppText variant="body7" color={AppColors.gray90}>
              연락처{' '}
              <AppText variant="body7" color={AppColors.negative}>
                *
              </AppText>
            </AppText>

            <Controller
              control={control}
              name="customerPhone"
              render={({ field: { value, onChange } }) => (
                <MemoPhoneInput
                  value={value}
                  onChangeText={onChange}
                  label=""
                  required
                />
              )}
            />
          </View>

          {/* Title */}
          <RHFFormInput
            control={control}
            name="title"
            label="일정명"
            placeholder="일정명을 입력하세요"
            required
          />

          {/* Memo */}
          <RHFFormInput
            control={control}
            name="memo"
            label="메모"
            placeholder="메모를 입력하세요"
            multiline
          />
        </ScrollView>

        <View style={styles.bottomContainer}>
          <MemoAppButton
            label="등록"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            style={styles.submitBtn}
            disabled={isDisableButton}
          />
        </View>
      </MemoScreenBody>
    </AppSafeAreaView>
  );
};

export const MemoCreateMeetingScheduleScreen = React.memo(
  CreateMeetingScheduleScreen,
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
  scrollContent: {
    padding: ms(16),
    gap: ms(16),
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: ms(8),
    marginTop: ms(4),
  },
  dateInput: {
    flex: 1,
  },
  timeInput: {
    flex: 1,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: ms(8),
    paddingHorizontal: ms(16),
    paddingVertical: ms(10),
    backgroundColor: AppColors.gray10,
  },
  bottomContainer: {
    backgroundColor: AppColors.white,
    paddingVertical: ms(16),
    alignItems: 'center',
    marginBottom: ms(10),
  },
  submitBtn: {
    width: ms(163),
    paddingVertical: ms(8),
  },
  postcodeContainer: {
    flex: 1,
    justifyContent: 'flex-end' as const,
  },
  postcodeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  postcodeSheet: {
    height: '80%',
    backgroundColor: AppColors.white,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
  },
  postcodeHandleBar: {
    width: s(50),
    height: s(6),
    borderRadius: ms(100),
    backgroundColor: AppColors.gray20,
    alignSelf: 'center' as const,
    marginTop: ms(14),
  },
  postcodeTitle: {
    textAlign: 'center' as const,
    paddingVertical: ms(8),
    paddingHorizontal: ms(16),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray20,
  },
  postcode: {
    flex: 1,
  },
});
