import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { CardShadow } from '@/src/constants/shadows';
import {
  ArrowLeft2,
  Element3,
  Fatrows,
  SearchNormal1,
} from '@/src/constants/icons';
import type { DataRoomStackParamList } from '@/src/interface/tab.interface';
import { IFile, useGetFilesByFolderQuery } from '@/src/store/api/dataRoom.api';
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
import { MemoUploadProgressBar } from '../components/UploadProgressBar';
import { useFileUploadWithProgress } from '../hooks/useFileUploadWithProgress';
import { useFilePicker } from '../hooks/useFilePicker';
import { useSheetManager } from '../hooks/useSheetManager';

type TNav = NativeStackNavigationProp<DataRoomStackParamList, 'DataRoomDetail'>;
type TRoute = RouteProp<DataRoomStackParamList, 'DataRoomDetail'>;

const DataDetailScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();
  const route = useRoute<TRoute>();
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector(state => state.dataRoom.viewMode);

  //---------------------------------------
  const { folderId, folderName, tabType } = route.params;
  const { data: files = [] } = useGetFilesByFolderQuery(folderId);
  const { pickAndUpload } = useFilePicker(folderId);
  const progress = useAppSelector(state => state.dataRoom.uploadProgress);
  const { cancelUpload } = useFileUploadWithProgress();

  //---------------------------------------
  const {
    selectedItem: selectedFile,
    actionSheetVisible,
    moveSheetVisible,
    renameSheetVisible,
    openActionSheet,
    closeActionSheet,
    closeMoveSheet,
    closeRenameSheet,
    handleAction: handleFileAction,
  } = useSheetManager<IFile>();

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
  const renderListItem = React.useCallback(
    ({ item }: { item: IFile }) => (
      <MemoFileListItem item={item} onPressMore={openActionSheet} />
    ),
    [openActionSheet],
  );

  //---------------------------------------
  const renderGridItem = React.useCallback(
    ({ item }: { item: IFile }) => (
      <MemoFileGridItem item={item} onPressMore={openActionSheet} />
    ),
    [openActionSheet],
  );

  //---------------------------------------
  const keyExtractor = React.useCallback((item: IFile) => item.id, []);

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

        {/* Upload Progress Bar */}
        {progress && (
          <View style={styles.progressOverlay}>
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
          onUploadFile={pickAndUpload}
          showCreateFolder={false}
        />
      </View>

      {/* File Action Sheet */}
      <MemoFileActionSheet
        visible={actionSheetVisible}
        onClose={closeActionSheet}
        fileName={selectedFile?.originalName || ''}
        onAction={handleFileAction}
      />

      {/* Move Sheet */}
      {selectedFile && (
        <MemoMoveFileSheet
          visible={moveSheetVisible}
          onClose={closeMoveSheet}
          fileId={selectedFile.id}
          currentFolderId={folderId}
          type={tabType}
        />
      )}

      {/* Rename Sheet */}
      {selectedFile && (
        <MemoRenameSheet
          visible={renameSheetVisible}
          onClose={closeRenameSheet}
          itemId={selectedFile.id}
          currentName={selectedFile.originalName}
          kind="file"
        />
      )}
    </AppSafeAreaView>
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
  progressOverlay: {
    position: 'absolute',
    bottom: ms(32),
    left: 0,
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
