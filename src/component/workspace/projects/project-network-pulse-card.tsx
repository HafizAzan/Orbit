import React from "react";

function ProjectNetworkPulseCard() {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <h3 className="text-lg font-semibold text-foreground">Live Network Pulse</h3>
      <p className="mt-1 text-sm text-muted">Real-time migration telemetry across global clusters.</p>

      <div className="mt-6 flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-border bg-background/60">
        <p className="text-sm font-medium text-muted">Telemetry visualization coming soon</p>
      </div>
    </article>
  );
}

export default React.memo(ProjectNetworkPulseCard);
