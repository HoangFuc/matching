import React from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
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
import type { RootStackParamList } from '@/src/interface/tab.interface';
import { useGetStructureQuery } from '@/src/store/api/company.api';
import { MemoDepartmentSection } from '../components/DepartmentSection';
import { MemoDirectorsSection } from '../components/DirectorsSection';
import { MemoRenameOrgSheet } from '../components/RenameOrgSheet';
import { MOCK_STRUCTURE } from '../mockData';
import type { TStructure } from '../type';

type Props = NativeStackScreenProps<RootStackParamList, 'OrganizationChart'>;

//---------------------------------------
const hasAnyEditPermission = (structure: TStructure): boolean => {
  if (structure.canEdit) {
    return true;
  }
  for (const dept of structure.departments) {
    if (dept.canEdit) {
      return true;
    }
    for (const team of dept.teams) {
      if (team.canEdit) {
        return true;
      }
    }
  }
  return false;
};

//---------------------------------------
const OrganizationChartScreen: React.FC<Props> = ({ navigation }) => {
  const { data: apiStructure, refetch } = useGetStructureQuery();
  const insets = useSafeAreaInsets();
  const [isEditing, setIsEditing] = React.useState(false);
  const [renameVisible, setRenameVisible] = React.useState(false);
  const [createDeptVisible, setCreateDeptVisible] = React.useState(false);

  // Use API data if available, fallback to mock data
  const structure = apiStructure ?? MOCK_STRUCTURE;

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  //---------------------------------------
  const handleOpenRename = React.useCallback(() => {
    setRenameVisible(true);
  }, []);

  //---------------------------------------
  const handleCloseRename = React.useCallback(() => {
    setRenameVisible(false);
  }, []);

  //---------------------------------------
  const handleSaveRename = React.useCallback((newName: string) => {
    // TODO: send rename request to server
    console.log('Rename company to:', newName);
  }, []);

  //---------------------------------------
  const handleOpenCreateDept = React.useCallback(() => {
    setCreateDeptVisible(true);
  }, []);

  //---------------------------------------
  const handleCloseCreateDept = React.useCallback(() => {
    setCreateDeptVisible(false);
  }, []);

  //---------------------------------------
  const handleSaveCreateDept = React.useCallback((name: string) => {
    // TODO: send create department request to server
    console.log('Create department:', name);
  }, []);

  //---------------------------------------
  const handleToggleEdit = React.useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  //---------------------------------------
  const handlePressInvite = React.useCallback(() => {
    navigation.navigate('InviteMember', { hideStepBar: true });
  }, [navigation]);

  //---------------------------------------
  const handleCancelEdit = React.useCallback(() => {
    setIsEditing(false);
  }, []);

  //---------------------------------------
  const handlePressSave = React.useCallback(() => {
    // TODO: process body and send data to server
  }, []);

  //---------------------------------------
  const canEditAnything = hasAnyEditPermission(structure);

  //---------------------------------------
  const rightElement = React.useMemo(
    () =>
      isEditing ? null : (
        <View style={styles.headerRight}>
          {canEditAnything && (
            <Pressable hitSlop={8} onPress={handleToggleEdit}>
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
    [isEditing, canEditAnything, handleToggleEdit, handlePressInvite],
  );

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={AppColors.purple} />

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
                !(isEditing && structure.canEdit) && styles.hidden,
              ]}
              disabled={!(isEditing && structure.canEdit)}
              onPress={handleOpenCreateDept}
            />
          </View>

          {/* Directors */}
          {structure.directors.length > 0 && (
            <MemoDirectorsSection
              directors={structure.directors}
              totalMembers={structure.totalMembers}
              isEditing={isEditing}
              canEdit={structure.canEdit}
            />
          )}

          {/* Departments */}
          <View style={styles.departmentsContainer}>
            {structure.departments.map((dept, index) => (
              <MemoDepartmentSection
                key={dept.id}
                department={dept}
                isEditing={isEditing}
                canEditRoot={structure.canEdit}
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
              onPress={handleCancelEdit}
            />

            <MemoAppButton
              label="저장"
              variant="primary"
              textVariant="body6"
              textColor={AppColors.purple}
              onPress={handlePressSave}
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
  companyEditButton: {
    borderRadius: ms(8),
    padding: ms(6),
    backgroundColor: AppColors.gray10,
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
