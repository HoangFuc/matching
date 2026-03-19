export type TMember = {
  id: string;
  name: string;
  role: '팀장' | '팀원';
  avatar?: string;
};

export type TTeam = {
  id: string;
  name: string;
  members: TMember[];
};

export type TDepartment = {
  id: string;
  name: string;
  teams: TTeam[];
};

export type THeadquarters = {
  id: string;
  name: string;
  departments: TDepartment[];
};
