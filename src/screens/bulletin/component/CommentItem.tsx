import React, { useCallback, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { EllipsisVerticalIcon } from 'react-native-heroicons/solid';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoBottomSheetModal } from '@/src/component/BottomSheetModal';
import { AppColors } from '@/src/constants/colors';
import { TBulletinComment } from '@/src/interface/bulletin.interface';
import { MemoPostStats } from './PostStats';

const AUTHOR_OPTIONS = ['수정', '삭제'] as const;

interface IProps {
  comment: TBulletinComment;
  isReply?: boolean;
}

const CommentItem: React.FC<IProps> = ({ comment, isReply }) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleOpenOptions = useCallback(() => setShowOptions(true), []);
  const handleCloseOptions = useCallback(() => setShowOptions(false), []);

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
                <AppText variant="detail" color={AppColors.purple}>
                  작성자
                </AppText>
              </View>
            )}

            <AppText variant="detail" color={AppColors.gray80}>
              · {comment.timeAgo}
            </AppText>
          </View>
        </View>

        {comment.isAuthor && (
          <Pressable onPress={handleOpenOptions}>
            <EllipsisVerticalIcon color={AppColors.gray100} size={ms(20)} />
          </Pressable>
        )}
      </View>

      {/* Comment content */}
      <AppText variant="body8" color={AppColors.gray80}>
        {comment.content}
      </AppText>

      {/* Footer */}
      <MemoPostStats
        likes={comment.likes}
        comments={comment.replies?.length ?? 0}
        extra={
          !isReply ? (
            <Pressable>
              <AppText variant="pretendard" color={AppColors.gray100}>
                댓글 남기기
              </AppText>
            </Pressable>
          ) : undefined
        }
        isAuthor={comment.isAuthor}
      />

      {/* Replies */}
      {comment.replies?.map(reply => (
        <MemoCommentItem key={reply.id} comment={reply} isReply />
      ))}

      {comment.isAuthor && (
        <MemoBottomSheetModal
          visible={showOptions}
          onClose={handleCloseOptions}
          title="선택"
        >
          <View style={styles.optionContainer}>
            {AUTHOR_OPTIONS.map(option => (
              <Pressable key={option} onPress={handleCloseOptions}>
                <AppText
                  variant="body4"
                  color={AppColors.gray100}
                  style={styles.optionText}
                >
                  {option}
                </AppText>
              </Pressable>
            ))}
          </View>
        </MemoBottomSheetModal>
      )}
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
    width: ms(30),
    height: ms(30),
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
    backgroundColor: AppColors.lavendar,
    borderRadius: ms(4),
    paddingHorizontal: ms(6),
    paddingVertical: ms(1),
  },
  optionContainer: {
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
    paddingBottom: ms(24),
    gap: ms(16),
  },
  optionText: {
    textAlign: 'center',
  },
});
