import { CheckOutlined, FilterOutlined } from "@ant-design/icons";
import { Button, Drawer, Skeleton } from "antd";
import React from "react";
import {
  USER_ROLE_FILTER_OPTIONS,
  USER_ROLE_STYLES,
  USER_STATUS_FILTER_OPTIONS,
  USER_STATUS_STYLES,
  type UserRole,
  type UserStatus,
} from "../../../data/admin-users";
import { useOrganizations } from "../../../hooks/use-admin-organizations";
import { countActiveUserFilters, DEFAULT_USER_FILTERS, type UserFilters } from "../../../lib/user-filters";
import { delay } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import FilterDrawerSection from "../shared/filter-drawer-section";
import { Paragraph, Text } from "../../ui/typography";

type UserFilterDrawerProps = {
  open: boolean;
  draftFilters: UserFilters;
  onClose: () => void;
  onDraftChange: (filters: UserFilters) => void;
  onApply: () => void;
  onClear: () => void;
};

function UserFilterDrawer({ open, draftFilters, onClose, onDraftChange, onApply, onClear }: UserFilterDrawerProps) {
  const activeCount = countActiveUserFilters(draftFilters);
  const { data: orgsPage, isLoading: orgsLoading } = useOrganizations({ page: 1, limit: 100 });
  const orgOptions = (orgsPage?.data ?? []).map((org) => ({ value: org.name, label: org.name }));

  const toggleStatus = (status: UserStatus) => {
    const statuses = draftFilters.statuses.includes(status)
      ? draftFilters.statuses.filter((value) => value !== status)
      : [...draftFilters.statuses, status];

    onDraftChange({ ...draftFilters, statuses });
  };

  const toggleRole = (role: UserRole) => {
    const roles = draftFilters.roles.includes(role) ? draftFilters.roles.filter((value) => value !== role) : [...draftFilters.roles, role];

    onDraftChange({ ...draftFilters, roles });
  };

  const toggleOrganization = (organization: string) => {
    const organizations = draftFilters.organizations.includes(organization)
      ? draftFilters.organizations.filter((value) => value !== organization)
      : [...draftFilters.organizations, organization];

    onDraftChange({ ...draftFilters, organizations });
  };

  const handleClear = async () => {
    onDraftChange(DEFAULT_USER_FILTERS);
    onClear();
    await delay(200);
    onClose();
  };

  return (
    <Drawer
      title={null}
      placement="right"
      width={380}
      open={open}
      onClose={onClose}
      destroyOnClose={false}
      closable
      classNames={{
        header: "hidden!",
        body: "flex h-full flex-col px-0! py-0!",
        footer: "border-t border-border px-5! py-4!",
      }}
      footer={
        <div className="flex flex-col gap-2">
          <Button type="primary" size="large" block onClick={onApply} className="h-11! rounded-xl! font-semibold!">
            Apply filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </Button>
          <Button type="text" block onClick={handleClear} className="font-medium! text-muted!">
            Clear all
          </Button>
        </div>
      }
    >
      <div className="border-b border-border bg-feature-sync/30 px-5 py-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FilterOutlined className="text-lg" />
          </span>
          <div className="min-w-0">
            <Text as="p" size="sm" className="font-semibold text-foreground">
              Filter users
            </Text>
            <Paragraph size="xs" className="mt-1 text-muted">
              {activeCount > 0
                ? `${activeCount} ${activeCount === 1 ? "filter" : "filters"} selected`
                : "Refine the list by status, role, or organization."}
            </Paragraph>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        <FilterDrawerSection title="Status" description="Show users by account state.">
          {USER_STATUS_FILTER_OPTIONS.map((option) => {
            const isSelected = draftFilters.statuses.includes(option.value);
            const statusStyle = USER_STATUS_STYLES[option.value];

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleStatus(option.value)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all",
                  isSelected ? "border-primary bg-feature-sync shadow-sm" : "border-border bg-card hover:border-primary/25 hover:bg-background",
                )}
              >
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", statusStyle.dot)} />
                <Text size="sm" weight="medium">{statusStyle.label}</Text>
                {isSelected ? <CheckOutlined className="ml-auto text-sm text-primary" /> : null}
              </button>
            );
          })}
        </FilterDrawerSection>

        <FilterDrawerSection title="Role" description="Filter by user permission level.">
          <div className="grid grid-cols-1 gap-2">
            {USER_ROLE_FILTER_OPTIONS.map((option) => {
              const isSelected = draftFilters.roles.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleRole(option.value)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all",
                    isSelected ? "border-primary bg-feature-sync shadow-sm" : "border-border bg-card hover:border-primary/25 hover:bg-background",
                  )}
                >
                  <span
                    className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide", USER_ROLE_STYLES[option.value])}
                  >
                    {option.value}
                  </span>
                  {isSelected ? <CheckOutlined className="ml-auto text-sm text-primary" /> : null}
                </button>
              );
            })}
          </div>
        </FilterDrawerSection>

        <FilterDrawerSection title="Organization" description="Limit results to specific organizations.">
          {orgsLoading ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : orgOptions.length === 0 ? (
            <Paragraph size="sm" color="muted">No organizations found.</Paragraph>
          ) : (
            <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
              {orgOptions.map((option) => {
                const isSelected = draftFilters.organizations.includes(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleOrganization(option.value)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all",
                      isSelected ? "border-primary bg-feature-sync shadow-sm" : "border-border bg-card hover:border-primary/25 hover:bg-background",
                    )}
                  >
                    <Text size="sm" weight="medium">{option.label}</Text>
                    {isSelected ? <CheckOutlined className="ml-auto text-sm text-primary" /> : null}
                  </button>
                );
              })}
            </div>
          )}
        </FilterDrawerSection>
      </div>
    </Drawer>
  );
}

export default React.memo(UserFilterDrawer);
