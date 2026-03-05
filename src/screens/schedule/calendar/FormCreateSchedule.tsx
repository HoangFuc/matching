import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ArrowDown2, Calendar, Clock } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { FontWeight } from '@/src/constants/typography';

interface IProps {
  setShowTypePicker: (show: boolean) => void;
  scheduleType: string;
  date: string;
  setDate: (date: string) => void;
  time: string;
  setTime: (time: string) => void;
  renderGeneralFields: () => React.ReactNode;
  renderMeetingFields: () => React.ReactNode;
}

const FormCreateSchedule: React.FC<IProps> = props => {
  const {
    setShowTypePicker,
    scheduleType,
    date,
    setDate,
    time,
    setTime,
    renderGeneralFields,
    renderMeetingFields,
  } = props;

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
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

          <Pressable
            style={styles.selectBox}
            onPress={() => setShowTypePicker(true)}
          >
            <AppText variant="body8" color={AppColors.gray80}>
              {scheduleType}
            </AppText>

            <ArrowDown2
              size={`${ms(16)}`}
              color={AppColors.gray90}
              variant="Linear"
            />
          </Pressable>
        </View>

        {/* Date & Time */}
        <View style={styles.dateTimeRow}>
          <View style={styles.dateTimeField}>
            <AppText variant="body7" color={AppColors.gray90}>
              날짜
            </AppText>

            <View style={styles.dateInputWrapper}>
              <TextInput
                style={[styles.input]}
                placeholder="yyyy.mm.dd"
                placeholderTextColor={AppColors.gray40}
                value={date}
                onChangeText={setDate}
              />

              <Calendar
                size={`${ms(18)}`}
                color={AppColors.gray40}
                variant="Linear"
                style={styles.inputIcon}
              />
            </View>
          </View>

          <View style={styles.dateTimeField}>
            <AppText variant="body7" color={AppColors.gray90}>
              시간
            </AppText>

            <View style={styles.dateInputWrapper}>
              <TextInput
                style={[styles.input]}
                placeholder="00:00"
                placeholderTextColor={AppColors.gray40}
                value={time}
                onChangeText={setTime}
              />

              <Clock
                size={`${ms(18)}`}
                color={AppColors.gray40}
                variant="Linear"
                style={styles.inputIcon}
              />
            </View>
          </View>
        </View>

        {/* Dynamic fields based on schedule type */}
        {scheduleType === '일반일정'
          ? renderGeneralFields()
          : renderMeetingFields()}
      </View>
    </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: ms(8),
    backgroundColor: AppColors.gray10,
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
    height: ms(36),
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
