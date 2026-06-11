import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useCallback, useState } from "react";
import OrganizationCreateModal from "../../component/admin/organizations/organization-create-modal";
import OrgStatCard from "../../component/admin/organizations/org-stat-card";
import OrganizationsTable from "../../component/admin/organizations/organizations-table";
import { Paragraph, Title } from "../../component/ui/typography";
import { ORGANIZATION_STATS, ORGANIZATIONS_DATA, type OrganizationRecord } from "../../data/admin-organizations";

function AdminOrganizations() {
  const [organizations, setOrganizations] = useState(ORGANIZATIONS_DATA);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<OrganizationRecord | null>(null);

  const handleOpenCreate = useCallback(() => {
    setEditingOrganization(null);
    setFormModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((record: OrganizationRecord) => {
    setEditingOrganization(record);
    setFormModalOpen(true);
  }, []);

  const handleCloseFormModal = useCallback(() => {
    setFormModalOpen(false);
    setEditingOrganization(null);
  }, []);

  const handleOrganizationCreate = useCallback((organization: OrganizationRecord) => {
    setOrganizations((current) => [organization, ...current]);
  }, []);

  const handleOrganizationUpdate = useCallback((organization: OrganizationRecord) => {
    setOrganizations((current) => current.map((item) => (item.id === organization.id ? organization : item)));
  }, []);

  const createButton = (
    <Button type="primary" icon={<PlusOutlined />} size="large" className="font-semibold!" onClick={handleOpenCreate}>
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

      <OrganizationsTable data={organizations} emptyAction={createButton} onEdit={handleOpenEdit} />

      <OrganizationCreateModal
        open={formModalOpen}
        record={editingOrganization}
        existingOrganizations={organizations}
        onClose={handleCloseFormModal}
        onCreate={handleOrganizationCreate}
        onUpdate={handleOrganizationUpdate}
      />
    </div>
  );
}

export default React.memo(AdminOrganizations);
