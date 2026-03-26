import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import { Edit2, LoginCurve } from '@/src/constants/icons';

import { MemoChangePassword } from '../components/ChangePassword';

//---------------------------------------
const SecuritySettingsScreen: React.FC = () => {
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
  const handleSavePassword = React.useCallback(
    (_data: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      setIsEditing(false);
    },
    [],
  );

  //---------------------------------------
  const handleLogoutDevice = React.useCallback((_deviceId: string) => {
    // TODO: call API to logout device
  }, []);

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <MemoScreenHeader title="보안 설정" />

      <MemoScreenBody>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AppText variant="body5" color={AppColors.gray90}>
                비밀번호 변경
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
                <MemoChangePassword
                  onCancel={handleCancelEdit}
                  onSave={handleSavePassword}
                />
              ) : (
                <View style={styles.passwordRow}>
                  <AppText variant="body6" color={AppColors.gray90}>
                    현재 비밀번호
                  </AppText>

                  <AppText variant="body8" color={AppColors.gray90}>
                    Ab*********
                  </AppText>
                </View>
              )}
            </MemoBaseCard>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderColumn}>
              <AppText variant="body5" color={AppColors.gray90}>
                기기 로그인 관리
              </AppText>

              <AppText variant="detail" color={AppColors.gray80}>
                현재 로그인된 모든 기기를 확인하고 관리합니다.
              </AppText>
            </View>

            <MemoBaseCard>
              <View style={styles.deviceRow}>
                <View style={styles.deviceInfo}>
                  <AppText variant="body6" color={AppColors.gray90}>
                    iPhone 14 Pro Max
                  </AppText>

                  <AppText variant="detail" color={AppColors.gray80}>
                    서울, 대한민국 · 오늘 10:30
                  </AppText>
                </View>

                <Pressable hitSlop={8} onPress={() => handleLogoutDevice('1')}>
                  <LoginCurve
                    size={`${ms(20)}`}
                    color={AppColors.gray90}
                    variant="Linear"
                  />
                </Pressable>
              </View>
            </MemoBaseCard>
          </View>
        </ScrollView>
      </MemoScreenBody>
    </AppSafeAreaView>
  );
};

export const MemoSecuritySettingsScreen = React.memo(SecuritySettingsScreen);

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
  section: {
    gap: ms(8),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderColumn: {
    gap: ms(4),
  },
  editIcon: {
    backgroundColor: AppColors.gray20,
    padding: ms(4),
    borderRadius: ms(8),
  },
  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceInfo: {
    gap: ms(4),
  },
});
