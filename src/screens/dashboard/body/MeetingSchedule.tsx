import React from "react";
import { Image, StyleSheet, View } from "react-native";

import { AppText } from "@/src/component/AppText";
import { AppColors } from "@/src/constants/colors";
import { moderateScale as ms } from "react-native-size-matters/extend";
import { MemoTemplateMeetingCard } from "../meetingSchedule/TemplateMeetingCard";

const MeetingSchedule: React.FC = () => {
  return (
    <View style={styles.container}>
      <AppText variant="body1" color={AppColors.gray90}>
        오늘의 일정은?
      </AppText>

      <View style={styles.row}>
        <MemoTemplateMeetingCard
          text="OO고객과의 미팅"
          image={
            <Image
              source={require("@/src/assets/images/chat-bubble.png")}
              style={styles.cardImage}
            />
          }
        />

        <MemoTemplateMeetingCard
          text="OO 분양 1차 회의"
          image={
            <Image
              source={require("@/src/assets/images/list.png")}
              style={styles.cardImage}
            />
          }
        />
      </View>
    </View>
  );
};

export const MemoMeetingSchedule = React.memo(MeetingSchedule);

const styles = StyleSheet.create({
  container: {
    gap: ms(12),
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  cardImage: {
    width: ms(60),
    height: ms(60),
  },
});
