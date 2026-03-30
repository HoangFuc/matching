import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import {
  useGetStructureQuery,
  useUpdateDepartmentsMutation,
} from '@/src/store/api/company.api';
import type { TUpdateDepartmentsParams } from '@/src/store/api/company.api';
import { useToast } from '@/src/providers/ToastProvider';
import type { TOrgEditActions } from '../context/OrgEditContext';
import { MOCK_STRUCTURE } from '../mockData';
import type { TMember, TStructure } from '../type';

//---------------------------------------
const generateTempId = () =>
  `temp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

//---------------------------------------
const deepCloneStructure = (structure: TStructure): TStructure =>
  JSON.parse(JSON.stringify(structure));

//---------------------------------------
const removeMemberFromPositions = (
  structure: TStructure,
  memberId: string,
): TStructure => ({
  ...structure,
  departments: structure.departments.map(dept => {
    const wasDeptHead = dept.departmentHead?.memberId === memberId;
    return {
      ...dept,
      departmentHead: wasDeptHead ? null : dept.departmentHead,
      teams: dept.teams.map(team => {
        const wasLeader = team.teamLeader?.memberId === memberId;
        const wasMember = team.members.some(m => m.memberId === memberId);
        return {
          ...team,
          teamLeader: wasLeader ? null : team.teamLeader,
          members: wasMember
            ? team.members.filter(m => m.memberId !== memberId)
            : team.members,
          totalMembers:
            team.totalMembers - (wasLeader ? 1 : 0) - (wasMember ? 1 : 0),
        };
      }),
    };
  }),
});

//---------------------------------------
const buildSavePayload = (
  form: TStructure,
  server: TStructure,
  kickIds: string[],
): TUpdateDepartmentsParams => {
  const isDirector = server.canEdit;

  const departments = form.departments.map(dept => {
    const deptCanEdit = isDirector || dept.canEdit;

    if (!deptCanEdit) {
      return {
        id: dept.id,
        name: dept.name,
        teams: dept.teams.map(team => {
          if (team.canEdit) {
            return {
              id: team.id,
              name: team.name,
              memberIds: team.members
                .filter(m => m.roleSlug !== 'team_leader')
                .map(m => m.memberId),
            };
          }
          return { id: team.id, name: team.name };
        }),
      };
    }

    return {
      id: dept.id.startsWith('temp_') ? undefined : dept.id,
      name: dept.name,
      ...(isDirector && { headId: dept.departmentHead?.memberId }),
      teams: dept.teams.map(team => {
        const teamCanEdit = isDirector || dept.canEdit || team.canEdit;

        if (!teamCanEdit) {
          return { id: team.id, name: team.name };
        }

        return {
          id: team.id.startsWith('temp_') ? undefined : team.id,
          name: team.name,
          isDefault: team.isDefault,
          ...((isDirector || dept.canEdit) && {
            leaderId: team.teamLeader?.memberId,
          }),
          memberIds: team.members
            .filter(m => m.roleSlug !== 'team_leader')
            .map(m => m.memberId),
        };
      }),
    };
  });

  const payload: TUpdateDepartmentsParams = { departments };

  if (isDirector) {
    payload.companyName = form.companyName;

    const originalDirector2 = server.directors[1] ?? null;
    const currentDirector2 = form.directors[1] ?? null;

    if (originalDirector2 && !currentDirector2) {
      payload.removeDirector2Id = originalDirector2.memberId;
    } else if (
      originalDirector2 &&
      currentDirector2 &&
      originalDirector2.memberId !== currentDirector2.memberId
    ) {
      payload.removeDirector2Id = originalDirector2.memberId;
      payload.appointDirector2Id = currentDirector2.memberId;
    } else if (!originalDirector2 && currentDirector2) {
      payload.appointDirector2Id = currentDirector2.memberId;
    }
  }

  if (kickIds.length > 0) {
    payload.kickMemberIds = kickIds;
  }

  return payload;
};

//---------------------------------------
const hasAnyEditPermission = (structure: TStructure): boolean => {
  if (structure.canEdit) {
    return true;
  }
  for (const dept of structure.departments) {
    if (dept.canEdit) {
      return true;
    }
    for (const team of dept.teams) {
      if (team.canEdit) {
        return true;
      }
    }
  }
  return false;
};

//---------------------------------------
export const useOrgFormData = (directorSlot: number = 1) => {
  const { data: apiStructure, refetch } = useGetStructureQuery(directorSlot);

  console.log('======================api', apiStructure);
  const [updateDepartments] = useUpdateDepartmentsMutation();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState<TStructure | null>(null);
  const [kickMemberIds, setKickMemberIds] = React.useState<string[]>([]);

  const serverData = apiStructure ?? MOCK_STRUCTURE;
  const structure = formData ?? serverData;
  const canEditAnything = hasAnyEditPermission(structure);

  //---------------------------------------
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  //---------------------------------------
  const startEditing = React.useCallback(() => {
    setIsEditing(true);
    setFormData(deepCloneStructure(serverData));
    setKickMemberIds([]);
  }, [serverData]);

  //---------------------------------------
  const cancelEdit = React.useCallback(() => {
    setIsEditing(false);
    setFormData(null);
    setKickMemberIds([]);
  }, []);

  //---------------------------------------
  const saveEdit = React.useCallback(async () => {
    if (!formData) {
      return;
    }
    try {
      const payload = buildSavePayload(formData, serverData, kickMemberIds);
      await updateDepartments(payload).unwrap();
      showToast({ type: 'success', message: '조직도가 저장되었습니다.' });
      setIsEditing(false);
      setFormData(null);
      setKickMemberIds([]);
      refetch();
    } catch (error) {
      console.error('Failed to save organization changes:', error);
    }
  }, [
    formData,
    serverData,
    kickMemberIds,
    updateDepartments,
    showToast,
    refetch,
  ]);

  //---------------------------------------
  const editActions = React.useMemo<TOrgEditActions>(
    () => ({
      renameCompany: (newName: string) => {
        setFormData(prev => {
          if (!prev) {
            return prev;
          }
          return { ...prev, companyName: newName };
        });
      },

      createDepartment: (name: string) => {
        setFormData(prev => {
          if (!prev) {
            return prev;
          }
          const newDept = {
            id: generateTempId(),
            name,
            canEdit: true,
            departmentHead: null,
            teams: [
              {
                id: generateTempId(),
                name: '기본팀',
                isDefault: true,
                canEdit: true,
                teamLeader: null,
                members: [],
                totalMembers: 0,
              },
            ],
          };
          return {
            ...prev,
            departments: [...prev.departments, newDept],
            totalDepartments: prev.totalDepartments + 1,
          };
        });
      },

      renameDepartment: (deptId: string, newName: string) => {
        setFormData(prev => {
          if (!prev) {
            return prev;
          }
          return {
            ...prev,
            departments: prev.departments.map(dept =>
              dept.id === deptId ? { ...dept, name: newName } : dept,
            ),
          };
        });
      },

      addTeam: (deptId: string, teamName: string) => {
        setFormData(prev => {
          if (!prev) {
            return prev;
          }
          return {
            ...prev,
            departments: prev.departments.map(dept => {
              if (dept.id !== deptId) {
                return dept;
              }
              const newTeam = {
                id: generateTempId(),
                name: teamName,
                isDefault: false,
                canEdit: true,
                teamLeader: null,
                members: [],
                totalMembers: 0,
              };
              return { ...dept, teams: [...dept.teams, newTeam] };
            }),
          };
        });
      },

      renameTeam: (deptId: string, teamId: string, newName: string) => {
        setFormData(prev => {
          if (!prev) {
            return prev;
          }
          return {
            ...prev,
            departments: prev.departments.map(dept => {
              if (dept.id !== deptId) {
                return dept;
              }
              return {
                ...dept,
                teams: dept.teams.map(team =>
                  team.id === teamId ? { ...team, name: newName } : team,
                ),
              };
            }),
          };
        });
      },

      setDepartmentHead: (deptId: string, member: TMember) => {
        setFormData(prev => {
          if (!prev) {
            return prev;
          }
          const cleaned = removeMemberFromPositions(prev, member.memberId);
          return {
            ...cleaned,
            departments: cleaned.departments.map(dept =>
              dept.id === deptId
                ? { ...dept, departmentHead: { ...member } }
                : dept,
            ),
          };
        });
      },

      removeDepartmentHead: (deptId: string) => {
        setFormData(prev => {
          if (!prev) {
            return prev;
          }
          return {
            ...prev,
            departments: prev.departments.map(dept =>
              dept.id === deptId ? { ...dept, departmentHead: null } : dept,
            ),
          };
        });
      },

      setTeamLeader: (deptId: string, teamId: string, member: TMember) => {
        setFormData(prev => {
          if (!prev) {
            return prev;
          }
          const cleaned = removeMemberFromPositions(prev, member.memberId);
          return {
            ...cleaned,
            departments: cleaned.departments.map(dept => {
              if (dept.id !== deptId) {
                return dept;
              }
              return {
                ...dept,
                teams: dept.teams.map(team => {
                  if (team.id !== teamId) {
                    return team;
                  }
                  return {
                    ...team,
                    teamLeader: { ...member },
                    totalMembers: team.totalMembers + 1,
                  };
                }),
              };
            }),
          };
        });
      },

      removeTeamLeader: (deptId: string, teamId: string) => {
        setFormData(prev => {
          if (!prev) {
            return prev;
          }
          return {
            ...prev,
            departments: prev.departments.map(dept => {
              if (dept.id !== deptId) {
                return dept;
              }
              return {
                ...dept,
                teams: dept.teams.map(team => {
                  if (team.id !== teamId) {
                    return team;
                  }
                  return {
                    ...team,
                    teamLeader: null,
                    totalMembers: Math.max(0, team.totalMembers - 1),
                  };
                }),
              };
            }),
          };
        });
      },

      addTeamMember: (deptId: string, teamId: string, member: TMember) => {
        setFormData(prev => {
          if (!prev) {
            return prev;
          }
          const cleaned = removeMemberFromPositions(prev, member.memberId);
          return {
            ...cleaned,
            departments: cleaned.departments.map(dept => {
              if (dept.id !== deptId) {
                return dept;
              }
              return {
                ...dept,
                teams: dept.teams.map(team => {
                  if (team.id !== teamId) {
                    return team;
                  }
                  return {
                    ...team,
                    members: [...team.members, { ...member }],
                    totalMembers: team.totalMembers + 1,
                  };
                }),
              };
            }),
          };
        });
      },

      removeTeamMember: (deptId: string, teamId: string, memberId: string) => {
        setKickMemberIds(prev =>
          prev.includes(memberId) ? prev : [...prev, memberId],
        );
        setFormData(prev => {
          if (!prev) {
            return prev;
          }
          return {
            ...prev,
            departments: prev.departments.map(dept => {
              if (dept.id !== deptId) {
                return dept;
              }
              return {
                ...dept,
                teams: dept.teams.map(team => {
                  if (team.id !== teamId) {
                    return team;
                  }
                  return {
                    ...team,
                    members: team.members.filter(m => m.memberId !== memberId),
                    totalMembers: Math.max(0, team.totalMembers - 1),
                  };
                }),
              };
            }),
          };
        });
      },

      addDirector: (member: TMember) => {
        setFormData(prev => {
          if (!prev) {
            return prev;
          }
          return {
            ...prev,
            directors: [
              ...prev.directors,
              { ...member, role: '총괄 2', roleSlug: 'director_2' },
            ],
            departments: prev.departments.map(dept => ({
              ...dept,
              departmentHead:
                dept.departmentHead?.memberId === member.memberId
                  ? null
                  : dept.departmentHead,
              teams: dept.teams.map(team => ({
                ...team,
                teamLeader:
                  team.teamLeader?.memberId === member.memberId
                    ? null
                    : team.teamLeader,
                members: team.members.filter(
                  m => m.memberId !== member.memberId,
                ),
              })),
            })),
          };
        });
      },

      removeDirector: (memberId: string) => {
        setFormData(prev => {
          if (!prev) {
            return prev;
          }
          return {
            ...prev,
            directors: prev.directors.filter(d => d.memberId !== memberId),
          };
        });
      },

      kickMember: (memberId: string) => {
        setKickMemberIds(prev =>
          prev.includes(memberId) ? prev : [...prev, memberId],
        );
        setFormData(prev => {
          if (!prev) {
            return prev;
          }
          return {
            ...prev,
            directors: prev.directors.filter(d => d.memberId !== memberId),
            departments: prev.departments.map(dept => ({
              ...dept,
              departmentHead:
                dept.departmentHead?.memberId === memberId
                  ? null
                  : dept.departmentHead,
              teams: dept.teams.map(team => ({
                ...team,
                teamLeader:
                  team.teamLeader?.memberId === memberId
                    ? null
                    : team.teamLeader,
                members: team.members.filter(m => m.memberId !== memberId),
                totalMembers:
                  team.totalMembers -
                  (team.teamLeader?.memberId === memberId ? 1 : 0) -
                  (team.members.some(m => m.memberId === memberId) ? 1 : 0),
              })),
            })),
          };
        });
      },
    }),
    [],
  );

  return {
    structure,
    isEditing,
    canEditAnything,
    isSingleDirectorCompany: serverData.directors.length <= 1,
    editActions,
    startEditing,
    cancelEdit,
    saveEdit,
  };
};
