import React from "react";
import { ScrollView, StyleSheet } from "react-native";

import { moderateScale as ms } from "react-native-size-matters/extend";

import { MemoScreenBody } from "@/src/component/ScreenBody";
import { MemoCalendarAction } from "../component/body/CalendarAction";
import { MemoDraft } from "../component/body/Draft";
import { MemoMeetingSchedule } from "../component/body/MeetingSchedule";
import { MemoMoreActions } from "../component/body/MoreActions";
import { MemoRanking } from "../component/body/Ranking";

const BodyDashboard: React.FC = () => {
  return (
    <MemoScreenBody style={styles.body}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <MemoCalendarAction />

        <MemoRanking />

        <MemoMeetingSchedule />

        <MemoMoreActions />

        <MemoDraft />
      </ScrollView>
    </MemoScreenBody>
  );
};

export const MemoBodyDashboard = React.memo(BodyDashboard);

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
  },
});
