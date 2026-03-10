import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { ms } from 'react-native-size-matters/extend';

import { AppColors } from '@/src/constants/colors';
import { Add } from '@/src/constants/icons';
import { MemoBodyDashboard } from './Body';
import { MemoQuickActionModal } from '../component/calendarAction/QuickActionModal';
import { MemoHeaderDashboard } from './Header';
import { CardShadow } from '@/src/constants/shadows';

export const Dashboard: React.FC = () => {
  const [menuVisible, setMenuVisible] = React.useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MemoHeaderDashboard />

      <View style={styles.content}>
        <MemoBodyDashboard />
      </View>

      <MemoQuickActionModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />

      {!menuVisible && (
        <Pressable
          style={styles.fab}
          onPress={() => setMenuVisible(true)}
        >
          <Add
            size={`${ms(28)}`}
            color={AppColors.purple}
            variant="Linear"
          />
        </Pressable>
      )}
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
  fab: {
    position: 'absolute',
    bottom: ms(24),
    right: ms(16),
    zIndex: 2,
    width: ms(48),
    height: ms(48),
    borderRadius: ms(100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderColor: AppColors.gray30,
    ...CardShadow,
  },
});
