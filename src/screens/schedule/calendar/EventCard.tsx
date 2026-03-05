import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { CardShadow } from '@/src/constants/shadows';
import { TScheduleEvent } from '@/src/interface/schedule.interface';

interface IEventCardProps {
  event: TScheduleEvent;
}

const EventCard: React.FC<IEventCardProps> = ({ event }) => {
  return (
    <View style={cardStyles.container}>
      <View style={cardStyles.row}>
        <AppText
          variant="body5"
          color={AppColors.gray90}
          style={{ width: ms(60) }}
        >
          일정 종류
        </AppText>

        <View
          style={[cardStyles.badge, { backgroundColor: event.backgroundColor }]}
        >
          <AppText variant="detail" color={event.color}>
            {event.type || event.title}
          </AppText>
        </View>
      </View>

      <View style={cardStyles.row}>
        <AppText
          variant="body5"
          color={AppColors.gray90}
          style={{ width: ms(60) }}
        >
          일정명
        </AppText>
        <AppText variant="body8" color={AppColors.gray90}>
          {event.title}
        </AppText>
      </View>

      <View style={cardStyles.row}>
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
          style={cardStyles.descriptionText}
        >
          {event.description || '-'}
        </AppText>
      </View>
    </View>
  );
};

export const MemoEventCard = React.memo(EventCard);

const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.gray30,
    paddingHorizontal: ms(16),
    paddingVertical: ms(16),
    gap: ms(12),
    borderRadius: ms(16),
    ...CardShadow,
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
