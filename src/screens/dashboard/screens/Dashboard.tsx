import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';

import { AppColors } from '@/src/constants/colors';
import { MemoBodyDashboard } from './Body';
import { MemoHeaderDashboard } from './Header';

export const Dashboard: React.FC = () => {
  return (
    <AppSafeAreaView style={styles.safeArea}>
      <MemoHeaderDashboard />

      <View style={styles.content}>
        <MemoBodyDashboard />
      </View>
    </AppSafeAreaView>
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
