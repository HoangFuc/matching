import React from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { EllipsisVerticalIcon } from 'react-native-heroicons/solid';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoBottomSheetModal } from '@/src/component/BottomSheetModal';
import { AppColors } from '@/src/constants/colors';
import { IBulletinComment } from '@/src/interface/bulletin.interface';
import {
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} from '@/src/store/api/bulletin.api';
import { MemoPostStats } from './PostStats';
import { AppImages } from '@/src/constants/images';
import { formatTimeAgo } from '@/src/utils/date';

interface IProps {
  comment: IBulletinComment;
  authorId: string;
  isReply?: boolean;
  onReply?: (commentId: string, authorName: string) => void;
}

const CommentItem: React.FC<IProps> = ({
  comment,
  authorId,
  isReply,
  onReply,
}) => {
  const [showOptions, setShowOptions] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editContent, setEditContent] = React.useState(comment.content);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isTruncated, setIsTruncated] = React.useState(false);
  const isAuthor = authorId === comment.author.id;

  //---------------------------------------
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  //---------------------------------------
  const handleOpenOptions = React.useCallback(() => setShowOptions(true), []);
  const handleCloseOptions = React.useCallback(() => setShowOptions(false), []);

  //---------------------------------------
  const handleReply = React.useCallback(() => {
    onReply?.(comment.id, comment.author.fullName);
  }, [onReply, comment.id, comment.author.fullName]);

  //---------------------------------------
  const handleEdit = React.useCallback(() => {
    setShowOptions(false);
    setEditContent(comment.content);
    setIsEditing(true);
  }, [comment.content]);

  //---------------------------------------
  const handleEditSubmit = React.useCallback(() => {
    if (!editContent.trim() || !comment.postId) {
      return;
    }
    updateComment({
      commentId: comment.id,
      postId: comment.postId,
      content: editContent.trim(),
    });
    setIsEditing(false);
  }, [editContent, comment.id, comment.postId, updateComment]);

  //---------------------------------------
  const handleEditCancel = React.useCallback(() => {
    setIsEditing(false);
    setEditContent(comment.content);
  }, [comment.content]);

  //---------------------------------------
  const handleDelete = React.useCallback(() => {
    setShowOptions(false);
    Alert.alert('삭제', '댓글을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          if (!comment.postId) {
            return;
          }
          deleteComment({ commentId: comment.id, postId: comment.postId });
        },
      },
    ]);
  }, [comment.id, comment.postId, deleteComment]);

  //---------------------------------------
  const avatarSource = comment.author.avatarUrl
    ? { uri: comment.author.avatarUrl }
    : AppImages.avatar;

  return (
    <View style={[styles.container, isReply && styles.replyContainer]}>
      {/* Author row */}
      <View style={styles.authorRow}>
        <Image source={avatarSource} style={styles.avatar} />

        <View style={styles.authorInfo}>
          <View style={styles.nameRow}>
            <AppText variant="body6" color={AppColors.gray100}>
              {comment.author.fullName}
            </AppText>

            {/* {isAuthor && (
              <View style={styles.authorBadge}>
                <AppText variant="detail" color={AppColors.purple}>
                  작성자
                </AppText>
              </View>
            )} */}

            <AppText variant="detail" color={AppColors.gray80}>
              · {formatTimeAgo(comment.createdAt)}
            </AppText>
          </View>
        </View>

        {/* {isAuthor && (
          <Pressable onPress={handleOpenOptions}>
            <EllipsisVerticalIcon color={AppColors.gray100} size={ms(20)} />
          </Pressable>
        )} */}
      </View>

      {/* Comment content */}
      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={editContent}
            onChangeText={setEditContent}
            multiline
            autoFocus
          />
          <View style={styles.editActions}>
            <Pressable onPress={handleEditCancel}>
              <AppText variant="body6" color={AppColors.gray80}>
                취소
              </AppText>
            </Pressable>
            <Pressable onPress={handleEditSubmit}>
              <AppText variant="body6" color={AppColors.purple}>
                저장
              </AppText>
            </Pressable>
          </View>
        </View>
      ) : (
        <>
          {!isTruncated && (
            <AppText
              variant="body8"
              color={AppColors.gray80}
              style={styles.hiddenText}
              onTextLayout={e => {
                if (e.nativeEvent.lines.length > 3) {
                  setIsTruncated(true);
                }
              }}
            >
              {comment.content}
            </AppText>
          )}
          <AppText
            variant="body8"
            color={AppColors.gray80}
            numberOfLines={isExpanded ? undefined : 3}
          >
            {comment.content}
          </AppText>
          {isTruncated && !isExpanded && (
            <Pressable onPress={() => setIsExpanded(true)}>
              <AppText variant="body6" color={AppColors.gray90}>
                더보기
              </AppText>
            </Pressable>
          )}
        </>
      )}

      {/* Footer */}
      <MemoPostStats
        commentId={comment.id}
        postId={comment.postId}
        likes={comment.likeCount}
        isLiked={comment.isLiked}
        comments={comment.replies?.length ?? 0}
        extra={
          !isReply ? (
            <Pressable onPress={handleReply}>
              <AppText variant="pretendard" color={AppColors.gray100}>
                댓글 남기기
              </AppText>
            </Pressable>
          ) : undefined
        }
        // isAuthor={isAuthor}
      />

      {/* Replies */}
      {comment.replies?.map(reply => (
        <MemoCommentItem
          key={reply.id}
          comment={reply}
          authorId={authorId}
          isReply
          onReply={onReply}
        />
      ))}

      {/* {isAuthor && (
        <MemoBottomSheetModal
          visible={showOptions}
          onClose={handleCloseOptions}
          title="선택"
        >
          <View style={styles.optionContainer}>
            <Pressable onPress={handleEdit}>
              <AppText
                variant="body4"
                color={AppColors.gray100}
                style={styles.optionText}
              >
                수정
              </AppText>
            </Pressable>
            <Pressable onPress={handleDelete}>
              <AppText
                variant="body4"
                color={AppColors.gray100}
                style={styles.optionText}
              >
                삭제
              </AppText>
            </Pressable>
          </View>
        </MemoBottomSheetModal>
      )} */}
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
  editContainer: {
    gap: ms(8),
  },
  editInput: {
    borderWidth: 1,
    borderColor: AppColors.gray30,
    borderRadius: ms(8),
    padding: ms(8),
    fontSize: ms(14),
    color: AppColors.gray100,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: ms(16),
  },
  optionContainer: {
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
    paddingBottom: ms(24),
    gap: ms(16),
  },
  hiddenText: {
    position: 'absolute' as const,
    opacity: 0,
  },
  optionText: {
    textAlign: 'center',
  },
});
