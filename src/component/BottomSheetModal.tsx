import React from 'react';
import {
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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <BlurView style={styles.blur} blurType="dark" blurAmount={8}>
      <Pressable
        style={styles.overlay}
        onPress={onClose}
      >
        <Pressable
          style={[styles.sheet, sheetStyle]}
          onPress={e => e.stopPropagation()}
        >
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
        </Pressable>
      </Pressable>
      </BlurView>
    </Modal>
  );
};

export const MemoBottomSheetModal = React.memo(BottomSheetModal);

const styles = StyleSheet.create({
  blur: {
    flex: 1,
  },
  overlay: {
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
  title: {
    textAlign: 'center',
    paddingVertical: ms(8),
    paddingHorizontal: ms(16),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray20,
  },
});
