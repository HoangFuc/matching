import React from 'react';

import type { TMember } from '../type';

export type TOrgEditActions = {
  renameCompany: (newName: string) => void;
  createDepartment: (name: string, managedById?: string) => void;
  renameDepartment: (deptId: string, newName: string) => void;
  addTeam: (deptId: string, teamName: string) => void;
  renameTeam: (deptId: string, teamId: string, newName: string) => void;
  setDepartmentHead: (deptId: string, member: TMember) => void;
  removeDepartmentHead: (deptId: string) => void;
  setTeamLeader: (deptId: string, teamId: string, member: TMember) => void;
  removeTeamLeader: (deptId: string, teamId: string) => void;
  addTeamMember: (deptId: string, teamId: string, member: TMember) => void;
  removeTeamMember: (deptId: string, teamId: string, memberId: string) => void;
  addDirector: (member: TMember) => void;
  removeDirector: (memberId: string) => void;
  kickMember: (memberId: string) => void;
};

const noop = () => {};

const defaultActions: TOrgEditActions = {
  renameCompany: noop,
  createDepartment: noop,
  renameDepartment: noop,
  addTeam: noop,
  renameTeam: noop,
  setDepartmentHead: noop,
  removeDepartmentHead: noop,
  setTeamLeader: noop,
  removeTeamLeader: noop,
  addTeamMember: noop,
  removeTeamMember: noop,
  addDirector: noop,
  removeDirector: noop,
  kickMember: noop,
};

export const OrgEditContext = React.createContext<TOrgEditActions>(defaultActions);

export const useOrgEditActions = () => React.useContext(OrgEditContext);
