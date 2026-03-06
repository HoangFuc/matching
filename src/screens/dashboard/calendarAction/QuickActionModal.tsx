import React from 'react';
import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

const ACTIONS = [
  {
    label: '일정 등록',
    image: require('@/src/assets/images/calendar.png'),
  },
  {
    label: '미팅록 작성',
    image: require('@/src/assets/images/clipboard-with-pen.png'),
  },
  {
    label: '기안 등록',
    image: require('@/src/assets/images/phone-book.png'),
  },
];

const QuickActionModal: React.FC<IProps> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} />

      <View style={styles.bottomRow}>
        {ACTIONS.map(action => (
          <Pressable key={action.label} style={styles.actionItem} onPress={onClose}>
            <View style={styles.iconCircle}>
              <Image source={action.image} style={styles.icon} />
            </View>
            <AppText variant="body6" color={AppColors.gray90}>
              {action.label}
            </AppText>
          </Pressable>
        ))}

        <Pressable style={styles.fab} onPress={onClose}>
          <AppText variant="body5" color={AppColors.white}>
            {'×'}
          </AppText>
        </Pressable>
      </View>
    </Modal>
  );
};

export const MemoQuickActionModal = React.memo(QuickActionModal);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  bottomRow: {
    position: 'absolute',
    bottom: ms(24),
    right: ms(16),
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: ms(8),
  },
  actionItem: {
    alignItems: 'center',
    gap: ms(6),
  },
  iconCircle: {
    width: ms(56),
    height: ms(56),
    borderRadius: ms(28),
    backgroundColor: AppColors.lavendar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: ms(30),
    height: ms(30),
  },
  fab: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    backgroundColor: AppColors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: ms(4) },
    shadowOpacity: 0.2,
    shadowRadius: ms(6),
    elevation: 6,
  },
});
