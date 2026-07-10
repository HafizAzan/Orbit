import type { RegisterAs } from "./auth.types";

export type ActivityModule =
  | "tasks"
  | "projects"
  | "teams"
  | "members"
  | "organization"
  | "security"
  | "billing"
  | "github";

export type ActivityAction =
  | "created"
  | "updated"
  | "deleted"
  | "assigned"
  | "status_changed"
  | "invited"
  | "removed"
  | "role_changed"
  | "email_changed"
  | "requested";

export type ActivityEvent = {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: RegisterAs;
  module: ActivityModule;
  action: ActivityAction;
  summary: string;
  targetLabel: string | null;
  resourceType: string | null;
  resourceId: string | null;
  projectId: string | null;
  createdAt: string;
  canDelete: boolean;
};

export type ActivityFeedItem = {
  id: string;
  userName: string;
  action: string;
  target: string;
  timeAgo: string;
  avatarColor: string;
  module: ActivityModule;
  createdAt: string;
  canDelete: boolean;
};

export type ActivityListResponse = {
  data: ActivityEvent[];
  page: number;
  limit: number;
  total: number;
};
