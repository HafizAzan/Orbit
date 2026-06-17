import type { OrganizationPlan, OrganizationStatus } from "../data/admin-organizations";
import type { RegisterAs } from "./auth.types";

export type WorkspaceOrganization = {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  billingEmail: string | null;
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
  members: OrganizationMember[];
};

export type UpdateWorkspaceOrganizationRequest = {
  name?: string;
  slug?: string;
  billingEmail?: string;
};

export type UpdateOrganizationMemberRoleRequest = {
  role: Extract<RegisterAs, "admin" | "manager" | "member">;
};
