import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Edit2 } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoChip } from '@/src/component/Chip';
import { AppColors } from '@/src/constants/colors';
import { ROLE_SLUGS } from '@/src/interface/auth.interface';
import { useUserRole } from '@/src/hooks/useUserRole';
import type { TTeam } from '../type';
import { MemoMemberItem } from './MemberItem';

//---------------------------------------
const TeamSection: React.FC<{ team: TTeam }> = ({ team }) => {
  const userRole = useUserRole();
  const isTeamLeader = userRole === ROLE_SLUGS.TEAM_LEADER;

  return (
    <View style={styles.teamSection}>
      <View style={styles.teamHeader}>
        <MemoChip
          label={`${team.name}팀`}
          bgColor={AppColors.lightBlue}
          textColor={AppColors.strongBlue}
          textVariant="body6"
          paddingHorizontal={16}
          opacity={1}
        />

        {isTeamLeader && (
          <Pressable hitSlop={8} style={styles.editButton}>
            <Edit2
              size={`${ms(20)}`}
              color={AppColors.gray90}
              variant="Linear"
            />
          </Pressable>
        )}
      </View>

      {team.members.length <= 0 ? (
        <View style={styles.emptyTeam}>
          <AppText variant="body6" color={AppColors.gray90}>
            등록된 구성원이 없습니다.
          </AppText>
        </View>
      ) : (
        <View style={styles.membersGrid}>
          {team.members.map(member => (
            <MemoMemberItem key={member.memberId} member={member} />
          ))}
        </View>
      )}
    </View>
  );
};

export const MemoTeamSection = React.memo(TeamSection);

//---------------------------------------
const styles = StyleSheet.create({
  teamSection: {
    backgroundColor: AppColors.white,
    padding: ms(16),
    gap: ms(8),
    margin: ms(1),
  },
  emptyTeam: {
    alignItems: 'center',
    paddingVertical: ms(16),
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editButton: {
    borderRadius: ms(8),
    padding: ms(4),
    backgroundColor: AppColors.gray20,
  },
  membersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(12),
  },
});
