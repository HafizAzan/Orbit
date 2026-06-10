import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import OrgStatCard from "../../component/admin/organizations/org-stat-card";
import OrganizationsTable from "../../component/admin/organizations/organizations-table";
import { Paragraph, Title } from "../../component/ui/typography";
import { ORGANIZATION_STATS } from "../../data/admin-organizations";

function AdminOrganizations() {
  const createButton = (
    <Button type="primary" icon={<PlusOutlined />} size="large" className="font-semibold!">
      Create Organization
    </Button>
  );

  return (
    <div className="mx-auto max-w-8xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Title level={2} className="text-2xl text-foreground lg:text-3xl">
            Organizations
          </Title>
          <Paragraph size="sm" className="mt-1 text-muted">
            Manage enterprise accounts, billing plans, and organizational structures.
          </Paragraph>
        </div>

        {createButton}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ORGANIZATION_STATS.map((stat) => (
          <OrgStatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <OrganizationsTable emptyAction={createButton} />
    </div>
  );
}

export default React.memo(AdminOrganizations);
