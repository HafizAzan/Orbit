import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useCallback, useState } from "react";
import OrganizationCreateModal from "../../component/admin/organizations/organization-create-modal";
import OrgStatCard from "../../component/admin/organizations/org-stat-card";
import OrganizationsTable from "../../component/admin/organizations/organizations-table";
import { AdminListPageSkeleton } from "../../component/skeletons";
import { Paragraph, Title } from "../../component/ui/typography";
import type { OrganizationRecord } from "../../data/admin-organizations";
import { ORGANIZATIONS_PAGE_SIZE } from "../../data/admin-organizations";
import { useDeleteOrganization, useOrganizationStats, useOrganizations } from "../../hooks/use-admin-organizations";
import { mapOrganizationStats } from "../../lib/admin-billing-mappers";
import { showApiErrorToast, showApiSuccessToast } from "../../lib/api-error";

function AdminOrganizations() {
  const [page, setPage] = useState(1);
  const { data: organizationsPage, isLoading } = useOrganizations({ page, limit: ORGANIZATIONS_PAGE_SIZE });
  const organizations = organizationsPage?.data ?? [];
  const totalOrganizations = organizationsPage?.total ?? 0;
  const { data: stats } = useOrganizationStats();
  const { mutateAsync: deleteOrganization } = useDeleteOrganization();
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<OrganizationRecord | null>(null);

  const organizationStats = mapOrganizationStats(stats);

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

  const handleDelete = useCallback(
    async (record: OrganizationRecord) => {
      try {
        const result = await deleteOrganization(record.id);
        showApiSuccessToast(result.message);
      } catch (error) {
        showApiErrorToast(error);
        throw error;
      }
    },
    [deleteOrganization],
  );

  const handleBulkDelete = useCallback(
    async (records: OrganizationRecord[]) => {
      try {
        for (const record of records) {
          await deleteOrganization(record.id);
        }

        showApiSuccessToast(
          `${records.length} ${records.length === 1 ? "organization" : "organizations"} deleted successfully.`,
        );
      } catch (error) {
        showApiErrorToast(error);
        throw error;
      }
    },
    [deleteOrganization],
  );

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const createButton = (
    <Button type="primary" icon={<PlusOutlined />} size="large" className="font-semibold!" onClick={handleOpenCreate}>
      Create Organization
    </Button>
  );

  if (isLoading) {
    return <AdminListPageSkeleton tableColumns={6} />;
  }

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
        {organizationStats.map((stat) => (
          <OrgStatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <OrganizationsTable
        data={organizations}
        emptyAction={createButton}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        serverPagination={{
          page: organizationsPage?.page ?? page,
          pageSize: organizationsPage?.limit ?? ORGANIZATIONS_PAGE_SIZE,
          total: totalOrganizations,
          onChange: handlePageChange,
        }}
      />

      <OrganizationCreateModal open={formModalOpen} record={editingOrganization} onClose={handleCloseFormModal} />
    </div>
  );
}

export default React.memo(AdminOrganizations);
