import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ArrowRight2 } from "iconsax-react-nativejs";

import { AppText } from "@/src/component/AppText";
import { AppColors } from "@/src/constants/colors";
import { scale as s, moderateScale as ms } from "react-native-size-matters/extend";
import { MemoFirstPlaceCard } from "../ranking/FirstPlaceCard";
import { MemoRunnerUpCard } from "../ranking/RunnerUpCard";

const Ranking: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="body1" color={AppColors.gray90}>
          랭킹
        </AppText>

        <TouchableOpacity hitSlop={8}>
          <ArrowRight2 size={`${ms(16)}`} />
        </TouchableOpacity>
      </View>

      {/* Cards Row */}
      <View style={styles.cardsRow}>
        <MemoFirstPlaceCard />

        <View style={styles.runnerUpColumn}>
          <MemoRunnerUpCard rank={2} name="검은신사" score="100,233,000" />
          <MemoRunnerUpCard rank={3} name="검은신사" score="90,000,000" />
        </View>
      </View>
    </View>
  );
};

export const MemoRanking = React.memo(Ranking);

const styles = StyleSheet.create({
  container: {
    paddingBottom: ms(24),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ms(12),
  },
  cardsRow: {
    flexDirection: "row",
    gap: ms(8),
    height: s(148),
  },
  runnerUpColumn: {
    flex: 1,
    gap: ms(16),
  },
});
