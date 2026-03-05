import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { ms, s } from "react-native-size-matters/extend";

import { TScheduleEvent } from "@/src/interface/schedule.interface";

interface IProps {
  events: TScheduleEvent[];
}

const Events: React.FC<IProps> = (props) => {
  const { events } = props;

  return (
    events.length > 0 && (
      <View style={styles.container}>
        {events.slice(0, 2).map((event) => (
          <View
            key={event.id}
            style={[styles.eventItem, { backgroundColor: event.backgroundColor }]}
          >
            <Text
              numberOfLines={1}
              style={[styles.eventText, { color: event.color }]}
            >
              {event.title}
            </Text>
          </View>
        ))}
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
    fontWeight: "400",
    fontSize: ms(10),
    lineHeight: ms(14),
    letterSpacing: ms(-0.22),
    width: s(35.86),
  },
});
