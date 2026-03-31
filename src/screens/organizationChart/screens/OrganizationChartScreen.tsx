import React from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buildings, Edit2, SmsTracking } from 'iconsax-react-nativejs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { AppText } from '@/src/component/AppText';
import { MemoBottomButtonGroup } from '@/src/component/BottomButtonGroup';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import FullScreenLoading from '@/src/component/FullScreenLoading';
import { useUserRole } from '@/src/hooks/useUserRole';
import { ROLE_SLUGS } from '@/src/interface/auth.interface';
import type { RootStackParamList } from '@/src/interface/tab.interface';
import { MemoDepartmentSection } from '../components/DepartmentSection';
import { MemoDirectorsSection } from '../components/DirectorsSection';
import { MemoRenameOrgSheet } from '../components/RenameOrgSheet';
import { OrgEditContext } from '../context/OrgEditContext';
import { useOrgFormData } from '../hooks/useOrgFormData';

type Props = NativeStackScreenProps<RootStackParamList, 'OrganizationChart'>;

//---------------------------------------
const OrganizationChartScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const userRole = useUserRole();
  const [directorSlot, setDirectorSlot] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (userRole !== null) {
      setDirectorSlot(prev =>
        prev === null ? (userRole === ROLE_SLUGS.DIRECTOR_2 ? 2 : 1) : prev,
      );
    }
  }, [userRole]);

  const {
    structure,
    isLoading,
    isFetching,
    refetch,
    isEditing,
    hasChanges,
    canEditAnything,
    editActions,
    startEditing,
    cancelEdit,
    saveEdit,
  } = useOrgFormData(directorSlot);

  const [renameVisible, setRenameVisible] = React.useState(false);
  const [createDeptVisible, setCreateDeptVisible] = React.useState(false);

  //---------------------------------------
  const handleOpenRename = React.useCallback(() => {
    setRenameVisible(true);
  }, []);

  //---------------------------------------
  const handleCloseRename = React.useCallback(() => {
    setRenameVisible(false);
  }, []);

  //---------------------------------------
  const handleSaveRename = React.useCallback(
    (newName: string) => {
      editActions.renameCompany(newName);
    },
    [editActions],
  );

  //---------------------------------------
  const handleOpenCreateDept = React.useCallback(() => {
    setCreateDeptVisible(true);
  }, []);

  //---------------------------------------
  const handleCloseCreateDept = React.useCallback(() => {
    setCreateDeptVisible(false);
  }, []);

  //---------------------------------------
  const handleSaveCreateDept = React.useCallback(
    (name: string) => {
      const director = structure.directors[(directorSlot ?? 1) - 1];
      editActions.createDepartment(name, director?.memberId);
    },
    [editActions, structure.directors, directorSlot],
  );

  //---------------------------------------
  const handlePressDirector = React.useCallback(
    (slot: number) => {
      const isDirector2 = userRole === ROLE_SLUGS.DIRECTOR_2;

      if (isEditing && isDirector2) {
        return;
      }

      setDirectorSlot(slot);
    },
    [isEditing, userRole],
  );

  //---------------------------------------
  const handleStartEditing = React.useCallback(() => {
    const mySlotIndex = structure.directors.findIndex(d => d.isMe);
    if (mySlotIndex !== -1) {
      setDirectorSlot(mySlotIndex + 1);
    }
    startEditing();
  }, [structure.directors, startEditing]);

  //---------------------------------------
  const handlePressInvite = React.useCallback(() => {
    navigation.navigate('InviteMember', { hideStepBar: true });
  }, [navigation]);

  //---------------------------------------
  const rightElement = React.useMemo(
    () =>
      isEditing ? null : (
        <View style={styles.headerRight}>
          {canEditAnything && (
            <Pressable hitSlop={8} onPress={handleStartEditing}>
              <Edit2
                size={`${ms(20)}`}
                color={AppColors.white}
                variant="Linear"
              />
            </Pressable>
          )}

          <Pressable hitSlop={8} onPress={handlePressInvite}>
            <SmsTracking
              size={`${ms(20)}`}
              color={AppColors.white}
              variant="Linear"
            />
          </Pressable>
        </View>
      ),
    [isEditing, canEditAnything, handleStartEditing, handlePressInvite],
  );

  const isDirector = structure.directors.some(d => d.isMe);
  const canCreateDept = isEditing && (structure.canEdit || isDirector);
  const canSetDeptHead = structure.canEdit || isDirector;

  return (
    <OrgEditContext.Provider value={editActions}>
      <AppSafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={AppColors.purple}
        />

        <MemoScreenHeader
          title="조직도"
          rightElement={rightElement}
          hideBackButton={isEditing}
          onPressBack={() =>
            navigation.navigate('MainTabs', {
              screen: 'Home',
              params: { screen: 'Dashboard' },
            })
          }
        />

        <MemoScreenBody>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: ms(24) + insets.bottom },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              !isEditing ? (
                <RefreshControl
                  refreshing={isFetching && !isLoading}
                  onRefresh={refetch}
                  colors={[AppColors.purple]}
                  tintColor={AppColors.purple}
                />
              ) : undefined
            }
          >
            {/* Company Header */}
            <View style={styles.companyHeader}>
              <View style={styles.companyNameRow}>
                <Buildings
                  size={`${ms(20)}`}
                  color={AppColors.gray90}
                  variant="Linear"
                />

                <AppText variant="heading3" color={AppColors.gray90}>
                  {`${structure.companyName} (${structure.totalMembers}명)`}
                </AppText>

                {isEditing && structure.canEdit && (
                  <Pressable hitSlop={8} onPress={handleOpenRename}>
                    <Edit2
                      size={`${ms(20)}`}
                      color={AppColors.gray90}
                      variant="Linear"
                    />
                  </Pressable>
                )}
              </View>

              <MemoAppButton
                label="+ 부서 생성"
                variant="secondary"
                textVariant="body6"
                textColor={AppColors.purple}
                style={[
                  styles.addDepartmentButton,
                  !canCreateDept && styles.hidden,
                ]}
                disabled={!canCreateDept}
                onPress={handleOpenCreateDept}
              />
            </View>

            {/* Directors */}
            {structure.directors.length > 0 && (
              <MemoDirectorsSection
                directors={structure.directors}
                isEditing={isEditing}
                canEdit={structure.canEdit}
                selectedSlot={directorSlot ?? 1}
                onPressDirector={handlePressDirector}
              />
            )}

            {/* Departments */}
            <View style={styles.departmentsContainer}>
              {structure.departments.map((dept, index) => (
                <MemoDepartmentSection
                  key={dept.id}
                  department={dept}
                  allDepartments={structure.departments}
                  isEditing={isEditing}
                  canEditRoot={structure.canEdit}
                  canSetDeptHead={canSetDeptHead}
                  defaultExpanded={index < 2}
                />
              ))}
            </View>
          </ScrollView>

          {isEditing && (
            <MemoBottomButtonGroup>
              <MemoAppButton
                label="취소"
                variant="secondary"
                textVariant="body6"
                onPress={cancelEdit}
              />

              <MemoAppButton
                label="저장"
                variant="primary"
                textVariant="body6"
                disabled={!hasChanges}
                onPress={saveEdit}
              />
            </MemoBottomButtonGroup>
          )}
        </MemoScreenBody>

        <MemoRenameOrgSheet
          visible={renameVisible}
          onClose={handleCloseRename}
          currentName={structure.companyName}
          onSave={handleSaveRename}
        />

        <MemoRenameOrgSheet
          visible={createDeptVisible}
          onClose={handleCloseCreateDept}
          currentName=""
          onSave={handleSaveCreateDept}
          title="부서 생성"
          inputLabel="부서명"
          placeholder="조직명을 입력해 주세요"
        />
      </AppSafeAreaView>

      <FullScreenLoading visible={isLoading} />
    </OrgEditContext.Provider>
  );
};

export const MemoOrganizationChartScreen = React.memo(OrganizationChartScreen);

//---------------------------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(16),
  },
  scrollContent: {
    flexGrow: 1,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
    paddingBottom: ms(4),
  },
  companyNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  addDepartmentButton: {
    borderRadius: ms(100),
    paddingHorizontal: ms(12),
    paddingVertical: ms(4),
    backgroundColor: AppColors.lavendar,
  },
  hidden: {
    opacity: 0,
  },
  departmentsContainer: {
    paddingHorizontal: ms(16),
    gap: ms(16),
  },
});
