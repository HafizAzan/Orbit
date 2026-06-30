import { Button } from "antd";
import React from "react";
import { WORKSPACE_INTEGRATIONS } from "../../../data/workspace-settings";
import { toast } from "../../../lib/toast";
import { cn } from "../../../lib/utils";
import SettingsSection from "../../admin/settings/settings-section";
import { Paragraph, Text } from "../../ui/typography";

type WorkspaceIntegrationsSectionProps = {
  expanded?: boolean;
};

function WorkspaceIntegrationsSection({ expanded = false }: WorkspaceIntegrationsSectionProps) {
  return (
    <SettingsSection
      id="workspace-integrations"
      title="Active Integrations"
      description="Connected apps and services powering your workspace workflows."
      action={
        <button
          type="button"
          onClick={() => toast.info("Marketplace — coming soon")}
          className="text-sm font-semibold text-primary transition-opacity hover:opacity-80"
        >
          Browse Marketplace
        </button>
      }
    >
      <div className={cn("grid gap-4", expanded ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 lg:grid-cols-3")}>
        {WORKSPACE_INTEGRATIONS.map((integration) => (
          <div
            key={integration.id}
            className="flex items-start gap-3 rounded-2xl border border-border bg-background/50 p-4"
          >
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
                integration.iconBg,
              )}
            >
              {integration.iconText}
            </div>
            <div className="min-w-0">
              <Text as="p" weight="semibold">{integration.name}</Text>
              <Paragraph size="sm" className="mt-1">{integration.description}</Paragraph>
            </div>
          </div>
        ))}
      </div>

      {expanded ? (
        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="primary" className="font-semibold!" onClick={() => toast.info("Marketplace — coming soon")}>
            Browse Marketplace
          </Button>
          <Button className="font-semibold!" onClick={() => toast.info("Custom integration — coming soon")}>
            Add Custom Integration
          </Button>
        </div>
      ) : null}
    </SettingsSection>
  );
}

export default React.memo(WorkspaceIntegrationsSection);
