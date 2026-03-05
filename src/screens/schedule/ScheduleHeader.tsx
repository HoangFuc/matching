import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ArrowLeft2, Sort } from "iconsax-react-nativejs";
import {
  moderateScale as ms,
  scale as s,
} from "react-native-size-matters/extend";

import { AppText } from "@/src/component/AppText";
import { AppColors } from "@/src/constants/colors";
import { useNavigation } from "@react-navigation/native";

const ScheduleHeader: React.FC = () => {
  const navigation = useNavigation();

  //---------------------------------------
  const handlePressBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Pressable hitSlop={8} onPress={handlePressBack}>
        <ArrowLeft2
          size={`${ms(24)}`}
          color={AppColors.white}
          variant="Linear"
        />
      </Pressable>

      <AppText variant="heading3" color={AppColors.white}>
        일정
      </AppText>

      <Pressable hitSlop={8}>
        <Sort size={`${ms(24)}`} color={AppColors.white} variant="Linear" />
      </Pressable>
    </View>
  );
};

export const MemoScheduleHeader = React.memo(ScheduleHeader);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ms(16),
    paddingBottom: ms(24),
    backgroundColor: AppColors.purple,
    borderRadius: ms(100),
    width: s(375),
    height: s(49),
  },
});
