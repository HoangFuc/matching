import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ms } from 'react-native-size-matters/extend';

import { Document, DotsVertical } from '@/src/constants/icons';
import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import type { IFile } from '@/src/store/api/dataRoom.api';

interface FileListItemProps {
  item: IFile;
  onPressMore: (file: IFile) => void;
}

const FileListItem: React.FC<FileListItemProps> = ({ item, onPressMore }) => {
  return (
    <View style={styles.container}>
      <Document width={ms(20)} height={ms(20)} fill={AppColors.gray50} />

      <View style={styles.textContainer}>
        <AppText variant="body4" color={AppColors.gray90} numberOfLines={1}>
          {item.originalName}
        </AppText>

        <AppText variant="detail" color={AppColors.gray80}>
          {item.createdAt}
        </AppText>
      </View>

      <Pressable hitSlop={8} onPress={() => onPressMore(item)}>
        <DotsVertical width={ms(20)} height={ms(20)} fill={AppColors.gray50} />
      </Pressable>
    </View>
  );
};

export const MemoFileListItem = React.memo(FileListItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(12),
    paddingVertical: ms(12),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray20,
  },
  textContainer: {
    flex: 1,
    gap: ms(2),
  },
});
