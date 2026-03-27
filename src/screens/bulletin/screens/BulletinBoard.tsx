import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { AppColors } from '@/src/constants/colors';
import { IBulletinPost } from '@/src/interface/bulletin.interface';
import { RootStackParamList } from '@/src/interface/tab.interface';
import { useGetBulletinsQuery } from '@/src/store/api/bulletin.api';
import { MemoBulletinPostCard } from '../component/BulletinPostCard';
import { MemoBulletinHeader } from '../component/BulletinHeader';

const BulletinBoard: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [page, setPage] = React.useState(1);

  const { data, isLoading, isFetching, refetch } = useGetBulletinsQuery({
    page,
    limit: 10,
  });

  const posts = data?.data ?? [];

  const hasMore = page < (data?.meta?.totalPages ?? 0);

  //---------------------------------------
  const handleLoadMore = React.useCallback(() => {
    if (hasMore && !isFetching) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isFetching]);

  //---------------------------------------
  const renderItem = React.useCallback(
    ({ item }: { item: IBulletinPost }) => (
      <MemoBulletinPostCard
        post={item}
        onPress={() =>
          navigation.navigate('BulletinDetail', { postId: item.id })
        }
      />
    ),
    [navigation],
  );

  //---------------------------------------
  const keyExtractor = React.useCallback((item: IBulletinPost) => item.id, []);

  //---------------------------------------
  useFocusEffect(
    React.useCallback(() => {
      setPage(1);
      refetch();
    }, [refetch]),
  );

  //---------------------------------------
  const renderFooter = React.useCallback(() => {
    if (!isFetching || isLoading) {
      return null;
    }
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={AppColors.purple} />
      </View>
    );
  }, [isFetching, isLoading]);

  //---------------------------------------
  const renderEmpty = React.useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={AppColors.purple} />
        </View>
      );
    }
    return (
      <View style={styles.center}>
        <AppText variant="body8" color={AppColors.gray80}>
          게시글이 없습니다.
        </AppText>
      </View>
    );
  }, [isLoading]);

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <MemoBulletinHeader
        onPressAdd={() => navigation.navigate('CreateBulletin')}
      />

      <MemoScreenBody>
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={[
            styles.list,
            posts.length === 0 && styles.emptyList,
          ]}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          onRefresh={refetch}
          refreshing={isLoading}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      </MemoScreenBody>
    </AppSafeAreaView>
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
  emptyList: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: ms(40),
  },
  footer: {
    paddingVertical: ms(16),
    alignItems: 'center',
  },
});
