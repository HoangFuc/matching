import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Add, Edit2, Profile2User } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoChip } from '@/src/component/Chip';
import { AppColors } from '@/src/constants/colors';
import type { TTeam } from '../type';
import { MemoMemberItem } from './MemberItem';

const MAX_VISIBLE_MEMBERS = 4;

interface IProps {
  team: TTeam;
  isEditing?: boolean;
}

//---------------------------------------
const TeamSection: React.FC<IProps> = ({ team, isEditing = false }) => {
  const teamLeader = team.members.find(m => m.roleSlug === 'team_leader');
  const otherMembers = team.members.filter(m => m.roleSlug !== 'team_leader');

  const visibleMembers = isEditing
    ? otherMembers
    : otherMembers.slice(0, MAX_VISIBLE_MEMBERS);
  const overflowCount = isEditing
    ? 0
    : Math.max(0, otherMembers.length - MAX_VISIBLE_MEMBERS);

  return (
    <View style={styles.teamSection}>
      <View style={styles.teamHeader}>
        <MemoChip
          label={`${team.name} (${team.members.length}명)`}
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

        {isEditing && (
          <Pressable hitSlop={8} style={styles.editButton}>
            <Edit2
              size={`${ms(16)}`}
              color={AppColors.gray60}
              variant="Linear"
            />
          </Pressable>
        )}

        {/* Team Leader */}
        {teamLeader && (
          <MemoMemberItem member={teamLeader} showRole isEditing={isEditing} />
        )}
      </View>

      {/* Members Grid */}
      {(visibleMembers.length > 0 || isEditing) && (
        <View style={styles.membersGrid}>
          {visibleMembers.map(member => (
            <MemoMemberItem
              key={member.memberId}
              member={member}
              isEditing={isEditing}
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

          {isEditing && (
            <Pressable style={styles.addMemberItem}>
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

      {team.members.length <= 0 && (
        <View style={styles.emptyTeam}>
          <AppText variant="body7" color={AppColors.gray50}>
            등록된 구성원이 없습니다.
          </AppText>
        </View>
      )}

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
  editButton: {
    borderRadius: ms(6),
    padding: ms(3),
    backgroundColor: AppColors.gray20,
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
});
