import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ArrowLeft2, SearchNormal1 } from '@/src/constants/icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import type { DataRoomStackParamList } from '@/src/interface/tab.interface';
import {
  IFile,
  IFolder,
  useGetFoldersQuery,
} from '@/src/store/api/dataRoom.api';
import { MemoFABWithMenu } from '../components/FABWithMenu';
import { MemoFileGridItem } from '../components/file';
import type { TFolderAction } from '../components/folder';
import {
  MemoFolderActionSheet,
  MemoFolderCard,
  MemoMoveFolderSheet,
} from '../components/folder';
import { MemoNoData } from '../components/NoData';
import { MemoRenameSheet } from '../components/RenameSheet';
import {
  DATA_ROOM_TAB_LABEL,
  DATA_ROOM_TABS,
  type TDataRoomTabType,
} from '../constants';

type TNav = NativeStackNavigationProp<DataRoomStackParamList, 'DataRoomMain'>;

const DataRoomScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();
  const [activeTab, setActiveTab] =
    React.useState<TDataRoomTabType>('MARKET_PRICE');
  const { data } = useGetFoldersQuery(activeTab);
  const folders = data?.folders ?? [];
  const files = data?.files ?? [];

  // Sheet states
  const [actionSheetVisible, setActionSheetVisible] = React.useState(false);
  const [moveSheetVisible, setMoveSheetVisible] = React.useState(false);
  const [renameSheetVisible, setRenameSheetVisible] = React.useState(false);
  const [selectedFolder, setSelectedFolder] = React.useState<IFolder | null>(
    null,
  );

  const handlePressSearch = React.useCallback(() => {
    navigation.navigate('DataRoomSearch');
  }, [navigation]);

  const handlePressBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePressFolder = React.useCallback(
    (folder: IFolder) => {
      navigation.navigate('DataRoomDetail', {
        folderId: folder.id,
        folderName: folder.name,
      });
    },
    [navigation],
  );

  const handlePressMore = React.useCallback((folder: IFolder) => {
    setSelectedFolder(folder);
    setActionSheetVisible(true);
  }, []);

  const handleFolderAction = React.useCallback(
    (action: TFolderAction) => {
      if (!selectedFolder) {
        return;
      }
      switch (action) {
        case 'move':
          setMoveSheetVisible(true);
          break;
        case 'rename':
          setRenameSheetVisible(true);
          break;
        default:
          break;
      }
    },
    [selectedFolder],
  );

  //---------------------------------------
  const handlePressFileMore = React.useCallback((_file: IFile) => {
    // TODO: handle file action sheet
  }, []);

  //---------------------------------------
  const renderFolderItem = React.useCallback(
    ({ item }: { item: IFolder }) => {
      return (
        <MemoFolderCard
          folder={item}
          onPress={handlePressFolder}
          onPressMore={handlePressMore}
        />
      );
    },
    [handlePressFolder, handlePressMore],
  );

  //---------------------------------------
  const renderFileItem = React.useCallback(
    ({ item }: { item: IFile }) => {
      return <MemoFileGridItem item={item} onPressMore={handlePressFileMore} />;
    },
    [handlePressFileMore],
  );

  //---------------------------------------
  const keyExtractor = React.useCallback((item: IFolder) => item.id, []);
  const fileKeyExtractor = React.useCallback((item: IFile) => item.id, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable hitSlop={8} onPress={handlePressBack}>
          <ArrowLeft2
            size={`${ms(24)}`}
            color={AppColors.white}
            variant="Linear"
          />
        </Pressable>

        <AppText variant="heading3" color={AppColors.white}>
          자료실
        </AppText>

        <Pressable hitSlop={8} onPress={handlePressSearch}>
          <SearchNormal1
            size={`${ms(24)}`}
            color={AppColors.white}
            variant="Linear"
          />
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          {DATA_ROOM_TABS.map(tab => (
            <Pressable
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <AppText
                variant="body6"
                color={activeTab === tab ? AppColors.white : AppColors.gray80}
              >
                {DATA_ROOM_TAB_LABEL[tab]}
              </AppText>
            </Pressable>
          ))}
        </View>

        {/* Folder Grid */}
        <FlatList
          data={folders}
          renderItem={renderFolderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            files.length > 0 ? (
              <FlatList
                data={files}
                renderItem={renderFileItem}
                keyExtractor={fileKeyExtractor}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.fileListContent}
                scrollEnabled={false}
              />
            ) : null
          }
          ListEmptyComponent={
            files.length === 0 ? (
              <MemoNoData message="데이터가 없습니다" />
            ) : null
          }
        />

        {/* FAB + Menu */}
        <MemoFABWithMenu variant="white" />
      </View>

      {/* Folder Action Sheet */}
      <MemoFolderActionSheet
        visible={actionSheetVisible}
        onClose={() => setActionSheetVisible(false)}
        folderName={selectedFolder?.name || ''}
        onAction={handleFolderAction}
      />

      {/* Move Folder Sheet */}
      {selectedFolder && (
        <MemoMoveFolderSheet
          visible={moveSheetVisible}
          onClose={() => setMoveSheetVisible(false)}
          folderId={selectedFolder.id}
          currentType={selectedFolder.type}
        />
      )}

      {/* Rename Folder Sheet */}
      {selectedFolder && (
        <MemoRenameSheet
          visible={renameSheetVisible}
          onClose={() => setRenameSheetVisible(false)}
          itemId={selectedFolder.id}
          currentName={selectedFolder.name}
          kind="folder"
        />
      )}
    </SafeAreaView>
  );
};

export const MemoDataRoomScreen = React.memo(DataRoomScreen);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingBottom: ms(12),
    height: ms(49),
    backgroundColor: AppColors.purple,
  },
  content: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: ms(16),
    marginTop: ms(16),
    marginBottom: ms(12),
    gap: ms(10),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(10),
    borderRadius: ms(25),
    backgroundColor: AppColors.gray10,
  },
  tabActive: {
    backgroundColor: AppColors.purple,
  },
  listContent: {
    paddingTop: ms(4),
    paddingHorizontal: ms(16),
    paddingBottom: ms(80),
    gap: ms(12),
  },
  row: {
    gap: ms(12),
  },
  emptyList: {
    flex: 1,
  },
  fileListContent: {
    gap: ms(12),
  },
});
