import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Add } from '@/src/constants/icons';
import { ms } from 'react-native-size-matters/extend';
import { AppColors } from '@/src/constants/colors';
import { MemoAddMenuSheet } from './AddMenuSheet';
import { MemoCreateFolderSheet } from './folder';

interface FABWithMenuProps {
  variant?: 'white' | 'purple';
  onUploadFile?: () => void;
  showCreateFolder?: boolean;
}

const FABWithMenu: React.FC<FABWithMenuProps> = ({
  variant = 'white',
  onUploadFile,
  showCreateFolder = true,
}) => {
  const [addMenuVisible, setAddMenuVisible] = React.useState(false);
  const [createFolderVisible, setCreateFolderVisible] = React.useState(false);

  const isPurple = variant === 'purple';

  const handleUploadFile = React.useCallback(() => {
    onUploadFile?.();
  }, [onUploadFile]);

  const handleCreateFolder = React.useCallback(() => {
    setCreateFolderVisible(true);
  }, []);

  return (
    <>
      <Pressable
        style={[styles.fab, isPurple ? styles.fabPurple : styles.fabWhite]}
        onPress={() => setAddMenuVisible(true)}
      >
        <Add
          size={`${ms(28)}`}
          color={isPurple ? AppColors.white : AppColors.gray100}
          variant="Linear"
        />
      </Pressable>

      <MemoAddMenuSheet
        visible={addMenuVisible}
        onClose={() => setAddMenuVisible(false)}
        onUploadFile={handleUploadFile}
        onCreateFolder={handleCreateFolder}
        showCreateFolder={showCreateFolder}
      />

      <MemoCreateFolderSheet
        visible={createFolderVisible}
        onClose={() => setCreateFolderVisible(false)}
      />
    </>
  );
};

export const MemoFABWithMenu = React.memo(FABWithMenu);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: ms(32),
    right: ms(16),
    width: ms(58),
    height: ms(58),
    borderRadius: ms(100),
    alignItems: 'center',
    justifyContent: 'center',
    padding: ms(16),
  },
  fabWhite: {
    backgroundColor: AppColors.white,
    shadowColor: '#5329C2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 4,
    elevation: 4,
  },
  fabPurple: {
    backgroundColor: AppColors.purple,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
