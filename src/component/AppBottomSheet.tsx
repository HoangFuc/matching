import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

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
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.overlay} onPress={onClose}>
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

            <ScrollView
              contentContainerStyle={[
                styles.contentContainer,
                contentContainerStyle,
              ]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>

            {footer && <View style={styles.footerContainer}>{footer}</View>}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
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
    backgroundColor: 'rgba(0,0,0,0.7)',
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
