import type { OrganizationPlan, OrganizationRecord, OrganizationStatus } from "../data/admin-organizations";
import { normalizeEmail, normalizeText } from "./helper";

export type CreateOrganizationInput = {
  name: string;
  ownerName: string;
  ownerEmail: string;
  plan: OrganizationPlan;
  status: OrganizationStatus;
};

export function generateOrganizationSlug(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return slug || "organization";
}

export function ensureUniqueOrganizationSlug(slug: string, existingSlugs: string[]) {
  if (!existingSlugs.includes(slug)) return slug;

  let counter = 2;

  while (existingSlugs.includes(`${slug}-${counter}`)) {
    counter += 1;
  }

  return `${slug}-${counter}`;
}

export function updateOrganizationRecord(
  existing: OrganizationRecord,
  input: CreateOrganizationInput,
  allOrganizations: OrganizationRecord[],
): OrganizationRecord {
  const existingSlugs = allOrganizations.filter((organization) => organization.id !== existing.id).map((organization) => organization.slug);
  const baseSlug = generateOrganizationSlug(input.name);
  const slug = ensureUniqueOrganizationSlug(baseSlug, existingSlugs);

  return {
    ...existing,
    name: normalizeText(input.name),
    slug,
    ownerName: normalizeText(input.ownerName),
    ownerEmail: normalizeEmail(input.ownerEmail),
    plan: input.plan,
    status: input.status,
  };
}

export function createOrganizationRecord(
  input: CreateOrganizationInput,
  existingOrganizations: OrganizationRecord[],
): OrganizationRecord {
  const baseSlug = generateOrganizationSlug(input.name);
  const existingSlugs = existingOrganizations.map((organization) => organization.slug);
  const slug = ensureUniqueOrganizationSlug(baseSlug, existingSlugs);
  const maxId = existingOrganizations.reduce((max, organization) => Math.max(max, Number(organization.id) || 0), 0);

  return {
    id: String(maxId + 1),
    name: normalizeText(input.name),
    slug,
    ownerName: normalizeText(input.ownerName),
    ownerEmail: normalizeEmail(input.ownerEmail),
    plan: input.plan,
    status: input.status,
    users: 0,
    projects: 0,
    createdAt: new Date().toISOString().slice(0, 10),
  };
}
