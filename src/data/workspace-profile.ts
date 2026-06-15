import type { RegisterAs } from "../types/auth.types";
import type { AuthUser } from "../types/auth.types";

export type WorkspaceProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  role: RegisterAs;
  emailVerified: boolean;
  accountStatus: AuthUser["accountStatus"];
  organizationName: string;
  organizationId: string | null;
};

export const WORKSPACE_PROFILE_TABS = [
  { key: "personal", label: "Personal Info", roles: ["owner", "admin", "manager", "member"] as RegisterAs[] },
  { key: "security", label: "Security", roles: ["owner", "admin", "manager", "member"] as RegisterAs[] },
  { key: "organization", label: "Organization", roles: ["owner", "admin"] as RegisterAs[] },
] as const;

export type WorkspaceProfileTab = (typeof WORKSPACE_PROFILE_TABS)[number]["key"];

export {
  PROFILE_PASSWORD_HINTS,
  PROFILE_EMAIL_SECURITY_NOTE,
  EMAIL_CHANGE_STEPS,
  FORGOT_PASSWORD_FLOW_STEPS,
  FORGOT_PASSWORD_NOTE,
} from "./admin-profile";

export function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return { firstName: "", lastName: "" };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

export function buildWorkspaceProfileFromUser(user: AuthUser): WorkspaceProfile {
  const { firstName, lastName } = splitFullName(user.name);

  return {
    id: user.id,
    firstName,
    lastName,
    email: user.email,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email)}`,
    role: user.role,
    emailVerified: user.emailVerificationStatus === "verified",
    accountStatus: user.accountStatus,
    organizationName: user.organization?.name ?? "—",
    organizationId: user.organization?.id ?? null,
  };
}

export function getWorkspaceProfileDisplayName(profile: Pick<WorkspaceProfile, "firstName" | "lastName">) {
  return `${profile.firstName} ${profile.lastName}`.trim();
}
