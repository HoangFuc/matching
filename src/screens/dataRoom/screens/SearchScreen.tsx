import React from 'react';
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ArrowLeft2, SearchNormal1 } from '@/src/constants/icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { FontWeight } from '@/src/constants/typography';
import type { DataRoomStackParamList } from '@/src/interface/tab.interface';
import { IFile, IFolder, useSearchQuery } from '@/src/store/api/dataRoom.api';
import { MemoFolderCard } from '../components/folder';

type TSearchResult = {
  type: 'folder' | 'file';
  item: IFolder | IFile;
};

type TNav = NativeStackNavigationProp<DataRoomStackParamList, 'DataRoomSearch'>;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();
  const [keyword, setKeyword] = React.useState('');
  const inputRef = React.useRef<TextInput>(null);
  const { data: dataSearch } = useSearchQuery(keyword.trim(), {
    skip: !keyword.trim(),
  });

  //---------------------------------------
  const results = React.useMemo<TSearchResult[]>(() => {
    if (!keyword.trim() || !dataSearch) {
      return [];
    }

    const folderResults: TSearchResult[] = dataSearch.folders.map(item => ({
      type: 'folder',
      item,
    }));

    const fileResults: TSearchResult[] = dataSearch.files.map(item => ({
      type: 'file',
      item,
    }));

    return [...folderResults, ...fileResults];
  }, [keyword, dataSearch]);

  //---------------------------------------
  const handleGoBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  //---------------------------------------
  const handlePressFolder = React.useCallback(
    (folder: IFolder) => {
      navigation.navigate('DataRoomDetail', {
        folderId: folder.id,
        folderName: folder.name,
        tabType: folder.type,
      });
    },
    [navigation],
  );

  //---------------------------------------
  const renderItem = React.useCallback(
    ({ item }: { item: TSearchResult }) => {
      if (item.type === 'folder') {
        const folder = item.item as IFolder;
        return (
          <MemoFolderCard
            folder={folder}
            showMore={false}
            onPress={handlePressFolder}
          />
        );
      }
      return null;
    },
    [handlePressFolder],
  );

  //---------------------------------------
  const keyExtractor = React.useCallback(
    (item: TSearchResult) =>
      item.type === 'folder'
        ? `folder-${(item.item as IFolder).id}`
        : `file-${(item.item as IFile).id}`,
    [],
  );

  //---------------------------------------
  React.useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={AppColors.white} barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <Pressable hitSlop={8} onPress={handleGoBack}>
          <ArrowLeft2
            size={`${ms(24)}`}
            color={AppColors.gray80}
            variant="Linear"
          />
        </Pressable>

        <View style={styles.searchInputWrapper}>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="OO 분양"
            placeholderTextColor={AppColors.gray40}
            value={keyword}
            onChangeText={setKeyword}
            returnKeyType="search"
          />
          <SearchNormal1
            size={`${ms(18)}`}
            color={AppColors.gray50}
            variant="Linear"
          />
        </View>
      </View>

      {/* Results */}
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        ListEmptyComponent={
          keyword.trim() ? (
            <View style={styles.emptyContainer}>
              <AppText variant="body7" color={AppColors.gray50}>
                검색 결과가 없습니다
              </AppText>
            </View>
          ) : null
        }
      />
    </AppSafeAreaView>
  );
};

export const MemoSearchScreen = React.memo(SearchScreen);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(16),
    paddingVertical: ms(10),
    gap: ms(10),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray20,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.gray10,
    borderRadius: ms(8),
    paddingHorizontal: ms(12),
    height: ms(36),
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: FontWeight.regular,
    color: AppColors.gray100,
    paddingVertical: 0,
  },
  listContent: {
    padding: ms(16),
    gap: ms(12),
  },
  row: {
    gap: ms(12),
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: ms(60),
  },
});
