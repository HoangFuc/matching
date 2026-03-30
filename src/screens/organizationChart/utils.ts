import type { TDepartment, TTeam } from './type';

type TMemberPosition = {
  type: 'department' | 'team';
  groupName: string;
  departmentId: string;
  teamId?: string;
};

export const findMemberCurrentPosition = (
  departments: TDepartment[],
  memberId: string,
): TMemberPosition | null => {
  for (const dept of departments) {
    if (dept.departmentHead?.memberId === memberId) {
      return {
        type: 'department',
        groupName: dept.name,
        departmentId: dept.id,
      };
    }

    for (const team of dept.teams) {
      if (team.teamLeader?.memberId === memberId) {
        return {
          type: 'team',
          groupName: team.name,
          departmentId: dept.id,
          teamId: team.id,
        };
      }

      if (team.members.some(m => m.memberId === memberId)) {
        return {
          type: 'team',
          groupName: team.name,
          departmentId: dept.id,
          teamId: team.id,
        };
      }
    }
  }

  return null;
};

export const getDepartmentMemberIds = (department: TDepartment): string[] => {
  const ids: string[] = [];

  if (department.departmentHead?.memberId) {
    ids.push(department.departmentHead.memberId);
  }

  for (const team of department.teams) {
    if (team.teamLeader?.memberId) {
      ids.push(team.teamLeader.memberId);
    }
    for (const member of team.members) {
      ids.push(member.memberId);
    }
  }

  return ids;
};

export const getTeamMemberIds = (team: TTeam): string[] => {
  const ids: string[] = [];

  if (team.teamLeader?.memberId) {
    ids.push(team.teamLeader.memberId);
  }

  for (const member of team.members) {
    ids.push(member.memberId);
  }

  return ids;
};
