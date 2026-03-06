import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Add, ArrowLeft2, ArrowRight2 } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { _storeData } from '@/src/api/async.storage';
import { getSeed } from '@/src/api/seed.api';
import { AppText } from '@/src/component/AppText';
import { MemoAppButton } from '@/src/component/AppButton';
import { AppColors } from '@/src/constants/colors';
import { useMutation } from '@tanstack/react-query';
import { MemoScheduleRegisterModal } from './ScheduleRegisterModal';

interface IProps {
  year: number;
  setYear: React.Dispatch<React.SetStateAction<number>>;
  month: number;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
}

const HeaderCalendar: React.FC<IProps> = props => {
  const { year, setYear, month, setMonth } = props;
  const [showRegisterModal, setShowRegisterModal] = React.useState(false);

  //---------------------------------------
  const mutation = useMutation({
    mutationFn: getSeed,
    onSuccess: async (res: { accessToken: string }) => {
      await _storeData('auth', res.accessToken);
    },
  });

  //---------------------------------------
  const goToPrevMonth = React.useCallback(() => {
    if (month === 0) {
      setYear(y => y - 1);
      setMonth(11);
    } else {
      setMonth(m => m - 1);
    }
  }, [month, setMonth, setYear]);

  //---------------------------------------
  const goToNextMonth = React.useCallback(() => {
    if (month === 11) {
      setYear(y => y + 1);
      setMonth(0);
    } else {
      setMonth(m => m + 1);
    }
  }, [month, setMonth, setYear]);

  return (
    <View style={styles.container}>
      {/* Month selector */}
      <View style={styles.monthSelector}>
        <Pressable onPress={goToPrevMonth} hitSlop={8}>
          <ArrowLeft2
            size={`${ms(20)}`}
            color={AppColors.gray90}
            variant="Linear"
          />
        </Pressable>

        <AppText variant="heading3" color={AppColors.gray100}>
          {year}년 {month + 1}월
        </AppText>

        <Pressable onPress={goToNextMonth} hitSlop={8}>
          <ArrowRight2
            size={`${ms(20)}`}
            color={AppColors.gray90}
            variant="Linear"
          />
        </Pressable>
      </View>

      {/* Register schedule button */}
      <MemoAppButton
        label="일정 등록"
        textVariant="detail"
        icon={
          <Add size={`${ms(14)}`} color={AppColors.purple} variant="Linear" />
        }
        onPress={() => {
          mutation.mutate();
          setShowRegisterModal(true);
        }}
      />

      <MemoScheduleRegisterModal
        visible={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
    </View>
  );
};

export const MemoHeaderCalendar = React.memo(HeaderCalendar);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(16),
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(10),
  },
});
