import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import {
  Add,
  ArrowDown2,
  ArrowUp2,
  CloseCircle,
  Edit2,
  People,
} from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { AppColors } from '@/src/constants/colors';
import { useOrgEditActions } from '../context/OrgEditContext';
import type { TDepartment, TMember } from '../type';
import { MemoAddMemberSheet } from './AddMemberSheet';
import { MemoRenameOrgSheet } from './RenameOrgSheet';
import { MemoTeamSection } from './TeamSection';

interface IProps {
  department: TDepartment;
  isEditing?: boolean;
  canEditRoot?: boolean;
  defaultExpanded?: boolean;
}

//---------------------------------------
const getTotalMembers = (department: TDepartment): number => {
  const headCount = department.departmentHead ? 1 : 0;
  const teamCount = department.teams.reduce(
    (sum, team) => sum + team.totalMembers,
    0,
  );
  return headCount + teamCount;
};

//---------------------------------------
const DepartmentHeadPlaceholder: React.FC<{
  isEditing?: boolean;
  onPressAdd?: () => void;
}> = ({ isEditing = false, onPressAdd }) => {
  return (
    <View style={styles.headPlaceholder}>
      <AppText variant="body7" color={AppColors.gray70}>
        본부장
      </AppText>

      {isEditing && (
        <Pressable style={styles.headPlaceholderAddButton} onPress={onPressAdd}>
          <Add size={`${ms(12)}`} color={AppColors.gray70} variant="Linear" />
        </Pressable>
      )}
    </View>
  );
};

//---------------------------------------
const DepartmentSection: React.FC<IProps> = ({
  department,
  isEditing = false,
  canEditRoot = false,
  defaultExpanded = true,
}) => {
  const actions = useOrgEditActions();
  const canEditDept = canEditRoot || department.canEdit;
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const [renameVisible, setRenameVisible] = React.useState(false);
  const [addTeamVisible, setAddTeamVisible] = React.useState(false);
  const [addMemberVisible, setAddMemberVisible] = React.useState(false);
  const totalMembers = getTotalMembers(department);

  //---------------------------------------
  const handleToggle = React.useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  //---------------------------------------
  const handlePressEdit = React.useCallback(() => {
    setRenameVisible(true);
  }, []);

  //---------------------------------------
  const handleCloseRename = React.useCallback(() => {
    setRenameVisible(false);
  }, []);

  //---------------------------------------
  const handleSaveRename = React.useCallback(
    (newName: string) => {
      actions.renameDepartment(department.id, newName);
    },
    [actions, department.id],
  );

  //---------------------------------------
  const handlePressAddTeam = React.useCallback(() => {
    setAddTeamVisible(true);
  }, []);

  //---------------------------------------
  const handleCloseAddTeam = React.useCallback(() => {
    setAddTeamVisible(false);
  }, []);

  //---------------------------------------
  const handleSaveAddTeam = React.useCallback(
    (teamName: string) => {
      actions.addTeam(department.id, teamName);
    },
    [actions, department.id],
  );

  //---------------------------------------
  const handlePressAddMember = React.useCallback(() => {
    setAddMemberVisible(true);
  }, []);

  //---------------------------------------
  const handleCloseAddMember = React.useCallback(() => {
    setAddMemberVisible(false);
  }, []);

  //---------------------------------------
  const handleConfirmAddMember = React.useCallback(
    (member: TMember) => {
      actions.setDepartmentHead(department.id, member);
    },
    [actions, department.id],
  );

  //---------------------------------------
  const handleRemoveDepartmentHead = React.useCallback(() => {
    actions.removeDepartmentHead(department.id);
  }, [actions, department.id]);

  return (
    <MemoBaseCard style={styles.card}>
      <Pressable style={styles.departmentHeader} onPress={handleToggle}>
        <View style={styles.departmentNameRow}>
          <People
            size={`${ms(20)}`}
            color={AppColors.gray90}
            variant="Linear"
          />

          <AppText variant="body5" color={AppColors.gray90}>
            {`${department.name} (${totalMembers}명)`}
          </AppText>

          <Pressable
            hitSlop={8}
            disabled={!(isEditing && canEditDept)}
            onPress={e => {
              e.stopPropagation();
              handlePressEdit();
            }}
            style={[
              styles.editButton,
              !(isEditing && canEditDept) && styles.hidden,
            ]}
          >
            <Edit2
              size={`${ms(20)}`}
              color={AppColors.gray90}
              variant="Linear"
            />
          </Pressable>
        </View>

        {expanded ? (
          <ArrowUp2
            size={`${ms(20)}`}
            color={AppColors.gray90}
            variant="Linear"
          />
        ) : (
          <ArrowDown2
            size={`${ms(20)}`}
            color={AppColors.gray90}
            variant="Linear"
          />
        )}
      </Pressable>

      {expanded && (
        <View style={styles.expandedContent}>
          {/* Department Head */}
          {department.departmentHead?.fullName ? (
            <View style={styles.departmentHeadRow}>
              {department.departmentHead.avatarUrl ? (
                <Image
                  source={{ uri: department.departmentHead.avatarUrl }}
                  style={styles.headAvatar}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.headAvatarPlaceholder}>
                  <AppText variant="body8" color={AppColors.white}>
                    {department.departmentHead.fullName.charAt(0)}
                  </AppText>
                </View>
              )}

              <View style={styles.headInfoRow}>
                <AppText variant="body6" color={AppColors.gray90}>
                  {department.departmentHead.fullName}
                </AppText>

                {department.departmentHead.isMe && (
                  <View style={styles.meBadge}>
                    <AppText variant="detail" color={AppColors.purple}>
                      나
                    </AppText>
                  </View>
                )}

                <View style={styles.dot} />

                <AppText variant="detail" color={AppColors.gray70}>
                  {department.departmentHead.role}
                </AppText>

                <Pressable
                  hitSlop={8}
                  disabled={!(isEditing && canEditDept)}
                  onPress={handleRemoveDepartmentHead}
                  style={!(isEditing && canEditDept) && styles.hidden}
                >
                  <CloseCircle
                    size={`${ms(16)}`}
                    color={AppColors.gray50}
                    variant="Bold"
                  />
                </Pressable>
              </View>
            </View>
          ) : (
            <DepartmentHeadPlaceholder
              isEditing={isEditing && canEditDept}
              onPressAdd={handlePressAddMember}
            />
          )}

          {department.teams.map((team, index) => {
            const isLastTeam = index === department.teams.length - 1;
            const isLast = isLastTeam && !(isEditing && canEditDept);

            return (
              <View key={team.id} style={styles.teamRow}>
                <View style={styles.connectorColumn}>
                  <View
                    style={[
                      styles.connectorLineTop,
                      { borderColor: AppColors.gray30 },
                    ]}
                  />

                  <View
                    style={[
                      styles.connectorLineHorizontal,
                      { borderColor: AppColors.gray30 },
                    ]}
                  />

                  {!isLast && (
                    <View
                      style={[
                        styles.connectorLineBottom,
                        { borderColor: AppColors.gray30 },
                      ]}
                    />
                  )}
                </View>

                <MemoTeamSection
                  departmentId={department.id}
                  team={team}
                  isEditing={isEditing}
                  canEditDept={canEditDept}
                />
              </View>
            );
          })}

          {isEditing && canEditDept && (
            <View style={styles.teamRow}>
              <View style={styles.connectorColumn}>
                <View
                  style={[
                    styles.connectorLineTop,
                    { borderColor: AppColors.gray30 },
                  ]}
                />

                <View
                  style={[
                    styles.connectorLineHorizontal,
                    { borderColor: AppColors.gray30 },
                  ]}
                />
              </View>

              <Pressable
                style={styles.addTeamButton}
                onPress={handlePressAddTeam}
              >
                <AppText variant="body8" color={AppColors.gray70}>
                  + 팀 추가
                </AppText>
              </Pressable>
            </View>
          )}
        </View>
      )}
      <MemoRenameOrgSheet
        visible={renameVisible}
        onClose={handleCloseRename}
        currentName={department.name}
        onSave={handleSaveRename}
        inputLabel="부서명"
        placeholder="부서명을 입력해 주세요"
      />

      <MemoRenameOrgSheet
        visible={addTeamVisible}
        onClose={handleCloseAddTeam}
        currentName=""
        onSave={handleSaveAddTeam}
        title="팀 추가"
        inputLabel="팀명"
        placeholder="팀명을 입력하세요"
      />

      <MemoAddMemberSheet
        visible={addMemberVisible}
        onClose={handleCloseAddMember}
        onConfirm={handleConfirmAddMember}
      />
    </MemoBaseCard>
  );
};

export const MemoDepartmentSection = React.memo(DepartmentSection);

//---------------------------------------
const styles = StyleSheet.create({
  departmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingVertical: ms(12),
  },
  departmentNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
  },
  editButton: {
    borderRadius: ms(8),
    padding: ms(4),
  },
  expandedContent: {
    paddingHorizontal: ms(16),
    paddingBottom: ms(16),
    gap: ms(8),
  },
  departmentHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    padding: ms(8),
    borderRadius: ms(8),
    backgroundColor: AppColors.gray10,
    marginBottom: ms(1),
    marginLeft: ms(10),
  },
  headAvatar: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(16),
  },
  headAvatarPlaceholder: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: AppColors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
  },
  meBadge: {
    backgroundColor: AppColors.pastelLavendar,
    borderRadius: ms(4),
    paddingHorizontal: ms(6),
    paddingVertical: ms(1),
  },
  dot: {
    width: ms(3),
    height: ms(3),
    borderRadius: ms(1.5),
    backgroundColor: AppColors.gray90,
  },
  card: {
    padding: 0,
  },
  teamRow: {
    flexDirection: 'row' as const,
    alignItems: 'stretch' as const,
    flex: 1,
  },
  connectorColumn: {
    width: ms(20),
    alignItems: 'center' as const,
    marginVertical: ms(-4),
  },
  connectorLineTop: {
    flex: 1,
    borderLeftWidth: ms(1),
  },
  connectorLineHorizontal: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    width: '50%',
    borderTopWidth: ms(1),
  },
  connectorLineBottom: {
    flex: 1,
    borderLeftWidth: ms(1),
  },
  hidden: {
    opacity: 0,
  },
  addTeamButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    padding: ms(8),
    borderColor: AppColors.gray30,
    borderRadius: ms(8),
    marginLeft: ms(18),
    gap: ms(6),
    backgroundColor: AppColors.gray10,
  },
  headPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(4),
    padding: ms(8),
    borderRadius: ms(8),
    backgroundColor: AppColors.gray10,
    marginLeft: ms(10),
  },
  headPlaceholderAddButton: {
    width: ms(24),
    height: ms(24),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.gray20,
    borderRadius: ms(100),
    padding: ms(4),
  },
  headPlaceholderLine: {
    flex: 1,
    height: ms(2),
    backgroundColor: AppColors.gray80,
    borderRadius: ms(1),
  },
});
