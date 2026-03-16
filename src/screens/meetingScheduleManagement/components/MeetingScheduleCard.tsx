import React from 'react';
import { StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { formatKoreanPhone } from '@/src/component/PhoneInput';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { MemoChip } from '@/src/component/Chip';
import { AppColors } from '@/src/constants/colors';
import { MEETING_SCHEDULE_STATUS_LABEL } from '@/src/constants/meetingSchedule';
import {
  IMeetingScheduleManagement,
  TMeetingScheduleStatus,
} from '@/src/interface/meetingScheduleManagement.interface';

interface IProps {
  item: IMeetingScheduleManagement;
  onPress?: () => void;
}

const STATUS_CONFIG: Record<
  TMeetingScheduleStatus,
  { bgColor: string; textColor: string; borderColor: string }
> = {
  incomplete: {
    bgColor: AppColors.lightCream,
    textColor: AppColors.amber,
    borderColor: AppColors.amber,
  },
  completed: {
    bgColor: AppColors.lightBlue,
    textColor: AppColors.strongBlue,
    borderColor: AppColors.strongBlue,
  },
};

const DEFAULT_STATUS_CONFIG = {
  bgColor: AppColors.lightCream,
  textColor: AppColors.amber,
  borderColor: AppColors.amber,
};

const MeetingScheduleCard: React.FC<IProps> = ({ item, onPress }) => {
  const statusConfig =
    STATUS_CONFIG[item.status as TMeetingScheduleStatus] ??
    DEFAULT_STATUS_CONFIG;

  return (
    <MemoBaseCard style={[styles.card]} onPress={onPress}>
      <View style={styles.row}>
        <AppText variant="body6" color={AppColors.gray90}>
          {item.customerName}
        </AppText>

        <MemoChip
          label={MEETING_SCHEDULE_STATUS_LABEL[item.status] ?? item.status}
          bgColor={statusConfig.bgColor}
          textColor={statusConfig.textColor}
          textVariant="detail"
        />
      </View>

      <View style={styles.row}>
        <AppText variant="body6" color={AppColors.gray90}>
          {formatKoreanPhone(item.customerPhone ?? '')}
        </AppText>

        <AppText variant="body8" color={AppColors.black}>
          영업 담당자:{' '}
          <AppText variant="body6" color={AppColors.black}>
            {item.creator.fullName}
          </AppText>
        </AppText>
      </View>
    </MemoBaseCard>
  );
};

export const MemoMeetingScheduleCard = React.memo(MeetingScheduleCard);

const styles = StyleSheet.create({
  card: {
    gap: ms(8),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
