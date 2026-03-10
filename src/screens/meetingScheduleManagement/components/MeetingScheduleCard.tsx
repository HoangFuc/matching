import React from 'react';
import { StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { MemoChip } from '@/src/component/Chip';
import { AppColors } from '@/src/constants/colors';
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
  미완료: {
    bgColor: AppColors.lightCream,
    textColor: AppColors.amber,
    borderColor: AppColors.amber,
  },
  작성완료: {
    bgColor: AppColors.lightBlue,
    textColor: AppColors.strongBlue,
    borderColor: AppColors.strongBlue,
  },
};

const MeetingScheduleCard: React.FC<IProps> = ({ item, onPress }) => {
  const statusConfig = STATUS_CONFIG[item.status];

  return (
    <MemoBaseCard style={[styles.card]} onPress={onPress}>
      <View style={styles.row}>
        <AppText variant="body6" color={AppColors.gray90}>
          {item.customerName}
        </AppText>

        <MemoChip
          label={item.status}
          bgColor={statusConfig.bgColor}
          textColor={statusConfig.textColor}
          textVariant="detail"
        />
      </View>

      <View style={styles.row}>
        <AppText variant="body6" color={AppColors.gray90}>
          {item.phone}
        </AppText>

        <AppText variant="body8" color={AppColors.black}>
          영업 담당자:{' '}
          <AppText variant="body6" color={AppColors.black}>
            {item.salesPerson}
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
