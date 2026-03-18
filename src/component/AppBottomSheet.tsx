import { BlurView } from '@react-native-community/blur';
import React from 'react';
import {
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

import { AppColors } from '@/src/constants/colors';
import { AppText } from './AppText';

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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={styles.flex}>
        <KeyboardAvoidingView style={styles.flex} behavior="padding">
          <BlurView style={styles.overlay} blurType="dark" blurAmount={8}>
            <Pressable style={styles.overlayPressable} onPress={onClose}>
              <Pressable
                style={[styles.sheet, { maxHeight }]}
                onPress={e => e.stopPropagation()}
              >
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

                {footer && <View style={styles.footerContainer}>{footer}</View>}
              </Pressable>
            </Pressable>
          </BlurView>
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
    flex: 1,
    justifyContent: 'flex-end',
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
    paddingBottom: ms(20),
    paddingTop: ms(12),
  },
});
