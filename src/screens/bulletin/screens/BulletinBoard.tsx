import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { MemoScreenBody } from '@/src/component/ScreenBody';
import { AppColors } from '@/src/constants/colors';
import { AppImages } from '@/src/constants/images';
import { TBulletinPost } from '@/src/interface/bulletin.interface';
import { RootStackParamList } from '@/src/interface/tab.interface';
import { MemoBulletinPostCard } from '../component/BulletinPostCard';
import { MemoBulletinHeader } from '../component/BulletinHeader';

const MOCK_POSTS: TBulletinPost[] = [
  {
    id: '1',
    author: '제갈공명',
    avatar: AppImages.avatar,
    timeAgo: '2분 전',
    title: '이번 주말, 설악산으로 단풍 구경 떠나요!',
    content:
      '이번 주말, 설악산으로 단풍 구경 떠나요! 사진 명소도 공유해 드릴게요. 함께 아름다운 추억 만들어요!',
    images: [AppImages.news],
    likes: 15,
    comments: 4,
  },
  {
    id: '2',
    author: '강감찬',
    avatar: AppImages.avatar,
    timeAgo: '2분 전',
    title: '',
    content:
      "오늘 점심시간, 회사 앞 '보름달' 식당에서 김치찌개 먹을 사람! 선착순 5명!",
    images: [AppImages.news],
    likes: 15,
    comments: 4,
  },
  {
    id: '3',
    author: '을지문덕',
    avatar: AppImages.avatar,
    timeAgo: '2분 전',
    title: '',
    content:
      '주말에 가볍게 앞산 등산 어때요? 등산 후에 맛있는 막걸리도 한잔하면 최고! 등산 메이트 구합니다!',
    images: [AppImages.news],
    likes: 15,
    comments: 4,
  },
  {
    id: '4',
    author: '김유신',
    avatar: AppImages.avatar,
    timeAgo: '2분 전',
    title: '',
    content:
      '이번 주말, 청량산으로 등산 갈 사람! 정상에서 컵라면 먹으면 진짜 꿀맛! 같이 땀 흘리고 맛있는 거 먹어요!',
    likes: 15,
    comments: 4,
  },
];

const BulletinBoard: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const renderItem = React.useCallback(
    ({ item }: { item: TBulletinPost }) => (
      <MemoBulletinPostCard
        post={item}
        onPress={() => navigation.navigate('BulletinDetail', { post: item })}
      />
    ),
    [navigation],
  );

  const keyExtractor = React.useCallback((item: TBulletinPost) => item.id, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MemoBulletinHeader onPressAdd={() => navigation.navigate('CreateBulletin')} />

      <MemoScreenBody>
        <FlatList
          data={MOCK_POSTS}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </MemoScreenBody>
    </SafeAreaView>
  );
};

export const MemoBulletinBoard = React.memo(BulletinBoard);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
  list: {
    padding: ms(16),
    gap: ms(12),
  },
});
