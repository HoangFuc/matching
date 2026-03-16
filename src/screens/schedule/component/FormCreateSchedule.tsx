import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { Calendar, Clock } from '@/src/constants/icons';
import { Control, Controller } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ms } from 'react-native-size-matters';

import { MemoDatePickerModal } from '@/src/component/calendar/DatePickerModal';
import { MemoTimePickerModal } from '@/src/component/calendar/TimePickerModal';

import { AppText } from '@/src/component/AppText';
import { MemoDropdownButton } from '@/src/component/DropdownButton';
import { RHFFormInput } from '@/src/component/RHFFormInput';
import { AppColors } from '@/src/constants/colors';
import { FontWeight } from '@/src/constants/typography';
import type { ISchedulePayload } from '@/src/screens/schedule/type';

interface IProps {
  control: Control<ISchedulePayload>;
  setShowTypePicker: (show: boolean) => void;
  scheduleType: string;
}

const FormCreateSchedule: React.FC<IProps> = ({
  control,
  setShowTypePicker,
  scheduleType,
}) => {
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);

  return (
    <KeyboardAwareScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={ms(20)}
    >
      <AppText
        variant="heading3"
        color={AppColors.gray100}
        style={styles.title}
      >
        일정 등록
      </AppText>

      <View style={{ padding: ms(16), gap: ms(16) }}>
        <View>
          <AppText variant="body7" color={AppColors.gray90}>
            일정 종류
          </AppText>

          <MemoDropdownButton
            label={scheduleType}
            textVariant="body8"
            textColor={AppColors.gray80}
            onPress={() => setShowTypePicker(true)}
            style={styles.selectBox}
          />
        </View>

        {/* Date & Time */}
        <View style={styles.dateTimeRow}>
          <View style={styles.dateTimeField}>
            <AppText variant="body7" color={AppColors.gray90}>
              날짜
            </AppText>

            <Controller
              control={control}
              name="scheduleDate"
              render={({ field: { value, onChange } }) => (
                <>
                  <Pressable
                    style={styles.dateInputWrapper}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <View style={[styles.input, styles.dateDisplay]}>
                      <AppText
                        variant="body8"
                        color={value ? AppColors.gray100 : AppColors.gray40}
                      >
                        {value || 'yyyy.mm.dd'}
                      </AppText>
                    </View>

                    <Calendar
                      size={`${ms(18)}`}
                      color={AppColors.gray40}
                      variant="Linear"
                      style={styles.inputIcon}
                    />
                  </Pressable>

                  <MemoDatePickerModal
                    visible={showDatePicker}
                    value={value}
                    onConfirm={dateStr => {
                      setShowDatePicker(false);
                      onChange(dateStr);
                    }}
                    onCancel={() => setShowDatePicker(false)}
                  />
                </>
              )}
            />
          </View>

          <View style={styles.dateTimeField}>
            <AppText variant="body7" color={AppColors.gray90}>
              시간
            </AppText>

            <Controller
              control={control}
              name="startTime"
              render={({ field: { value, onChange } }) => (
                <>
                  <Pressable
                    style={styles.dateInputWrapper}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <View style={[styles.input, styles.dateDisplay]}>
                      <AppText
                        variant="body8"
                        color={value ? AppColors.gray100 : AppColors.gray40}
                      >
                        {value instanceof Date
                          ? `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`
                          : value || '00:00'}
                      </AppText>
                    </View>

                    <Clock
                      size={`${ms(18)}`}
                      color={AppColors.gray40}
                      variant="Linear"
                      style={styles.inputIcon}
                    />
                  </Pressable>

                  <MemoTimePickerModal
                    visible={showTimePicker}
                    value={value instanceof Date ? value : undefined}
                    onConfirm={time => {
                      setShowTimePicker(false);
                      onChange(time);
                    }}
                    onCancel={() => setShowTimePicker(false)}
                  />
                </>
              )}
            />
          </View>
        </View>

        {/* Dynamic fields based on schedule type */}
        {scheduleType === '일반일정' ? (
          <View style={{ gap: ms(16) }}>
            <RHFFormInput
              control={control}
              name="title"
              label="일정명"
              placeholder="일정명을 입력하세요"
            />

            <RHFFormInput
              control={control}
              name="description"
              label="일정내용"
              placeholder="일정 내용을 입력하세요"
              multiline
            />
          </View>
        ) : (
          <View style={{ gap: ms(16) }}>
            <RHFFormInput
              control={control}
              name="customerName"
              label="고객명"
              labelVariant="body6"
              placeholder="고객명을 입력하세요"
            />

            <RHFFormInput
              control={control}
              name="customerPhone"
              label="연락처"
              labelVariant="body6"
              placeholder="연락처을 입력하세요"
              keyboardType="phone-pad"
            />

            <RHFFormInput
              control={control}
              name="title"
              label="일정명"
              labelVariant="body6"
              placeholder="일정명을 입력하세요"
            />

            <RHFFormInput
              control={control}
              name="memo"
              label="메모"
              labelVariant="body6"
              placeholder="메모를 입력하세요"
              multiline
            />
          </View>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};

export const MemoFormCreateSchedule = React.memo(FormCreateSchedule);

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
  },
  title: {
    textAlign: 'center',
    paddingVertical: ms(8),
    paddingHorizontal: ms(16),
    gap: ms(8),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray20,
  },
  selectBox: {
    paddingVertical: ms(8),
    height: ms(36),
    marginTop: 0,
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
  dateInputWrapper: {
    position: 'relative',
  },
  dateDisplay: {
    justifyContent: 'center',
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: ms(12),
  },
  dateTimeField: {
    flex: 1,
  },
  inputIcon: {
    position: 'absolute',
    right: ms(16),
    top: ms(9),
  },
});
