import { useCallback, useState } from 'react';

export type Team = {
  id: string;
  name: string;
  isDefault: boolean;
};

export type Department = {
  id: string;
  name: string;
  teams: Team[];
};

let nextId = 1;

//---------------------------------------
const uniqueId = (prefix: string) => `${prefix}-${Date.now()}-${nextId++}`;

//---------------------------------------
const createTeam = (isDefault = false): Team => ({
  id: uniqueId('team'),
  name: '',
  isDefault,
});

//---------------------------------------
const createDepartment = (): Department => ({
  id: uniqueId('dept'),
  name: '',
  teams: [],
});

export const useOrgChartDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 'dept-1',
      name: '',
      teams: [{ id: 'team-1', name: '', isDefault: true }],
    },
  ]);

  //---------------------------------------
  const totalDepartments = departments.length;
  const totalTeams = departments.reduce(
    (sum, dept) => sum + dept.teams.length,
    0,
  );
  const canDeleteDept = departments.length > 1;
  const isValid = departments.every(
    dept =>
      dept.name.trim() !== '' &&
      dept.teams.every(team => team.name.trim() !== ''),
  );

  //---------------------------------------
  const addDepartment = useCallback(() => {
    setDepartments(prev => [...prev, createDepartment()]);
  }, []);

  //---------------------------------------
  const deleteDepartment = useCallback((deptId: string) => {
    setDepartments(prev => prev.filter(dept => dept.id !== deptId));
  }, []);

  //---------------------------------------
  const updateDeptName = useCallback((deptId: string, value: string) => {
    setDepartments(prev =>
      prev.map(dept =>
        dept.id === deptId ? { ...dept, name: value } : dept,
      ),
    );
  }, []);

  //---------------------------------------
  const addTeam = useCallback((deptId: string) => {
    setDepartments(prev =>
      prev.map(dept =>
        dept.id === deptId
          ? { ...dept, teams: [...dept.teams, createTeam()] }
          : dept,
      ),
    );
  }, []);

  //---------------------------------------
  const deleteTeam = useCallback((deptId: string, teamId: string) => {
    setDepartments(prev =>
      prev.map(dept =>
        dept.id === deptId
          ? { ...dept, teams: dept.teams.filter(t => t.id !== teamId) }
          : dept,
      ),
    );
  }, []);

  //---------------------------------------
  const updateTeamName = useCallback(
    (deptId: string, teamId: string, value: string) => {
      setDepartments(prev =>
        prev.map(dept =>
          dept.id === deptId
            ? {
                ...dept,
                teams: dept.teams.map(team =>
                  team.id === teamId ? { ...team, name: value } : team,
                ),
              }
            : dept,
        ),
      );
    },
    [],
  );

  //---------------------------------------
  const toggleDefault = useCallback((deptId: string, teamId: string) => {
    setDepartments(prev => {
      const target = prev
        .find(d => d.id === deptId)
        ?.teams.find(t => t.id === teamId);
      const newValue = !target?.isDefault;

      return prev.map(dept => {
        if (dept.id !== deptId) {
          return dept;
        }
        return {
          ...dept,
          teams: dept.teams.map(team => ({
            ...team,
            isDefault: team.id === teamId ? newValue : false,
          })),
        };
      });
    });
  }, []);

  //---------------------------------------
  const toJson = useCallback(
    () =>
      JSON.stringify(
        departments.map(dept => ({
          name: dept.name,
          teams: dept.teams.map(team => ({
            name: team.name,
            isDefault: team.isDefault,
          })),
        })),
      ),
    [departments],
  );

  return {
    departments,
    totalDepartments,
    totalTeams,
    canDeleteDept,
    isValid,
    addDepartment,
    deleteDepartment,
    updateDeptName,
    addTeam,
    deleteTeam,
    updateTeamName,
    toggleDefault,
    toJson,
  };
};
