import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters';

import { AppColors } from '../constants/colors';

interface FullScreenLoadingProps {
  visible: boolean;
}

const FullScreenLoading: React.FC<FullScreenLoadingProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.container}>
        <View style={styles.overlay}>
          <ActivityIndicator size="small" color={AppColors.purple} />
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(FullScreenLoading);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: ms(75),
    height: ms(75),
    borderRadius: ms(12),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
});
