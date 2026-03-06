import React from 'react';
import { Image, StyleSheet, View } from 'react-native';


import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { AppColors } from '@/src/constants/colors';
import { TBulletinPost } from '@/src/interface/bulletin.interface';
import { MemoPostStats } from './PostStats';

interface IProps {
  post: TBulletinPost;
  onPress?: () => void;
}

const BulletinPostCard: React.FC<IProps> = ({ post, onPress }) => {
  return (
    <MemoBaseCard style={styles.card} onPress={onPress}>
      {/* Author row */}
      <View style={styles.authorRow}>
        <Image source={post.avatar} style={styles.avatar} />

        <View style={styles.authorInfo}>
          <AppText variant="body6" color={AppColors.gray100}>
            {post.author}
          </AppText>
        </View>

        <AppText variant="detail" color={AppColors.gray80}>
          {post.timeAgo}
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
          <Image source={post.images[0]} style={styles.postImage} />
        )}
      </View>

      {/* Footer - likes & comments */}
      <MemoPostStats likes={post.likes} comments={post.comments} />
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
