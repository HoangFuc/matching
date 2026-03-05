import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { moderateScale as ms } from "react-native-size-matters/extend";

import { AppColors } from "@/src/constants/colors";
import { MemoCalendarAction } from "./body/CalendarAction";
import { MemoDraft } from "./body/Draft";
import { MemoMeetingSchedule } from "./body/MeetingSchedule";
import { MemoMoreActions } from "./body/MoreActions";
import { MemoRanking } from "./body/Ranking";

const BodyDashboard: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <MemoCalendarAction />

        <MemoRanking />

        <MemoMeetingSchedule />

        <MemoMoreActions />

        <MemoDraft />
      </ScrollView>
    </View>
  );
};

export const MemoBodyDashboard = React.memo(BodyDashboard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.white,
    flex: 1,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
  },
});
