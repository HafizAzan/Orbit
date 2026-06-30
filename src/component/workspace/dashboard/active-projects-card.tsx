import { ProjectOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import type { ActiveProject } from "../../../data/workspace-dashboard";
import { WORKSPACE_ROUTES } from "../../../router/workspace-routes";
import { cn } from "../../../lib/utils";
import { Text, Title } from "../../ui/typography";

type ActiveProjectsCardProps = {
  items: ActiveProject[];
};

function ActiveProjectsCard({ items }: ActiveProjectsCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Title level={5} color="default">Active Projects</Title>
        <Link to={WORKSPACE_ROUTES.PROJECTS} className="text-sm font-medium text-primary transition-opacity hover:opacity-80">
          View all
        </Link>
      </div>

      <ul className="space-y-5">
        {items.map((project) => (
          <li key={project.id}>
            <div className="flex items-start gap-3">
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", project.iconBg)}>
                <ProjectOutlined className="text-base" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Text as="p" weight="semibold" className="truncate">{project.name}</Text>
                    <Text as="p" size="xs" color="muted" className="mt-0.5">Last updated {project.updatedAt}</Text>
                  </div>
                  <Text as="span" size="sm" weight="bold" className="shrink-0">{project.progress}%</Text>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default React.memo(ActiveProjectsCard);
