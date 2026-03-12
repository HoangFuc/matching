import React from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { RouteProp, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import { AppImages } from '@/src/constants/images';
import { RootStackParamList } from '@/src/interface/tab.interface';
import {
  useCreateCommentMutation,
  useGetBulletinDetailQuery,
  useGetCommentsQuery,
} from '@/src/store/api/bulletin.api';
import { MemoCommentInput } from './CommentInput';
import { MemoCommentItem } from './CommentItem';
import { MemoImageCarousel } from './ImageCarousel';
import { MemoPostStats } from './PostStats';

const BulletinDetail: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'BulletinDetail'>>();
  const { postId } = route.params;

  //---------------------------------------
  const { data: post, isLoading } = useGetBulletinDetailQuery(postId);
  const { data: commentsData } = useGetCommentsQuery(postId);

  //---------------------------------------
  const [createComment] = useCreateCommentMutation();

  //---------------------------------------
  const totalCommentCount = React.useMemo(() => {
    if (!commentsData?.data) return post?.commentCount ?? 0;
    const countReplies = (comments: typeof commentsData.data): number =>
      comments.reduce(
        (sum, c) => sum + 1 + (c.replies ? countReplies(c.replies) : 0),
        0,
      );
    return countReplies(commentsData.data);
  }, [commentsData, post?.commentCount]);

  //---------------------------------------
  const [replyTo, setReplyTo] = React.useState<{
    commentId: string;
    authorName: string;
  } | null>(null);

  //---------------------------------------
  const avatarSource = post?.author.avatarUrl
    ? { uri: post.author.avatarUrl }
    : AppImages.avatar;

  //---------------------------------------
  const handleReply = React.useCallback(
    (commentId: string, authorName: string) => {
      setReplyTo({ commentId, authorName });
    },
    [],
  );

  //---------------------------------------
  const handleCancelReply = React.useCallback(() => {
    setReplyTo(null);
  }, []);

  //---------------------------------------
  const handleSend = React.useCallback(
    (text: string, parentId?: string) => {
      createComment({
        postId,
        content: text,
        ...(parentId && { parentId }),
      });
      setReplyTo(null);
    },
    [createComment, postId],
  );

  //---------------------------------------
  if (isLoading || !post) {
    return (
      <SafeAreaView style={styles.safeAreaTop} edges={['top']}>
        <MemoScreenHeader title="게시글 상세" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={AppColors.purple} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaTop} edges={['top']}>
      <MemoScreenHeader title="게시글 상세" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Post author */}
          <View style={styles.authorRow}>
            <Image source={avatarSource} style={styles.avatar} />

            <View style={styles.authorInfo}>
              <AppText variant="body1" color={AppColors.gray100}>
                {post.author.fullName}
              </AppText>
            </View>
          </View>

          {/* Post content */}
          <View style={styles.postContent}>
            <AppText variant="body8" color={AppColors.gray90}>
              {post.content}
            </AppText>

            {post.images && post.images.length > 0 && (
              <MemoImageCarousel images={post.images} />
            )}

            <AppText variant="detail" color={AppColors.gray80}>
              {dayjs(post.createdAt).format('YYYY.MM.DD')}
            </AppText>
          </View>

          {/* Post stats */}
          <View style={styles.statsRow}>
            <MemoPostStats
              postId={postId}
              likes={post.likeCount}
              comments={totalCommentCount}
              isLiked={post.isLiked}
              extra={
                <Pressable>
                  <AppText variant="pretendard" color={AppColors.gray100}>
                    댓글 남기기
                  </AppText>
                </Pressable>
              }
            />
          </View>

          {/* Comments */}
          <View style={styles.commentsSection}>
            {commentsData?.data?.map(comment => (
              <MemoCommentItem
                key={`${comment.id}-${comment.postId}`}
                comment={comment}
                authorId={post.author.id}
                onReply={handleReply}
              />
            ))}
          </View>
        </ScrollView>

        {/* Comment input */}
        <MemoCommentInput
          replyTo={replyTo}
          onCancelReply={handleCancelReply}
          onSend={handleSend}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export const MemoBulletinDetail = React.memo(BulletinDetail);

const styles = StyleSheet.create({
  safeAreaTop: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
  flex: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.white,
  },
  scrollView: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  scrollContent: {
    padding: ms(16),
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    paddingBottom: ms(12),
  },
  avatar: {
    width: ms(46),
    height: ms(46),
    borderRadius: ms(18),
  },
  authorInfo: {
    flex: 1,
  },
  postContent: {
    gap: ms(12),
    paddingBottom: ms(12),
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: ms(12),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray20,
  },
  commentsSection: {
    paddingTop: ms(4),
  },
});
