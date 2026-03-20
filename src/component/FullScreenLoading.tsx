import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Modal, StyleSheet, View} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {ms} from 'react-native-size-matters/extend';
import {AppColors} from '../constants/colors';

interface FullScreenLoadingProps {
  visible: boolean;
}

const SPINNER_SIZE = ms(44);
const BORDER_WIDTH = ms(3);

const FullScreenLoading: React.FC<FullScreenLoadingProps> = ({visible}) => {
  const rotation = useRef(new Animated.Value(0)).current;

  //---------------------------------------
  useEffect(() => {
    if (!visible) return;

    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start();

    return () => animation.stop();
  }, [visible, rotation]);

  if (!visible) return null;

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <BlurView style={styles.overlay} blurType="light" blurAmount={6}>
        <View style={styles.spinnerContainer}>
          <View style={styles.track} />
          <Animated.View
            style={[styles.spinner, {transform: [{rotate: spin}]}]}
          />
        </View>
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
  spinnerContainer: {
    width: SPINNER_SIZE,
    height: SPINNER_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  track: {
    position: 'absolute',
    width: SPINNER_SIZE,
    height: SPINNER_SIZE,
    borderRadius: SPINNER_SIZE / 2,
    borderWidth: BORDER_WIDTH,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  spinner: {
    width: SPINNER_SIZE,
    height: SPINNER_SIZE,
    borderRadius: SPINNER_SIZE / 2,
    borderWidth: BORDER_WIDTH,
    borderColor: 'transparent',
    borderTopColor: AppColors.purple,
  },
});
