import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ms } from 'react-native-size-matters/extend';

import { MemoAppBottomSheet } from '@/src/component/AppBottomSheet';
import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';

interface IProps {
  visible: boolean;
  onClose: () => void;
  onUploadFile: () => void;
  onCreateFolder?: () => void;
  showCreateFolder?: boolean;
}

const AddMenuSheet: React.FC<IProps> = ({
  visible,
  onClose,
  onUploadFile,
  onCreateFolder,
  showCreateFolder = true,
}) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <MemoAppBottomSheet
      visible={visible}
      onClose={onClose}
      title="추가"
      contentContainerStyle={{
        ...styles.content,
        paddingBottom: ms(40),
        marginBottom: ms(10) + bottom,
      }}
    >
      <Pressable
        style={styles.menuItem}
        onPress={() => {
          onUploadFile();
          onClose();
        }}
      >
        <AppText variant="body4" color={AppColors.gray100}>
          파일 업로드
        </AppText>
      </Pressable>

      {showCreateFolder && (
        <Pressable
          style={styles.menuItem}
          onPress={() => {
            onCreateFolder?.();
            onClose();
          }}
        >
          <AppText variant="body4" color={AppColors.gray100}>
            폴더 생성
          </AppText>
        </Pressable>
      )}
    </MemoAppBottomSheet>
  );
};

export const MemoAddMenuSheet = React.memo(AddMenuSheet);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 0,
    paddingBottom: 0,
    marginBottom: ms(20),
    gap: 0,
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: ms(14),
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray20,
    marginHorizontal: ms(20),
  },
});
