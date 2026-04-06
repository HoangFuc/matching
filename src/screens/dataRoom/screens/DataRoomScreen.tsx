import React from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { ArrowLeft2, SearchNormal1 } from '@/src/constants/icons';
import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { CardShadow } from '@/src/constants/shadows';
import type { DataRoomStackParamList } from '@/src/interface/tab.interface';
import {
  IFile,
  IFolder,
  useGetFoldersQuery,
} from '@/src/store/api/dataRoom.api';
import { useAppSelector } from '@/src/store/hooks';
import { MemoFABWithMenu } from '../components/FABWithMenu';
import { MemoFileGridItem } from '../components/file';
import {
  MemoFolderActionSheet,
  MemoFolderCard,
  MemoFolderInfoSheet,
  MemoMoveFolderSheet,
} from '../components/folder';
import { MemoNoData } from '../components/NoData';
import { MemoRenameSheet } from '../components/RenameSheet';
import { MemoUploadProgressBar } from '../components/UploadProgressBar';
import {
  DATA_ROOM_TAB_LABEL,
  DATA_ROOM_TABS,
  type TDataRoomTabType,
} from '../constants';
import { useFileUploadWithProgress } from '../hooks/useFileUploadWithProgress';
import { useShareItem } from '../hooks/useShareItem';
import { useSheetManager } from '../hooks/useSheetManager';

type TGridItem =
  | { type: 'folder'; data: IFolder }
  | { type: 'file'; data: IFile };

type TNav = NativeStackNavigationProp<DataRoomStackParamList, 'DataRoomMain'>;

const DataRoomScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();
  const { bottom } = useSafeAreaInsets();
  const [activeTab, setActiveTab] =
    React.useState<TDataRoomTabType>('MARKET_PRICE');
  const { data, isFetching, refetch } = useGetFoldersQuery(activeTab);
  //---------------------------------------
  const gridItems = React.useMemo<TGridItem[]>(() => {
    const folders: IFolder[] = data?.folders ?? [];
    const files: IFile[] = data?.files ?? [];
    const items: TGridItem[] = folders.map(f => ({ type: 'folder', data: f }));
    files.forEach(f => items.push({ type: 'file', data: f }));
    return items;
  }, [data]);

  //---------------------------------------
  const { shareFolder } = useShareItem();

  //---------------------------------------
  const handleShareFolder = React.useCallback(
    (folder: IFolder) => {
      shareFolder(folder.name);
    },
    [shareFolder],
  );

  //---------------------------------------
  const {
    selectedItem: selectedFolder,
    actionSheetVisible,
    moveSheetVisible,
    renameSheetVisible,
    infoSheetVisible,
    openActionSheet: handlePressMore,
    closeActionSheet,
    closeMoveSheet,
    closeRenameSheet,
    closeInfoSheet,
    handleAction: handleFolderAction,
  } = useSheetManager<IFolder>({ onShare: handleShareFolder });

  //---------------------------------------
  const handlePressSearch = React.useCallback(() => {
    navigation.navigate('DataRoomSearch');
  }, [navigation]);

  //---------------------------------------
  const handlePressBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  //---------------------------------------
  const handlePressFolder = React.useCallback(
    (folder: IFolder) => {
      navigation.navigate('DataRoomDetail', {
        folderId: folder.id,
        folderName: folder.name,
        tabType: activeTab,
      });
    },
    [navigation, activeTab],
  );

  //---------------------------------------
  const { upload, cancelUpload } = useFileUploadWithProgress();
  const progress = useAppSelector(state => state.dataRoom.uploadProgress);
  const isPickingRef = React.useRef(false);

  //---------------------------------------
  const handleUploadFile = React.useCallback(async () => {
    if (isPickingRef.current) return;
    isPickingRef.current = true;

    try {
      const result = await pick({
        type: [types.allFiles],
        allowMultiSelection: false,
      });

      const file = result[0];

      if (!file) return;

      await upload(
        [
          {
            uri: file.uri,
            name: file.name ?? 'unknown',
            type: file.type ?? 'application/octet-stream',
          },
        ],
        activeTab,
      );
    } catch (err) {
      if (isErrorWithCode(err) && err.code !== errorCodes.OPERATION_CANCELED) {
        console.error('DocumentPicker error:', err);
      }
    } finally {
      isPickingRef.current = false;
    }
  }, [upload, activeTab]);

  //---------------------------------------
  const handlePressFileMore = React.useCallback((_file: IFile) => {
    // TODO: handle file action sheet
  }, []);

  //---------------------------------------
  const handlePressFile = React.useCallback(
    (file: IFile) => {
      navigation.navigate('DataRoomFileViewer', {
        fileName: file.originalName,
        downloadUrl: file.downloadUrl,
        mimeType: file.mimeType,
      });
    },
    [navigation],
  );

  //---------------------------------------
  const renderGridItem = React.useCallback(
    ({ item }: { item: TGridItem }) => {
      if (item.type === 'folder') {
        return (
          <MemoFolderCard
            folder={item.data}
            onPress={handlePressFolder}
            onPressMore={handlePressMore}
          />
        );
      }
      return (
        <MemoFileGridItem item={item.data} onPressMore={handlePressFileMore} onPress={handlePressFile} />
      );
    },
    [handlePressFolder, handlePressMore, handlePressFileMore, handlePressFile],
  );

  //---------------------------------------
  const gridKeyExtractor = React.useCallback(
    (item: TGridItem) => `${item.type}-${item.data.id}`,
    [],
  );

  return (
    <AppSafeAreaView style={styles.safeArea}>
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

        {/* Folder & File Grid */}
        <FlatList
          data={gridItems}
          renderItem={renderGridItem}
          keyExtractor={gridKeyExtractor}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              colors={[AppColors.purple]}
              tintColor={AppColors.purple}
            />
          }
          ListEmptyComponent={<MemoNoData message="데이터가 없습니다" />}
        />

        {/* Upload Progress */}
        {progress && (
          <View style={[styles.progressOverlay, { bottom: ms(32) + bottom }]}>
            <MemoUploadProgressBar
              progress={progress}
              onCancel={cancelUpload}
              containerStyle={styles.progressBar}
            />
          </View>
        )}

        {/* FAB + Menu */}
        <MemoFABWithMenu
          variant="white"
          onUploadFile={handleUploadFile}
          activeTab={activeTab}
        />
      </View>

      {/* Folder Action Sheet */}
      <MemoFolderActionSheet
        visible={actionSheetVisible}
        onClose={closeActionSheet}
        folderName={selectedFolder?.name || ''}
        onAction={handleFolderAction}
      />

      {/* Move Folder Sheet */}
      {selectedFolder && (
        <MemoMoveFolderSheet
          visible={moveSheetVisible}
          onClose={closeMoveSheet}
          folderId={selectedFolder.id}
          currentType={selectedFolder.type}
        />
      )}

      {/* Rename Folder Sheet */}
      {selectedFolder && (
        <MemoRenameSheet
          visible={renameSheetVisible}
          onClose={closeRenameSheet}
          itemId={selectedFolder.id}
          currentName={selectedFolder.name}
          kind="folder"
        />
      )}

      {/* Folder Info Sheet */}
      <MemoFolderInfoSheet
        visible={infoSheetVisible}
        onClose={closeInfoSheet}
        folder={selectedFolder}
      />
    </AppSafeAreaView>
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
  progressOverlay: {
    position: 'absolute',
    left: ms(16),
    right: ms(82),
    zIndex: 10,
  },
  progressBar: {
    borderRadius: ms(100),
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.gray20,
    paddingVertical: ms(8),
    paddingHorizontal: ms(16),
    ...CardShadow,
  },
});
