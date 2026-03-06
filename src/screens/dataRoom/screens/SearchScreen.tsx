import React from 'react';
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import {ArrowLeft2, SearchNormal1} from '@/src/constants/icons';
import {ms} from 'react-native-size-matters/extend';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import {AppText} from '@/src/component/AppText';
import {AppColors} from '@/src/constants/colors';
import {FontWeight} from '@/src/constants/typography';
import {
  FAKE_FILES,
  FAKE_FOLDERS,
  IFile,
  IFolder,
} from '@/src/store/api/dataRoom.api';
import {MemoFolderCard} from '../components/folder';

type TSearchResult = {
  type: 'folder' | 'file';
  item: IFolder | IFile;
};

const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const [keyword, setKeyword] = React.useState('');
  const inputRef = React.useRef<TextInput>(null);

  React.useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const results = React.useMemo<TSearchResult[]>(() => {
    if (!keyword.trim()) {
      return [];
    }
    const lower = keyword.toLowerCase();

    const folderResults: TSearchResult[] = FAKE_FOLDERS.filter(f =>
      f.name.toLowerCase().includes(lower),
    ).map(item => ({type: 'folder', item}));

    const fileResults: TSearchResult[] = FAKE_FILES.filter(f =>
      f.name.toLowerCase().includes(lower),
    ).map(item => ({type: 'file', item}));

    return [...folderResults, ...fileResults];
  }, [keyword]);

  const handleGoBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const renderItem = React.useCallback(
    ({item}: {item: TSearchResult}) => {
      if (item.type === 'folder') {
        const folder = item.item as IFolder;
        return <MemoFolderCard folder={folder} showMore={false} />;
      }
      return null;
    },
    [],
  );

  const keyExtractor = React.useCallback(
    (item: TSearchResult) =>
      item.type === 'folder'
        ? `folder-${(item.item as IFolder).id}`
        : `file-${(item.item as IFile).id}`,
    [],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
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
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    </SafeAreaView>
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
  emptyContainer: {
    alignItems: 'center',
    paddingTop: ms(60),
  },
});
