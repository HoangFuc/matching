import React from "react";
import { StyleSheet, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { AppColors } from "@/src/constants/colors";
import { MemoBodyDashboard } from "./Body";
import { MemoHeaderDashboard } from "./Header";
export const Dashboard: React.FC = () => {
  //---------------------------------------

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <MemoHeaderDashboard />

      <View style={styles.content}>
        <MemoBodyDashboard />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
  content: {
    flex: 1,
  },
});
