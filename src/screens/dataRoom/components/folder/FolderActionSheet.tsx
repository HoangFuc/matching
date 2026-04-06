import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { MemoAppBottomSheet } from '@/src/component/AppBottomSheet';
import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type TFolderAction = 'share' | 'move' | 'rename' | 'info';

interface IProps {
  visible: boolean;
  onClose: () => void;
  folderName: string;
  onAction: (action: TFolderAction) => void;
}

const ACTIONS: { key: TFolderAction; label: string }[] = [
  { key: 'share', label: '공유' },
  { key: 'move', label: '이동' },
  { key: 'rename', label: '이름 변경' },
  { key: 'info', label: '상세정보' },
];

const FolderActionSheet: React.FC<IProps> = ({
  visible,
  onClose,
  folderName,
  onAction,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <MemoAppBottomSheet visible={visible} onClose={onClose} title={folderName}>
      <View style={{ gap: 16, paddingBottom: 20 + insets.bottom, paddingTop: 16 }}>
        {ACTIONS.map(action => (
          <Pressable
            key={action.key}
            style={styles.actionItem}
            onPress={() => {
              onAction(action.key);
              onClose();
            }}
          >
            <AppText variant="body4" color={AppColors.gray80}>
              {action.label}
            </AppText>
          </Pressable>
        ))}
      </View>
    </MemoAppBottomSheet>
  );
};

export const MemoFolderActionSheet = React.memo(FolderActionSheet);

const styles = StyleSheet.create({
  actionItem: {
    alignItems: 'center',
  },
});
