import React from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { Add, Trash } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoChip } from '@/src/component/Chip';
import { MemoFormInput } from '@/src/component/FormInput';
import { AppColors } from '@/src/constants/colors';
import type { Team } from '../../hooks/useOrgChartDepartments';

interface ITeamCardProps {
  team: Team;
  teamIndex: number;
  deptId: string;
  isFirst: boolean;
  isLast: boolean;
  canDelete: boolean;
  onAddTeam: (deptId: string) => void;
  onDeleteTeam: (deptId: string, teamId: string) => void;
  onNameChange: (deptId: string, teamId: string, value: string) => void;
  onToggleDefault: (deptId: string, teamId: string) => void;
}

const TeamCard: React.FC<ITeamCardProps> = ({
  team,
  teamIndex,
  deptId,
  isFirst,
  isLast,
  canDelete,
  onAddTeam,
  onDeleteTeam,
  onNameChange,
  onToggleDefault,
}) => (
  <View
    style={[
      styles.container,
      isFirst && styles.containerFirst,
      !isFirst && styles.containerNotFirst,
      !isLast && styles.containerNotLast,
    ]}
  >
    {isFirst && (
      <View style={styles.arrow}>
        <View style={styles.triangle} />
      </View>
    )}

    <View style={styles.header}>
      <MemoChip
        label={`팀 ${teamIndex + 1}`}
        bgColor={AppColors.lightBlue}
        textColor={AppColors.strongBlue}
        selected
        textVariant="body6"
        paddingHorizontal={16}
      />

      {isLast ? (
        <Pressable
          style={styles.addButton}
          onPress={() => onAddTeam(deptId)}
        >
          <Add size={`${ms(20)}`} color={AppColors.gray90} variant="Linear" />
        </Pressable>
      ) : canDelete ? (
        <Pressable
          style={styles.trashButton}
          onPress={() => onDeleteTeam(deptId, team.id)}
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
      onChangeText={(value: string) => onNameChange(deptId, team.id, value)}
      gap={4}
    />

    <View style={styles.defaultRow}>
      <View style={styles.defaultTextGroup}>
        <AppText variant="detail" color={AppColors.gray90}>
          이 팀을 기본 팀으로 설정
        </AppText>

        <AppText variant="detail" color={AppColors.gray90}>
          멤버 초대 시 이 팀에 자동 배정됩니다.
        </AppText>
      </View>

      <Switch
        value={team.isDefault}
        onValueChange={() => onToggleDefault(deptId, team.id)}
        trackColor={{ false: AppColors.gray20, true: AppColors.purple }}
        thumbColor={AppColors.gray40}
      />
    </View>
  </View>
);

export const MemoTeamCard = React.memo(TeamCard);

const styles = StyleSheet.create({
  container: {
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
  containerFirst: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: 0,
  },
  containerNotFirst: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  containerNotLast: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  arrow: {
    position: 'absolute',
    top: -ms(8),
    left: ms(16),
    zIndex: 1,
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: ms(8),
    borderRightWidth: ms(8),
    borderBottomWidth: ms(8),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: AppColors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addButton: {
    width: ms(28),
    height: ms(28),
    borderRadius: ms(8),
    padding: ms(4),
    gap: ms(10),
    backgroundColor: AppColors.gray20,
  },
  trashButton: {
    backgroundColor: AppColors.pastelPink,
    borderRadius: ms(8),
    padding: ms(4),
  },
  defaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  defaultTextGroup: {
    flex: 1,
    gap: ms(2),
  },
});
