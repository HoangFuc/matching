import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { Like1, Message } from '@/src/constants/icons';
import {
  useToggleCommentLikeMutation,
  useToggleLikeMutation,
} from '@/src/store/api/bulletin.api';

interface IProps {
  postId?: string;
  commentId?: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  extra?: React.ReactNode;
  isAuthor?: boolean;
}

const PostStats: React.FC<IProps> = ({
  postId,
  commentId,
  likes,
  comments,
  isLiked,
  extra,
  isAuthor,
}) => {
  const [toggleLike] = useToggleLikeMutation();
  const [toggleCommentLike, { data: commentLikeResponse }] =
    useToggleCommentLikeMutation();

  //---------------------------------------
  const currentLikeCount = commentId
    ? (commentLikeResponse?.likeCount ?? likes)
    : likes;
  const currentLiked = commentId
    ? (commentLikeResponse?.isLiked ?? isLiked ?? false)
    : (isLiked ?? false);

  //---------------------------------------
  const handleLike = React.useCallback(() => {
    if (commentId && postId) {
      toggleCommentLike({ commentId, postId });
    } else if (postId) {
      toggleLike(postId);
    }
  }, [toggleLike, toggleCommentLike, postId, commentId]);

  return (
    <View style={styles.container}>
      <View style={styles.stats}>
        <Pressable style={styles.stat} onPress={handleLike} hitSlop={8}>
          <Like1
            size={`${ms(16)}`}
            color={currentLiked ? AppColors.purple : AppColors.gray100}
            variant={currentLiked ? 'Bold' : 'Linear'}
          />
          <AppText variant="detail" color={AppColors.gray100}>
            {currentLikeCount}
          </AppText>
        </Pressable>

        {!isAuthor && (
          <View style={styles.stat}>
            <Message
              size={`${ms(16)}`}
              color={AppColors.gray100}
              variant="Linear"
            />
            <AppText variant="detail" color={AppColors.gray100}>
              {comments}
            </AppText>
          </View>
        )}
      </View>

      {!isAuthor && extra}
    </View>
  );
};

export const MemoPostStats = React.memo(PostStats);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(16),
  },
  stats: {
    flexDirection: 'row',
    gap: ms(16),
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
  },
});
