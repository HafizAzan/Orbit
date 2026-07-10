import React, { useMemo } from "react";
import PageSeo from "../../component/seo/page-seo";
import UserStatCard from "../../component/admin/users/user-stat-card";
import UsersTable from "../../component/admin/users/users-table";
import { Paragraph, Title } from "../../component/ui/typography";
import { AdminListPageSkeleton } from "../../component/skeletons";
import { useAdminUserStats, useAdminUsers } from "../../hooks/use-admin-users";
import { USERS_PAGE_SIZE, type UserStat } from "../../data/admin-users";

function AdminUsers() {
  const [page, setPage] = React.useState(1);
  const { data: usersPage, isLoading } = useAdminUsers({ page, limit: USERS_PAGE_SIZE });
  const { data: stats } = useAdminUserStats();

  const userStats: UserStat[] = useMemo(() => {
    if (!stats) return [];
    return [
      {
        id: "total",
        label: "Total Users",
        value: String(stats.total.value),
        meta: "Across all orgs",
        metaVariant: "muted",
        icon: "total",
      },
      {
        id: "active",
        label: "Active",
        value: String(stats.active.value),
        meta: `${stats.active.percentage}%`,
        metaVariant: "primary",
        icon: "active",
      },
      {
        id: "pending",
        label: "Pending",
        value: String(stats.pending.value),
        meta: `${stats.pending.percentage}%`,
        metaVariant: "muted",
        icon: "new",
      },
      {
        id: "suspended",
        label: "Suspended",
        value: String(stats.suspended.value),
        meta: `${stats.suspended.percentage}%`,
        metaVariant: "danger",
        icon: "suspended",
        variant: "danger",
      },
    ];
  }, [stats]);

  if (isLoading && !usersPage) {
    return <AdminListPageSkeleton />;
  }

  return (
    <div className="mx-auto max-w-8xl">
      <PageSeo title="Users Management" description="Manage all user accounts across organizations." noIndex />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Title level={2} className="text-2xl text-foreground lg:text-3xl">
            Users Management
          </Title>
          <Paragraph size="sm" className="mt-1 text-muted">
            Oversee and manage all user accounts across organizations.
          </Paragraph>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {userStats.map((stat) => (
          <UserStatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <UsersTable
        data={usersPage?.data ?? []}
        total={usersPage?.total ?? 0}
        page={page}
        onPageChange={setPage}
        serverPagination
      />
    </div>
  );
}

export default React.memo(AdminUsers);
