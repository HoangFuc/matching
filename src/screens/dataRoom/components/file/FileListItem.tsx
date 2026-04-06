import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ms } from 'react-native-size-matters/extend';

import { DotsVertical } from '@/src/constants/icons';
import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import type { IFile } from '@/src/store/api/dataRoom.api';
import dayjs from 'dayjs';
import { getFileTypeConfig } from '../../utils/fileTypeConfig';

interface FileListItemProps {
  item: IFile;
  onPressMore: (file: IFile) => void;
  onPress?: (file: IFile) => void;
}

const getFileNameParts = (name: string) => {
  const lastDot = name.lastIndexOf('.');
  if (lastDot === -1) return { baseName: name, ext: '' };
  return { baseName: name.slice(0, lastDot), ext: name.slice(lastDot) };
};

const FileListItem: React.FC<FileListItemProps> = ({
  item,
  onPressMore,
  onPress,
}) => {
  const config = getFileTypeConfig(item.originalName);
  const { baseName, ext } = getFileNameParts(item.originalName);

  return (
    <Pressable style={styles.container} onPress={() => onPress?.(item)}>
      <View style={[styles.badge, { backgroundColor: config.bgColor }]}>
        {config.image ? (
          <Image source={config.image} style={styles.badgeIcon} resizeMode="contain" />
        ) : (
          <Text style={styles.badgeText}>{config.label}</Text>
        )}
      </View>

      <View style={styles.textContainer}>
        <View style={styles.nameRow}>
          <AppText variant="body4" color={AppColors.gray90} numberOfLines={1} style={styles.nameBase}>
            {baseName}
          </AppText>
          {ext ? (
            <AppText variant="body4" color={AppColors.gray90}>
              {ext}
            </AppText>
          ) : null}
        </View>

        <AppText variant="detail" color={AppColors.gray80}>
          {dayjs(item.createdAt).format('YYYY.MM.DD')}
        </AppText>
      </View>

      <Pressable hitSlop={8} onPress={() => onPressMore(item)}>
        <DotsVertical width={ms(20)} height={ms(20)} fill={AppColors.gray50} />
      </Pressable>
    </Pressable>
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
  badge: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: {
    width: ms(22),
    height: ms(22),
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: ms(9),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  textContainer: {
    flex: 1,
    gap: ms(2),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameBase: {
    flexShrink: 1,
  },
});
