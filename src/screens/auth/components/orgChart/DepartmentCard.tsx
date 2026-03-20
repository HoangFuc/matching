import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Add, Trash } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoChip } from '@/src/component/Chip';
import { MemoFormInput } from '@/src/component/FormInput';
import { AppColors } from '@/src/constants/colors';
import type { Department } from '../../hooks/useOrgChartDepartments';
import { MemoTeamCard } from './TeamCard';

interface IDepartmentCardProps {
  dept: Department;
  deptIndex: number;
  canDeleteDept: boolean;
  onDeleteDept: (deptId: string) => void;
  onDeptNameChange: (deptId: string, value: string) => void;
  onAddTeam: (deptId: string) => void;
  onDeleteTeam: (deptId: string, teamId: string) => void;
  onTeamNameChange: (deptId: string, teamId: string, value: string) => void;
  onToggleDefault: (deptId: string, teamId: string) => void;
}

const TIMELINE_WIDTH = ms(28);

const DepartmentCard: React.FC<IDepartmentCardProps> = ({
  dept,
  deptIndex,
  canDeleteDept,
  onDeleteDept,
  onDeptNameChange,
  onAddTeam,
  onDeleteTeam,
  onTeamNameChange,
  onToggleDefault,
}) => {
  const hasTeams = dept.teams.length > 0;
  const canDeleteTeam = dept.teams.length > 1;

  return (
    <View>
      {/* Department badge */}
      <View style={styles.badgeRow}>
        <View style={styles.indexBadge}>
          <AppText variant="body5" color={AppColors.purple}>
            {deptIndex + 1}
          </AppText>
        </View>
      </View>

      {/* Department card */}
      <View>
        <View style={[styles.infoSection, !hasTeams && styles.infoSectionNoTeams]}>
          <View style={styles.header}>
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
                onPress={() => onDeleteDept(dept.id)}
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
            onChangeText={(value: string) => onDeptNameChange(dept.id, value)}
            gap={4}
          />

          {!hasTeams && (
            <Pressable
              style={styles.addTeamButton}
              onPress={() => onAddTeam(dept.id)}
            >
              <Add
                size={`${ms(16)}`}
                color={AppColors.gray90}
                variant="Linear"
              />
              <AppText variant="body7" color={AppColors.gray90}>
                팀 추가
              </AppText>
            </Pressable>
          )}
        </View>

        {dept.teams.map((team, teamIndex) => (
          <MemoTeamCard
            key={team.id}
            team={team}
            teamIndex={teamIndex}
            deptId={dept.id}
            isFirst={teamIndex === 0}
            isLast={teamIndex === dept.teams.length - 1}
            canDelete={canDeleteTeam}
            onAddTeam={onAddTeam}
            onDeleteTeam={onDeleteTeam}
            onNameChange={onTeamNameChange}
            onToggleDefault={onToggleDefault}
          />
        ))}
      </View>
    </View>
  );
};

export const MemoDepartmentCard = React.memo(DepartmentCard);

const styles = StyleSheet.create({
  badgeRow: {
    position: 'absolute',
    left: -TIMELINE_WIDTH,
    top: 0,
    width: TIMELINE_WIDTH,
    alignItems: 'center',
  },
  indexBadge: {
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
  infoSection: {
    backgroundColor: AppColors.lavendar,
    borderTopLeftRadius: ms(12),
    borderTopRightRadius: ms(12),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: ms(12),
    gap: ms(12),
  },
  infoSectionNoTeams: {
    borderBottomLeftRadius: ms(12),
    borderBottomRightRadius: ms(12),
  },
  addTeamButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(4),
    paddingVertical: ms(8),
    borderTopWidth: 1,
    borderTopColor: AppColors.gray20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trashButton: {
    backgroundColor: AppColors.pastelPink,
    borderRadius: ms(8),
    padding: ms(4),
  },
});
