import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoChip } from '@/src/component/Chip';
import { AppColors } from '@/src/constants/colors';
import type { TTeam } from '../type';
import { MemoMemberItem } from './MemberItem';

//---------------------------------------
const TeamSection: React.FC<{ team: TTeam }> = ({ team }) => {
  return (
    <View style={styles.teamSection}>
      <MemoChip
        label={team.name}
        bgColor={AppColors.lightBlue}
        textColor={AppColors.strongBlue}
        textVariant="body6"
        paddingHorizontal={16}
        opacity={1}
      />

      {team.members.length === 0 ? (
        <View style={styles.emptyTeam}>
          <AppText variant="body7" color={AppColors.gray50}>
            등록된 구성원이 없습니다.
          </AppText>
        </View>
      ) : (
        <View style={styles.membersGrid}>
          {team.members.map(member => (
            <MemoMemberItem key={member.id} member={member} />
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
  membersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(12),
  },
});
