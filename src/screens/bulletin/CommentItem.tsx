import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Like1 } from 'iconsax-react-nativejs';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { TBulletinComment } from '@/src/interface/bulletin.interface';

interface IProps {
  comment: TBulletinComment;
  isReply?: boolean;
}

const CommentItem: React.FC<IProps> = ({ comment, isReply }) => {
  return (
    <View style={[styles.container, isReply && styles.replyContainer]}>
      {/* Author row */}
      <View style={styles.authorRow}>
        <Image source={comment.avatar} style={styles.avatar} />

        <View style={styles.authorInfo}>
          <View style={styles.nameRow}>
            <AppText variant="body6" color={AppColors.gray100}>
              {comment.author}
            </AppText>

            {comment.isAuthor && (
              <View style={styles.authorBadge}>
                <AppText variant="detail" color={AppColors.white}>
                  작성자
                </AppText>
              </View>
            )}
          </View>
        </View>

        <AppText variant="detail" color={AppColors.gray50}>
          {comment.timeAgo}
        </AppText>
      </View>

      {/* Comment content */}
      <AppText variant="body8" color={AppColors.gray80}>
        {comment.content}
      </AppText>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.stat}>
          <Like1 size={`${ms(14)}`} color={AppColors.gray50} variant="Linear" />
          <AppText variant="detail" color={AppColors.gray50}>
            {comment.likes}
          </AppText>
        </View>

        {!isReply && (
          <Pressable>
            <AppText variant="detail" color={AppColors.gray50}>
              댓글 남기기
            </AppText>
          </Pressable>
        )}
      </View>

      {/* Replies */}
      {comment.replies?.map(reply => (
        <MemoCommentItem key={reply.id} comment={reply} isReply />
      ))}
    </View>
  );
};

export const MemoCommentItem = React.memo(CommentItem);

const styles = StyleSheet.create({
  container: {
    paddingVertical: ms(12),
    gap: ms(8),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray20,
  },
  replyContainer: {
    marginLeft: ms(24),
    borderBottomWidth: 0,
    paddingVertical: ms(8),
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  avatar: {
    width: ms(28),
    height: ms(28),
    borderRadius: ms(14),
  },
  authorInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
  },
  authorBadge: {
    backgroundColor: AppColors.purple,
    borderRadius: ms(4),
    paddingHorizontal: ms(6),
    paddingVertical: ms(1),
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(12),
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
  },
});
