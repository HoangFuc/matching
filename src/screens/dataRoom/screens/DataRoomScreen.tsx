import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ArrowLeft2, SearchNormal1 } from '@/src/constants/icons';
import { ms } from 'react-native-size-matters/extend';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import type { DataRoomStackParamList } from '@/src/interface/tab.interface';
import { FAKE_FOLDERS, IFolder } from '@/src/store/api/dataRoom.api';
import { MemoFABWithMenu } from '../components/FABWithMenu';
import { MemoFolderCard, MemoFolderActionSheet, MemoMoveFolderSheet } from '../components/folder';
import type { TFolderAction } from '../components/folder';
import { MemoRenameSheet } from '../components/RenameSheet';
import { MemoNoData } from '../components/NoData';

type TNav = NativeStackNavigationProp<DataRoomStackParamList, 'DataRoomMain'>;
type TTabType = '시세 자료' | '분양자료';

const TABS: TTabType[] = ['시세 자료', '분양자료'];

const DataRoomScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();
  const [activeTab, setActiveTab] = React.useState<TTabType>('시세 자료');

  // Sheet states
  const [actionSheetVisible, setActionSheetVisible] = React.useState(false);
  const [moveSheetVisible, setMoveSheetVisible] = React.useState(false);
  const [renameSheetVisible, setRenameSheetVisible] = React.useState(false);
  const [selectedFolder, setSelectedFolder] = React.useState<IFolder | null>(null);

  const filteredFolders = React.useMemo(
    () => FAKE_FOLDERS.filter(f => f.type === activeTab),
    [activeTab],
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

  const keyExtractor = React.useCallback((item: IFolder) => item.id, []);

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
          {TABS.map(tab => (
            <Pressable
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <AppText
                variant="body6"
                color={activeTab === tab ? AppColors.white : AppColors.gray80}
              >
                {tab}
              </AppText>
            </Pressable>
          ))}
        </View>

        {/* Folder Grid */}
        <FlatList
          data={filteredFolders}
          renderItem={renderFolderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[
            styles.listContent,
            filteredFolders.length === 0 && styles.emptyList,
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<MemoNoData message="폴더가 없습니다" />}
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
});
