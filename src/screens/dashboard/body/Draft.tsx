import React from "react";
import { StyleSheet, View } from "react-native";

import { ms, s } from "react-native-size-matters/extend";
import { MemoBodyDraft } from "../draft/BodyDraft";
import { MemoHeaderDraft } from "../draft/HeaderDraft";

const Draft: React.FC = () => {
  return (
    <View style={styles.container}>
      <MemoHeaderDraft />

      <MemoBodyDraft />
    </View>
  );
};

export const MemoDraft = React.memo(Draft);

const styles = StyleSheet.create({
  container: {
    gap: ms(12),
    width: s(343),
    height: s(92),
    marginBottom: ms(16),
  },
});
