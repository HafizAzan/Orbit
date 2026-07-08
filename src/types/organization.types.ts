import type { OrganizationPlan, OrganizationStatus } from "../data/admin-organizations";
import type { RegisterAs } from "./auth.types";

export type WorkspaceOrganizationSettings = {
  dailyDigest: boolean;
  realtimePush: boolean;
  weeklyReport: boolean;
  twoFactorRequired: boolean;
  sessionTimeoutEnabled: boolean;
  sessionTimeoutMinutes: number;
};

export type WorkspaceOrganization = {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  billingEmail: string | null;
  workspaceSettings: WorkspaceOrganizationSettings;
  plan: {
    code: OrganizationPlan;
    name: string;
    status: string;
    createdAt: string;
    expiresAt: string | null;
  };
  users: number;
  projects: number;
  status: OrganizationStatus;
  createdAt: string;
};

export type OrganizationMember = {
  id: string;
  fullName: string;
  email: string;
  role: RegisterAs;
  accountStatus: "pending" | "active" | "suspended";
  emailVerificationStatus: "pending" | "verified";
  joinedAt: string;
};

export type OrganizationMembersSummary = {
  occupiedSeats: number;
  totalSeats: number;
  data: OrganizationMember[];
  page: number;
  limit: number;
  total: number;
};

export type UpdateWorkspaceOrganizationRequest = {
  name?: string;
  slug?: string;
  billingEmail?: string;
  workspaceSettings?: Partial<WorkspaceOrganizationSettings>;
};

export type UpdateOrganizationMemberRoleRequest = {
  role: Extract<RegisterAs, "admin" | "manager" | "member">;
};

export type UpdateOrganizationMemberEmailRequest = {
  email: string;
};

export type OrganizationAboutPerson = {
  id: string;
  fullName: string;
  email: string;
  role: RegisterAs;
};

export type OrganizationAbout = {
  organization: {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
  };
  owner: OrganizationAboutPerson;
  admins: {
    count: number;
    data: OrganizationAboutPerson[];
  };
  managers: {
    count: number;
    data: OrganizationAboutPerson[];
  };
};
