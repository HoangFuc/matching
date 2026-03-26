export type TMember = {
  memberId: string;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
  roleSlug: string;
  isMe: boolean;
};

export type TTeam = {
  id: string;
  name: string;
  isDefault: boolean;
  members: TMember[];
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
  departmentHead: TDepartmentHead | null;
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
};

export type TStructure = {
  companyName: string;
  totalMembers: number;
  directors: TDirector[];
  departments: TDepartment[];
  totalDepartments: number;
};
