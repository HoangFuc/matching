import React from 'react';
import {ActivityIndicator, Modal, StyleSheet} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {AppColors} from '../constants/colors';

interface FullScreenLoadingProps {
  visible: boolean;
}

const FullScreenLoading: React.FC<FullScreenLoadingProps> = ({visible}) => {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <BlurView style={styles.overlay} blurType="dark" blurAmount={8}>
        <ActivityIndicator size="large" color={AppColors.purple} />
      </BlurView>
    </Modal>
  );
};

export default React.memo(FullScreenLoading);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
