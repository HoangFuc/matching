import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Add } from "iconsax-react-nativejs";
import { ms } from "react-native-size-matters/extend";

import { AppText } from "@/src/component/AppText";
import { AppColors } from "@/src/constants/colors";

const HeaderDraft: React.FC = () => {
  return (
    <View style={styles.container}>
      <AppText variant="body1" color={AppColors.gray90}>
        기안
      </AppText>

      <Pressable
        onPress={() => console.log("======================asdasdsa")}
        style={styles.button}
      >
        <Add size={`${ms(16)}`} color={AppColors.purple} />

        <AppText variant="body6" color={AppColors.purple}>
          기안 올리기
        </AppText>
      </Pressable>
    </View>
  );
};

export const MemoHeaderDraft = React.memo(HeaderDraft);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: ms(4),
    backgroundColor: AppColors.lavendar,
    paddingHorizontal: ms(12),
    paddingVertical: ms(4),
    borderRadius: ms(100),
  },
});
