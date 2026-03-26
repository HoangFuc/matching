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
import { MOCK_STRUCTURE } from '../mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'OrganizationChart'>;

//---------------------------------------
const OrganizationChartScreen: React.FC<Props> = ({ navigation }) => {
  // const { data: apiStructure, refetch } = useGetStructureQuery();
  const [isEditing, setIsEditing] = React.useState(false);

  // Use API data if available, fallback to mock data
  // const structure = apiStructure ?? MOCK_STRUCTURE;
  const structure = MOCK_STRUCTURE;

  //---------------------------------------
  // useFocusEffect(
  //   React.useCallback(() => {
  //     refetch();
  //   }, [refetch]),
  // );

  //---------------------------------------
  const handleToggleEdit = React.useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  //---------------------------------------
  const handlePressInvite = React.useCallback(() => {
    navigation.navigate('InviteMember', { hideStepBar: true });
  }, [navigation]);

  //---------------------------------------
  const handlePressShare = React.useCallback(() => {
    // TODO: implement share
  }, []);

  //---------------------------------------
  const rightElement = React.useMemo(
    () =>
      isEditing ? null : (
        <View style={styles.headerRight}>
          <Pressable hitSlop={8} onPress={handleToggleEdit}>
            <Edit2
              size={`${ms(22)}`}
              color={AppColors.white}
              variant="Linear"
            />
          </Pressable>

          <Pressable hitSlop={8} onPress={handlePressInvite}>
            <SmsTracking
              size={`${ms(22)}`}
              color={AppColors.white}
              variant="Linear"
            />
          </Pressable>
        </View>
      ),
    [isEditing, handleToggleEdit, handlePressInvite],
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
          contentContainerStyle={styles.scrollContent}
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
            </View>

            {isEditing && (
              <MemoAppButton
                label="+ 부서 생성"
                variant="secondary"
                textVariant="body6"
                textColor={AppColors.purple}
                style={styles.addDepartmentButton}
                onPress={() => {}}
              />
            )}
          </View>

          {/* Directors */}
          {structure.directors.length > 0 && (
            <MemoDirectorsSection directors={structure.directors} />
          )}

          {/* Departments */}
          <View style={styles.departmentsContainer}>
            {structure.departments.map((dept, index) => (
              <MemoDepartmentSection
                key={dept.id}
                department={dept}
                isEditing={isEditing}
                defaultExpanded={index < 2}
              />
            ))}
          </View>
        </ScrollView>

        {isEditing && (
          <MemoBottomButtonGroup>
            <MemoAppButton
              label="공유하기"
              variant="primary"
              textVariant="body6"
              onPress={handlePressShare}
            />
          </MemoBottomButtonGroup>
        )}
      </MemoScreenBody>
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
    paddingBottom: ms(24),
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
  departmentsContainer: {
    paddingHorizontal: ms(16),
    gap: ms(16),
  },
});
