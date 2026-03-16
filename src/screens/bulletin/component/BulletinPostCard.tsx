import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

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
  //---------------------------------------
  const [isTruncated, setIsTruncated] = React.useState<boolean | null>(null);
  const [isExpanded, setIsExpanded] = React.useState(false);

  //---------------------------------------
  const avatarSource = post.author.avatarUrl
    ? { uri: post.author.avatarUrl }
    : AppImages.avatar;

  return (
    <MemoBaseCard style={styles.card} onPress={onPress}>
      {/* Author row */}
      <View style={styles.authorRow}>
        <Image source={avatarSource} style={styles.avatar} />

        <View style={styles.authorInfo}>
          <AppText variant="body6" color={AppColors.gray100}>
            {post.author.fullName}
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
        <View style={styles.textContent}>
          <AppText
            variant="body8"
            color={AppColors.gray90}
            numberOfLines={isTruncated !== null && !isExpanded ? 3 : undefined}
            onTextLayout={e => {
              if (isTruncated === null) {
                setIsTruncated(e.nativeEvent.lines.length > 3);
              }
            }}
          >
            {post.content}
          </AppText>

          {isTruncated && !isExpanded && (
            <Pressable onPress={() => setIsExpanded(true)}>
              <AppText variant="body6" color={AppColors.gray90}>
                더보기
              </AppText>
            </Pressable>
          )}
        </View>

        <Image source={{ uri: post.thumbnailUrl }} style={styles.postImage} />
      </View>

      {/* Footer - likes & comments */}
      <MemoPostStats
        postId={post.id}
        likes={post.likeCount}
        comments={post.commentCount}
        isLiked={post.isLiked}
      />
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
