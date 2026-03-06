import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { AppColors } from '@/src/constants/colors';
import { ArrowRight2 } from '@/src/constants/icons';
import type { RootTabNavigationProp } from '@/src/interface/tab.interface';

interface IProps {
  checkinTime: string | null;
  onCheckin: () => void;
}

const Checkin: React.FC<IProps> = ({ checkinTime, onCheckin }) => {
  const navigation = useNavigation<RootTabNavigationProp>();

  if (checkinTime) {
    return (
      <MemoBaseCard
        style={styles.checkedCard}
        onPress={() =>
          navigation.navigate('Schedule', {
            screen: 'ScheduleMain',
            params: { mode: 'attendance' },
          })
        }
      >
        <View style={styles.header}>
          <AppText variant="body5" color={AppColors.gray90}>
            {'근무 시간'}
          </AppText>

          <ArrowRight2 size={ms(16)} color={AppColors.gray90} />
        </View>

        <View style={styles.timeContainer}>
          <View style={styles.timeRow}>
            <AppText variant="body5" color={AppColors.gray90}>
              {'출근 시간'}
            </AppText>

            <AppText variant="body8" color={AppColors.gray90}>
              {checkinTime}
            </AppText>
          </View>

          <View style={styles.timeRow}>
            <AppText variant="body5" color={AppColors.gray90}>
              {'정시'}
            </AppText>

            <AppText variant="body8" color={AppColors.gray90}>
              {'정시'}
            </AppText>
          </View>
        </View>
      </MemoBaseCard>
    );
  }

  return (
    <MemoBaseCard style={styles.card}>
      <Image
        style={styles.image}
        source={require('@/src/assets/images/task.png')}
      />

      <AppText variant="body5" color={AppColors.gray90}>
        {'오늘 출근을 체크하세요'}
      </AppText>

      <Pressable style={styles.button} onPress={onCheckin}>
        <AppText variant="body7" color={AppColors.purple}>
          {'출근 체크'}
        </AppText>
      </Pressable>
    </MemoBaseCard>
  );
};

export const MemoCheckin = React.memo(Checkin);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(6),
  },
  image: {
    width: ms(43),
    height: ms(32),
  },
  button: {
    backgroundColor: AppColors.lavendar,
    borderRadius: ms(100),
    paddingHorizontal: ms(8),
    paddingVertical: ms(4),
  },
  checkedCard: {
    flex: 1,
    gap: ms(8),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  timeContainer: {
    backgroundColor: AppColors.lightBlue,
    borderRadius: ms(8),
    padding: ms(12),
    gap: ms(4),
  },
});
