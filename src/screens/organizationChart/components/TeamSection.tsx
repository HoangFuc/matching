import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Add, Edit2, Profile2User } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoChip } from '@/src/component/Chip';
import { AppColors } from '@/src/constants/colors';
import { useOrgEditActions } from '../context/OrgEditContext';
import type { TDepartment, TMember, TTeam } from '../type';
import { findMemberCurrentPosition, getTeamMemberIds } from '../utils';
import { MemoAddMemberSheet } from './AddMemberSheet';
import { MemoKickMemberSheet } from './KickMemberSheet';
import { MemoMemberItem } from './MemberItem';
import { MemoRenameOrgSheet } from './RenameOrgSheet';
import { MemoTransferMemberSheet } from './TransferMemberSheet';

const MAX_VISIBLE_MEMBERS = 4;

interface IProps {
  departmentId: string;
  team: TTeam;
  allDepartments: TDepartment[];
  isEditing?: boolean;
  canEditDept?: boolean;
}

//---------------------------------------
const TeamSection: React.FC<IProps> = ({
  departmentId,
  team,
  allDepartments,
  isEditing = false,
  canEditDept = false,
}) => {
  const actions = useOrgEditActions();
  const [renameVisible, setRenameVisible] = React.useState(false);
  const [addMemberVisible, setAddMemberVisible] = React.useState(false);
  const [kickTarget, setKickTarget] = React.useState<TMember | null>(null);
  const [transferInfo, setTransferInfo] = React.useState<{
    member: TMember;
    currentGroupName: string;
    transferType: 'department' | 'team';
    addAs: 'leader' | 'member';
  } | null>(null);
  const teamLeader = team.teamLeader;
  const otherMembers = team.members.filter(m => m.roleSlug !== 'team_leader');
  const canEditTeam = canEditDept || team.canEdit;
  const disabledMemberIds = React.useMemo(
    () => getTeamMemberIds(team),
    [team],
  );

  const visibleMembers = isEditing && canEditTeam
    ? otherMembers
    : otherMembers.slice(0, MAX_VISIBLE_MEMBERS);
  const overflowCount = isEditing && canEditTeam
    ? 0
    : Math.max(0, otherMembers.length - MAX_VISIBLE_MEMBERS);

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
      actions.renameTeam(departmentId, team.id, newName);
    },
    [actions, departmentId, team.id],
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
      const position = findMemberCurrentPosition(allDepartments, member.memberId);
      if (position) {
        setTransferInfo({
          member,
          currentGroupName: position.groupName,
          transferType: position.type,
          addAs: 'member',
        });
        return;
      }
      actions.addTeamMember(departmentId, team.id, member);
    },
    [actions, departmentId, team.id, allDepartments],
  );

  //---------------------------------------
  const handleCloseTransfer = React.useCallback(() => {
    setTransferInfo(null);
  }, []);

  //---------------------------------------
  const handleConfirmTransfer = React.useCallback(() => {
    if (transferInfo) {
      actions.addTeamMember(departmentId, team.id, transferInfo.member);
    }
    setTransferInfo(null);
  }, [actions, departmentId, team.id, transferInfo]);

  //---------------------------------------
  const handlePressRemoveLeader = React.useCallback(() => {
    if (teamLeader) {
      setKickTarget(teamLeader);
    }
  }, [teamLeader]);

  //---------------------------------------
  const handlePressRemoveMember = React.useCallback(
    (member: TMember) => {
      setKickTarget(member);
    },
    [],
  );

  //---------------------------------------
  const handleCloseKick = React.useCallback(() => {
    setKickTarget(null);
  }, []);

  //---------------------------------------
  const handleConfirmKick = React.useCallback(() => {
    if (!kickTarget) {
      return;
    }
    actions.kickMember(kickTarget.memberId);
    setKickTarget(null);
  }, [kickTarget, actions]);

  return (
    <View style={styles.teamSection}>
      <View style={styles.teamHeader}>
        <View style={styles.teamNameRow}>
          <MemoChip
            label={`${team.name} (${team.totalMembers}명)`}
            bgColor={AppColors.lightBlue}
            textColor={AppColors.strongBlue}
            textVariant="detail"
            paddingHorizontal={6}
            paddingVertical={2}
            opacity={1}
            leftIcon={
              <Profile2User
                size={`${ms(14)}`}
                color={AppColors.strongBlue}
                variant="Linear"
              />
            }
            leftIconStyle={{ marginRight: ms(4) }}
          />

          <Pressable
            hitSlop={8}
            disabled={!(isEditing && canEditTeam)}
            onPress={handlePressEdit}
            style={[styles.editButton, !(isEditing && canEditTeam) && styles.hidden]}
          >
            <Edit2
              size={`${ms(20)}`}
              color={AppColors.gray90}
              variant="Linear"
            />
          </Pressable>
        </View>

        {/* Team Leader */}
        {teamLeader ? (
          <MemoMemberItem
            member={teamLeader}
            showRole
            isEditing={isEditing && canEditDept}
            onPressRemove={handlePressRemoveLeader}
          />
        ) : (
          <Pressable
            style={styles.addLeaderRow}
            disabled={!(isEditing && canEditDept)}
            onPress={handlePressAddMember}
          >
            <AppText variant="body6" color={AppColors.gray70}>
              팀장
            </AppText>

            {isEditing && canEditDept && (
              <View style={styles.addLeaderCircle}>
                <Add
                  size={`${ms(12)}`}
                  color={AppColors.gray70}
                  variant="Linear"
                />
              </View>
            )}
          </Pressable>
        )}
      </View>

      {/* Members Grid */}
      {visibleMembers.length > 0 && (
        <View style={styles.membersGrid}>
          {visibleMembers.map(member => (
            <MemoMemberItem
              key={member.memberId}
              member={member}
              isEditing={isEditing && canEditTeam}
              onPressRemove={() => handlePressRemoveMember(member)}
            />
          ))}

          {overflowCount > 0 && (
            <View style={styles.overflowItem}>
              <View style={styles.overflowCircle}>
                <AppText variant="body8" color={AppColors.gray60}>
                  {`+${overflowCount}`}
                </AppText>
              </View>

              <AppText variant="detail" color={AppColors.gray60}>
                기타
              </AppText>
            </View>
          )}

          {isEditing && canEditTeam && visibleMembers.length > 0 && (
            <Pressable
              style={styles.addMemberItem}
              onPress={handlePressAddMember}
            >
              <View style={styles.addMemberCircle}>
                <Add
                  size={`${ms(20)}`}
                  color={AppColors.gray50}
                  variant="Linear"
                />
              </View>

              <AppText variant="body7" color={AppColors.gray70}>
                팀원
              </AppText>
            </Pressable>
          )}
        </View>
      )}

      {visibleMembers.length === 0 && (
        <Pressable
          style={styles.addMemberRow}
          disabled={!(isEditing && canEditTeam)}
          onPress={handlePressAddMember}
        >
          <AppText variant="body6" color={AppColors.gray70}>
            팀원
          </AppText>

          {isEditing && canEditTeam && (
            <View style={styles.addLeaderCircle}>
              <Add size={`${ms(12)}`} color={AppColors.gray70} variant="Linear" />
            </View>
          )}
        </Pressable>
      )}

      <MemoRenameOrgSheet
        visible={renameVisible}
        onClose={handleCloseRename}
        currentName={team.name}
        onSave={handleSaveRename}
        inputLabel="팀명"
        placeholder="팀명을 입력해 주세요"
      />

      <MemoAddMemberSheet
        visible={addMemberVisible}
        disabledMemberIds={disabledMemberIds}
        onClose={handleCloseAddMember}
        onConfirm={handleConfirmAddMember}
      />

      <MemoKickMemberSheet
        visible={kickTarget !== null}
        memberName={kickTarget?.fullName ?? ''}
        kickType="team"
        onClose={handleCloseKick}
        onConfirm={handleConfirmKick}
      />

      <MemoTransferMemberSheet
        visible={transferInfo !== null}
        memberName={transferInfo?.member.fullName ?? ''}
        currentGroupName={transferInfo?.currentGroupName ?? ''}
        targetGroupName={team.name}
        transferType={transferInfo?.transferType ?? 'team'}
        onClose={handleCloseTransfer}
        onConfirm={handleConfirmTransfer}
      />
    </View>
  );
};

export const MemoTeamSection = React.memo(TeamSection);

//---------------------------------------
const styles = StyleSheet.create({
  teamSection: {
    flex: 1,
    backgroundColor: AppColors.white,
    gap: ms(10),
    marginLeft: ms(18),
    borderColor: AppColors.gray30,
    borderWidth: ms(1),
    borderRadius: ms(8),
    overflow: 'hidden',
  },
  emptyTeam: {
    alignItems: 'center',
    paddingVertical: ms(16),
  },
  teamHeader: {
    backgroundColor: AppColors.gray10,
    gap: ms(8),
    padding: ms(8),
  },
  teamNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
  },
  editButton: {
    borderRadius: ms(6),
    padding: ms(3),
  },
  membersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(12),
    padding: ms(8),
  },
  overflowItem: {
    alignItems: 'center',
    gap: ms(4),
    width: ms(48),
  },
  overflowCircle: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(18),
    backgroundColor: AppColors.gray10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AppColors.gray20,
  },
  hidden: {
    opacity: 0,
  },
  addMemberItem: {
    alignItems: 'center',
    gap: ms(4),
    width: ms(48),
  },
  addMemberCircle: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.gray20,
  },
  addLeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(4),
  },
  addMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(4),
    paddingVertical: ms(8),
  },
  addLeaderCircle: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.gray20,
  },
});
