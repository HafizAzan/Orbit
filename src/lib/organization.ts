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
