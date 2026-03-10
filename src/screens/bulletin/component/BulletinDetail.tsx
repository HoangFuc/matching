import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { RouteProp, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import { XMarkIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import { Send } from '@/src/constants/icons';
import { AppImages } from '@/src/constants/images';
import { RootStackParamList } from '@/src/interface/tab.interface';
import {
  useCreateCommentMutation,
  useGetBulletinDetailQuery,
  useGetCommentsQuery,
} from '@/src/store/api/bulletin.api';
import { MemoCommentItem } from './CommentItem';
import { MemoPostStats } from './PostStats';

const BulletinDetail: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'BulletinDetail'>>();
  const { postId } = route.params;

  //---------------------------------------
  const { data: post, isLoading } = useGetBulletinDetailQuery(postId);
  const { data: commentsData } = useGetCommentsQuery(postId);

  //---------------------------------------
  const [createComment] = useCreateCommentMutation();
  const [commentText, setCommentText] = React.useState('');

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
  const inputRef = React.useRef<TextInput>(null);
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const imageWidth = Dimensions.get('window').width - ms(32);

  //---------------------------------------
  const handleImageScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / imageWidth);
      setActiveImageIndex(index);
    },
    [imageWidth],
  );

  //---------------------------------------
  const avatarSource = post?.author.avatarUrl
    ? { uri: post.author.avatarUrl }
    : AppImages.avatar;

  //---------------------------------------
  const handleReply = React.useCallback(
    (commentId: string, authorName: string) => {
      setReplyTo({ commentId, authorName });
      inputRef.current?.focus();
    },
    [],
  );

  //---------------------------------------
  const handleCancelReply = React.useCallback(() => {
    setReplyTo(null);
  }, []);

  //---------------------------------------
  const handleSend = React.useCallback(() => {
    if (!commentText.trim()) return;
    createComment({
      postId,
      content: commentText.trim(),
      ...(replyTo && { parentId: replyTo.commentId }),
    });
    setCommentText('');
    setReplyTo(null);
  }, [commentText, createComment, postId, replyTo]);

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
              <View>
                <FlatList
                  data={post.images}
                  keyExtractor={img => `${img.id}-${img.postId}`}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleImageScroll}
                  scrollEventThrottle={16}
                  renderItem={({ item }) => (
                    <Image
                      source={{ uri: item.presignedUrl }}
                      style={[styles.postImage, { width: imageWidth }]}
                      resizeMode="cover"
                    />
                  )}
                />
                {post.images.length > 1 && (
                  <View style={styles.dotContainer}>
                    {post.images.map((img, index) => (
                      <View
                        key={`dot-${img.id}`}
                        style={[
                          styles.dot,
                          index === activeImageIndex && styles.dotActive,
                        ]}
                      />
                    ))}
                  </View>
                )}
              </View>
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
        <SafeAreaView style={styles.safeAreaBottom} edges={['bottom']}>
          {replyTo && (
            <View style={styles.replyIndicator}>
              <AppText variant="body8" color={AppColors.gray80}>
                {replyTo.authorName}에게 답글 남기는 중
              </AppText>
              <Pressable onPress={handleCancelReply} hitSlop={8}>
                <XMarkIcon color={AppColors.gray80} size={ms(16)} />
              </Pressable>
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="내용을 입력해주세요"
              placeholderTextColor={AppColors.gray40}
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />

            <Pressable style={styles.sendButton} onPress={handleSend}>
              <Send
                size={`${ms(20)}`}
                color={AppColors.gray90}
                variant="Linear"
                style={{
                  borderRadius: ms(1.5),
                }}
              />
            </Pressable>
          </View>
        </SafeAreaView>
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
  safeAreaBottom: {
    backgroundColor: AppColors.white,
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
  postImage: {
    height: ms(343),
    borderRadius: ms(8),
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: ms(6),
    marginTop: ms(10),
  },
  dot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: AppColors.gray30,
  },
  dotActive: {
    backgroundColor: AppColors.purple,
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
  replyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
    backgroundColor: AppColors.gray10,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
    backgroundColor: AppColors.white,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray20,
  },
  input: {
    flex: 1,
    backgroundColor: AppColors.gray10,
    borderRadius: ms(20),
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
    fontSize: 14,
    color: AppColors.gray100,
    maxHeight: ms(80),
  },
  sendButton: {
    padding: ms(4),
  },
});
