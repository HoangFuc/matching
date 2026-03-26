import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import {
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
import type { TDepartment } from '../type';
import { MemoTeamSection } from './TeamSection';

interface IProps {
  department: TDepartment;
  isEditing?: boolean;
  defaultExpanded?: boolean;
}

//---------------------------------------
const getTotalMembers = (department: TDepartment): number => {
  let count = department.departmentHead ? 1 : 0;
  department.teams.forEach(team => {
    count += team.members.length;
  });
  return count;
};

//---------------------------------------
const DepartmentSection: React.FC<IProps> = ({
  department,
  isEditing = false,
  defaultExpanded = true,
}) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const totalMembers = getTotalMembers(department);

  //---------------------------------------
  const handleToggle = React.useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

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

          {isEditing && (
            <Pressable hitSlop={8} style={styles.editButton}>
              <Edit2
                size={`${ms(17)}`}
                color={AppColors.gray90}
                variant="Linear"
              />
            </Pressable>
          )}
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
          {department.departmentHead && (
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

                <View style={styles.dot} />

                <AppText variant="detail" color={AppColors.gray70}>
                  {department.departmentHead.role}
                </AppText>

                {isEditing && (
                  <Pressable hitSlop={8}>
                    <CloseCircle
                      size={`${ms(16)}`}
                      color={AppColors.gray50}
                      variant="Bold"
                    />
                  </Pressable>
                )}
              </View>
            </View>
          )}

          {department.teams.map((team, index) => {
            const isLastTeam = index === department.teams.length - 1;
            const isLast = isLastTeam && !isEditing;

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

                <MemoTeamSection team={team} isEditing={isEditing} />
              </View>
            );
          })}

          {isEditing && (
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

              <Pressable style={styles.addTeamButton}>
                <AppText variant="body7" color={AppColors.gray50}>
                  + 팀 추가
                </AppText>
              </Pressable>
            </View>
          )}
        </View>
      )}
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
  addTeamButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(10),
    borderWidth: 1,
    borderColor: AppColors.gray30,
    borderRadius: ms(8),
    borderStyle: 'dashed',
    marginLeft: ms(18),
  },
});
