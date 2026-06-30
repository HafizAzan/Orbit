import React from "react";
import { Paragraph, Text, Title } from "../../ui/typography";

function ProjectNetworkPulseCard() {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <Title level={5} color="default">
        Live Network Pulse
      </Title>
      <Paragraph size="sm" className="mt-1">Real-time migration telemetry across global clusters.</Paragraph>

      <div className="mt-6 flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-border bg-background/60">
        <Text as="p" size="sm" weight="medium" color="muted">
          Telemetry visualization coming soon
        </Text>
      </div>
    </article>
  );
}

export default React.memo(ProjectNetworkPulseCard);
