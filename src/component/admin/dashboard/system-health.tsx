import { GlobalOutlined } from "@ant-design/icons";
import React from "react";
import type { SystemRegion } from "../../../data/admin-dashboard";

type SystemHealthProps = {
  regions: SystemRegion[];
};

function SystemHealth({ regions }: SystemHealthProps) {
  return (
    <article className="rounded-2xl border border-indigo-100 bg-linear-to-r from-indigo-50/80 to-violet-50/50 p-5 lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
            <GlobalOutlined className="text-xl" />
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground">Global System Health</h3>
            <p className="mt-1 max-w-2xl text-sm text-muted">
              All systems are operational across 12 worldwide regions. Low latency detected in Tokyo hub.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {regions.map((region) => (
            <div key={region.id} className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-foreground">{region.name}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default React.memo(SystemHealth);
