import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import {
  ArrowLeft2,
  Element3,
  Fatrows,
  SearchNormal1,
} from '@/src/constants/icons';
import type { DataRoomStackParamList } from '@/src/interface/tab.interface';
import {
  IFile,
  useGetFilesByFolderQuery,
  useUploadFileMutation,
} from '@/src/store/api/dataRoom.api';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { toggleViewMode } from '@/src/store/slices/dataRoomSlice';
import { MemoFABWithMenu } from '../components/FABWithMenu';
import {
  MemoFileActionSheet,
  MemoFileGridItem,
  MemoFileListItem,
  MemoMoveFileSheet,
} from '../components/file';
import { MemoNoData } from '../components/NoData';
import { MemoRenameSheet } from '../components/RenameSheet';

type TNav = NativeStackNavigationProp<DataRoomStackParamList, 'DataRoomDetail'>;
type TRoute = RouteProp<DataRoomStackParamList, 'DataRoomDetail'>;

const DataDetailScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();
  const route = useRoute<TRoute>();
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector(state => state.dataRoom.viewMode);

  //---------------------------------------
  const { folderId, folderName } = route.params;
  const { data: files = [] } = useGetFilesByFolderQuery(folderId);
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  //---------------------------------------
  const [actionSheetVisible, setActionSheetVisible] = React.useState(false);
  const [moveSheetVisible, setMoveSheetVisible] = React.useState(false);
  const [renameSheetVisible, setRenameSheetVisible] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<IFile | null>(null);

  //---------------------------------------
  const handlePressBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  //---------------------------------------
  const handlePressSearch = React.useCallback(() => {
    navigation.navigate('DataRoomSearch');
  }, [navigation]);

  //---------------------------------------
  const handleToggleView = React.useCallback(() => {
    dispatch(toggleViewMode());
  }, [dispatch]);

  //---------------------------------------
  const handleUploadFile = React.useCallback(async () => {
    try {
      const result = await pick({
        type: [types.allFiles],
        allowMultiSelection: true,
      });

      const pickedFiles = result.map(file => ({
        uri: file.uri,
        name: file.name ?? 'file',
        type: file.type ?? 'application/octet-stream',
      }));

      await uploadFile({ folderId, files: pickedFiles }).unwrap();
    } catch (err) {
      if (isErrorWithCode(err) && err.code !== errorCodes.OPERATION_CANCELED) {
        console.error('Upload error:', err);
      }
    }
  }, [folderId, uploadFile]);

  //---------------------------------------
  const handlePressMore = React.useCallback((file: IFile) => {
    setSelectedFile(file);
    setActionSheetVisible(true);
  }, []);

  //---------------------------------------
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

  //---------------------------------------
  const renderListItem = React.useCallback(
    ({ item }: { item: IFile }) => (
      <MemoFileListItem item={item} onPressMore={handlePressMore} />
    ),
    [handlePressMore],
  );

  //---------------------------------------
  const renderGridItem = React.useCallback(
    ({ item }: { item: IFile }) => (
      <MemoFileGridItem item={item} onPressMore={handlePressMore} />
    ),
    [handlePressMore],
  );

  //---------------------------------------
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
        <MemoFABWithMenu
          variant="white"
          onUploadFile={handleUploadFile}
          showCreateFolder={false}
        />
      </View>

      {/* File Action Sheet */}
      <MemoFileActionSheet
        visible={actionSheetVisible}
        onClose={() => setActionSheetVisible(false)}
        fileName={selectedFile?.originalName || ''}
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

      {/* Loading Overlay */}
      {isUploading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={AppColors.purple} />
          <AppText
            variant="body1"
            color={AppColors.gray100}
            style={styles.loadingText}
          >
            파일 업로드 중...
          </AppText>
        </View>
      )}

      {/* Rename Sheet */}
      {selectedFile && (
        <MemoRenameSheet
          visible={renameSheetVisible}
          onClose={() => setRenameSheetVisible(false)}
          itemId={selectedFile.id}
          currentName={selectedFile.originalName}
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: ms(12),
  },
});
