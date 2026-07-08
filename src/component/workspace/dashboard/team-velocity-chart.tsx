import React, { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  type DashboardPeriodFilter,
  type VelocityPoint,
  VELOCITY_CHART_SUBTITLES,
} from "../../../data/workspace-dashboard";
import { useChartTheme } from "../../../lib/chart-theme";
import { Paragraph, Text, Title } from "../../ui/typography";

type TeamVelocityChartProps = {
  data: VelocityPoint[];
  period: DashboardPeriodFilter;
};

function TeamVelocityChart({ data, period }: TeamVelocityChartProps) {
  const chart = useChartTheme();

  const yAxisMax = useMemo(() => {
    const peak = data.reduce((max, point) => Math.max(max, point.completed), 0);
    return Math.max(peak, 4);
  }, [data]);

  const totalCompleted = useMemo(
    () => data.reduce((sum, point) => sum + point.completed, 0),
    [data],
  );

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <Title level={5} color="default">
            Team Velocity
          </Title>
          <Paragraph size="sm" className="mt-0.5">
            {VELOCITY_CHART_SUBTITLES[period]}
          </Paragraph>
          <Text as="p" size="xs" color="muted" className="mt-1">
            {totalCompleted === 0
              ? "No completed tasks in this period yet."
              : `${totalCompleted} task${totalCompleted === 1 ? "" : "s"} completed in this period.`}
          </Text>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chart.primary} stopOpacity={0.35} />
                <stop offset="100%" stopColor={chart.primary} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chart.grid} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: chart.axis, fontSize: 12 }}
              dy={8}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: chart.axis, fontSize: 12 }}
              width={36}
              allowDecimals={false}
              domain={[0, yAxisMax]}
              label={{
                value: "Tasks",
                angle: -90,
                position: "insideLeft",
                fill: chart.axis,
                fontSize: 11,
                offset: 10,
              }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${chart.tooltipBorder}`,
                backgroundColor: chart.tooltipBg,
                color: chart.axis,
                boxShadow: chart.tooltipShadow,
              }}
              labelFormatter={(label) => `Date: ${label}`}
              formatter={(value) => [
                `${value} task${value === 1 ? "" : "s"}`,
                "Completed",
              ]}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke={chart.primary}
              strokeWidth={3}
              fill="url(#velocityGradient)"
              dot={false}
              activeDot={{ r: 5, fill: chart.primary, stroke: chart.activeDotStroke, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

export default React.memo(TeamVelocityChart);
