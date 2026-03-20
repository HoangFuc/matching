// ── OTP ──────────────────────────────────────────────
export interface IOtpSendParams {
  phone: string;
  purpose: string;
}

export interface IOtpSendResponse {
  message: string;
}

export interface IOtpVerifyParams {
  phone: string;
  code: string;
}

export interface IOtpVerifyResponse {
  phoneVerificationToken: string;
}

// ── Login ────────────────────────────────────────────
export interface ILoginParams {
  phone: string;
  password: string;
}

export interface IAuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  isNewUser?: boolean;
  user: IAuthUser;
  companies: ICompanyResponse[];
}

// ── Join Company ─────────────────────────────────────
export interface IJoinCompanyParams {
  inviteCode: string;
}

export interface IAuthUser {
  id: string;
  fullName: string;
  phone: string;
}

export interface ICompanyResponse {
  id: string;
  name: string;
  directorCount: number;
  departments: ICompanyDepartment[];
}

export interface ICompanyDepartment {
  id: string;
  name: string;
  teams: ICompanyTeam[];
}

export interface ICompanyTeam {
  id: string;
  name: string;
  isDefault: boolean;
}

// ── Social Login ─────────────────────────────────────
export interface ISocialLoginParams {
  provider: 'google' | 'kakao' | 'naver';
  accessToken: string;
}

// ── Register Company ─────────────────────────────────
export interface IRegisterCompanyParams {
  // Step 1 - JoinMembership
  fullName: string;
  phone: string;
  password: string;
  passwordConfirm: string;
  phoneVerificationToken: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
  // Step 2 - CreateAgency
  companyName: string;
  directorCount: number; // 1 = single, 2 = dual
  companyLogo?: { uri: string; type: string; name: string };
  // Step 3 - OrgChartSetup
  departments: string; // JSON string
}

// ── Create Company (Social Login) ────────────────────
export interface ICreateCompanyParams {
  companyName: string;
  directorCount: number;
  companyLogo?: { uri: string; type: string; name: string };
  departments: string; // JSON string
}

// ── Register with Invite ─────────────────────────────
export interface IRegisterWithInviteParams {
  inviteCode: string;
  fullName: string;
  phone: string;
  password: string;
  passwordConfirm: string;
  phoneVerificationToken: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
}

// ── Role Slugs ──────────────────────────────────────
export const ROLE_SLUGS = {
  DIRECTOR: 'director',
  DIRECTOR_2: 'director_2',
  DEPARTMENT_HEAD: 'department_head',
  TEAM_LEADER: 'team_leader',
  MEMBER: 'member',
} as const;

export type TRoleSlug = (typeof ROLE_SLUGS)[keyof typeof ROLE_SLUGS];

// ── Invitations ──────────────────────────────────────
export interface ICreateInvitationParams {
  roleSlug: string;
  departmentId?: string;
  teamId?: string;
  expiresInDays: number;
}

export interface IInvitationLink {
  id: string;
  inviteCode: string;
  inviteUrl: string;
  role: string;
  roleSlug: string;
  department: string | null;
  team: string | null;
  expiresAt: string;
  maxUses: number;
  linkType: string;
}

export interface IInvitationDetailCompany {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface IInvitationDetailDirector {
  fullName: string;
  avatarUrl: string | null;
  role: string;
  roleSlug: string;
}

export interface IInvitationDetailInviter {
  fullName: string;
  avatarUrl: string | null;
  roleName: string;
}

export interface IInvitationDetailRole {
  name: string;
  slug: string;
  description: string;
}

export interface IInvitationDetailDepartment {
  id: string;
  name: string;
}

export interface IInvitationDetailTeam {
  id: string;
  name: string;
}

export interface IInvitationDetailResponse {
  company: IInvitationDetailCompany;
  directors: IInvitationDetailDirector[];
  inviter: IInvitationDetailInviter;
  role: IInvitationDetailRole;
  department: IInvitationDetailDepartment | null;
  team: IInvitationDetailTeam | null;
  nodePath: string;
  expiresAt: string;
  linkType: string;
}

// ── Refresh / Logout ─────────────────────────────────
export interface IRefreshTokenParams {
  refreshToken: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ILogoutParams {
  refreshToken: string;
}
