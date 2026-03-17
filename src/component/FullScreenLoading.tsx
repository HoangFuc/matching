import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, View} from 'react-native';
import {AppColors} from '../constants/colors';

interface FullScreenLoadingProps {
  visible: boolean;
}

const FullScreenLoading: React.FC<FullScreenLoadingProps> = ({visible}) => {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color={AppColors.purple} />
      </View>
    </Modal>
  );
};

export default React.memo(FullScreenLoading);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
