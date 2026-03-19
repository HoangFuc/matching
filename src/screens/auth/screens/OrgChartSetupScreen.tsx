import React from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Add,
  ArrowRight2,
  Buildings,
  InfoCircle,
  Trash,
  User,
} from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { MemoBottomButtonGroup } from '@/src/component/BottomButtonGroup';
import { MemoChip } from '@/src/component/Chip';
import { MemoFormInput } from '@/src/component/FormInput';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { MemoStepProgressBar } from '@/src/component/StepProgressBar';
import { AppColors } from '@/src/constants/colors';
import type { AuthStackParamList } from '@/src/interface/tab.interface';

type Props = NativeStackScreenProps<AuthStackParamList, 'OrgChartSetup'>;

type Team = {
  id: string;
  name: string;
  isDefault: boolean;
};

type Department = {
  id: string;
  name: string;
  teams: Team[];
};

let nextId = 1;

//---------------------------------------
const uniqueId = (prefix: string) => `${prefix}-${Date.now()}-${nextId++}`;

//---------------------------------------
const createTeam = (isDefault = false): Team => ({
  id: uniqueId('team'),
  name: '',
  isDefault,
});

//---------------------------------------
const createDepartment = (): Department => ({
  id: uniqueId('dept'),
  name: '',
  teams: [createTeam()],
});

const OrgChartSetupScreen: React.FC<Props> = ({ navigation, route }) => {
  const managementType = route.params?.managementType;
  const hideStepBar = route.params?.hideStepBar;
  const [departments, setDepartments] = React.useState<Department[]>([
    {
      id: 'dept-1',
      name: '',
      teams: [{ id: 'team-1', name: '', isDefault: false }],
    },
  ]);

  //---------------------------------------
  const totalDepartments = departments.length;
  const totalTeams = departments.reduce(
    (sum, dept) => sum + dept.teams.length,
    0,
  );
  const canDeleteDept = departments.length > 1;

  //---------------------------------------
  const handleCancel = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  //---------------------------------------
  const handleNext = React.useCallback(() => {
    navigation.navigate('InviteMember', { managementType, hideStepBar });
  }, [navigation, managementType, hideStepBar]);

  //---------------------------------------
  const handleAddDepartment = React.useCallback(() => {
    setDepartments(prev => [...prev, createDepartment()]);
  }, []);

  //---------------------------------------
  const handleDeleteDepartment = React.useCallback((deptId: string) => {
    setDepartments(prev => prev.filter(dept => dept.id !== deptId));
  }, []);

  //---------------------------------------
  const handleDeptNameChange = React.useCallback(
    (deptId: string, value: string) => {
      setDepartments(prev =>
        prev.map(dept =>
          dept.id === deptId ? { ...dept, name: value } : dept,
        ),
      );
    },
    [],
  );

  //---------------------------------------
  const handleAddTeam = React.useCallback((deptId: string) => {
    setDepartments(prev =>
      prev.map(dept =>
        dept.id === deptId
          ? { ...dept, teams: [...dept.teams, createTeam()] }
          : dept,
      ),
    );
  }, []);

  //---------------------------------------
  const handleDeleteTeam = React.useCallback(
    (deptId: string, teamId: string) => {
      setDepartments(prev =>
        prev.map(dept =>
          dept.id === deptId
            ? { ...dept, teams: dept.teams.filter(t => t.id !== teamId) }
            : dept,
        ),
      );
    },
    [],
  );

  //---------------------------------------
  const handleTeamNameChange = React.useCallback(
    (deptId: string, teamId: string, value: string) => {
      setDepartments(prev =>
        prev.map(dept =>
          dept.id === deptId
            ? {
                ...dept,
                teams: dept.teams.map(team =>
                  team.id === teamId ? { ...team, name: value } : team,
                ),
              }
            : dept,
        ),
      );
    },
    [],
  );

  //---------------------------------------
  const handleToggleDefault = React.useCallback(
    (deptId: string, teamId: string) => {
      setDepartments(prev => {
        const target = prev
          .find(d => d.id === deptId)
          ?.teams.find(t => t.id === teamId);
        const newValue = !target?.isDefault;

        return prev.map(dept => ({
          ...dept,
          teams: dept.teams.map(team => ({
            ...team,
            isDefault:
              dept.id === deptId && team.id === teamId ? newValue : false,
          })),
        }));
      });
    },
    [],
  );

  //---------------------------------------
  const renderTeam = React.useCallback(
    (
      team: Team,
      teamIndex: number,
      dept: Department,
      isFirst: boolean,
      isLast: boolean,
      canDelete: boolean,
    ) => (
      <View
        key={team.id}
        style={[
          styles.teamContainer,
          isFirst && styles.teamContainerFirst,
          !isFirst && styles.teamContainerNotFirst,
          !isLast && styles.teamContainerNotLast,
        ]}
      >
        {isFirst && (
          <View style={styles.deptToTeamArrow}>
            <View style={styles.deptToTeamTriangle} />
          </View>
        )}

        <View style={styles.teamHeader}>
          <MemoChip
            label={`팀 ${teamIndex + 1}`}
            bgColor={AppColors.lightBlue}
            textColor={AppColors.strongBlue}
            selected
            textVariant="body6"
            paddingHorizontal={16}
          />

          {isLast ? (
            <View style={styles.addTeamRow}>
              <Pressable
                style={styles.addTeamButton}
                onPress={() => handleAddTeam(dept.id)}
              >
                <Add
                  size={`${ms(20)}`}
                  color={AppColors.gray90}
                  variant="Linear"
                />
              </Pressable>
            </View>
          ) : canDelete ? (
            <Pressable
              style={styles.trashButton}
              onPress={() => handleDeleteTeam(dept.id, team.id)}
            >
              <Trash
                size={`${ms(18)}`}
                color={AppColors.negative}
                variant="Linear"
              />
            </Pressable>
          ) : null}
        </View>

        <MemoFormInput
          label="팀명"
          placeholder="팀명을 입력하세요"
          required
          value={team.name}
          onChangeText={(value: string) =>
            handleTeamNameChange(dept.id, team.id, value)
          }
          gap={4}
        />

        <View style={styles.defaultTeamRow}>
          <View style={styles.defaultTeamTextGroup}>
            <AppText variant="detail" color={AppColors.gray90}>
              이 팀을 기본 팀으로 설정
            </AppText>

            <AppText variant="detail" color={AppColors.gray90}>
              멤버 초대 시 이 팀에 자동 배정됩니다.
            </AppText>
          </View>

          <Switch
            value={team.isDefault}
            onValueChange={() => handleToggleDefault(dept.id, team.id)}
            trackColor={{
              false: AppColors.gray20,
              true: AppColors.purple,
            }}
            thumbColor={AppColors.gray40}
          />
        </View>
      </View>
    ),
    [
      handleAddTeam,
      handleDeleteTeam,
      handleTeamNameChange,
      handleToggleDefault,
    ],
  );

  //---------------------------------------
  const renderDepartment = React.useCallback(
    (dept: Department, deptIndex: number) => {
      const canDeleteTeam = dept.teams.length > 1;

      return (
        <View key={dept.id} style={styles.deptRow}>
          {/* Left timeline */}
          <View style={styles.timelineColumn}>
            <View style={styles.deptIndexBadge}>
              <AppText variant="body5" color={AppColors.purple}>
                {deptIndex + 1}
              </AppText>
            </View>

            <View style={styles.timelineLine} />
          </View>

          {/* Department card */}
          <View style={styles.deptCardWrapper}>
            <View style={styles.deptInfoSection}>
              <View style={styles.deptHeader}>
                <MemoChip
                  label={`본부 ${deptIndex + 1}`}
                  bgColor={AppColors.lightLime}
                  textColor={AppColors.green}
                  textVariant="body6"
                  paddingHorizontal={16}
                  opacity={1}
                />

                {canDeleteDept && (
                  <Pressable
                    style={styles.trashButton}
                    onPress={() => handleDeleteDepartment(dept.id)}
                  >
                    <Trash
                      size={`${ms(18)}`}
                      color={AppColors.negative}
                      variant="Linear"
                    />
                  </Pressable>
                )}
              </View>

              <MemoFormInput
                label="본부명"
                placeholder="본부명을 입력하세요"
                required
                value={dept.name}
                onChangeText={(value: string) =>
                  handleDeptNameChange(dept.id, value)
                }
                gap={4}
              />
            </View>

            {dept.teams.map((team, teamIndex) =>
              renderTeam(
                team,
                teamIndex,
                dept,
                teamIndex === 0,
                teamIndex === dept.teams.length - 1,
                canDeleteTeam,
              ),
            )}
          </View>
        </View>
      );
    },
    [canDeleteDept, handleDeleteDepartment, handleDeptNameChange, renderTeam],
  );

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={AppColors.purple} />

      <MemoScreenHeader title="조직도 기본 설정" />

      <MemoScreenBody>
        {!hideStepBar && (
          <View style={styles.stepBarContainer}>
            <MemoStepProgressBar currentStep={3} totalSteps={4} />
          </View>
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
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

          {/* 본부 목록 */}
          {departments.map((dept, index) => renderDepartment(dept, index))}

          {/* 추가 버튼 */}
          <View style={styles.addDeptRow}>
            <View style={styles.addDeptTimelineColumn}>
              <Pressable
                style={styles.addDeptCircle}
                onPress={handleAddDepartment}
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
              onPress={handleAddDepartment}
            />
          </View>

          {/* 미리보기 */}
          <MemoBaseCard style={styles.previewCard}>
            <AppText variant="body6" color={AppColors.gray90}>
              미리보기
            </AppText>

            <View style={styles.previewFlow}>
              <View
                style={[
                  styles.breadcrumbTag,
                  { backgroundColor: AppColors.warmIvory },
                ]}
              >
                <View style={{ flexDirection: 'row' }}>
                  <AppText variant="body8" color={AppColors.burntOrange}>
                    총괄{' '}
                  </AppText>

                  <AppText variant="body6" color={AppColors.burntOrange}>
                    나
                  </AppText>
                </View>
              </View>

              <ArrowRight2
                size={ms(14)}
                color={AppColors.gray50}
                variant="Linear"
              />

              <View
                style={[
                  styles.breadcrumbTag,
                  { backgroundColor: AppColors.lightLime },
                ]}
              >
                <Buildings
                  size={ms(14)}
                  color={AppColors.green}
                  variant="Linear"
                />

                <AppText variant="body6" color={AppColors.green}>
                  {`본부 ${totalDepartments}개`}
                </AppText>
              </View>

              <ArrowRight2
                size={ms(14)}
                color={AppColors.gray50}
                variant="Linear"
              />

              <View
                style={[
                  styles.breadcrumbTag,
                  { backgroundColor: AppColors.lightBlue },
                ]}
              >
                <User
                  size={ms(14)}
                  color={AppColors.strongBlue}
                  variant="Linear"
                />
                <AppText variant="body6" color={AppColors.strongBlue}>
                  {`팀 ${totalTeams}개`}
                </AppText>
              </View>
            </View>

            <AppText variant="detail" color={AppColors.gray80}>
              * 설정한 조직 구조는 나중에 팀 관리 메뉴에서 변경할 수 있습니다.
            </AppText>
          </MemoBaseCard>

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
        </ScrollView>

        <MemoBottomButtonGroup>
          <MemoAppButton
            label="취소"
            variant="secondary"
            textVariant="body6"
            onPress={handleCancel}
          />

          <MemoAppButton
            label="다음"
            variant="primary"
            textVariant="body6"
            onPress={handleNext}
          />
        </MemoBottomButtonGroup>
      </MemoScreenBody>
    </AppSafeAreaView>
  );
};

export const MemoOrgChartSetupScreen = React.memo(OrgChartSetupScreen);

const TIMELINE_WIDTH = ms(28);

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
  // Department row: timeline + card
  deptRow: {
    flexDirection: 'row',
  },
  timelineColumn: {
    width: TIMELINE_WIDTH,
    alignItems: 'center',
  },
  deptIndexBadge: {
    width: ms(22),
    height: ms(22),
    borderRadius: ms(11),
    borderWidth: 1.5,
    borderColor: AppColors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  timelineLine: {
    flex: 1,
    width: ms(6),
    borderRadius: ms(3),
    backgroundColor: AppColors.lavendar,
  },
  deptCardWrapper: {
    flex: 1,
    paddingLeft: ms(8),
  },
  deptCard: {
    gap: ms(12),
  },
  deptInfoSection: {
    backgroundColor: AppColors.lavendar,
    borderTopLeftRadius: ms(12),
    borderTopRightRadius: ms(12),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: ms(12),
    gap: ms(12),
  },
  deptToTeamArrow: {
    position: 'absolute',
    top: -ms(8),
    left: ms(16),
    zIndex: 1,
  },
  deptToTeamTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: ms(8),
    borderRightWidth: ms(8),
    borderBottomWidth: ms(8),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: AppColors.white,
  },
  deptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // Team
  teamContainer: {
    backgroundColor: AppColors.white,
    borderRadius: ms(12),
    padding: ms(12),
    gap: ms(10),
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: AppColors.lavendar,
  },
  teamContainerFirst: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: 0,
  },
  teamContainerNotFirst: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  teamContainerNotLast: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addTeamRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addTeamButton: {
    width: ms(28),
    height: ms(28),
    borderRadius: ms(8),
    padding: ms(4),
    gap: ms(10),
    backgroundColor: AppColors.gray20,
  },
  defaultTeamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  defaultTeamTextGroup: {
    flex: 1,
    gap: ms(2),
  },
  // Add department
  addDeptRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addDeptTimelineColumn: {
    width: TIMELINE_WIDTH,
    alignItems: 'center',
  },
  addDeptCircle: {
    width: ms(22),
    height: ms(22),
    borderRadius: ms(11),
    borderWidth: 1.5,
    borderColor: AppColors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addDeptButton: {
    flexDirection: 'row',
    gap: ms(4),
    paddingHorizontal: ms(16),
    paddingVertical: ms(6),
    alignSelf: 'flex-start',
    marginLeft: ms(8),
  },
  separator: {
    height: ms(1),
    backgroundColor: AppColors.gray20,
  },
  // Preview
  previewCard: {
    gap: ms(12),
    height: ms(121),
  },
  previewFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    flexWrap: 'wrap',
  },
  trashButton: {
    backgroundColor: AppColors.pastelPink,
    borderRadius: ms(8),
    padding: ms(4),
  },
  breadcrumbTag: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ms(8),
    paddingVertical: ms(4),
    borderRadius: ms(100),
    gap: ms(4),
  },
});
