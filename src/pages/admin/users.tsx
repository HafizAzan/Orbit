import React from "react";
import UserStatCard from "../../component/admin/users/user-stat-card";
import UsersTable from "../../component/admin/users/users-table";
import { Paragraph, Title } from "../../component/ui/typography";
import { USER_STATS } from "../../data/admin-users";

function AdminUsers() {
  return (
    <div className="mx-auto max-w-8xl">
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
        {USER_STATS.map((stat) => (
          <UserStatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <UsersTable />
    </div>
  );
}

export default React.memo(AdminUsers);
