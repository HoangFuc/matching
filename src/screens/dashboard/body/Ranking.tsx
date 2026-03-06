import React from 'react';
import { StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';
import { MemoSectionHeader } from '@/src/component/SectionHeader';
import { MemoFirstPlaceCard } from '../ranking/FirstPlaceCard';
import { MemoRunnerUpCard } from '../ranking/RunnerUpCard';

const Ranking: React.FC = () => {
  return (
    <View style={styles.container}>
      <MemoSectionHeader title="랭킹" onAction={() => {}} />

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
  cardsRow: {
    flexDirection: 'row',
    gap: ms(8),
  },
  runnerUpColumn: {
    flex: 1,
    gap: ms(8),
  },
});
