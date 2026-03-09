import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { AppColors } from '@/src/constants/colors';
import { AppImages } from '@/src/constants/images';
import { IBulletinPost } from '@/src/interface/bulletin.interface';
import { formatTimeAgo } from '@/src/utils/date';
import { MemoPostStats } from './PostStats';

interface IProps {
  post: IBulletinPost;
  onPress?: () => void;
}

const BulletinPostCard: React.FC<IProps> = ({ post, onPress }) => {
  const avatarSource = post.author.profileImage
    ? { uri: post.author.profileImage }
    : AppImages.avatar;

  return (
    <MemoBaseCard style={styles.card} onPress={onPress}>
      {/* Author row */}
      <View style={styles.authorRow}>
        <Image source={avatarSource} style={styles.avatar} />

        <View style={styles.authorInfo}>
          <AppText variant="body6" color={AppColors.gray100}>
            {post.author.name}
          </AppText>
        </View>

        <AppText variant="detail" color={AppColors.gray80}>
          {formatTimeAgo(post.createdAt)}
        </AppText>
      </View>

      {/* Title */}
      {!!post.title && (
        <AppText variant="body2" color={AppColors.gray90}>
          {post.title}
        </AppText>
      )}

      {/* Content + Image */}
      <View style={styles.contentRow}>
        <AppText
          variant="body8"
          color={AppColors.gray90}
          numberOfLines={3}
          style={styles.textContent}
        >
          {post.content}
        </AppText>

        {post.images && post.images.length > 0 && (
          <Image source={{ uri: post.images[0].url }} style={styles.postImage} />
        )}
      </View>

      {/* Footer - likes & comments */}
      <MemoPostStats likes={post.likesCount} comments={post.commentsCount} />
    </MemoBaseCard>
  );
};

export const MemoBulletinPostCard = React.memo(BulletinPostCard);

const styles = StyleSheet.create({
  card: {
    gap: ms(12),
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  avatar: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(100),
  },
  authorInfo: {
    flex: 1,
  },
  contentRow: {
    flexDirection: 'row',
    gap: ms(12),
  },
  textContent: {
    flex: 1,
    gap: ms(4),
  },
  postImage: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(8),
  },
});
