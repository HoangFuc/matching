import { BlurView } from '@react-native-community/blur';
import React from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { ms, s } from 'react-native-size-matters/extend';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppColors } from '@/src/constants/colors';
import { AppText } from './AppText';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const ANIM_DURATION = 300;

interface IProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: number;
  showHandle?: boolean;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
  footer?: React.ReactNode;
}

const AppBottomSheet: React.FC<IProps> = ({
  visible,
  onClose,
  title,
  children,
  maxHeight = s(716),
  showHandle = true,
  scrollable = true,
  contentContainerStyle,
  footer,
}) => {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = React.useState(false);
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;

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
        Animated.timing(slideAnim, {
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
        Animated.timing(slideAnim, {
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
  }, [visible, backdropOpacity, slideAnim]);

  //---------------------------------------
  const handleClose = React.useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <GestureHandlerRootView style={styles.flex}>
        <KeyboardAvoidingView style={styles.flex} behavior="padding">
          <Animated.View
            style={[StyleSheet.absoluteFill, { opacity: backdropOpacity }]}
            pointerEvents="none"
          >
            <BlurView style={styles.overlay} blurType="dark" blurAmount={8} />
          </Animated.View>

          <Pressable style={styles.flex} onPress={handleClose} />

          <Animated.View
            style={[
              styles.sheetWrapper,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={[styles.sheet, { maxHeight }]}>
              {showHandle && <View style={styles.handleBar} />}

              {title && (
                <View style={styles.titleContainer}>
                  <AppText variant="heading3" color={AppColors.gray100}>
                    {title}
                  </AppText>
                </View>
              )}

              {scrollable ? (
                <KeyboardAwareScrollView
                  contentContainerStyle={[
                    styles.contentContainer,
                    contentContainerStyle,
                  ]}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  enableOnAndroid
                  extraScrollHeight={ms(20)}
                >
                  {children}
                </KeyboardAwareScrollView>
              ) : (
                <KeyboardAwareScrollView
                  contentContainerStyle={[
                    styles.contentContainer,
                    contentContainerStyle,
                  ]}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  enableOnAndroid
                  extraScrollHeight={ms(20)}
                  scrollEnabled={false}
                >
                  {children}
                </KeyboardAwareScrollView>
              )}

              {footer && (
                <View
                  style={[
                    styles.footerContainer,
                    { paddingBottom: ms(20) + insets.bottom },
                  ]}
                >
                  {footer}
                </View>
              )}
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
};

export const MemoAppBottomSheet = React.memo(AppBottomSheet);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  overlayPressable: {
    ...StyleSheet.absoluteFillObject,
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
  titleContainer: {
    alignItems: 'center',
    paddingTop: ms(16),
    paddingBottom: ms(12),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray20,
  },
  contentContainer: {
    paddingHorizontal: ms(20),
    gap: ms(16),
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: ms(12),
    paddingHorizontal: ms(20),
    paddingTop: ms(12),
  },
});
