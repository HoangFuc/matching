import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { MemoAppBottomSheet } from '@/src/component/AppBottomSheet';
import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TAction = 'share' | 'move' | 'rename' | 'info';

interface IProps {
  visible: boolean;
  onClose: () => void;
  fileName: string;
  onAction: (action: TAction) => void;
}

const ACTIONS: { key: TAction; label: string }[] = [
  { key: 'share', label: '공유' },
  { key: 'move', label: '이동' },
  { key: 'rename', label: '이름 변경' },
  { key: 'info', label: '상세정보' },
];

const FileActionSheet: React.FC<IProps> = ({
  visible,
  onClose,
  fileName,
  onAction,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <MemoAppBottomSheet visible={visible} onClose={onClose} title={fileName}>
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

export const MemoFileActionSheet = React.memo(FileActionSheet);

const styles = StyleSheet.create({
  actionItem: {
    alignItems: 'center',
  },
});
