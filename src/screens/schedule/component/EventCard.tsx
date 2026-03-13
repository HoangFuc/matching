import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters';

import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { AppColors } from '@/src/constants/colors';
import { TScheduleEvent } from '@/src/interface/schedule.interface';

interface IEventCardProps {
  event: TScheduleEvent;
}

const EventCard: React.FC<IEventCardProps> = ({ event }) => {
  return (
    <MemoBaseCard style={styles.card}>
      <View style={styles.row}>
        <AppText
          variant="body5"
          color={AppColors.gray90}
          style={{ width: ms(60) }}
        >
          일정 종류
        </AppText>

        <View
          style={[styles.badge, { backgroundColor: event.backgroundColor }]}
        >
          <AppText variant="detail" color={event.color}>
            {event.type || event.title}
          </AppText>
        </View>
      </View>

      <View style={styles.row}>
        <AppText
          variant="body5"
          color={AppColors.gray90}
          style={{ width: ms(60) }}
        >
          시간
        </AppText>
        <AppText variant="body8" color={AppColors.gray90}>
          {event.startTime || '-'}
        </AppText>
      </View>

      <View style={styles.row}>
        <AppText
          variant="body5"
          color={AppColors.gray90}
          style={{ width: ms(60) }}
        >
          일정명
        </AppText>
        <AppText variant="body8" color={AppColors.gray90}>
          {event.scheduleName || event.title}
        </AppText>
      </View>

      <View style={styles.row}>
        <AppText
          variant="body5"
          color={AppColors.gray90}
          style={{ width: ms(60) }}
        >
          일정내용
        </AppText>
        <AppText
          variant="body8"
          color={AppColors.gray90}
          style={styles.descriptionText}
        >
          {event.description || '-'}
        </AppText>
      </View>
    </MemoBaseCard>
  );
};

export const MemoEventCard = React.memo(EventCard);

const styles = StyleSheet.create({
  card: {
    gap: ms(12),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(16),
  },
  badge: {
    borderRadius: ms(100),
    paddingHorizontal: ms(8),
    paddingVertical: ms(4),
  },
  descriptionText: {
    flex: 1,
  },
});
