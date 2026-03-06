import React from 'react';
import { Dimensions, Image, Pressable, StyleSheet } from 'react-native';

import { DotsVertical } from '@/src/constants/icons';
import { ms } from 'react-native-size-matters/extend';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - ms(16) * 2 - ms(12)) / 2;

import { AppText } from '@/src/component/AppText';
import { AppColors, Primary } from '@/src/constants/colors';
import { AppImages } from '@/src/constants/images';
import type { IFolder } from '@/src/store/api/dataRoom.api';

interface IProps {
  folder: IFolder;
  onPress?: (folder: IFolder) => void;
  onPressMore?: (folder: IFolder) => void;
  showMore?: boolean;
}

const FolderCard: React.FC<IProps> = ({
  folder,
  onPress,
  onPressMore,
  showMore = true,
}) => {
  return (
    <Pressable style={styles.card} onPress={() => onPress?.(folder)}>
      {showMore && (
        <Pressable
          hitSlop={8}
          onPress={() => onPressMore?.(folder)}
          style={styles.moreIcon}
        >
          <DotsVertical
            width={ms(20)}
            height={ms(20)}
            fill={AppColors.gray50}
          />
        </Pressable>
      )}
      <AppText variant="detail" color={AppColors.gray90}>
        {folder.createdAt}
      </AppText>
      <AppText variant="body6" color={AppColors.gray90} numberOfLines={1}>
        {folder.name}
      </AppText>
      <Image
        source={AppImages.folder}
        style={styles.icon}
        resizeMode="contain"
      />
    </Pressable>
  );
};

export const MemoFolderCard = React.memo(FolderCard);

export const folderCardStyles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    overflow: 'hidden',
    backgroundColor: AppColors.white,
    borderRadius: ms(16),
    paddingTop: ms(16),
    paddingBottom: ms(8),
    paddingLeft: ms(16),
    paddingRight: ms(8),
    gap: ms(3),
    shadowColor: '#5329C2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
});

const styles = StyleSheet.create({
  card: folderCardStyles.card,
  moreIcon: {
    position: 'absolute',
    top: ms(8),
    right: ms(8),
  },
  icon: {
    width: ms(46),
    height: ms(46),
    alignSelf: 'flex-end',
  },
});
