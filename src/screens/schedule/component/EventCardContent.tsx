import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ArrowLeft2 } from '@/src/constants/icons';
import { ms } from 'react-native-size-matters';
import { MemoEventCard } from './EventCard';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { TScheduleEvent } from '@/src/interface/schedule.interface';
import { formatDateHeader } from '@/src/utils/calendar.helper';

interface IProps {
  handlePressBack: () => void;
  dateKey: string;
  events: TScheduleEvent[];
}

const EventCardContent: React.FC<IProps> = props => {
  const { handlePressBack, dateKey, events } = props;

  return (
    <View style={styles.content}>
      <View style={styles.dateHeader}>
        <Pressable hitSlop={8} onPress={handlePressBack}>
          <ArrowLeft2
            size={`${ms(20)}`}
            color={AppColors.gray90}
            variant="Linear"
          />
        </Pressable>

        <AppText variant="heading3" color={AppColors.gray100}>
          {formatDateHeader(dateKey)}
        </AppText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {events.map((event, index) => (
          <MemoEventCard key={`${event.id}-${index}`} event={event} />
        ))}

        {events.length === 0 && (
          <View style={styles.emptyContainer}>
            <AppText variant="body4" color={AppColors.gray50}>
              등록된 일정이 없습니다.
            </AppText>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export const MemoEventCardContent = React.memo(EventCardContent);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    padding: ms(16),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ms(16),
    paddingBottom: ms(40),
    gap: ms(16),
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: ms(40),
  },
});
