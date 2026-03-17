import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { TScheduleEvent } from '@/src/interface/schedule.interface';

interface IProps {
  events: TScheduleEvent[];
  styleEventItem?: ViewStyle;
  containerStyle?: ViewStyle;
}

const Events: React.FC<IProps> = props => {
  const { events, styleEventItem, containerStyle } = props;

  return (
    events.length > 0 && (
      <View style={[styles.container, containerStyle]}>
        {events.slice(0, 2).map((event, index) => (
          <View
            key={`${event.id}_${index}`}
            style={[
              styles.eventItem,
              styleEventItem,
              { backgroundColor: event.backgroundColor },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[styles.eventText, { color: event.color }]}
            >
              {event.title}
            </Text>
          </View>
        ))}
        {events.length > 2 && (
          <Text style={styles.moreText}>+{events.length - 2}</Text>
        )}
      </View>
    )
  );
};

export const MemoEvents = React.memo(Events);

const styles = StyleSheet.create({
  container: {
    gap: ms(2),
  },
  eventItem: {
    borderRadius: ms(4),
    paddingHorizontal: ms(3),
    paddingVertical: ms(1),
  },
  eventText: {
    fontWeight: '400',
    fontSize: ms(9),
    lineHeight: ms(9) * 1.4,
    letterSpacing: ms(9) * -0.022,
    textAlign: 'center',
  },
  moreText: {
    fontSize: ms(9),
    fontWeight: '500',
    color: '#999',
    textAlign: 'center',
  },
});
