import React from 'react';

export function useSheetManager<T>() {
  const [actionSheetVisible, setActionSheetVisible] = React.useState(false);
  const [moveSheetVisible, setMoveSheetVisible] = React.useState(false);
  const [renameSheetVisible, setRenameSheetVisible] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<T | null>(null);

  //---------------------------------------
  const openActionSheet = React.useCallback((item: T) => {
    setSelectedItem(item);
    setActionSheetVisible(true);
  }, []);

  //---------------------------------------
  const closeActionSheet = React.useCallback(() => {
    setActionSheetVisible(false);
  }, []);

  //---------------------------------------
  const closeMoveSheet = React.useCallback(() => {
    setMoveSheetVisible(false);
  }, []);

  //---------------------------------------
  const closeRenameSheet = React.useCallback(() => {
    setRenameSheetVisible(false);
  }, []);

  //---------------------------------------
  const handleAction = React.useCallback(
    (action: string) => {
      if (!selectedItem) {
        return;
      }
      switch (action) {
        case 'move':
          setMoveSheetVisible(true);
          break;
        case 'rename':
          setRenameSheetVisible(true);
          break;
        default:
          break;
      }
    },
    [selectedItem],
  );

  return {
    selectedItem,
    actionSheetVisible,
    moveSheetVisible,
    renameSheetVisible,
    openActionSheet,
    closeActionSheet,
    closeMoveSheet,
    closeRenameSheet,
    handleAction,
  };
}
