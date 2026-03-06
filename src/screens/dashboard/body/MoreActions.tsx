import React from "react";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AppText } from "@/src/component/AppText";
import { AppColors } from "@/src/constants/colors";
import { AppImages } from "@/src/constants/images";
import type { RootStackParamList } from "@/src/interface/tab.interface";
import { Image, StyleSheet, View } from "react-native";
import { moderateScale as ms } from "react-native-size-matters/extend";
import { MemoCommonAction } from "../moreActions/CommonAction";

type TNav = NativeStackNavigationProp<RootStackParamList>;

const MoreActions: React.FC = () => {
  const navigation = useNavigation<TNav>();
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
              source={AppImages.calendar}
              style={styles.icon}
            />
          }
        />

        <MemoCommonAction
          label="회의록"
          image={
            <Image
              source={AppImages.clipboardWithPen}
              style={styles.icon}
            />
          }
        />

        <MemoCommonAction
          label="자료실"
          image={
            <Image
              source={AppImages.folderWithDocument}
              style={styles.iconSmall}
            />
          }
          onPress={() => navigation.navigate("DataRoom")}
        />

        <MemoCommonAction
          label="팀 게시판"
          image={
            <Image
              source={AppImages.bell}
              style={styles.icon}
            />
          }
        />

        <MemoCommonAction
          label="계약현황"
          image={
            <Image
              source={AppImages.clipboard}
              style={styles.icon}
            />
          }
        />

        <MemoCommonAction
          label="뉴스"
          image={
            <Image
              source={AppImages.speaker}
              style={styles.icon}
            />
          }
        />

        <MemoCommonAction
          label="기안"
          image={
            <Image
              source={AppImages.phoneBook}
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
