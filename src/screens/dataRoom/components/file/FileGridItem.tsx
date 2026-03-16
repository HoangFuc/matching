import React from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { ms } from 'react-native-size-matters/extend';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - ms(16) * 2 - ms(12)) / 2;

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { Document, DotsVertical } from '@/src/constants/icons';
import type { IFile } from '@/src/store/api/dataRoom.api';
import { MemoFileThumbnail } from './FileThumbnail';
import dayjs from 'dayjs';

interface FileGridItemProps {
  item: IFile;
  onPressMore: (file: IFile) => void;
}

const FileGridItem: React.FC<FileGridItemProps> = ({ item, onPressMore }) => {
  return (
    <Pressable style={styles.container}>
      {/* Header: icon + name + dots */}
      <View style={styles.header}>
        <Document
          size={`${ms(20)}`}
          color={AppColors.gray90}
          variant="Linear"
        />

        <View style={styles.headerText}>
          <AppText variant="body3" color={AppColors.gray90} numberOfLines={1}>
            {item.originalName}
          </AppText>

          <AppText variant="detail" color={AppColors.gray80}>
            {dayjs(item.createdAt).format('YYYY.MM.DD')}
          </AppText>
        </View>

        <Pressable hitSlop={8} onPress={() => onPressMore(item)}>
          <DotsVertical
            width={ms(16)}
            height={ms(16)}
            fill={AppColors.gray50}
          />
        </Pressable>
      </View>

      {/* Preview */}
      <View style={styles.preview}>
        <MemoFileThumbnail file={item} style={styles.thumbnailFill} />
      </View>
    </Pressable>
  );
};

export const MemoFileGridItem = React.memo(FileGridItem);

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: ms(8),
    overflow: 'hidden',
    marginBottom: ms(12),
    gap: ms(8),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  headerText: {
    flex: 1,
    gap: ms(2),
  },
  preview: {
    height: ms(91.97),
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: AppColors.gray20,
    overflow: 'hidden',
    backgroundColor: AppColors.gray20,
  },
  thumbnailFill: {
    width: '100%',
    height: '100%',
    borderRadius: ms(8),
  },
});
