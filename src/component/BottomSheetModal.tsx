import React from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';

import { ms, s } from 'react-native-size-matters/extend';

import { AppText } from './AppText';
import { AppColors } from '../constants/colors';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const ANIM_DURATION = 300;

interface IProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  sheetStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const BottomSheetModal: React.FC<IProps> = ({
  visible,
  onClose,
  title,
  sheetStyle,
  children,
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  //---------------------------------------

  React.useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setModalVisible(false);
        }
      });
    }
  }, [visible, backdropOpacity, translateY]);

  //---------------------------------------

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: backdropOpacity }]}
        pointerEvents="none"
      >
        <BlurView style={styles.blur} blurType="dark" blurAmount={8} />
      </Animated.View>

      <Pressable style={styles.flex} onPress={onClose} />

      <Animated.View
        style={[styles.sheetWrapper, { transform: [{ translateY }] }]}
      >
        <View style={[styles.sheet, sheetStyle]}>
          <View style={styles.handleBar} />

          {title && (
            <AppText
              variant="heading3"
              color={AppColors.gray100}
              style={styles.title}
            >
              {title}
            </AppText>
          )}

          {children}
        </View>
      </Animated.View>
    </Modal>
  );
};

export const MemoBottomSheetModal = React.memo(BottomSheetModal);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  blur: {
    flex: 1,
  },
  sheetWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    backgroundColor: AppColors.white,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
  },
  handleBar: {
    width: s(50),
    height: s(6),
    borderRadius: ms(100),
    backgroundColor: AppColors.gray20,
    alignSelf: 'center',
    marginTop: ms(14),
  },
  title: {
    textAlign: 'center',
    paddingVertical: ms(8),
    paddingHorizontal: ms(16),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray20,
  },
});
