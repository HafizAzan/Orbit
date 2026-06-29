import type { RegisterAs } from "../types/auth.types";

export function canChangeOwnEmail(role: RegisterAs) {
  return role === "owner";
}

export function canRequestOwnEmailChange(role: RegisterAs) {
  return role === "admin" || role === "manager" || role === "member";
}

export function getEmailChangeRequestRecipientLabel(actorRole: RegisterAs) {
  if (actorRole === "admin") {
    return "organization owner";
  }

  return "workspace admin";
}

export function canActorChangeMemberEmail(actorRole: RegisterAs, targetRole: RegisterAs) {
  if (actorRole === "owner") {
    return targetRole === "admin" || targetRole === "manager" || targetRole === "member";
  }

  if (actorRole === "admin") {
    return targetRole === "manager" || targetRole === "member";
  }

  return false;
}
