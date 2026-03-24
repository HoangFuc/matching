import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { AppText } from '@/src/component/AppText';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import {
  Buildings,
  Cup,
  Element3,
  LoginCurve,
  Notification,
  InfoCircle,
  Document,
} from '@/src/constants/icons';
import {
  getUserInfo,
  getCompanyInfo,
} from '@/src/services/tokenService';
import type { RootStackParamList } from '@/src/interface/tab.interface';

import { MemoProfileCard } from '../components/ProfileCard';
import { MemoPersonalInfoSection } from '../components/PersonalInfoSection';
import { MemoMenuItem } from '../components/MenuItem';

const APP_VERSION = '1.0.0';

//---------------------------------------
const MyPageScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [userInfo, setUserInfo] = React.useState<any>(null);
  const [companyInfo, setCompanyInfo] = React.useState<any>(null);

  //---------------------------------------
  React.useEffect(() => {
    const loadData = async () => {
      const user = await getUserInfo();
      const company = await getCompanyInfo();
      setUserInfo(user);
      setCompanyInfo(company);
    };
    loadData();
  }, []);

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
          <MemoProfileCard
            avatarUrl={userInfo?.avatarUrl}
            name={userInfo?.fullName ?? ''}
            companyName={companyInfo?.companyName ?? ''}
            roleName={userInfo?.roleName ?? ''}
          />

          <MemoPersonalInfoSection
            name={userInfo?.fullName ?? ''}
            phone={userInfo?.phone ?? ''}
            team={userInfo?.teamName ?? ''}
            position={userInfo?.positionName ?? ''}
          />

          <View style={styles.menuSection}>
            <MemoMenuItem
              icon={
                <Buildings
                  size={`${ms(20)}`}
                  color={AppColors.gray70}
                  variant="Linear"
                />
              }
              label="앱 조직도"
              onPress={handlePressOrgChart}
            />
            <MemoMenuItem
              icon={
                <Cup
                  size={`${ms(20)}`}
                  color={AppColors.gray70}
                  variant="Linear"
                />
              }
              label="팀 미션"
            />
          </View>

          <View style={styles.menuSection}>
            <MemoMenuItem
              icon={
                <Element3
                  size={`${ms(20)}`}
                  color={AppColors.gray70}
                  variant="Linear"
                />
              }
              label="보안 설정"
            />
            <MemoMenuItem
              icon={
                <Notification
                  size={`${ms(20)}`}
                  color={AppColors.gray70}
                  variant="Linear"
                />
              }
              label="알림 설정"
            />
            <MemoMenuItem
              icon={
                <InfoCircle
                  size={`${ms(20)}`}
                  color={AppColors.gray70}
                  variant="Linear"
                />
              }
              label="개인 정보 보호 정책"
            />
            <MemoMenuItem
              icon={
                <Document
                  size={`${ms(20)}`}
                  color={AppColors.gray70}
                  variant="Linear"
                />
              }
              label="이용 약관"
            />
            <MemoMenuItem
              icon={
                <LoginCurve
                  size={`${ms(20)}`}
                  color={AppColors.gray70}
                  variant="Linear"
                />
              }
              label="앱 버전"
              rightText={APP_VERSION}
              showArrow={false}
            />
          </View>

          <Pressable style={styles.withdrawButton}>
            <AppText variant="body7" color={AppColors.negative}>
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
    paddingHorizontal: ms(20),
    paddingBottom: ms(40),
  },
  menuSection: {
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray20,
  },
  withdrawButton: {
    alignItems: 'center',
    paddingVertical: ms(20),
  },
});
