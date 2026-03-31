import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import {
  companyApi,
  useGetStructureQuery,
  useUpdateDepartmentsMutation,
} from '@/src/store/api/company.api';
import type { TUpdateDepartmentsParams } from '@/src/store/api/company.api';
import { useToast } from '@/src/providers/ToastProvider';
import { useAppDispatch } from '@/src/store/hooks';
import type { TOrgEditActions } from '../context/OrgEditContext';
import type { TMember, TStructure } from '../type';

//---------------------------------------
const EMPTY_STRUCTURE: TStructure = {
  companyName: '',
  totalMembers: 0,
  canEdit: false,
  directors: [],
  departments: [],
  totalDepartments: 0,
};

//---------------------------------------
const generateTempId = () =>
  `temp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

//---------------------------------------
const deepCloneStructure = (structure: TStructure): TStructure =>
  JSON.parse(JSON.stringify(structure));

//---------------------------------------
const memberExistsInStructure = (
  structure: TStructure,
  memberId: string,
): boolean => {
  for (const dept of structure.departments) {
    if (dept.departmentHead?.memberId === memberId) {
      return true;
    }
    for (const team of dept.teams) {
      if (team.teamLeader?.memberId === memberId) {
        return true;
      }
      if (team.members.some(m => m.memberId === memberId)) {
        return true;
      }
    }
  }
  if (structure.directors.some(d => d.memberId === memberId)) {
    return true;
  }
  return false;
};

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
  const isAdmin = server.canEdit;
  const isDirector = server.directors.some(d => d.isMe);

  const departments = form.departments.map(dept => {
    const deptCanEdit = isAdmin || dept.canEdit;

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
      ...(isAdmin && { managedById: dept.managedById }),
      ...(isDirector && { headId: dept.departmentHead?.memberId }),
      teams: dept.teams.map(team => {
        const teamCanEdit = isAdmin || dept.canEdit || team.canEdit;

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

  if (isAdmin) {
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
  if (structure.directors.some(d => d.isMe)) {
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
export const useOrgFormData = (directorSlot: number | null) => {
  const slot = directorSlot ?? 1;
  const { data: apiStructure, isLoading, isFetching, refetch } = useGetStructureQuery(slot, {
    skip: directorSlot === null,
  });

  const dispatch = useAppDispatch();
  const [updateDepartments] = useUpdateDepartmentsMutation();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState<TStructure | null>(null);
  const [kickMemberIds, setKickMemberIds] = React.useState<string[]>([]);
  const formDataCacheRef = React.useRef<Record<number, TStructure>>({});
  const serverDataCacheRef = React.useRef<Record<number, TStructure>>({});
  const prevSlotRef = React.useRef(slot);

  const serverData = apiStructure ?? EMPTY_STRUCTURE;
  const structure = formData ?? serverData;
  const canEditAnything = hasAnyEditPermission(structure);

  React.useEffect(() => {
    console.log('[OrgChart] directors:', JSON.stringify(structure.directors, null, 2));
  }, [structure.directors]);

  const hasChanges = React.useMemo(() => {
    if (!formData || kickMemberIds.length > 0) {
      return kickMemberIds.length > 0;
    }
    const original = serverDataCacheRef.current[slot];
    if (!original) {
      return false;
    }
    return JSON.stringify(formData) !== JSON.stringify(original);
  }, [formData, kickMemberIds, slot]);

  //---------------------------------------
  useFocusEffect(
    React.useCallback(() => {
      if (directorSlot !== null) {
        refetch();
      }
    }, [directorSlot, refetch]),
  );

  //---------------------------------------
  React.useEffect(() => {
    if (!isEditing) {
      prevSlotRef.current = slot;
      return;
    }

    if (prevSlotRef.current !== slot) {
      setFormData(current => {
        if (current) {
          formDataCacheRef.current[prevSlotRef.current] = current;
        }
        prevSlotRef.current = slot;

        const cached = formDataCacheRef.current[slot];
        return cached ? deepCloneStructure(cached) : null;
      });
    }
  }, [slot, isEditing]);

  //---------------------------------------
  React.useEffect(() => {
    if (isEditing && apiStructure && !formData && !formDataCacheRef.current[slot]) {
      serverDataCacheRef.current[slot] = deepCloneStructure(apiStructure);
      setFormData(deepCloneStructure(apiStructure));
    }
  }, [apiStructure, isEditing, slot, formData]);

  //---------------------------------------
  const startEditing = React.useCallback(() => {
    formDataCacheRef.current = {};
    serverDataCacheRef.current = { [slot]: deepCloneStructure(serverData) };
    setIsEditing(true);
    setFormData(deepCloneStructure(serverData));
    setKickMemberIds([]);
  }, [serverData, slot]);

  //---------------------------------------
  const cancelEdit = React.useCallback(() => {
    formDataCacheRef.current = {};
    serverDataCacheRef.current = {};
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
      // Fetch departments from director slots not yet cached
      const totalDirectors = formData.directors.length;
      for (let slot = 1; slot <= totalDirectors; slot++) {
        if (!serverDataCacheRef.current[slot]) {
          const result = await dispatch(
            companyApi.endpoints.getStructure.initiate(slot),
          ).unwrap();
          serverDataCacheRef.current[slot] = deepCloneStructure(result);
        }
      }

      // Base: all server departments from all slots
      const deptMap = new Map<string, TStructure['departments'][number]>();
      for (const cached of Object.values(serverDataCacheRef.current)) {
        for (const dept of cached.departments) {
          deptMap.set(dept.id, dept);
        }
      }

      // Override with cached edits from other slots
      for (const [cachedSlot, cached] of Object.entries(formDataCacheRef.current)) {
        if (Number(cachedSlot) !== slot) {
          for (const dept of cached.departments) {
            deptMap.set(dept.id, dept);
          }
        }
      }

      // Override with current slot edits (highest priority)
      for (const dept of formData.departments) {
        deptMap.set(dept.id, dept);
      }

      const mergedFormData = {
        ...formData,
        departments: Array.from(deptMap.values()),
      };

      const payload = buildSavePayload(mergedFormData, serverData, kickMemberIds);
      await updateDepartments(payload).unwrap();
      showToast({ type: 'success', message: '조직도가 저장되었습니다.' });
      formDataCacheRef.current = {};
      serverDataCacheRef.current = {};
      setIsEditing(false);
      setFormData(null);
      setKickMemberIds([]);
      refetch();
    } catch (error) {
      console.error('Failed to save organization changes:', error);
    }
  }, [
    formData,
    slot,
    serverData,
    kickMemberIds,
    updateDepartments,
    showToast,
    refetch,
    dispatch,
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

      createDepartment: (name: string, managedById?: string) => {
        setFormData(prev => {
          if (!prev) {
            return prev;
          }
          const myDirector = prev.directors.find(d => d.isMe);
          const newDept = {
            id: generateTempId(),
            name,
            canEdit: true,
            managedById: managedById ?? myDirector?.memberId,
            departmentHead: null,
            teams: [],
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
          const newDirectors = [...prev.directors];
          newDirectors[1] = { ...member, role: '총괄 2', roleSlug: 'director_2' };
          return {
            ...prev,
            directors: newDirectors,
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
        const existsInServer = Object.values(
          serverDataCacheRef.current,
        ).some(cached => memberExistsInStructure(cached, memberId));
        if (existsInServer) {
          setKickMemberIds(prev =>
            prev.includes(memberId) ? prev : [...prev, memberId],
          );
        }
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
    isLoading,
    isFetching,
    refetch,
    isEditing,
    hasChanges,
    canEditAnything,
    isSingleDirectorCompany: serverData.directors.length <= 1,
    editActions,
    startEditing,
    cancelEdit,
    saveEdit,
  };
};
