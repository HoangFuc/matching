import React from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { RouteProp, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import { AppImages } from '@/src/constants/images';
import { Send } from '@/src/constants/icons';
import { TBulletinComment } from '@/src/interface/bulletin.interface';
import { RootStackParamList } from '@/src/interface/tab.interface';
import { useGetBulletinDetailQuery } from '@/src/store/api/bulletin.api';
import { formatTimeAgo } from '@/src/utils/date';
import { MemoCommentItem } from './CommentItem';
import { MemoPostStats } from './PostStats';

const MOCK_COMMENTS: TBulletinComment[] = [
  {
    id: '1',
    author: '나태원',
    avatar: AppImages.avatar,
    timeAgo: '1분전',
    content: '선생님이 잘 가르침',
    likes: 15,
    replies: [
      {
        id: '1-1',
        author: '제갈공명',
        avatar: AppImages.avatar,
        timeAgo: '1분전',
        content: '@나태원 선생님이 잘 가르침',
        likes: 15,
        isAuthor: true,
      },
    ],
  },
  {
    id: '2',
    author: '김유신',
    avatar: AppImages.avatar,
    timeAgo: '2분 전',
    content: '선생님이 잘 가르침',
    likes: 0,
  },
  {
    id: '3',
    author: '나태원',
    avatar: AppImages.avatar,
    timeAgo: '2분 전',
    content:
      '설악산 설악산의 가을빛은 눈을 뗄 수 없는 만큼 아름답습니다. 노랗게 물든 잎들은 시간이 이곳에서 속삭이고, 바람은 부드럽게 말들을 싣어 나릅...',
    likes: 15,
  },
];

const BulletinDetail: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'BulletinDetail'>>();
  const { postId } = route.params;

  const { data: post, isLoading } = useGetBulletinDetailQuery(postId);

  const [commentText, setCommentText] = React.useState('');

  //---------------------------------------
  const handleSend = React.useCallback(() => {
    if (!commentText.trim()) return;
    setCommentText('');
  }, [commentText]);

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

  const avatarSource = post.author.profileImage
    ? { uri: post.author.profileImage }
    : AppImages.avatar;

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
                {post.author.name}
              </AppText>
            </View>
          </View>

          {/* Post content */}
          <View style={styles.postContent}>
            {!!post.title && (
              <AppText variant="body2" color={AppColors.gray100}>
                {post.title}
              </AppText>
            )}

            <AppText variant="body8" color={AppColors.gray90}>
              {post.content}
            </AppText>

            {post.images.map((img) => (
              <Image
                key={img.id}
                source={{ uri: img.url }}
                style={styles.postImage}
                resizeMode="cover"
              />
            ))}

            <AppText variant="detail" color={AppColors.gray80}>
              {formatTimeAgo(post.createdAt)}
            </AppText>
          </View>

          {/* Post stats */}
          <View style={styles.statsRow}>
            <MemoPostStats
              likes={post.likesCount}
              comments={post.commentsCount}
              extra={
                <Pressable>
                  <AppText variant="pretendard" color={AppColors.gray100}>
                    댓글 남기기
                  </AppText>
                </Pressable>
              }
            />
          </View>

          {/* Comments (still mock for now) */}
          <View style={styles.commentsSection}>
            {MOCK_COMMENTS.map(comment => (
              <MemoCommentItem key={comment.id} comment={comment} />
            ))}
          </View>
        </ScrollView>

        {/* Comment input */}
        <SafeAreaView style={styles.safeAreaBottom} edges={['bottom']}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="댓글을 남겨보세요"
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
    width: '100%',
    height: ms(343),
    borderRadius: ms(8),
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
