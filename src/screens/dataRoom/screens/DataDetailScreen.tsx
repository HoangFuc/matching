import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

import {
  ArrowLeft2,
  Element3,
  SearchNormal1,
} from '@/src/constants/icons';
import { ms } from 'react-native-size-matters/extend';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import type { DataRoomStackParamList } from '@/src/interface/tab.interface';
import { useGetFilesByFolderQuery, IFile } from '@/src/store/api/dataRoom.api';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { toggleViewMode } from '@/src/store/slices/dataRoomSlice';
import { MemoFileActionSheet, MemoMoveFileSheet, MemoFileListItem, MemoFileGridItem } from '../components/file';
import { MemoRenameSheet } from '../components/RenameSheet';
import { MemoFABWithMenu } from '../components/FABWithMenu';
import { MemoNoData } from '../components/NoData';
import { Fatrows } from 'iconsax-react-nativejs';

type TNav = NativeStackNavigationProp<DataRoomStackParamList, 'DataRoomDetail'>;
type TRoute = RouteProp<DataRoomStackParamList, 'DataRoomDetail'>;

const DataDetailScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();
  const route = useRoute<TRoute>();
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector(state => state.dataRoom.viewMode);

  const { folderId, folderName } = route.params;
  const { data: files = [] } = useGetFilesByFolderQuery(folderId);

  // Sheet states
  const [actionSheetVisible, setActionSheetVisible] = React.useState(false);
  const [moveSheetVisible, setMoveSheetVisible] = React.useState(false);
  const [renameSheetVisible, setRenameSheetVisible] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<IFile | null>(null);

  const handlePressBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePressSearch = React.useCallback(() => {
    navigation.navigate('DataRoomSearch');
  }, [navigation]);

  const handleToggleView = React.useCallback(() => {
    dispatch(toggleViewMode());
  }, [dispatch]);

  const handleUploadFile = React.useCallback(async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });
      // TODO: upload files to server
      console.log('Selected files:', result);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('DocumentPicker error:', err);
      }
    }
  }, []);

  const handlePressMore = React.useCallback((file: IFile) => {
    setSelectedFile(file);
    setActionSheetVisible(true);
  }, []);

  const handleFileAction = React.useCallback(
    (action: 'share' | 'move' | 'rename' | 'info') => {
      if (!selectedFile) {
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
    [selectedFile],
  );

  const renderListItem = React.useCallback(
    ({ item }: { item: IFile }) => (
      <MemoFileListItem item={item} onPressMore={handlePressMore} />
    ),
    [handlePressMore],
  );

  const renderGridItem = React.useCallback(
    ({ item }: { item: IFile }) => (
      <MemoFileGridItem item={item} onPressMore={handlePressMore} />
    ),
    [handlePressMore],
  );

  const keyExtractor = React.useCallback((item: IFile) => item.id, []);

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

        <AppText
          variant="heading3"
          color={AppColors.white}
          numberOfLines={1}
          style={styles.headerTitle}
        >
          {folderName}
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
        {/* Folder name + view toggle */}
        <View style={styles.subHeader}>
          <AppText variant="body1" color={AppColors.gray100}>
            {folderName}
          </AppText>
          <Pressable hitSlop={8} onPress={handleToggleView}>
            {viewMode === 'list' ? (
              <Element3
                size={`${ms(20)}`}
                color={AppColors.gray100}
                variant="Linear"
              />
            ) : (
              <Fatrows
                size={`${ms(20)}`}
                color={AppColors.gray100}
                variant="Linear"
              />
            )}
          </Pressable>
        </View>

        {/* File list/grid */}
        {viewMode === 'list' ? (
          <FlatList
            key="list"
            data={files}
            renderItem={renderListItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={[
              styles.listContent,
              files.length === 0 && styles.emptyList,
            ]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<MemoNoData message="파일이 없습니다" />}
          />
        ) : (
          <FlatList
            key="grid"
            data={files}
            renderItem={renderGridItem}
            keyExtractor={keyExtractor}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={[
              styles.listContent,
              files.length === 0 && styles.emptyList,
            ]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<MemoNoData message="파일이 없습니다" />}
          />
        )}

        {/* FAB + Menu */}
        <MemoFABWithMenu variant="white" onUploadFile={handleUploadFile} showCreateFolder={false} />
      </View>

      {/* File Action Sheet */}
      <MemoFileActionSheet
        visible={actionSheetVisible}
        onClose={() => setActionSheetVisible(false)}
        fileName={selectedFile?.name || ''}
        onAction={handleFileAction}
      />

      {/* Move Sheet */}
      {selectedFile && (
        <MemoMoveFileSheet
          visible={moveSheetVisible}
          onClose={() => setMoveSheetVisible(false)}
          fileId={selectedFile.id}
          currentFolderId={folderId}
        />
      )}

      {/* Rename Sheet */}
      {selectedFile && (
        <MemoRenameSheet
          visible={renameSheetVisible}
          onClose={() => setRenameSheetVisible(false)}
          itemId={selectedFile.id}
          currentName={selectedFile.name}
          kind="file"
        />
      )}

    </SafeAreaView>
  );
};

export const MemoDataDetailScreen = React.memo(DataDetailScreen);

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
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: ms(8),
  },
  content: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
    paddingBottom: ms(12),
  },
  listContent: {
    paddingHorizontal: ms(16),
    paddingBottom: ms(80),
  },
  gridRow: {
    gap: ms(12),
  },
  emptyList: {
    flex: 1,
  },
});
