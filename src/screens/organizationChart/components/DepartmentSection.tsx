import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ArrowDown2, ArrowUp2, Edit2 } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { ROLE_SLUGS } from '@/src/interface/auth.interface';
import { useUserRole } from '@/src/hooks/useUserRole';
import type { TDepartment } from '../type';
import { MemoTeamSection } from './TeamSection';

//---------------------------------------
const DepartmentSection: React.FC<{ department: TDepartment }> = ({
  department,
}) => {
  const userRole = useUserRole();
  const isDepartmentHead = userRole === ROLE_SLUGS.DEPARTMENT_HEAD;
  const [expanded, setExpanded] = React.useState(true);

  //---------------------------------------
  const handleToggle = React.useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  return (
    <View style={styles.departmentContainer}>
      <Pressable style={styles.departmentHeader} onPress={handleToggle}>
        <View style={styles.departmentNameRow}>
          <AppText variant="body6" color={AppColors.gray90}>
            {`${department.name}본부`}
          </AppText>

          {isDepartmentHead && (
            <Pressable hitSlop={8} style={styles.editButton}>
              <Edit2
                size={`${ms(20)}`}
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
        <View>
          {department.teams.map(team => (
            <MemoTeamSection key={team.id} team={team} />
          ))}
        </View>
      )}
    </View>
  );
};

export const MemoDepartmentSection = React.memo(DepartmentSection);

//---------------------------------------
const styles = StyleSheet.create({
  departmentContainer: {
    backgroundColor: AppColors.lavendar,
    borderRadius: ms(12),
    borderColor: AppColors.lavendar,
    borderWidth: 1,
  },
  departmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
  },
  departmentNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  editButton: {
    borderRadius: ms(8),
    padding: ms(4),
    gap: ms(10),
    backgroundColor: AppColors.gray20,
  },
});
