import { RocketOutlined } from "@ant-design/icons";
import React from "react";
import { GROWTH_FORECAST } from "../../../data/admin-dashboard";
import { Paragraph, Text } from "../../ui/typography";

function GrowthForecastCard() {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-white shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
          <RocketOutlined className="text-lg" />
        </span>
        <div>
          <Text size="xs" weight="semibold" className="tracking-[0.2em] text-slate-400 uppercase">Growth Forecast</Text>
          <Text as="p" className="mt-2 text-3xl font-bold">{GROWTH_FORECAST.target}</Text>
          <Paragraph size="sm" className="mt-2 mb-0! text-slate-400">{GROWTH_FORECAST.helperText}</Paragraph>
        </div>
      </div>
    </article>
  );
}

export default React.memo(GrowthForecastCard);
