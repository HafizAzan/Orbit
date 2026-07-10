import type { ActivityRecord } from "../data/admin-activity";
import type { OrganizationRecord } from "../data/admin-organizations";
import type { SubscriptionRecord } from "../data/admin-subscriptions";
import type { UserRecord } from "../data/admin-users";
import { ADMIN_ROUTES } from "../router/admin-routes";
import { matchesSearchQuery } from "./helper";

export const ADMIN_TABLE_SEARCH_PARAM = "search";

export const ADMIN_SEARCH_CATEGORY_LABELS = {
  organizations: "Organizations",
  users: "Users",
  subscriptions: "Subscriptions",
  activity: "Activity",
} as const;

export type AdminGlobalSearchCategory = keyof typeof ADMIN_SEARCH_CATEGORY_LABELS;

export type AdminGlobalSearchResult = {
  id: string;
  category: AdminGlobalSearchCategory;
  title: string;
  subtitle: string;
  route: string;
};

export type AdminGlobalSearchSources = {
  organizations: OrganizationRecord[];
  users: UserRecord[];
  subscriptions: SubscriptionRecord[];
  activities: ActivityRecord[];
};

const RESULTS_PER_CATEGORY = 4;
const MIN_QUERY_LENGTH = 2;

export function buildAdminSearchUrl(route: string, query: string) {
  const trimmed = query.trim();
  if (!trimmed) return route;

  const params = new URLSearchParams({ [ADMIN_TABLE_SEARCH_PARAM]: trimmed });
  return `${route}?${params.toString()}`;
}

function pushResult(
  results: AdminGlobalSearchResult[],
  counts: Record<AdminGlobalSearchCategory, number>,
  result: AdminGlobalSearchResult,
) {
  if (counts[result.category] >= RESULTS_PER_CATEGORY) return;

  results.push(result);
  counts[result.category] += 1;
}

export function searchAdminGlobal(
  query: string,
  sources: AdminGlobalSearchSources,
): AdminGlobalSearchResult[] {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length < MIN_QUERY_LENGTH) return [];

  const results: AdminGlobalSearchResult[] = [];
  const counts: Record<AdminGlobalSearchCategory, number> = {
    organizations: 0,
    users: 0,
    subscriptions: 0,
    activity: 0,
  };

  for (const organization of sources.organizations) {
    const matches =
      matchesSearchQuery(organization.name, normalizedQuery) ||
      matchesSearchQuery(organization.slug, normalizedQuery) ||
      matchesSearchQuery(organization.ownerName, normalizedQuery) ||
      matchesSearchQuery(organization.ownerEmail, normalizedQuery);

    if (!matches) continue;

    pushResult(results, counts, {
      id: `organization-${organization.id}`,
      category: "organizations",
      title: organization.name,
      subtitle: organization.ownerEmail,
      route: ADMIN_ROUTES.ORGANIZATIONS,
    });
  }

  for (const user of sources.users) {
    const matches =
      matchesSearchQuery(user.name, normalizedQuery) ||
      matchesSearchQuery(user.email, normalizedQuery) ||
      matchesSearchQuery(user.organization, normalizedQuery);

    if (!matches) continue;

    pushResult(results, counts, {
      id: `user-${user.id}`,
      category: "users",
      title: user.name,
      subtitle: user.email,
      route: ADMIN_ROUTES.USERS,
    });
  }

  for (const subscription of sources.subscriptions) {
    const matches =
      matchesSearchQuery(subscription.organizationName, normalizedQuery) ||
      matchesSearchQuery(subscription.contactEmail, normalizedQuery) ||
      matchesSearchQuery(subscription.plan, normalizedQuery);

    if (!matches) continue;

    pushResult(results, counts, {
      id: `subscription-${subscription.id}`,
      category: "subscriptions",
      title: subscription.organizationName,
      subtitle: `${subscription.plan} · ${subscription.billingCycle}`,
      route: ADMIN_ROUTES.SUBSCRIPTIONS,
    });
  }

  for (const activity of sources.activities) {
    const matches =
      matchesSearchQuery(activity.title, normalizedQuery) ||
      matchesSearchQuery(activity.description, normalizedQuery) ||
      matchesSearchQuery(activity.organization, normalizedQuery) ||
      matchesSearchQuery(activity.actor, normalizedQuery);

    if (!matches) continue;

    pushResult(results, counts, {
      id: `activity-${activity.id}`,
      category: "activity",
      title: activity.title,
      subtitle: `${activity.organization} · ${activity.actor}`,
      route: ADMIN_ROUTES.ACTIVITY,
    });
  }

  return results;
}

export function groupAdminSearchResults(results: AdminGlobalSearchResult[]) {
  const order: AdminGlobalSearchCategory[] = ["organizations", "users", "subscriptions", "activity"];

  return order
    .map((category) => {
      const items = results.filter((result) => result.category === category);
      if (!items.length) return null;

      return {
        label: ADMIN_SEARCH_CATEGORY_LABELS[category],
        options: items.map((item) => ({
          value: item.id,
          label: item.title,
          result: item,
        })),
      };
    })
    .filter((group): group is NonNullable<typeof group> => group !== null);
}
