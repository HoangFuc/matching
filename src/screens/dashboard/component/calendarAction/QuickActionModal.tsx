import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { BlurView } from '@react-native-community/blur';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { Add, Calendar, ClipboardText, DocumentText } from '@/src/constants/icons';
import { CardShadow } from '@/src/constants/shadows';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

const ICON_SIZE = ms(24);
const ICON_COLOR = AppColors.purple;

const ACTIONS = [
  {
    label: '일정 등록',
    Icon: Calendar,
  },
  {
    label: '미팅록 작성',
    Icon: ClipboardText,
  },
  {
    label: '기안 등록',
    Icon: DocumentText,
  },
];

const QuickActionModal: React.FC<IProps> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <Pressable style={styles.blurWrapper} onPress={onClose}>
          <BlurView
            style={styles.blur}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor={AppColors.white}
          />
        </Pressable>

        <View style={styles.actionsRow}>
          {ACTIONS.map(action => (
            <Pressable
              key={action.label}
              style={styles.actionItem}
              onPress={onClose}
            >
              <View style={styles.iconCircle}>
                <action.Icon
                  size={ICON_SIZE}
                  color={ICON_COLOR}
                  variant="Linear"
                  style={{
                    borderWidth: ms(1.5),
                  }}
                />

                <AppText variant="detail" color={AppColors.purple}>
                  {action.label}
                </AppText>
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.fab} onPress={onClose}>
          <Add
            size={`${ms(28)}`}
            color={AppColors.negative}
            variant="Linear"
            style={{ transform: [{ rotate: '45deg' }] }}
          />
        </Pressable>
      </View>
    </Modal>
  );
};

export const MemoQuickActionModal = React.memo(QuickActionModal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blur: {
    flex: 1,
  },
  actionsRow: {
    position: 'absolute',
    bottom: ms(24) + ms(92),
    left: ms(16),
    right: ms(60),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  fab: {
    position: 'absolute',
    bottom: ms(24) + ms(92),
    right: ms(16),
    width: ms(48),
    height: ms(48),
    borderRadius: ms(100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderColor: AppColors.gray30,
    ...CardShadow,
  },
  actionItem: {
    alignItems: 'center',
  },
  iconCircle: {
    width: ms(66),
    height: ms(66),
    borderRadius: ms(33),
    backgroundColor: AppColors.lavendar,
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(4),
  },
});
