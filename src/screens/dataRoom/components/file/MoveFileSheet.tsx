import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { MemoAppBottomSheet } from '@/src/component/AppBottomSheet';
import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { RadioCheck } from '@/src/constants/icons';
import {
  IFolder,
  useGetFoldersQuery,
  useMoveFileMutation,
} from '@/src/store/api/dataRoom.api';

interface IProps {
  visible: boolean;
  onClose: () => void;
  fileId: string;
  currentFolderId: string;
}

const MoveFileSheet: React.FC<IProps> = ({
  visible,
  onClose,
  fileId,
  currentFolderId,
}) => {
  const { data: folders = [] } = useGetFoldersQuery();
  const [moveFile, { isLoading }] = useMoveFileMutation();
  const [selectedFolderId, setSelectedFolderId] = React.useState<string | null>(
    null,
  );

  const handleConfirm = React.useCallback(async () => {
    if (!selectedFolderId) {
      return;
    }
    try {
      await moveFile({ fileId, targetFolderId: selectedFolderId }).unwrap();
      onClose();
    } catch (error) {
      console.log('Move file error:', error);
    }
  }, [selectedFolderId, moveFile, fileId, onClose]);

  const footer = React.useMemo(
    () => (
      <>
        <MemoAppButton label="취소" variant="secondary" onPress={onClose} />
        <MemoAppButton
          label="확인"
          variant="primary"
          onPress={handleConfirm}
          disabled={!selectedFolderId || isLoading}
        />
      </>
    ),
    [onClose, handleConfirm, selectedFolderId, isLoading],
  );

  return (
    <MemoAppBottomSheet
      visible={visible}
      onClose={onClose}
      title="이동"
      footer={footer}
    >
      <View style={{ paddingVertical: ms(16), gap: 16 }}>
        <AppText variant="body2" color={AppColors.gray100}>
          폴더
        </AppText>

        {folders.map((folder: IFolder) => (
          <Pressable
            key={folder.id}
            style={styles.folderItem}
            onPress={() => setSelectedFolderId(folder.id)}
          >
            <AppText
              variant={selectedFolderId === folder.id ? 'body2' : 'body4'}
              color={
                folder.id === currentFolderId
                  ? AppColors.gray40
                  : selectedFolderId === folder.id
                  ? AppColors.purple
                  : AppColors.gray80
              }
            >
              {folder.name}
            </AppText>
            {selectedFolderId === folder.id && (
              <RadioCheck width={ms(20)} height={ms(20)} />
            )}
          </Pressable>
        ))}
      </View>
    </MemoAppBottomSheet>
  );
};

export const MemoMoveFileSheet = React.memo(MoveFileSheet);

const styles = StyleSheet.create({
  folderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
