import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import { Edit2 } from '@/src/constants/icons';
import type { RootStackParamList } from '@/src/interface/tab.interface';
import { useGetUserProfileQuery } from '@/src/store/api/user.api';

import { MemoGeneralMenuSection } from '../components/GeneralMenuSection';
import { MemoPersonalInfoEditSection } from '../components/PersonalInfoEditSection';
import { MemoPersonalInfoSection } from '../components/PersonalInfoSection';
import { MemoProfileCard } from '../components/ProfileCard';
import { MemoSettingsMenuSection } from '../components/SettingsMenuSection';

//---------------------------------------
const MyPageScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { data: userProfile, refetch } = useGetUserProfileQuery();
  const [isEditing, setIsEditing] = React.useState(false);

  //---------------------------------------
  const handlePressEdit = React.useCallback(() => {
    setIsEditing(true);
  }, []);

  //---------------------------------------
  const handleCancelEdit = React.useCallback(() => {
    setIsEditing(false);
  }, []);

  //---------------------------------------
  const handleSaveEdit = React.useCallback(
    (_data: {
      name: string;
      phone: string;
      team: string;
      position: string;
    }) => {
      refetch();
      setIsEditing(false);
    },
    [refetch],
  );

  //---------------------------------------
  const handlePressOrgChart = React.useCallback(() => {
    navigation.navigate('OrganizationChart');
  }, [navigation]);

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <MemoScreenHeader title="마이 페이지" />

      <MemoScreenBody>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.personalCard}>
            <MemoProfileCard
              avatarUrl={userProfile?.avatarUrl}
              name={userProfile?.fullName ?? ''}
              companyName={userProfile?.company.name ?? ''}
              roleName={userProfile?.role.name ?? ''}
            />
          </View>

          <View style={{ gap: ms(8) }}>
            <View style={styles.header}>
              <AppText variant="body5" color={AppColors.gray90}>
                개인 정보
              </AppText>

              {!isEditing && (
                <Pressable
                  hitSlop={8}
                  onPress={handlePressEdit}
                  style={styles.editIcon}
                >
                  <Edit2
                    size={`${ms(20)}`}
                    color={AppColors.gray90}
                    variant="Linear"
                  />
                </Pressable>
              )}
            </View>

            <MemoBaseCard>
              {isEditing ? (
                <MemoPersonalInfoEditSection
                  name={userProfile?.fullName ?? ''}
                  phone={userProfile?.phone ?? ''}
                  team={userProfile?.team?.name ?? ''}
                  position={userProfile?.department?.name ?? ''}
                  onCancel={handleCancelEdit}
                  onSave={handleSaveEdit}
                />
              ) : (
                <MemoPersonalInfoSection
                  name={userProfile?.fullName ?? ''}
                  phone={userProfile?.phone ?? ''}
                  team={userProfile?.team?.name ?? ''}
                  position={userProfile?.department?.name ?? ''}
                  onPressEdit={handlePressEdit}
                />
              )}
            </MemoBaseCard>
          </View>

          <MemoGeneralMenuSection onPressOrgChart={handlePressOrgChart} />

          <MemoSettingsMenuSection />

          <Pressable style={styles.withdrawButton}>
            <AppText variant="body3" color={AppColors.negative}>
              회원 탈퇴
            </AppText>
          </Pressable>
        </ScrollView>
      </MemoScreenBody>
    </AppSafeAreaView>
  );
};

export const MemoMyPageScreen = React.memo(MyPageScreen);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: ms(16),
    paddingBottom: ms(40),
    gap: ms(12),
  },
  personalCard: {
    gap: ms(16),
  },
  withdrawButton: {
    alignItems: 'center',
    paddingVertical: ms(8),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editIcon: {
    backgroundColor: AppColors.gray20,
    padding: ms(4),
    borderRadius: ms(8),
  },
});
