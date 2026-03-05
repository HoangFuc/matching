import React from "react";

import { AppText } from "@/src/component/AppText";
import { AppColors } from "@/src/constants/colors";
import { Image, StyleSheet, View } from "react-native";
import { moderateScale as ms } from "react-native-size-matters/extend";
import { MemoCommonAction } from "../moreActions/CommonAction";

const MoreActions: React.FC = () => {
  return (
    <View style={styles.container}>
      <AppText variant="body1" color={AppColors.gray90}>
        메뉴
      </AppText>

      <View style={styles.grid}>
        <MemoCommonAction
          label="일정"
          image={
            <Image
              source={require("@/src/assets/images/calendar.png")}
              style={styles.icon}
            />
          }
        />

        <MemoCommonAction
          label="회의록"
          image={
            <Image
              source={require("@/src/assets/images/clipboard-with-pen.png")}
              style={styles.icon}
            />
          }
        />

        <MemoCommonAction
          label="자료실"
          image={
            <Image
              source={require("@/src/assets/images/folder-with-document.png")}
              style={styles.iconSmall}
            />
          }
        />

        <MemoCommonAction
          label="팀 게시판"
          image={
            <Image
              source={require("@/src/assets/images/bell.png")}
              style={styles.icon}
            />
          }
        />

        <MemoCommonAction
          label="계약현황"
          image={
            <Image
              source={require("@/src/assets/images/clipboard.png")}
              style={styles.icon}
            />
          }
        />

        <MemoCommonAction
          label="뉴스"
          image={
            <Image
              source={require("@/src/assets/images/speaker.png")}
              style={styles.icon}
            />
          }
        />

        <MemoCommonAction
          label="기안"
          image={
            <Image
              source={require("@/src/assets/images/phone-book.png")}
              style={styles.icon}
            />
          }
        />
      </View>
    </View>
  );
};

export const MemoMoreActions = React.memo(MoreActions);

const styles = StyleSheet.create({
  container: {
    paddingVertical: ms(24),
    gap: ms(12),
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ms(8),
  },
  icon: {
    width: ms(48),
    height: ms(48),
  },
  iconSmall: {
    width: ms(36),
    height: ms(48),
  },
});
