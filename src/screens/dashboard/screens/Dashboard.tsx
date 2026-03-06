import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { MemoBodyDashboard } from './Body';
import { MemoQuickActionModal } from '../component/calendarAction/QuickActionModal';
import { MemoHeaderDashboard } from './Header';

export const Dashboard: React.FC = () => {
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MemoHeaderDashboard />

      <View style={styles.content}>
        <MemoBodyDashboard />
      </View>

      {!modalVisible && (
        <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
          <AppText variant="body5" color={AppColors.white}>
            {'+'}
          </AppText>
        </Pressable>
      )}

      <MemoQuickActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
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
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    backgroundColor: AppColors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: ms(4) },
    shadowOpacity: 0.2,
    shadowRadius: ms(6),
    elevation: 6,
  },
});
