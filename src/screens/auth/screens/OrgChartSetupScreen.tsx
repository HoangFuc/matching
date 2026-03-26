import React from 'react';
import { Pressable, StatusBar, StyleSheet, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Add, InfoCircle } from 'iconsax-react-nativejs';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { AppText } from '@/src/component/AppText';
import { MemoBottomButtonGroup } from '@/src/component/BottomButtonGroup';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { MemoStepProgressBar } from '@/src/component/StepProgressBar';
import { AppColors } from '@/src/constants/colors';
import type { AuthStackParamList } from '@/src/interface/tab.interface';
import { useToast } from '@/src/providers/ToastProvider';
import {
  saveCompanyInfo,
  saveTokens,
  saveUserInfo,
} from '@/src/services/tokenService';
import {
  useCreateCompanyMutation,
  useRegisterCompanyMutation,
} from '@/src/store/api/auth.api';
import {
  useGetDepartmentsQuery,
  useUpdateDepartmentsMutation,
  type TCompanyDepartment,
} from '@/src/store/api/company.api';
import { MemoDepartmentCard } from '../components/orgChart/DepartmentCard';
import { MemoOrgChartPreview } from '../components/orgChart/OrgChartPreview';
import { useRegisterCompany } from '../context/RegisterCompanyContext';
import {
  useOrgChartDepartments,
  type Department,
} from '../hooks/useOrgChartDepartments';

type Props = NativeStackScreenProps<AuthStackParamList, 'OrgChartSetup'>;

const TIMELINE_WIDTH = ms(28);

//---------------------------------------
const mapApiDepartments = (apiDepts: TCompanyDepartment[]): Department[] =>
  apiDepts.map(d => ({
    id: d.id,
    name: d.name,
    teams: d.teams.map(t => ({
      id: t.id,
      name: t.name,
      isDefault: t.isDefault,
    })),
  }));

const OrgChartSetupScreen: React.FC<Props> = ({ navigation, route }) => {
  const hideStepBar = route.params?.hideStepBar;
  const fromSocialLogin = route.params?.fromSocialLogin;
  const { setStepData, getFormData, resetFormData } = useRegisterCompany();
  const [registerCompany] = useRegisterCompanyMutation();
  const [createCompany] = useCreateCompanyMutation();
  const [updateDepartments] = useUpdateDepartmentsMutation();
  const { showToast } = useToast();
  const directorName = getFormData().fullName || '나';

  const { data: deptData } = useGetDepartmentsQuery(undefined, {
    skip: !hideStepBar,
  });

  const initialDepartments = React.useMemo(
    () => (deptData ? mapApiDepartments(deptData) : undefined),
    [deptData],
  );

  const {
    departments,
    totalDepartments,
    totalTeams,
    canDeleteDept,
    isValid,
    addDepartment,
    deleteDepartment,
    updateDeptName,
    addTeam,
    deleteTeam,
    updateTeamName,
    toggleDefault,
    toJson,
  } = useOrgChartDepartments(initialDepartments);

  //---------------------------------------
  const initialJson = React.useMemo(
    () =>
      initialDepartments
        ? JSON.stringify(
            initialDepartments.map(dept => ({
              name: dept.name,
              teams: dept.teams.map(team => ({
                name: team.name,
                isDefault: team.isDefault,
              })),
            })),
          )
        : null,
    [initialDepartments],
  );

  //---------------------------------------
  const handleCancel = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  //---------------------------------------
  const handleNext = React.useCallback(async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      if (hideStepBar) {
        if (!(initialJson && toJson() === initialJson)) {
          const isServerId = (id: string) =>
            !id.startsWith('dept-') && !id.startsWith('team-');
          const body = {
            departments: departments.map(dept => ({
              ...(isServerId(dept.id) && { id: dept.id }),
              name: dept.name,
              teams: dept.teams.map(team => ({
                ...(isServerId(team.id) && { id: team.id }),
                name: team.name,
                isDefault: team.isDefault,
              })),
            })),
          };
          await updateDepartments(body).unwrap();
          showToast({ type: 'success', message: '조직도가 수정되었습니다' });
        }
        navigation.navigate('InviteMember', { departments, hideStepBar: true });
        return;
      }

      setStepData({ departments: toJson() });
      const formData = getFormData();

      let response;
      if (fromSocialLogin) {
        response = await createCompany({
          companyName: formData.companyName!,
          directorCount: formData.directorCount!,
          companyLogo: formData.companyLogo,
          departments: formData.departments!,
        }).unwrap();
      } else {
        response = await registerCompany(formData as any).unwrap();
      }

      if (response.accessToken && response.refreshToken) {
        await saveTokens(response.accessToken, response.refreshToken);
      }
      if (response.user) {
        await saveUserInfo(response.user);
      }
      if (response.companies) {
        await saveCompanyInfo(response.companies);
      }
      resetFormData();

      const company = response.companies?.[0];
      if (fromSocialLogin) {
        showToast({ type: 'success', message: '생성이 완료되었습니다' });
        navigation.navigate('InviteMember', {
          company,
          directorCount: formData.directorCount,
        });
      } else {
        navigation.navigate('InviteMember', {
          company,
          directorCount: formData.directorCount,
          hideStepBar,
        });
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    hideStepBar,
    setStepData,
    toJson,
    getFormData,
    fromSocialLogin,
    resetFormData,
    initialJson,
    navigation,
    departments,
    updateDepartments,
    showToast,
    createCompany,
    registerCompany,
  ]);

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={AppColors.purple} />

      <MemoScreenHeader title="조직도 기본 설정" />

      <MemoScreenBody>
        {!hideStepBar && (
          <View style={styles.stepBarContainer}>
            <MemoStepProgressBar
              currentStep={fromSocialLogin ? 2 : 3}
              totalSteps={fromSocialLogin ? 2 : 4}
            />
          </View>
        )}

        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid
          extraScrollHeight={ms(120)}
        >
          {/* 안내 문구 */}
          {!hideStepBar && (
            <View style={styles.infoRow}>
              <InfoCircle
                size={`${ms(14)}`}
                color={AppColors.gray80}
                variant="Linear"
              />
              <AppText variant="detail" color={AppColors.gray80}>
                업무 효율을 위해 우리 회사의 첫 번째 본부와 팀을 생성해주세요.
              </AppText>
            </View>
          )}

          {/* 본부 목록 + 타임라인 */}
          <View style={styles.timelineWrapper}>
            <View style={styles.timelineLine} />

            <View style={styles.timelineContent}>
              {departments.map((dept, index) => (
                <MemoDepartmentCard
                  key={dept.id}
                  dept={dept}
                  deptIndex={index}
                  canDeleteDept={canDeleteDept}
                  onDeleteDept={deleteDepartment}
                  onDeptNameChange={updateDeptName}
                  onAddTeam={addTeam}
                  onDeleteTeam={deleteTeam}
                  onTeamNameChange={updateTeamName}
                  onToggleDefault={toggleDefault}
                />
              ))}

              {/* 추가 버튼 */}
              <View style={styles.addDeptRow}>
                <View style={styles.addDeptBadgeRow}>
                  <Pressable
                    style={styles.addDeptCircle}
                    onPress={addDepartment}
                  >
                    <Add
                      size={`${ms(14)}`}
                      color={AppColors.purple}
                      variant="Linear"
                    />
                  </Pressable>
                </View>

                <MemoAppButton
                  label="추가"
                  textVariant="body7"
                  icon={
                    <Add
                      size={`${ms(16)}`}
                      color={AppColors.purple}
                      variant="Linear"
                    />
                  }
                  style={styles.addDeptButton}
                  onPress={addDepartment}
                />
              </View>
            </View>
          </View>

          {/* 미리보기 */}
          <MemoOrgChartPreview
            directorName={directorName}
            totalDepartments={totalDepartments}
            totalTeams={totalTeams}
          />

          {/* 하단 안내 */}
          <View style={styles.infoRow}>
            <InfoCircle
              size={`${ms(14)}`}
              color={AppColors.gray80}
              variant="Linear"
            />
            <AppText
              variant="detail"
              color={AppColors.gray80}
              style={styles.bottomInfoText}
            >
              본부와 팀 이름은 구성원들이 업무 위치를 명확히 알 수 있도록
              직관적인 이름을 사용하는 것을 권장합니다.
            </AppText>
          </View>
        </KeyboardAwareScrollView>

        <MemoBottomButtonGroup>
          <MemoAppButton
            label="취소"
            variant="secondary"
            textVariant="body6"
            onPress={handleCancel}
          />

          <MemoAppButton
            label="확인"
            variant="primary"
            textVariant="body6"
            disabled={!isValid || isSubmitting}
            onPress={handleNext}
          />
        </MemoBottomButtonGroup>
      </MemoScreenBody>
    </AppSafeAreaView>
  );
};

export const MemoOrgChartSetupScreen = React.memo(OrgChartSetupScreen);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
  stepBarContainer: {
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
    marginBottom: ms(8),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: ms(16),
    paddingBottom: ms(32),
    gap: ms(16),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
  },
  bottomInfoText: {
    flex: 1,
  },
  // Timeline
  timelineWrapper: {
    flexDirection: 'row',
  },
  timelineLine: {
    position: 'absolute',
    left: TIMELINE_WIDTH / 2 - ms(3),
    top: ms(11),
    bottom: ms(11),
    width: ms(6),
    borderRadius: ms(3),
    backgroundColor: AppColors.lavendar,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: TIMELINE_WIDTH,
    gap: ms(16),
  },
  // Add department
  addDeptRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addDeptBadgeRow: {
    width: TIMELINE_WIDTH,
    alignItems: 'center',
    marginLeft: -TIMELINE_WIDTH,
  },
  addDeptCircle: {
    width: ms(22),
    height: ms(22),
    borderRadius: ms(11),
    borderWidth: 1.5,
    borderColor: AppColors.purple,
    backgroundColor: AppColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  addDeptButton: {
    flexDirection: 'row',
    gap: ms(4),
    paddingHorizontal: ms(16),
    paddingVertical: ms(6),
    alignSelf: 'flex-start',
    marginLeft: ms(8),
  },
});
