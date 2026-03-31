export type TMember = {
  memberId: string;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
  roleSlug: string;
  isMe: boolean;
  teamName?: string | null;
  departmentName?: string | null;
};

export type TTeam = {
  id: string;
  name: string;
  isDefault: boolean;
  canEdit: boolean;
  teamLeader?: TMember | null;
  members: TMember[];
  totalMembers: number;
};

export type TDepartmentHead = {
  memberId: string;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
  roleSlug: string;
  isMe: boolean;
};

export type TDepartment = {
  id: string;
  name: string;
  canEdit: boolean;
  managedById?: string;
  departmentHead?: TDepartmentHead | null;
  teams: TTeam[];
};

export type TDirector = {
  memberId: string;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
  roleSlug: string;
  isMe: boolean;
  isAdmin?: boolean;
};

export type TStructure = {
  companyName: string;
  totalMembers: number;
  canEdit: boolean;
  directors: TDirector[];
  departments: TDepartment[];
  totalDepartments: number;
};
