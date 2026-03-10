import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import DatePicker from 'react-native-date-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { RHFFormInput } from '@/src/component/RHFFormInput';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import { Calendar, Clock } from '@/src/constants/icons';
import { ICreateMeetingSchedulePayload } from '@/src/interface/meetingScheduleManagement.interface';

const formatDate = (d: Date) => dayjs(d).format('YYYY.MM.DD');
const formatTime = (d: Date) => dayjs(d).format('HH:mm');

const CreateMeetingScheduleScreen: React.FC = () => {
  const navigation = useNavigation();

  //---------------------------------------
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);

  //---------------------------------------
  const { control, handleSubmit, watch } =
    useForm<ICreateMeetingSchedulePayload>({
      defaultValues: {
        date: '',
        time: '00:00',
        visitLocation: '',
        customerName: '',
        phone: '',
        scheduleName: '',
        memo: '',
      },
    });

  const formValue = watch();

  //---------------------------------------
  const isDisableButton = React.useMemo(() => {
    return (
      !formValue.date ||
      !formValue.customerName ||
      !formValue.phone ||
      !formValue.scheduleName
    );
  }, [formValue]);

  //---------------------------------------
  const onSubmit = React.useCallback(
    async (data: ICreateMeetingSchedulePayload) => {
      // TODO: call API to create meeting schedule
      console.log('submit', data);
      navigation.goBack();
    },
    [navigation],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
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
                name="date"
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
                name="time"
                render={({ field: { value, onChange } }) => (
                  <>
                    <Pressable
                      style={[styles.dropdownBtn, styles.timeInput]}
                      onPress={() => setShowTimePicker(true)}
                    >
                      <AppText variant="body7" color={AppColors.gray100}>
                        {value}
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
                        value ? new Date(`2000-01-01T${value}:00`) : new Date()
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

          {/* Visit Location */}
          <RHFFormInput
            control={control}
            name="visitLocation"
            label="방문 장소"
            placeholder="장소를 입력하세요"
          />

          {/* Customer Name */}
          <RHFFormInput
            control={control}
            name="customerName"
            label="고객명 *"
            placeholder="고객명을 입력하세요"
          />

          {/* Phone */}
          <RHFFormInput
            control={control}
            name="phone"
            label="연락처 *"
            placeholder="연락처를 입력하세요"
            keyboardType="phone-pad"
          />

          {/* Schedule Name */}
          <RHFFormInput
            control={control}
            name="scheduleName"
            label="일정명 *"
            placeholder="일정명을 입력하세요"
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
    </SafeAreaView>
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
  },
  submitBtn: {
    width: ms(163),
    paddingVertical: ms(8),
  },
});
